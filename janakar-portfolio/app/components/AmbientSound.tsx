'use client'

import { useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { useMobius } from '@/app/context/MobiusContext'

/**
 * Interstellar-like space pad + soft focus binaural (alpha / gamma),
 * locked to Möbius pulse, color, and rotation pan.
 */
export default function AmbientSound() {
  const { syncRef, setListening } = useMobius()
  const [on, setOn] = useState(false)
  const onRef = useRef(false)
  const ctxRef = useRef<AudioContext | null>(null)
  const masterRef = useRef<GainNode | null>(null)
  const organGainRef = useRef<GainNode | null>(null)
  const spaceGainRef = useRef<GainNode | null>(null)
  const focusGainRef = useRef<GainNode | null>(null)
  const panRef = useRef<StereoPannerNode | null>(null)
  const noteBusRef = useRef<GainNode | null>(null)
  const startedRef = useRef(false)
  const prevSpreadRef = useRef(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      ctxRef.current?.close().catch(() => {})
      ctxRef.current = null
      masterRef.current = null
      organGainRef.current = null
      spaceGainRef.current = null
      focusGainRef.current = null
      panRef.current = null
      noteBusRef.current = null
      startedRef.current = false
      setListening(false)
    }
  }, [setListening])

  useEffect(() => {
    if (!on) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      return
    }

    const tick = () => {
      const ctx = ctxRef.current
      const sync = syncRef.current
      if (ctx && onRef.current) {
        const t = ctx.currentTime
        const spread = sync.spread
        const phase = sync.colorPhase

        // Organ pad swells with particle bloom (Interstellar rise)
        if (organGainRef.current) {
          organGainRef.current.gain.setTargetAtTime(0.14 + spread * 0.16, t, 0.1)
        }
        // Soft space dust — quiet, not wind
        if (spaceGainRef.current) {
          spaceGainRef.current.gain.setTargetAtTime(0.02 + spread * 0.025, t, 0.12)
        }
        // Focus bed steady, slight lift on bloom
        if (focusGainRef.current) {
          focusGainRef.current.gain.setTargetAtTime(0.07 + spread * 0.04, t, 0.1)
        }
        if (panRef.current) {
          panRef.current.pan.setTargetAtTime(Math.sin(sync.rotY) * 0.85, t, 0.05)
        }

        // Soft harmonic “star chime” on bloom
        if (spread > 0.55 && prevSpreadRef.current <= 0.55 && noteBusRef.current) {
          const scale = [261.63, 329.63, 392.0, 523.25] // C major — clear, calm
          const freq = scale[Math.floor(phase * scale.length) % scale.length]
          const osc = ctx.createOscillator()
          osc.type = 'sine'
          osc.frequency.value = freq
          const g = ctx.createGain()
          g.gain.setValueAtTime(0, t)
          g.gain.linearRampToValueAtTime(0.07, t + 1.2)
          g.gain.linearRampToValueAtTime(0, t + 6)
          osc.connect(g).connect(noteBusRef.current)
          osc.start(t)
          osc.stop(t + 7)
        }
        prevSpreadRef.current = spread
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [on, syncRef])

  async function ensureStarted() {
    if (startedRef.current && ctxRef.current) {
      if (ctxRef.current.state === 'suspended') await ctxRef.current.resume()
      return
    }

    const ctx = new AudioContext()
    const master = ctx.createGain()
    master.gain.value = 0

    const pan = ctx.createStereoPanner()
    pan.pan.value = 0
    panRef.current = pan

    const highpass = ctx.createBiquadFilter()
    highpass.type = 'highpass'
    highpass.frequency.value = 90
    highpass.Q.value = 0.7

    const lowpass = ctx.createBiquadFilter()
    lowpass.type = 'lowpass'
    lowpass.frequency.value = 4800
    lowpass.Q.value = 0.5

    const compressor = ctx.createDynamicsCompressor()
    compressor.threshold.value = -26
    compressor.knee.value = 18
    compressor.ratio.value = 2.8
    compressor.attack.value = 0.1
    compressor.release.value = 0.35

    master.connect(pan).connect(highpass).connect(lowpass).connect(compressor).connect(ctx.destination)

    const now = ctx.currentTime

    function tone(freq: number, type: OscillatorType, gainVal: number, dest: AudioNode) {
      const osc = ctx.createOscillator()
      osc.type = type
      osc.frequency.value = freq
      const g = ctx.createGain()
      g.gain.value = gainVal
      osc.connect(g).connect(dest)
      osc.start(now)
      return osc
    }

    // ——— Interstellar-like organ stack (odd harmonics, soft) ———
    const organ = ctx.createGain()
    organ.gain.value = 0.14
    organ.connect(master)
    organGainRef.current = organ
    const fundamental = 110
    // pipe-organ feel: fundamental + soft harmonics
    ;[1, 2, 3, 4, 6].forEach((h, i) => {
      tone(fundamental * h, 'sine', 0.18 / (i + 1), organ)
      // slight detune twin for width
      const det = ctx.createOscillator()
      det.type = 'sine'
      det.frequency.value = fundamental * h * 1.003
      const dg = ctx.createGain()
      dg.gain.value = 0.06 / (i + 1)
      det.connect(dg).connect(organ)
      det.start(now)
    })

    // Slow organ swell LFO (cinematic breath)
    const swell = ctx.createOscillator()
    swell.frequency.value = 0.045
    const swellDepth = ctx.createGain()
    swellDepth.gain.value = 0.05
    swell.connect(swellDepth).connect(organ.gain)
    swell.start(now)

    // ——— Focus: alpha binaural (~10 Hz) + soft 40 Hz gamma AM ———
    // Headphones: L/R carriers for calm alert focus
    const focus = ctx.createGain()
    focus.gain.value = 0.07
    focus.connect(master)
    focusGainRef.current = focus

    const carrier = 200
    const alpha = 10 // calm focus
    const merge = ctx.createChannelMerger(2)
    const binL = ctx.createOscillator()
    const binR = ctx.createOscillator()
    binL.type = 'sine'
    binR.type = 'sine'
    binL.frequency.value = carrier
    binR.frequency.value = carrier + alpha
    const binG = ctx.createGain()
    binG.gain.value = 0.55
    binL.connect(merge, 0, 0)
    binR.connect(merge, 0, 1)
    merge.connect(binG).connect(focus)
    binL.start(now)
    binR.start(now)

    // 40 Hz gamma pulse on a soft mid tone (cognitive binding feel)
    const gammaTone = ctx.createOscillator()
    gammaTone.type = 'sine'
    gammaTone.frequency.value = 256
    const gammaGain = ctx.createGain()
    gammaGain.gain.value = 0.04
    gammaTone.connect(gammaGain).connect(focus)
    gammaTone.start(now)
    const gammaLfo = ctx.createOscillator()
    gammaLfo.frequency.value = 40
    const gammaDepth = ctx.createGain()
    gammaDepth.gain.value = 0.03
    gammaLfo.connect(gammaDepth).connect(gammaGain.gain)
    gammaLfo.start(now)

    // ——— Quiet Interstellar “space” dust (filtered, not blowing) ———
    const noiseLen = 4 * ctx.sampleRate
    const noiseBuf = ctx.createBuffer(1, noiseLen, ctx.sampleRate)
    const data = noiseBuf.getChannelData(0)
    let pink = 0
    for (let i = 0; i < noiseLen; i++) {
      const white = Math.random() * 2 - 1
      pink = 0.98 * pink + 0.02 * white
      data[i] = pink * 0.4
    }
    const noise = ctx.createBufferSource()
    noise.buffer = noiseBuf
    noise.loop = true

    const spaceBp = ctx.createBiquadFilter()
    spaceBp.type = 'bandpass'
    spaceBp.frequency.value = 900
    spaceBp.Q.value = 0.35

    const space = ctx.createGain()
    space.gain.value = 0.02
    spaceGainRef.current = space

    noise.connect(spaceBp).connect(space).connect(master)
    noise.start(now)

    // Soft high “starfield” sine veil
    tone(660, 'sine', 0.025, master)
    tone(990, 'sine', 0.015, master)

    const noteBus = ctx.createGain()
    noteBus.gain.value = 0.14
    noteBus.connect(master)
    noteBusRef.current = noteBus

    ctxRef.current = ctx
    masterRef.current = master
    startedRef.current = true
  }

  async function setPlaying(next: boolean) {
    await ensureStarted()
    const master = masterRef.current
    const ctx = ctxRef.current
    if (!master || !ctx) return

    const t = ctx.currentTime
    master.gain.cancelScheduledValues(t)
    master.gain.setValueAtTime(master.gain.value, t)
    master.gain.linearRampToValueAtTime(next ? 0.1 : 0, t + 2)
    onRef.current = next
    setOn(next)
    setListening(next)
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(!on)}
      aria-pressed={on}
      aria-label={on ? 'Mute ambient sound' : 'Play ambient sound'}
      className={`relative z-20 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-[1.25px] bg-transparent p-0 pointer-events-auto cursor-pointer transition-colors ${
        on
          ? 'border-[#5C4AD0] text-[#5C4AD0] hover:border-[#2511AE] hover:text-[#2511AE]'
          : 'border-[var(--muted-color)] text-[var(--muted-color)] hover:border-[var(--muted-hover-color)] hover:text-[var(--muted-hover-color)]'
      }`}
    >
      {on ? <VolumeX size={15} strokeWidth={1.875} /> : <Volume2 size={15} strokeWidth={1.875} />}
    </button>
  )
}
