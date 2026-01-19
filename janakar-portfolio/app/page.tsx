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
                <p className="m-0 p-0 text-[2.3rem] font-medium tracking-[--letter-spacing-custom-tighter] text-primary max-[480px]:text-[2rem] max-[480px]:leading-tight">Janakar Patel | જનકાર પટેલ</p>
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
              <div className="w-1/2 mt-0 text-[1.1rem] font-crimson font-normal tracking-[-0.2px] text-primary leading-[1.2] max-[768px]:w-full max-[768px]:text-base max-[480px]:w-full max-[480px]:text-base max-[480px]:leading-tight">
                I'm an engineer and a self-taught artist curious about software and hardware, 
                currently based in Ahmedabad City and working on Data and AI at <span className="underline cursor-pointer hover:text-blue-700 hover:italic hover:font-bold"><a href="https://www.tcs.com" target="_blank" rel="noopener noreferrer">TCS</a></span>.  
                Previously, I was an engineering student at <span className="underline cursor-pointer hover:text-blue-700 hover:italic hover:font-bold"><a href="https://www.pdpu.ac.in" target="_blank" rel="noopener noreferrer">Pandit Deendayal Energy University</a></span> in Gandhinagar.
                <br /><br />
                I'm care about intentional thinking, design, and engineering. I 
                enjoy dreaming up ambitious toys that solve complex problems in 
                creative ways. I want to create beautiful things that I am proud of.
                <br /><br />
                I've recently been working on and thinking about machine understandings research.
              </div>
            </div>
          </div>
          <div className="mt-4 w-3/4 text-[1.1rem] font-crimson font-normal tracking-[-0.2px] text-primary leading-[1.2] max-[768px]:w-full max-[768px]:text-base max-[480px]:w-full max-[480px]:text-base max-[480px]:leading-tight">
            If my work resonates with you, feel free to reach out anytime at <Link href="/contact" className="cursor-pointer underline text-blue-700">click here.</Link>
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