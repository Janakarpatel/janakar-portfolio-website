'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Footer from './components/Footer'

export default function Home() {
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

  return (
    <>
      <div className="w-full min-h-screen flex flex-col relative">
        <div className="w-auto h-max p-10 pb-32 z-10 max-[768px]:p-6 max-[768px]:pb-40 max-[480px]:p-8.75 max-[480px]:pb-48">
          <div className="m-0 flex flex-col items-start gap-6 max-[768px]:w-full max-[768px]:gap-6 max-[480px]:w-full max-[480px]:gap-5">
            <div className="content-left">
              <div className="flex flex-col gap-0">
                <p className="m-0 p-0 text-[2.3rem] font-medium tracking-[--letter-spacing-custom-tighter] text-primary max-[480px]:text-[2rem] max-[480px]:leading-tight">Janakar Patel</p>
                <p className="m-0 text-base font-[1rem] tracking-[--letter-spacing-custom-tight] text-secondary max-[480px]:text-base max-[480px]:mt-1">Data, AI/ML Software + *Art & Design</p>
              </div>
              <div className="mt-4 flex gap-2.5 max-[480px]:mt-5 max-[480px]:gap-2.5">
                <a href="https://github.com/janakarpatel" target="_blank" rel="noopener noreferrer" className="hover-link text-[1.1rem] tracking-[-0.3px] cursor-pointer pointer-events-auto relative z-2 max-[480px]:text-base">GitHub</a>
                <a href="https://www.linkedin.com/in/janakarpatel/" target="_blank" rel="noopener noreferrer" className="hover-link text-[1.1rem] tracking-[-0.3px] cursor-pointer pointer-events-auto relative z-2 max-[480px]:text-base">LinkedIn</a>
                <a href="https://twitter.com/janakarpatel" target="_blank" rel="noopener noreferrer" className="hover-link text-[1.1rem] tracking-[-0.3px] cursor-pointer pointer-events-auto relative z-2 max-[480px]:text-base">Twitter</a>
                <a href="mailto:contact.janakarpatel@gmail.com" className="hover-link text-[1.1rem] tracking-[-0.3px] cursor-pointer pointer-events-auto relative z-2 max-[480px]:text-base">Email</a>
              </div>
            </div>
            <div className="w-full">
              <div className="w-3/4 mt-0 text-[1.1rem] font-crimson font-normal tracking-[-0.3px] text-primary leading-[1.2] max-[768px]:w-full max-[768px]:text-base max-[480px]:w-full max-[480px]:text-base max-[480px]:leading-tight">
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
          <div className="mt-4 w-3/4 text-[1.1rem] font-crimson font-normal tracking-[-0.3px] text-primary leading-[1.2] max-[768px]:w-full max-[768px]:text-base max-[480px]:w-full max-[480px]:text-base max-[480px]:leading-tight">
            If my work resonates with you, feel free to reach out anytime at <Link href="/contact" className="cursor-pointer underline text-blue-700">here.</Link>
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
        <Footer timestamp={timestamp} fixed />
      </div>
    </>
  )
}