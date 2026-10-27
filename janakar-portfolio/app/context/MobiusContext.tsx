'use client'

import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { usePathname } from 'next/navigation'

/** Live strip motion for audio / other sync (updated every frame). */
export interface MobiusSync {
  /** Raw pulse sine, -1…1 */
  pulse: number
  /** Particle bloom amount, 0…1 */
  spread: number
  /** Color cycle phase, 0…1 */
  colorPhase: number
  /** Strip Y rotation (radians) for stereo pan */
  rotY: number
  elapsed: number
}

interface MobiusContextType {
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  isReady: boolean
  syncRef: React.RefObject<MobiusSync>
  /** ambient sound is playing (footer monkey wears headphones) */
  listening: boolean
  setListening: (on: boolean) => void
}

const MobiusContext = createContext<MobiusContextType | undefined>(undefined)

/** Converts a hex color string to normalized RGB values in the 0–1 range. */
function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? [
        parseInt(result[1], 16) / 255,
        parseInt(result[2], 16) / 255,
        parseInt(result[3], 16) / 255,
      ]
    : [1, 1, 1]
}

/** Fast PRNG for Langevin noise in the hot loop. */
function mulberry32(seed: number) {
  return function next() {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Future: monospace "0"/"1" point sprites mixed with solid dots.
 *
 * Approach that worked in experimentation:
 * 1. Canvas atlas (white glyphs on black): left cell "0", right cell "1"; sample .r as mask
 *    (canvas alpha uploads were unreliable). Flip Y: `1.0 - gl_PointCoord.y`.
 * 2. Per-point `aGlyph` attribute: -1 = solid dot, 0/1 = atlas cell. Split size via
 *    `uSize` (chars ~0.7) vs `uDotSize` (dots ~0.045). Last mix tried: ~99% dots,
 *    0.5% "0", 0.5% "1" (`charChance: 0.01`, then 50/50).
 * 3. Fragment: dots → `vec4(vColor, 1)`; chars → discard if mask < 0.25, else
 *    `vec4(vColor * mask, 1)`. Keep opaque (no transparent blending) so palette/pulse
 *    colors match dots and don't wash out against the page.
 * 4. Dispose the CanvasTexture on teardown.
 */

/** Visual and animation settings for the Möbius strip point cloud. */
const MOBIUS_CONFIG = {
  pointSize: 0.045,
  uSegments: 500,
  vSegments: 100,
  /** 1 is full grid density; lower values space points farther apart. */
  density: 0.69,
  radius: 23,
  width: 10,
  jitter: 0.8,
  spreadMultiplier: 8.5,
  /** Typical per-particle displacement from Brownian vibration. */
  brownianAmplitude: 0.42,
  /** Spring rate; higher values make the jitter snappier. */
  brownianFrequency: 5.5,
  /** Velocity drag; higher values reduce glide. */
  brownianDamping: 3.2,
  timeScale: 0.2,
  pulseSpeed: 0.5,
  rotation: { x: 0.0007, y: 0.0005, z: 0 },
  groupPosition: { x: 0, y: 0, z: 50 },
  rainbowSpeed: 0.14,
  // blue-purple with mid stops so the loop blends without hard jumps
  colorPalette: ['#1A0A8C', '#2511AE', '#5C4AD0', '#9A8DE1', '#BFBAFA', '#7B6DE0'],
  /** Saturn-style core: particle sphere inside the strip ring. */
  showPlanet: false,
  planetRadius: 10,
  planetPoints: 7000,
  planetSpin: 0.0012,
  /** Radial brain-wave ripple amplitude (world units). */
  planetWaveAmp: 1.35,
  /** Visual stand-ins for alpha / theta / gamma traveling waves. */
  planetWaveAlpha: 6.5,
  planetWaveTheta: 3.2,
  planetWaveGamma: 12,
} as const

/** Color on GPU; uPulse (0–1 bloom) shifts hue and lifts brightness with the strip pulse. */
const MOBIUS_VERTEX = /* glsl */ `
uniform float uSize;
uniform float uScale;
uniform float uColorTime;
uniform float uPulse;
uniform vec3 uPalette[6];
uniform float uPaletteCount;

attribute float aUv;

varying vec3 vColor;

vec3 paletteAt(float index) {
  int i = int(mod(index, uPaletteCount));
  if (i == 0) return uPalette[0];
  if (i == 1) return uPalette[1];
  if (i == 2) return uPalette[2];
  if (i == 3) return uPalette[3];
  if (i == 4) return uPalette[4];
  return uPalette[5];
}

void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  bool isPerspective = projectionMatrix[2][3] == -1.0;
  gl_PointSize = uSize * (1.0 + uPulse * 0.35);
  if (isPerspective) {
    gl_PointSize *= uScale / -mvPosition.z;
  }

  // Pulse advances the rainbow and pulls toward the bright palette stop
  float t = fract(aUv + uColorTime + uPulse * 0.28);
  float colorIndex = t * uPaletteCount;
  float i1 = floor(colorIndex);
  float blend = colorIndex - i1;
  blend = blend * blend * (3.0 - 2.0 * blend);
  vec3 base = mix(paletteAt(i1), paletteAt(i1 + 1.0), blend);
  vec3 flare = uPalette[4];
  vColor = mix(base, flare, uPulse * 0.55) * (0.82 + uPulse * 0.55);
}
`

const MOBIUS_FRAGMENT = /* glsl */ `
varying vec3 vColor;

void main() {
  gl_FragColor = vec4(vColor, 1.0);
}
`

/** Cap drawing buffer size on weak devices; particle count stays full. */
function getMaxDpr() {
  if (typeof window === 'undefined') return 1.5
  const cores = navigator.hardwareConcurrency || 4
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    ?.saveData
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  // shortcut: heuristic only; upgrade if we add a real FPS probe
  return saveData || reducedMotion || cores <= 4 ? 1 : 1.5
}

/**
 * Provides a shared Three.js canvas and Möbius strip animation used as the
 * site background. The scene persists across route changes.
 */
export function MobiusProvider({ children }: { children: React.ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isReady, setIsReady] = useState(false)
  const [listening, setListening] = useState(false)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const clockRef = useRef<THREE.Clock | null>(null)
  const animationIdRef = useRef<number | null>(null)
  const mobiusRef = useRef<THREE.Points | null>(null)
  const pathname = usePathname()
  const isAnimatingRef = useRef(true)
  const syncRef = useRef<MobiusSync>({ pulse: 0, spread: 0, colorPhase: 0, rotY: 0, elapsed: 0 })

  useEffect(() => {
    if (!canvasRef.current) return

    const config = MOBIUS_CONFIG
    const maxDpr = getMaxDpr()
    const rgbPalette = config.colorPalette.map(hexToRgb)
    const paletteVecs = rgbPalette.map(([r, g, b]) => new THREE.Vector3(r, g, b))
    while (paletteVecs.length < 6) paletteVecs.push(paletteVecs[paletteVecs.length - 1].clone())
    const rand = mulberry32(0x9e3779b9)

    const canvas = canvasRef.current
    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.set(0, 0, 90)
    scene.add(camera)

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: true,
      powerPreference: 'low-power',
      stencil: false,
      depth: true,
    })
    renderer.setSize(window.innerWidth, window.innerHeight, false)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxDpr))
    rendererRef.current = renderer

    const uSegments = Math.max(1, Math.round(config.uSegments * config.density))
    const vSegments = Math.max(1, Math.round(config.vSegments * config.density))
    const pointCount = (uSegments + 1) * (vSegments + 1)

    const positions = new Float32Array(pointCount * 3)
    const original = new Float32Array(pointCount * 3)
    const directions = new Float32Array(pointCount * 3)
    const uvs = new Float32Array(pointCount)
    const brownianOffsets = new Float32Array(pointCount * 3)
    const brownianVelocities = new Float32Array(pointCount * 3)

    let p = 0
    let uvi = 0
    for (let i = 0; i <= uSegments; i++) {
      const u = (i / uSegments) * Math.PI * 2
      const cosU = Math.cos(u)
      const sinU = Math.sin(u)
      const uNorm = u / (Math.PI * 2)

      for (let j = 0; j <= vSegments; j++) {
        const v = (j / vSegments - 0.5) * config.width
        const twist = u / 2
        const cosTwist = Math.cos(twist)
        const sinTwist = Math.sin(twist)
        const radial = config.radius + v * cosTwist

        const x = radial * cosU + (Math.random() - 0.5) * config.jitter
        const y = radial * sinU + (Math.random() - 0.5) * config.jitter
        const z = v * sinTwist + (Math.random() - 0.5) * config.jitter

        positions[p] = x
        positions[p + 1] = y
        positions[p + 2] = z
        original[p] = x
        original[p + 1] = y
        original[p + 2] = z

        let dx = Math.random() - 0.5
        let dy = Math.random() - 0.5
        let dz = Math.random() - 0.5
        const invLen = 1 / Math.hypot(dx, dy, dz)
        directions[p] = dx * invLen
        directions[p + 1] = dy * invLen
        directions[p + 2] = dz * invLen

        uvs[uvi++] = uNorm
        p += 3
      }
    }

    const geometry = new THREE.BufferGeometry()
    const positionAttr = new THREE.BufferAttribute(positions, 3)
    positionAttr.setUsage(THREE.DynamicDrawUsage)
    geometry.setAttribute('position', positionAttr)
    geometry.setAttribute('aUv', new THREE.BufferAttribute(uvs, 1))

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uSize: { value: config.pointSize },
        uScale: { value: renderer.domElement.height * 0.5 },
        uColorTime: { value: 0 },
        uPulse: { value: 0 },
        uPalette: { value: paletteVecs },
        uPaletteCount: { value: rgbPalette.length },
      },
      vertexShader: MOBIUS_VERTEX,
      fragmentShader: MOBIUS_FRAGMENT,
    })

    const mobius = new THREE.Points(geometry, material)
    mobius.frustumCulled = false
    mobiusRef.current = mobius

    // Particle planet at the strip center (same shader/palette as the ring)
    const planetCount = config.showPlanet ? config.planetPoints : 0
    const planetPositions = new Float32Array(planetCount * 3)
    const planetOriginal = new Float32Array(planetCount * 3)
    const planetLon = new Float32Array(planetCount)
    const planetLat = new Float32Array(planetCount)
    const planetUvs = new Float32Array(planetCount)
    const planetR = config.planetRadius
    for (let i = 0; i < planetCount; i++) {
      const u = Math.random()
      const v = Math.random()
      const theta = u * Math.PI * 2
      const phi = Math.acos(2 * v - 1)
      const sinP = Math.sin(phi)
      const i3 = i * 3
      const x = planetR * sinP * Math.cos(theta)
      const y = planetR * sinP * Math.sin(theta)
      const z = planetR * Math.cos(phi)
      planetPositions[i3] = x
      planetPositions[i3 + 1] = y
      planetPositions[i3 + 2] = z
      planetOriginal[i3] = x
      planetOriginal[i3 + 1] = y
      planetOriginal[i3 + 2] = z
      planetLon[i] = theta
      planetLat[i] = phi - Math.PI / 2
      planetUvs[i] = u
    }
    const planetGeometry = new THREE.BufferGeometry()
    const planetPosAttr = new THREE.BufferAttribute(planetPositions, 3)
    planetPosAttr.setUsage(THREE.DynamicDrawUsage)
    planetGeometry.setAttribute('position', planetPosAttr)
    planetGeometry.setAttribute('aUv', new THREE.BufferAttribute(planetUvs, 1))
    const planet = new THREE.Points(planetGeometry, material)
    planet.frustumCulled = false
    planet.visible = config.showPlanet

    const group = new THREE.Group()
    group.add(planet)
    group.add(mobius)
    group.position.set(config.groupPosition.x, config.groupPosition.y, config.groupPosition.z)
    scene.add(group)

    const clock = new THREE.Clock()
    clockRef.current = clock

    const sync = syncRef.current
    const rotX = config.rotation.x
    const rotY = config.rotation.y
    const rotZ = config.rotation.z
    const spring = config.brownianFrequency * config.brownianFrequency
    const gamma = config.brownianDamping
    const sigmaBase = config.brownianAmplitude * config.brownianFrequency * Math.sqrt(2 * gamma)
    const spreadMul = config.spreadMultiplier
    const timeScale = config.timeScale
    const pulseSpeed = config.pulseSpeed
    const rainbowSpeed = config.rainbowSpeed
    const uniforms = material.uniforms
    const posLen = positions.length

    function tick() {
      if (!isAnimatingRef.current) {
        animationIdRef.current = null
        return
      }

      const dt = Math.min(clock.getDelta(), 1 / 30)
      const elapsed = clock.elapsedTime
      const time = elapsed * timeScale
      const pulse = Math.sin(time * pulseSpeed)
      const spreadAmount = pulse > 0 ? pulse : 0

      sync.pulse = pulse
      sync.spread = spreadAmount
      sync.colorPhase = (elapsed * rainbowSpeed) % 1
      sync.elapsed = elapsed
      sync.rotY = mobius.rotation.y

      const noiseScale = sigmaBase * Math.sqrt(dt)
      const velDamp = 1 / (1 + gamma * dt)
      const spread = spreadAmount * spreadMul

      for (let i = 0; i < posLen; i += 3) {
        const n0 = (rand() * 2 - 1) * noiseScale
        const n1 = (rand() * 2 - 1) * noiseScale
        const n2 = (rand() * 2 - 1) * noiseScale

        brownianVelocities[i] =
          (brownianVelocities[i] - spring * brownianOffsets[i] * dt + n0) * velDamp
        brownianVelocities[i + 1] =
          (brownianVelocities[i + 1] - spring * brownianOffsets[i + 1] * dt + n1) * velDamp
        brownianVelocities[i + 2] =
          (brownianVelocities[i + 2] - spring * brownianOffsets[i + 2] * dt + n2) * velDamp

        brownianOffsets[i] += brownianVelocities[i] * dt
        brownianOffsets[i + 1] += brownianVelocities[i + 1] * dt
        brownianOffsets[i + 2] += brownianVelocities[i + 2] * dt

        positions[i] = original[i] + directions[i] * spread + brownianOffsets[i]
        positions[i + 1] = original[i + 1] + directions[i + 1] * spread + brownianOffsets[i + 1]
        positions[i + 2] = original[i + 2] + directions[i + 2] * spread + brownianOffsets[i + 2]
      }
      positionAttr.needsUpdate = true

      uniforms.uColorTime.value = elapsed * rainbowSpeed
      uniforms.uPulse.value = spreadAmount

      // Brain-wave ripples on the planet (alpha / theta / gamma traveling waves)
      const waveAmp = config.planetWaveAmp * (0.75 + spreadAmount * 0.55)
      const aSpd = config.planetWaveAlpha
      const thSpd = config.planetWaveTheta
      const gSpd = config.planetWaveGamma
      for (let i = 0; i < planetCount; i++) {
        const i3 = i * 3
        const lon = planetLon[i]
        const lat = planetLat[i]
        const alpha = Math.sin(lon * 8 + elapsed * aSpd)
        const thetaW = Math.sin(lat * 5 - elapsed * thSpd) * Math.cos(lon * 3 + elapsed * 2)
        const gammaW = Math.sin(lon * 14 + lat * 10 + elapsed * gSpd)
        const w = alpha * 0.5 + thetaW * 0.35 + gammaW * 0.2
        const r = planetR + waveAmp * w
        const ox = planetOriginal[i3]
        const oy = planetOriginal[i3 + 1]
        const oz = planetOriginal[i3 + 2]
        const inv = r / planetR
        planetPositions[i3] = ox * inv
        planetPositions[i3 + 1] = oy * inv
        planetPositions[i3 + 2] = oz * inv
      }
      planetPosAttr.needsUpdate = true

      mobius.rotation.x += rotX
      mobius.rotation.y += rotY
      mobius.rotation.z += rotZ
      planet.rotation.y += config.planetSpin

      renderer.render(scene, camera)
      animationIdRef.current = requestAnimationFrame(tick)
    }

    tick()

    const handleResize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxDpr))
      renderer.setSize(w, h, false)
      uniforms.uScale.value = renderer.domElement.height * 0.5
    }

    const handleVisibility = () => {
      const visible = !document.hidden
      isAnimatingRef.current = visible
      if (visible) {
        clock.getDelta()
        if (animationIdRef.current == null) animationIdRef.current = requestAnimationFrame(tick)
      }
    }

    window.addEventListener('resize', handleResize)
    document.addEventListener('visibilitychange', handleVisibility)
    setIsReady(true)

    return () => {
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('visibilitychange', handleVisibility)
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current)
      renderer.dispose()
      geometry.dispose()
      planetGeometry.dispose()
      material.dispose()
    }
  }, [])

  // Reset animation clock when returning to the home page
  useEffect(() => {
    if (pathname === '/' && clockRef.current) {
      clockRef.current = new THREE.Clock()
    }
  }, [pathname])

  return (
    <MobiusContext.Provider value={{ canvasRef, isReady, syncRef, listening, setListening }}>
      {children}
    </MobiusContext.Provider>
  )
}

/** Access the shared Möbius canvas ref and readiness state. */
export function useMobius() {
  const context = useContext(MobiusContext)
  if (context === undefined) {
    throw new Error('useMobius must be used within a MobiusProvider')
  }
  return context
}
