'use client'

import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { usePathname } from 'next/navigation'

interface MobiusContextType {
    canvasRef: React.RefObject<HTMLCanvasElement | null>
    isReady: boolean
}

const MobiusContext = createContext<MobiusContextType | undefined>(undefined)

export function MobiusProvider({ children }: { children: React.ReactNode }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isReady, setIsReady] = useState(false)
    const sceneRef = useRef<THREE.Scene | null>(null)
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
    const clockRef = useRef<THREE.Clock | null>(null)
    const animationIdRef = useRef<number | null>(null)
    const mobiusRef = useRef<THREE.Points | null>(null)
    const mobiusPositionsRef = useRef<Float32Array | null>(null)
    const originalMobiusPositionsRef = useRef<Float32Array | null>(null)
    const mobiusDirectionsRef = useRef<THREE.Vector3[]>([])
    const mobiusGeometryRef = useRef<THREE.BufferGeometry | null>(null)
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
    const groupRef = useRef<THREE.Group | null>(null)
    const pathname = usePathname()
    const isAnimatingRef = useRef(true)

    useEffect(() => {
        if (!canvasRef.current) return

    const config = {
        color: 0xff6699,
        pointSize: 0.1,
        uSegments: 500,
        vSegments: 100,
        radius: 25,
        width: 10,
        jitter: 0.8,
        spreadMultiplier: 8.5,
        timeScale: 0.2,
        pulseSpeed: 0.5,
        rotation: { x: 0.0022, y: 0.0015, z: 0 },
        groupPosition: { x: 0, y: 0, z: 50 }
    }

    // Scene, Camera, Renderer
    const canvas = canvasRef.current
    const scene = new THREE.Scene()
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    )
    camera.position.set(0, 0, 90)
    scene.add(camera)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    rendererRef.current = renderer

    // Materials
    const mobiusMaterial = new THREE.PointsMaterial({ size: config.pointSize, color: config.color })

    // Möbius strip point cloud
    const uSegments = config.uSegments
    const vSegments = config.vSegments
    const radius = config.radius
    const width = config.width
    const positions: number[] = []

    for (let i = 0; i <= uSegments; i++) {
        const u = (i / uSegments) * Math.PI * 2
        const cosU = Math.cos(u)
        const sinU = Math.sin(u)

        for (let j = 0; j <= vSegments; j++) {
            const v = (j / vSegments - 0.5) * width
            const twist = u / 2
            const cosTwist = Math.cos(twist)
            const sinTwist = Math.sin(twist)

            const x = (radius + v * cosTwist) * cosU
            const y = (radius + v * cosTwist) * sinU
            const z = v * sinTwist

            // Add subtle jitter so the cloud feels organic
            positions.push(
            x + (Math.random() - 0.5) * config.jitter,
            y + (Math.random() - 0.5) * config.jitter,
            z + (Math.random() - 0.5) * config.jitter
            )
        }
    }

    const mobiusGeometry = new THREE.BufferGeometry()
    const mobiusPositions = new Float32Array(positions)
    mobiusGeometry.setAttribute('position', new THREE.BufferAttribute(mobiusPositions, 3))
    mobiusGeometryRef.current = mobiusGeometry

    const originalMobiusPositions = mobiusPositions.slice()
    originalMobiusPositionsRef.current = originalMobiusPositions
    mobiusPositionsRef.current = mobiusPositions

    const mobiusDirections: THREE.Vector3[] = []

    for (let i = 0; i < originalMobiusPositions.length; i += 3) {
        const dir = new THREE.Vector3(
            Math.random() - 0.5,
            Math.random() - 0.5,
            Math.random() - 0.5
        ).normalize()
        mobiusDirections.push(dir)
    }

    mobiusDirectionsRef.current = mobiusDirections

    const mobius = new THREE.Points(mobiusGeometry, mobiusMaterial)
    mobiusRef.current = mobius

    // Group and position
    const group = new THREE.Group()
    group.add(mobius)
    group.position.set(config.groupPosition.x, config.groupPosition.y, config.groupPosition.z)
    scene.add(group)
    groupRef.current = group

    // Animation loop
    const clock = new THREE.Clock()
    clockRef.current = clock

    function tick() {
        if (!isAnimatingRef.current) {
            animationIdRef.current = requestAnimationFrame(tick)
            return
        }

        const time = clock.getElapsedTime() * config.timeScale
        const pulse = Math.sin(time * config.pulseSpeed)
        const spreadAmount = Math.max(0, pulse)

        // Animate Möbius strip points
        if (mobiusPositionsRef.current && originalMobiusPositionsRef.current) {
            for (let i = 0; i < mobiusPositionsRef.current.length; i += 3) {
            const index = i / 3
            const ox = originalMobiusPositionsRef.current[i]
            const oy = originalMobiusPositionsRef.current[i + 1]
            const oz = originalMobiusPositionsRef.current[i + 2]
            const dir = mobiusDirectionsRef.current[index]

            mobiusPositionsRef.current[i] = ox + dir.x * spreadAmount * config.spreadMultiplier
            mobiusPositionsRef.current[i + 1] = oy + dir.y * spreadAmount * config.spreadMultiplier
            mobiusPositionsRef.current[i + 2] = oz + dir.z * spreadAmount * config.spreadMultiplier
            }
            if (mobiusGeometryRef.current) {
            mobiusGeometryRef.current.attributes.position.needsUpdate = true
            }
        }

        // Rotations
        if (mobiusRef.current) {
            mobius.rotation.x += config.rotation.x
            mobius.rotation.y += config.rotation.y
            mobius.rotation.z += config.rotation.z
        }

        renderer.render(scene, camera)
        animationIdRef.current = requestAnimationFrame(tick)
    }

    tick()

    // Resize handler
    const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)
    setIsReady(true)

    // Cleanup
    return () => {
        window.removeEventListener('resize', handleResize)
        if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current)
        renderer.dispose()
        mobiusGeometry.dispose()
        mobiusMaterial.dispose()
    }
    }, [])

  // Reset clock when returning to home page
    useEffect(() => {
        if (pathname === '/') {
            // On home page - reset clock to start from zero
            if (clockRef.current) {
                clockRef.current = new THREE.Clock()
            }
        }
    }, [pathname])

    return (
        <MobiusContext.Provider value={{ canvasRef, isReady }}>
        {children}
        </MobiusContext.Provider>
    )
}

export function useMobius() {
    const context = useContext(MobiusContext)
    if (context === undefined) {
        throw new Error('useMobius must be used within a MobiusProvider')
    }
    return context
}
