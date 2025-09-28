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
    camera.position.set(0, 0, 100)
    scene.add(camera)

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Materials
    const torusMaterial = new THREE.PointsMaterial({ size: 0.2, color: 0x00ff00 })
    const sphereMaterial = new THREE.PointsMaterial({ size: 0.2, color: 0x4da6ff })

    // Sphere Point Cloud
    const sphereGeometry = new THREE.SphereGeometry(24, 100, 100)
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
    const torusGeometry = new THREE.TorusGeometry(35, 7, 32, 200)
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
                <a href="mailto:your-email@example.com">Email</a>
              </div>
            </div>
            <div className="content-right">
              <div className="description">
                I am an engineer and explorer at the intersection of data, AI, and creativity. 
                I am currently a Data Engineer at Tata Consultancy Services, where I design large-scale 
                workflows in Databricks and build systems that make large language models more reliable 
                in practice.
                <br />
                I am at the beginning of my research journey. I don't yet have years of publications, 
                but I am studying how research is done, experimenting with ideas, and looking for 
                opportunities to contribute. My curiosity drives me toward areas where AI, data, 
                and human creativity meet, and I hope to grow into a researcher who creates work that 
                both advances understanding and impacts the world.
                <br />
                Outside of engineering, I create in other forms too. I paint on canvas, draw cartoons, 
                and design graphics and user interfaces. I love the process of shaping ideas into something 
                visual and tangible. I also love to play games — video games for imagination and physical 
                sports for energy. I often find myself on a volleyball court, not competitively, but for 
                the joy of play and teamwork.
                <br />
                I see myself as a learner first — someone who wants to explore widely, from AI to art, 
                from research to design. My goal is to bring these threads together and grow into a polymath 
                who learns across disciplines and contributes to changing the world in meaningful ways.
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
        </div>
      </div>
    </>
    // <>
    //   <canvas ref={canvasRef} className="webgl" />
    //   <div className='main-wrapper'>
    //     <div className="content-layout">
    //       {/* Left side - Image
    //       <div className="image-section">
    //         <div className="profile-image">
    //           <img src="/profile.jpg" alt="Janakar Patel" />
    //         </div>
    //       </div> */}

    //       {/* Right side - Content */}
    //       <div className="content-section">
    //         <div className="te">
    //           <p className="name">Janakar Patel</p>
    //           <p className="tag">Data, AI/ML Software + Research (Little)</p>
              
    //           <div className="social_media">
    //             <a href="https://github.com/janakarpatel" target="_blank" rel="noopener noreferrer">GitHub</a>
    //             <a href="https://www.linkedin.com/in/janakarpatel/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
    //             <a href="https://twitter.com/janakarpatel" target="_blank" rel="noopener noreferrer">Twitter</a>
    //             <a href="mailto:your-email@example.com">Email</a>
    //           </div>

    //           <div className="description">
    //             I am an engineer and explorer at the intersection of data, AI, and creativity. 
    //             I am currently a Data Engineer at Tata Consultancy Services, where I design large-scale 
    //             workflows in Databricks and build systems that make large language models more reliable 
    //             in practice.
    //             <br />
    //             <br />
    //             I am at the beginning of my research journey. I don't yet have years of publications, 
    //             but I am studying how research is done, experimenting with ideas, and looking for 
    //             opportunities to contribute. My curiosity drives me toward areas where AI, data, 
    //             and human creativity meet, and I hope to grow into a researcher who creates work that 
    //             both advances understanding and impacts the world.
    //             <br />
    //             Outside of engineering, I create in other forms too. I paint on canvas, draw cartoons, 
    //             and design graphics and user interfaces. I love the process of shaping ideas into something 
    //             visual and tangible. I also love to play games — video games for imagination and physical 
    //             sports for energy. I often find myself on a volleyball court, not competitively, but for 
    //             the joy of play and teamwork.
    //             <br />
    //             I see myself as a learner first — someone who wants to explore widely, from AI to art, 
    //             from research to design. My goal is to bring these threads together and grow into a polymath 
    //             who learns across disciplines and contributes to changing the world in meaningful ways.
    //           </div>
    //         </div>
    //       </div>
    //     </div>

    //     <div className="mode-toggle" onClick={toggleTheme}>
    //       <svg 
    //         className="moon-icon" 
    //         xmlns="http://www.w3.org/2000/svg" 
    //         width="24" 
    //         height="24" 
    //         viewBox="0 0 24 24" 
    //         fill="none" 
    //         stroke="currentColor" 
    //         strokeWidth="2" 
    //         strokeLinecap="round" 
    //         strokeLinejoin="round"
    //       >
    //         <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
    //       </svg>
    //       <svg 
    //         className="sun-icon" 
    //         xmlns="http://www.w3.org/2000/svg" 
    //         width="24" 
    //         height="24" 
    //         viewBox="0 0 24 24" 
    //         fill="none" 
    //         stroke="currentColor" 
    //         strokeWidth="2" 
    //         strokeLinecap="round" 
    //         strokeLinejoin="round"
    //       >
    //         <circle cx="12" cy="12" r="4"></circle>
    //         <path d="M12 2v2"></path>
    //         <path d="M12 20v2"></path>
    //         <path d="m4.93 4.93 1.41 1.41"></path>
    //         <path d="m17.66 17.66 1.41 1.41"></path>
    //         <path d="M2 12h2"></path>
    //         <path d="M20 12h2"></path>
    //         <path d="m6.34 17.66-1.41 1.41"></path>
    //         <path d="m19.07 4.93-1.41 1.41"></path>
    //       </svg>
    //     </div>

    //     <div className="domain_name">
    //       © janakarpatel.com / <span className="top_badge">Portfolio {currentYear}</span>
    //     </div>
    //     <div className="torus_equation">(x² + y² + z² + R² - r²)² = 4R²(x² + y²)</div>
    //     <div className="sphere_equation">(x - a)² + (y - b)² + (z - c)² = r²</div>
        
    //     {/* Test section for smooth scrolling */}
    //     {/* <div style={{ height: '100vh', width: '100vw' }}>Test</div> */}
    // </div>
    // </>
  )
}