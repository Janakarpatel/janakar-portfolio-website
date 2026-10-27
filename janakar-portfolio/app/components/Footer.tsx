'use client'

import { useEffect, useState } from 'react'
import NumberFlow, { NumberFlowGroup, continuous } from '@number-flow/react'
import FooterBunny from '@/app/components/FooterBunny'
import { useMobius } from '@/app/context/MobiusContext'

/** Always Ahmedabad time — never the visitor’s local zone. */
const TIME_ZONE = 'Asia/Kolkata'
const PLACE = 'Ahmedabad, Gujarat'

const clockFmt = new Intl.DateTimeFormat('en-US', {
  timeZone: TIME_ZONE,
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
})

const hour24Fmt = new Intl.DateTimeFormat('en-US', {
  timeZone: TIME_ZONE,
  hour: 'numeric',
  hour12: false,
})

type Clock = {
  hour: number
  minute: number
  period: 'am' | 'pm'
  sleeping: boolean
}

function getClock(now = new Date()): Clock {
  const parts = clockFmt.formatToParts(now)
  const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? 0)
  const minute = Number(parts.find((p) => p.type === 'minute')?.value ?? 0)
  const period: 'am' | 'pm' =
    (parts.find((p) => p.type === 'dayPeriod')?.value ?? 'AM').toLowerCase() === 'pm'
      ? 'pm'
      : 'am'

  // Midnight can be "24" in some engines; normalize for the sleep window.
  let hour24 = Number(hour24Fmt.formatToParts(now).find((p) => p.type === 'hour')?.value ?? 0)
  if (hour24 === 24) hour24 = 0
  // benji.org: sleeping when hour24 >= 22 || hour24 < 7
  const sleeping = hour24 >= 22 || hour24 < 7

  return { hour, minute, period, sleeping }
}

export default function Footer() {
  const [clock, setClock] = useState<Clock | null>(null)
  const [ready, setReady] = useState(false)
  const { listening } = useMobius()

  useEffect(() => {
    const tick = () => setClock(getClock())
    tick()
    const fade = requestAnimationFrame(() => setReady(true))
    // benji uses 60_000 ms
    const id = setInterval(tick, 60_000)
    return () => {
      cancelAnimationFrame(fade)
      clearInterval(id)
    }
  }, [])

  return (
    <footer className="w-full z-10 relative">
      {/* benji.org: same page column, footer padded 40px / 80px, plus the column's 2.5rem bottom */}
      <div className="max-w-[36.375rem] mx-auto px-4 pt-24 pb-30 max-[768px]:px-6">
        <div className="w-full">
          <p
            className="m-0 text-[13px] leading-[20px] tracking-[-0.04px] text-[var(--muted-color)]"
            style={{ fontFamily: 'var(--font-inter)', fontWeight: 460, fontVariantNumeric: 'tabular-nums' }}
          >
            <span
              style={{
                opacity: ready && clock ? 1 : 0,
                transition: 'opacity 0.3s ease',
              }}
            >
              {clock && (
                <>
                  <NumberFlowGroup>
                    <NumberFlow
                      value={clock.hour}
                      plugins={[continuous]}
                      willChange
                      style={{ lineHeight: 0.85 }}
                    />
                    <span>:</span>
                    <NumberFlow
                      value={clock.minute}
                      plugins={[continuous]}
                      willChange
                      format={{ minimumIntegerDigits: 2 }}
                      digits={{ 1: { max: 5 } }}
                      style={{ lineHeight: 0.85 }}
                    />
                  </NumberFlowGroup>
                  {clock.period} in {PLACE}
                </>
              )}
            </span>{'   '}
            <span
              style={{
                display: 'inline-block',
                verticalAlign: 'bottom',
                marginBottom: -6,
                // the monkey's ink starts closer to its box edge than benji's bunny; this matches his 8.3px visible gap
                marginLeft: 4,
                opacity: ready && clock ? 1 : 0,
                transition: 'opacity 0.3s ease',
              }}
            >
              {clock && <FooterBunny sleeping={clock.sleeping} listening={listening} />}
            </span>
          </p>
        </div>
      </div>
    </footer>
  )
}
