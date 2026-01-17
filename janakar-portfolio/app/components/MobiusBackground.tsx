'use client'

import { useMobius } from '@/app/context/MobiusContext'

export default function MobiusBackground() {
    const { canvasRef } = useMobius()

    return (
        <div className="fixed inset-0 -z-10">
        <canvas 
            ref={canvasRef} 
            className="fixed top-0 left-0 w-screen h-screen block opacity-80 -z-10 pointer-events-none"
        />
        </div>
    )
}
