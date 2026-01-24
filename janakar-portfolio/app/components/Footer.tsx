'use client'

interface FooterProps {
    timestamp: string
}

export default function Footer({ timestamp }: FooterProps) {
    return (
        <div className="w-full z-10 relative md:fixed md:bottom-0 md:left-0">
            <div className="p-6 flex justify-between items-end max-[768px]:p-6 max-[768px]:flex-col-reverse max-[768px]:gap-3 max-[768px]:items-start max-[480px]:p-8.75 max-[480px]:flex-col-reverse max-[480px]:gap-3 max-[480px]:items-start">
                <div className="text-[0.6rem] text-secondary tracking-[-0.2px] pointer-events-auto max-[480px]:text-xs">
                    © janakarpatel.vercel.app / <span className="top_badge">{timestamp}</span>
                </div>
                <div className="flex flex-col items-end gap-0 pointer-events-auto max-[480px]:items-start max-[480px]:gap-[0.2em]">
                    <div className="font-courier text-[0.75rem] max-[480px]:text-xs">x = (1 + v cos(u/2)) * cos u</div>
                    <div className="font-courier text-[0.75rem] max-[480px]:text-xs">y = (1 + v cos(u/2)) * sin u</div>
                    <div className="font-courier text-[0.75rem] max-[480px]:text-xs">z = v sin(u/2)</div>
                </div>
            </div>
        </div>
    )
}