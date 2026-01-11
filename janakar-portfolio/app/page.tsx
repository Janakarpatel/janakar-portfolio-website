'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [timestamp, setTimestamp] = useState<string>('')

  // Update timestamp every second
  useEffect(() => {
    const updateTimestamp = () => {
      const now = new Date()
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const seconds = String(now.getSeconds()).padStart(2, '0')
      const date = String(now.getDate()).padStart(2, '0')
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const year = now.getFullYear()

      setTimestamp(`${hours}:${minutes}:${seconds} - ${date}/${month}/${year}`)
    }

    updateTimestamp()
    const interval = setInterval(updateTimestamp, 1000)

    return () => clearInterval(interval)
  }, [])

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

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.set(0, 0, 90)
    scene.add(camera)

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

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

    const originalMobiusPositions = mobiusPositions.slice()
    const mobiusDirections: THREE.Vector3[] = []

    for (let i = 0; i < originalMobiusPositions.length; i += 3) {
      const dir = new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
      ).normalize()
      mobiusDirections.push(dir)
    }

    const mobius = new THREE.Points(mobiusGeometry, mobiusMaterial)

    // Group and position
    const group = new THREE.Group()
    group.add(mobius)
    group.position.set(config.groupPosition.x, config.groupPosition.y, config.groupPosition.z)
    scene.add(group)

    // Animation loop
    const clock = new THREE.Clock()
    let animationId: number

    function tick() {
      const time = clock.getElapsedTime() * config.timeScale
      const pulse = Math.sin(time * config.pulseSpeed)
      const spreadAmount = Math.max(0, pulse)

      // Animate Möbius strip points
      for (let i = 0; i < mobiusPositions.length; i += 3) {
        const index = i / 3
        const ox = originalMobiusPositions[i]
        const oy = originalMobiusPositions[i + 1]
        const oz = originalMobiusPositions[i + 2]
        const dir = mobiusDirections[index]

        mobiusPositions[i] = ox + dir.x * spreadAmount * config.spreadMultiplier
        mobiusPositions[i + 1] = oy + dir.y * spreadAmount * config.spreadMultiplier
        mobiusPositions[i + 2] = oz + dir.z * spreadAmount * config.spreadMultiplier
      }
      mobiusGeometry.attributes.position.needsUpdate = true

      // Rotations
      mobius.rotation.x += config.rotation.x
      mobius.rotation.y += config.rotation.y
      mobius.rotation.z += config.rotation.z

      renderer.render(scene, camera)
      animationId = requestAnimationFrame(tick)
    }

    tick()

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationId)
      renderer.dispose()
      mobiusGeometry.dispose()
      mobiusMaterial.dispose()
    }
  }, [])

  return (
    <>
      <div className="main-container">
        <div className="background-three-js">
          <canvas ref={canvasRef} className="webgl" />
        </div>
        <div className="main-text-container">
          <div className="content-section">
            <div className="content-left">
              <div className="title-section">
                <p className="name">Janakar Patel</p>
                <p className="tag">Data, AI/ML Software + *Art & Design</p>
              </div>
              <div className="social_media">
                <a href="https://github.com/janakarpatel" target="_blank" rel="noopener noreferrer">GitHub</a>
                <a href="https://www.linkedin.com/in/janakarpatel/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a href="https://twitter.com/janakarpatel" target="_blank" rel="noopener noreferrer">Twitter</a>
                <a href="mailto:contact.janakarpatel@gmail.com">Email</a>
              </div>
            </div>
            <div className="content-right">
              <div className="description">
                I build intelligent data systems that power real-time decision-making at enterprise scale. 
                At Tata Consultancy Services, I’ve been fortunate to work at the intersection of data engineering 
                and applied AI, where I design and optimize large-scale data pipelines on Databricks to support 
                Retrieval-Augmented Generation (RAG) systems. My work focuses on creating the invisible infrastructure 
                that enables large language models to think, retrieve, and respond reliably across multiple business 
                units. Alongside this, I’ve developed regression-based machine learning models to interpret market 
                and customer service data, enhancing workforce scheduling accuracy and optimizing service performance. 
                Through these efforts, I’ve come to appreciate the role of robust data foundations in advancing AI 
                capabilities—not just as systems of automation, but as systems of intelligence that scale human 
                decision-making across industries.
                <br /><br />
                Outside of my work, I am deeply interested in pursuing research. I am continuously learning 
                how impactful research is conducted, exploring ideas that connect AI (specifically Machine Learning), Data and Computation. 
                I love to contribute to work that creates real-world impact.
              </div>
            </div>
          </div>
          {/* <div className="interest-section">
            <p>Experience</p>
            <div className="interests">
              <p><a href="https://example.com/icem-intern" target="_blank" rel="noopener noreferrer">iCEM</a> • Data & AI Solutions</p>
              <p><a href="https://example.com/phenomenal-ai-intern" target="_blank" rel="noopener noreferrer">Phenomenal AI</a> • AI Engineer</p>
            </div>
            <br></br>
            <p>Education</p>
            <div className="interests">
              <p>• 2020 - 2024 Bachelor's in Information and Communication Technology</p>
            </div>
          </div> */}
        </div>
        <div className="footer-section">
            <div className="footer">
              <div className="domain_name">
                © janakarpatel.vercel.app / <span className="top_badge">{timestamp}</span>
              </div>
              <div className="equation-container">
                <div className="equation">x = (1 + v cos(u/2)) * cos u</div>
                <div className="equation">y = (1 + v cos(u/2)) * sin u</div>
                <div className="equation">y = z = v sin(u/2)</div>
              </div>
            </div>
        </div>
      </div>
    </>
  )
}