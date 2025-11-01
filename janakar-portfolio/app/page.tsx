'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDark, setIsDark] = useState(false)
  const [currentYear] = useState(new Date().getFullYear())

  useEffect(() => {
    if (!canvasRef.current) return

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
    const torusMaterial = new THREE.PointsMaterial({ size: 0.2, color: 0x00ff00 })
    const sphereMaterial = new THREE.PointsMaterial({ size: 0.2, color: 0x4da6ff })

    // Sphere Point Cloud
    const sphereGeometry = new THREE.SphereGeometry(15, 100, 50)
    const spherePositions = sphereGeometry.attributes.position.array as Float32Array
    
    // Add jitter to sphere
    for (let i = 0; i < spherePositions.length; i += 3) {
      spherePositions[i] += (Math.random() - 0.5)
      spherePositions[i + 1] += (Math.random() - 0.5)
      spherePositions[i + 2] += (Math.random() - 0.5)
    }

    const originalSpherePositions = spherePositions.slice()
    const sphereDirections: THREE.Vector3[] = []

    for (let i = 0; i < originalSpherePositions.length; i += 3) {
      const dir = new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
      ).normalize()
      sphereDirections.push(dir)
    }

    const sphere = new THREE.Points(sphereGeometry, sphereMaterial)

    // Torus Point Cloud
    const torusGeometry = new THREE.TorusGeometry(30, 10, 32, 200)
    const torusPositions = torusGeometry.attributes.position.array as Float32Array
    
    // Add jitter to torus
    for (let i = 0; i < torusPositions.length; i += 3) {
      torusPositions[i] += (Math.random() - 0.5)
      torusPositions[i + 1] += (Math.random() - 0.5)
      torusPositions[i + 2] += (Math.random() - 0.5)
    }

    const originalTorusPositions = torusPositions.slice()
    const torusDirections: THREE.Vector3[] = []

    for (let i = 0; i < originalTorusPositions.length; i += 3) {
      const dir = new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
      ).normalize()
      torusDirections.push(dir)
    }

    const torus = new THREE.Points(torusGeometry, torusMaterial)

    // Group and position
    const group = new THREE.Group()
    group.add(sphere)
    group.add(torus)
    group.position.set(0, 0, 30)
    scene.add(group)

    // Theme colors
    const lightTheme = { torus: 0x00ff00, sphere: 0x4da6ff }
    const darkTheme = { torus: 0x66ff66, sphere: 0x80ccff }

    // Animation loop
    const clock = new THREE.Clock()
    let animationId: number

    function tick() {
      const time = clock.getElapsedTime() * 0.2
      const pulse = Math.sin(time * 0.5)
      const spreadAmount = Math.max(0, pulse)

      // Animate sphere points
      for (let i = 0; i < spherePositions.length; i += 3) {
        const index = i / 3
        const ox = originalSpherePositions[i]
        const oy = originalSpherePositions[i + 1]
        const oz = originalSpherePositions[i + 2]
        const dir = sphereDirections[index]

        spherePositions[i] = ox + dir.x * spreadAmount * 10.0
        spherePositions[i + 1] = oy + dir.y * spreadAmount * 10.0
        spherePositions[i + 2] = oz + dir.z * spreadAmount * 10.0
      }
      sphereGeometry.attributes.position.needsUpdate = true

      // Animate torus points
      for (let i = 0; i < torusPositions.length; i += 3) {
        const index = i / 3
        const ox = originalTorusPositions[i]
        const oy = originalTorusPositions[i + 1]
        const oz = originalTorusPositions[i + 2]
        const dir = torusDirections[index]

        torusPositions[i] = ox + dir.x * spreadAmount * 10.0
        torusPositions[i + 1] = oy + dir.y * spreadAmount * 10.0
        torusPositions[i + 2] = oz + dir.z * spreadAmount * 10.0
      }
      torusGeometry.attributes.position.needsUpdate = true

      // Rotations
      sphere.rotation.y += 0.0025
      torus.rotation.x += 0.0025
      torus.rotation.y += 0.0005
      torus.rotation.z += 0.0035

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

    // Update theme colors
    const updateTheme = (dark: boolean) => {
      const colors = dark ? darkTheme : lightTheme
      torusMaterial.color.setHex(colors.torus)
      sphereMaterial.color.setHex(colors.sphere)
    }

    updateTheme(isDark)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationId)
      renderer.dispose()
      sphereGeometry.dispose()
      torusGeometry.dispose()
      torusMaterial.dispose()
      sphereMaterial.dispose()
    }
  }, [isDark])

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.body.classList.toggle('dark', !isDark)
  }

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
                <p className="tag">Data, AI/ML Software + Research (Little)</p>
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
          <div className="mode-toggle" onClick={toggleTheme}>
            <svg 
              className="moon-icon" 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
            </svg>
            <svg 
              className="sun-icon" 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="4"></circle>
              <path d="M12 2v2"></path>
              <path d="M12 20v2"></path>
              <path d="m4.93 4.93 1.41 1.41"></path>
              <path d="m17.66 17.66 1.41 1.41"></path>
              <path d="M2 12h2"></path>
              <path d="M20 12h2"></path>
              <path d="m6.34 17.66-1.41 1.41"></path>
              <path d="m19.07 4.93-1.41 1.41"></path>
            </svg>
          </div>
          <div className="interest-section">
            <p>Past</p>
            <div className="interests">
              <p><a href="https://example.com/icem-intern" target="_blank" rel="noopener noreferrer">iCEM</a> • Data & AI Solutions Intern</p>
              <p><a href="https://example.com/phenomenal-ai-intern" target="_blank" rel="noopener noreferrer">Phenomenal AI</a> • AI Engineer Intern</p>
            </div>
            <br></br>
            <p>Education</p>
            <div className="interests">
              <p>• 2020 - 2024 Bachelor's in Information and Communication Technology, Pandit Deendayal Energy University</p>
            </div>
          </div>
        </div>
        <div className="footer-section">
            <div className="footer">
              <div className="domain_name">
                © janakarpatel.com / <span className="top_badge">Portfolio {currentYear}</span>
              </div>
              <div className="equation-container">
                <div className="sphere_equation">(x - a)² + (y - b)² + (z - c)² = r²</div>
                <div className="torus_equation">(x² + y² + z² + R² - r²)² = 4R²(x² + y²)</div>
              </div>
            </div>
        </div>
      </div>
    </>
  )
}