'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import Footer from '@/app/components/Footer'

export default function Contact() {
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
            <div className="w-auto h-max p-10 pb-32 z-10 max-[768px]:p-6 max-[768px]:pb-40 max-[768px]:h-fit max-[480px]:p-6 max-[480px]:pb-48">
                <div className="mb-4">
                    <Link href="/" className="hover-link inline-flex items-center gap-2 text-base tracking-[-0.2px] duration-[0.3s] ease-[cubic-bezier(0.4,0,0.2,1)] group">
                        <ChevronLeft size={18} className="transition-transform duration-[0.4s] ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-x-1" />
                        Back
                    </Link>
                </div>
                <div className="flex flex-col items-start gap-5 max-[768px]:w-full max-[768px]:gap-6 max-[768px]:flex-col max-[480px]:w-full max-[480px]:gap-6 max-[480px]:flex-col">
                    <div className="content-left">
                    <div className="flex flex-col gap-1">
                        <p className="m-0 text-[2.3rem] font-medium tracking-[-1.2px] text-primary max-[480px]:text-[2rem] max-[480px]:leading-tight">Get in Touch</p>
                        <p className="mt-0.5 mb-0 text-base font-normal tracking-[-0.5px] text-secondary max-[480px]:text-base max-[480px]:mt-1">Let's collaborate and build something great</p>
                    </div>
                    </div>
                    <div className="w-full">
                    <div className="w-3/4 text-lg font-crimson font-normal tracking-[-0.3px] text-primary leading-tight max-[768px]:w-full max-[768px]:text-base max-[480px]:w-full max-[480px]:text-base max-[480px]:leading-tight">
                        I'm always interested in learning about new opportunities and technical challenges. 
                        Whether you want to discuss a project, explore a collaboration, or just have an interesting 
                        conversation, I'd love to hear from you.
                    </div>
                    </div>
                </div>

                <div className="mt-6 flex flex-col">
                    {/* <h2 className="m-0 p-0 text-2xl font-medium tracking-custom-super-tight text-black dark:text-white">Contact Methods</h2> */}
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col">
                            <h3 className="m-0 text-lg font-medium tracking-[-0.3px]">Email</h3>
                            <p className="w-3/4 mt-2 font-crimson text-lg tracking-[-0.5px] leading-tight m-0 max-[768px]:w-full max-[480px]:w-full">The best way to reach me is via email. I try to respond to every email. However, I tend to procrastinate on long/non-urgent emails, and sometimes forget to respond altogether. If I haven't replied in a week, feel free to follow up. <a href="mailto:contact.janakarpatel@gmail.com" className="hover-link m-0 text-base tracking-[-0.2px] font-crimson italic underline">contact.janakarpatel@gmail.com</a></p>
                        </div>
                        <div className="flex flex-col">
                            <h3 className="m-0 text-lg font-medium tracking-[-0.3px]">Social Links</h3>
                            <p className="w-3/4 mt-2 font-crimson text-lg tracking-[-0.5px] leading-tight m-0 max-[768px]:w-full max-[480px]:w-full">I use social media, but don’t spend a lot of time on it. The services I use include:</p>
                            <ul className="flex flex-col mt-2 ml-5 list-disc">
                                <li>
                                    <a href="https://twitter.com/janakarpatel" target="_blank" rel="noopener noreferrer" className="m-0 font-crimson text-base tracking-[-0.2px] text-blue-700">Twitter</a>
                                    <span className="m-0 text-base tracking-[-0.5px] font-crimson"> : I read Twitter DMs, but I find its inbox hard to use so please don’t use Twitter to reach me.</span>
                                </li>
                                <li>
                                    <a href="https://linkedin.com/in/janakarpatel" target="_blank" rel="noopener noreferrer" className="m-0 font-crimson text-base tracking-[-0.2px] text-blue-700">LinkedIn</a>
                                    <span className="m-0 text-base tracking-[-0.5px] font-crimson"> : I read LinkedIn messages but I prefer emails.</span>
                                </li>
                                <li>
                                    <a href="https://www.youtube.com/@prjack935" target="_blank" rel="noopener noreferrer" className="m-0 font-crimson text-base tracking-[-0.2px] text-blue-700">Youtube</a>
                                    <span className="m-0 text-base tracking-[-0.5px] font-crimson"> : I’m camera-shy, so I haven’t done a lot of videos. But I want to change that.</span>
                                </li>
                                <li>
                                    <a href="https://www.instagram.com/its.jnkr" target="_blank" rel="noopener noreferrer" className="m-0 font-crimson text-base tracking-[-0.2px] text-blue-700">Instagram</a>
                                    <span className="m-0 text-base tracking-[-0.5px] font-crimson"> : If I don’t follow you on Instagram, your message goes to a separate folder that I don’t check.</span>
                                </li>
                            </ul>
                            <p className='mt-2 text-md font-crimson tracking-normal'><span className='font-bold'>tl;dr</span>: follow me on social media but reach me via email.</p>
                        </div>
                        <div className="flex flex-col">
                            <h3 className="m-0 text-lg font-medium tracking-[-0.3px]">Scheduling</h3>
                            <p className="w-3/4 mt-2 font-crimson text-lg tracking-[-0.5px] leading-tight m-0 max-[768px]:w-full max-[480px]:w-full">Please send a calendar invite for any scheduled plans if I haven’t already. I may forget otherwise.</p>
                        </div>
                        <div className="flex flex-col">
                            <h3 className="m-0 text-lg font-medium tracking-[-0.3px]">Conclusion</h3>
                            <p className="w-3/4 mt-2 font-crimson text-lg tracking-[-0.5px] leading-tight m-0 max-[768px]:w-full max-[480px]:w-full">When it comes to communication, I’m systematic but not inflexible. This post is a reference to avoid misunderstandings, not a rule. Some of the best memories I’ve had are from spontaneous decisions. I’d love to have more free spirits and rulebreakers in my life.</p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer timestamp={timestamp} />
        </div>
        </>
    )
}
