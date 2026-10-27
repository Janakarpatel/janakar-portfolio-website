'use client'

import { useEffect, useState } from 'react'
import { motion, MotionConfig, type TargetAndTransition, type Transition } from 'framer-motion'

type Props = {
  /** hour24 >= 22 || hour24 < 7 (benji.org rule) */
  sleeping: boolean
  /** ambient sound is on: headphones + grooving, overrides sleep */
  listening?: boolean
  size?: number
}

type Anim = { initial?: TargetAndTransition; animate: TargetAndTransition; transition: Transition }

/** Only three eye shapes, switched instantly (never tweened, so never an oval). */
type Shape = 'dot' | 'v' | 'h'
type Eye = {
  /** one shape, or keyframes over the 6s loop at `times` */
  shape: Shape | Shape[]
  times?: number[]
  look?: TargetAndTransition
  lookT?: Transition
}

type Act = {
  /** resting pose; springs smoothly between acts */
  pose: { rotate: number; y: number }
  /** 6s loop on top of the pose; every loop starts and ends at 0 so switching never jumps */
  loop: Anim
  leftEye: Eye
  rightEye: Eye
  mouth: keyof typeof MOUTH
  tongue?: boolean
}

/** All mouths share one "M C C" structure so framer can morph `d` between them. */
const MOUTH = {
  neutral: 'M9.86 24.6C10.86 24.6 11.86 24.6 12.86 24.6C13.86 24.6 14.86 24.6 15.86 24.6',
  smile: 'M9.86 23.6C10.4 25 11.5 25.8 12.86 25.8C14.2 25.8 15.3 25 15.86 23.6',
  pout: 'M10.4 25.2C10.9 24.6 11.8 24.2 12.86 24.2C13.9 24.2 14.8 24.6 15.3 25.2',
  o: 'M12.86 23C10.7 23 10.7 26.2 12.86 26.2C15 26.2 15 23 12.86 23',
}

const LOOP_S = 6
const loop = (times: number[], ease: Transition['ease'] = 'easeInOut'): Transition => ({
  duration: LOOP_S,
  repeat: Infinity,
  times,
  ease,
})
/** hold each keyframe, then snap to the next one */
const JUMP = (t: number) => (t < 1 ? 0 : 1)

/** for values an act holds still: overrides any loop the previous act left running */
const SETTLE: Transition = { duration: 0.6, ease: 'easeOut' }

const EYE_Y = 17.5
const EYE_KEYS = ['x1', 'y1', 'x2', 'y2', 'strokeWidth'] as const

/** Each eye is one round-capped line: zero length = benji dot, else a 1.25px vertical/horizontal line. */
/** `k` converts screen px to viewBox units: eyes skip non-scaling-stroke, which makes Chrome repaint dots only partly while the head rotates. */
function shapeAttrs(shape: Shape, cx: number, k: number) {
  if (shape === 'dot') return { x1: cx, y1: EYE_Y, x2: cx + 0.01, y2: EYE_Y, strokeWidth: 2.9 * k }
  if (shape === 'v') return { x1: cx, y1: EYE_Y - 1.6, x2: cx, y2: EYE_Y + 1.6, strokeWidth: 1.25 * k }
  return { x1: cx - 1.6, y1: EYE_Y, x2: cx + 1.6, y2: EYE_Y, strokeWidth: 1.25 * k }
}

function eyeAnim(eye: Eye, cx: number, k: number): Anim {
  const shapes = Array.isArray(eye.shape) ? eye.shape : [eye.shape]
  const many = shapes.length > 1
  const shapeT = many && eye.times ? loop(eye.times, JUMP) : { duration: 0 }
  return {
    initial: Object.fromEntries(EYE_KEYS.map((key) => [key, shapeAttrs(shapes[0], cx, k)[key]])),
    animate: {
      x: 0,
      y: 0,
      ...eye.look,
      ...Object.fromEntries(
        EYE_KEYS.map((key) => [
          key,
          many ? shapes.map((s) => shapeAttrs(s, cx, k)[key]) : shapeAttrs(shapes[0], cx, k)[key],
        ])
      ),
    },
    transition: { default: SETTLE, ...Object.fromEntries(EYE_KEYS.map((k) => [k, shapeT])), ...eye.lookT },
  }
}

const closedEye: Eye = { shape: 'h', look: { y: 0.6 } }

const glance = { x: [0, 0, -1.6, -1.6, 1.6, 1.6, 0, 0] }
const glanceT = { x: loop([0, 0.12, 0.16, 0.24, 0.28, 0.36, 0.4, 1]) }
const TONGUE_TIMES = [0, 0.4, 0.44, 0.5, 0.56, 0.62, 0.68, 0.74, 0.8, 0.84, 0.88, 1]
const PEEK_T = [0, 0.1, 0.4, 0.5, 0.85, 1]
const peekEye: Eye = {
  shape: ['dot', 'dot', 'h', 'dot', 'dot'],
  times: [0, 0.6, 0.63, 0.66, 1],
  look: { x: [0, -1.4, -1.4, 1.4, 1.4, 0], y: [0, -0.8, -0.8, -0.4, -0.4, 0] },
  lookT: { x: loop(PEEK_T), y: loop(PEEK_T) },
}
const sulkEye: Eye = {
  shape: ['dot', 'dot', 'h', 'dot', 'dot'],
  times: [0, 0.75, 0.79, 0.83, 1],
  look: { y: 0.8, x: [0, -0.6, -0.6, 0.6, 0.6, 0] },
  lookT: { x: loop([0, 0.15, 0.45, 0.55, 0.85, 1]) },
}

const AWAKE: Act[] = [
  {
    // mischief: sneaky lean left/right with shifty eyes, then a long "nyah-nyah" tease (~40–88%)
    pose: { rotate: 0, y: 0 },
    loop: {
      animate: { y: 0, rotate: [0, 0, -7, -7, 6, 6, 0, -6, 6, -6, 6, -6, 6, 0, 0] },
      transition: {
        y: SETTLE,
        rotate: loop([0, 0.12, 0.16, 0.24, 0.28, 0.36, 0.4, 0.46, 0.52, 0.58, 0.64, 0.7, 0.76, 0.84, 1]),
      },
    },
    // vertical-line eyes ('_'): quick blink, then the right eye holds a wink while the tongue is out
    leftEye: { shape: ['v', 'v', 'h', 'v', 'v'], times: [0, 0.05, 0.07, 0.09, 1], look: glance, lookT: glanceT },
    rightEye: {
      shape: ['v', 'v', 'h', 'v', 'v', 'h', 'h', 'v', 'v'],
      times: [0, 0.05, 0.07, 0.09, 0.42, 0.46, 0.84, 0.88, 1],
      look: glance,
      lookT: glanceT,
    },
    mouth: 'neutral',
    tongue: true,
  },
  {
    // giggle: closed happy eyes, big smile, bouncing and shaking
    pose: { rotate: 0, y: 0 },
    loop: {
      animate: { y: [0, -1.2, 0, -1, 0, -1.2, 0, 0], rotate: [0, 3, -3, 3, -3, 2, 0, 0] },
      transition: loop([0, 0.08, 0.16, 0.24, 0.32, 0.4, 0.5, 1]),
    },
    leftEye: { shape: 'h', look: { y: 0.6 } },
    rightEye: { shape: 'h', look: { y: 0.6 } },
    mouth: 'smile',
  },
  {
    // peek: head cocked, round eyes darting around, "o" surprised mouth
    pose: { rotate: -12, y: -0.5 },
    loop: {
      animate: { y: 0, rotate: [0, -3, 0, 2, 0] },
      transition: { y: SETTLE, rotate: loop([0, 0.25, 0.5, 0.75, 1]) },
    },
    leftEye: peekEye,
    rightEye: peekEye,
    mouth: 'o',
  },
  {
    // sulk: head drooped, eyes down, little "no" shake, sad pout
    pose: { rotate: 0, y: 0.8 },
    loop: {
      animate: { y: [0, 0.5, 0, 0, 0, 0], rotate: [0, 0, -3, 3, 0, 0] },
      transition: loop([0, 0.3, 0.55, 0.7, 0.85, 1]),
    },
    leftEye: sulkEye,
    rightEye: sulkEye,
    mouth: 'pout',
  },
]

const breathe: Anim = {
  animate: { y: [0, 0.6, 0, 0.6, 0], rotate: [0, -1.5, 0, -1.5, 0] },
  transition: loop([0, 0.25, 0.5, 0.75, 1]),
}

const SLEEP: Act[] = [
  // asleep on the left side
  { pose: { rotate: -10, y: 0.6 }, loop: breathe, leftEye: closedEye, rightEye: closedEye, mouth: 'neutral' },
  // rolled over to the right side, sweet dream
  { pose: { rotate: 10, y: 0.6 }, loop: breathe, leftEye: closedEye, rightEye: closedEye, mouth: 'smile' },
  {
    // dozing upright and snoring: head slowly drops, then jerks back up
    pose: { rotate: 0, y: 0.6 },
    loop: {
      animate: { y: [0, 0, 1.6, 1.9, 0, 0], rotate: [0, 0, 5, 5, 0, 0] },
      transition: loop([0, 0.3, 0.65, 0.72, 0.78, 1]),
    },
    leftEye: closedEye,
    rightEye: closedEye,
    mouth: 'o',
  },
]

/** 8 head-bobs per 6s loop (~80 bpm) */
const BEATS = Array.from({ length: 17 }, (_, i) => i / 16)

const LISTEN: Act[] = [
  {
    // vibing: eyes shut, smiling, nodding on the beat
    pose: { rotate: 0, y: 0 },
    loop: {
      animate: {
        y: BEATS.map((_, i) => (i % 2 ? 1 : 0)),
        rotate: BEATS.map((_, i) => (i % 4 === 1 ? 3 : i % 4 === 3 ? -3 : 0)),
      },
      transition: loop(BEATS),
    },
    leftEye: closedEye,
    rightEye: closedEye,
    mouth: 'smile',
  },
  {
    // grooving: slow side-to-side sway, eyes following, humming "o"
    pose: { rotate: 0, y: 0 },
    loop: {
      animate: { y: [0, 0.6, 0, 0.6, 0], rotate: [0, -7, 0, 7, 0] },
      transition: loop([0, 0.25, 0.5, 0.75, 1]),
    },
    leftEye: { shape: 'dot', look: { x: [0, -1.2, 0, 1.2, 0] }, lookT: { x: loop([0, 0.25, 0.5, 0.75, 1]) } },
    rightEye: { shape: 'dot', look: { x: [0, -1.2, 0, 1.2, 0] }, lookT: { x: loop([0, 0.25, 0.5, 0.75, 1]) } },
    mouth: 'o',
  },
]

const POSE_T: Transition = { type: 'spring', stiffness: 40, damping: 12 }
const ORIGIN = { originX: '50%', originY: '100%' }

/** Picks a random act per state; holds it 1–3 whole loops so switches land on loop boundaries. */
function useAct(acts: Act[]) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    setIndex(0)
    let current = 0
    let timer: ReturnType<typeof setTimeout>
    const schedule = () => {
      timer = setTimeout(() => {
        current = (current + 1 + Math.floor(Math.random() * (acts.length - 1))) % acts.length
        setIndex(current)
        schedule()
      }, LOOP_S * 1000 * (1 + Math.floor(Math.random() * 3)))
    }
    schedule()
    return () => clearTimeout(timer)
  }, [acts])

  return acts[index] ?? acts[0]
}

/** "@" centred on (cx, 20.4). */
function at(cx: number) {
  const cy = 20.4
  return `M${cx + 1.7} ${cy - 1.8}V${cy + 1}Q${cx + 1.7} ${cy + 2.3} ${cx + 3} ${cy + 2.3}Q${cx + 4.4} ${cy + 2.3} ${cx + 4.4} ${cy}A4.4 4.4 0 1 0 ${cx + 1.8} ${cy + 4}M${cx} ${cy - 1.7}a1.7 1.7 0 1 0 0.01 0`
}

const NS = { vectorEffect: 'non-scaling-stroke' as const }
const PAD = { stroke: 'var(--headphone-pad-color)' }

/** benji.org-style ASCII monkey @('_')@: each glyph is its own animatable part. */
export default function FooterBunny({ sleeping, listening = false, size = 32 }: Props) {
  const acts = listening ? LISTEN : sleeping ? SLEEP : AWAKE
  const act = useAct(acts)
  const state = listening ? 'listen' : sleeping ? 'sleep' : 'awake'
  // framer skips re-animating attributes whose keyframes match the previous act, leaving them on the
  // old loop timing (half-dot, half-line eyes); remounting per act restarts every attribute together
  const eyeKey = `${state}-${acts.indexOf(act)}`

  return (
    <MotionConfig reducedMotion="user">
      <svg
        className={`bb bb--${state}`}
        width={size * 1.3}
        height={size}
        viewBox="0 0 52 40"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.25}
        strokeLinecap="round"
        aria-hidden
      >
        <g transform="translate(13.1, 1)">
          <motion.g style={ORIGIN} animate={act.pose} transition={POSE_T}>
            <motion.g style={ORIGIN} {...act.loop}>
              {/* "@" ears tuck away under the headphone cups */}
              <motion.g initial={false} animate={{ opacity: listening ? 0 : 1 }} transition={SETTLE}>
                <g className="bb-ear-l">
                  <path d={at(-6.8)} {...NS} />
                </g>
                <g className="bb-ear-r">
                  <path d={at(32.5)} {...NS} />
                </g>
              </motion.g>

              <path d="M3.3 15.4Q0.2 20.4 3.3 25.4M22.4 15.4Q25.5 20.4 22.4 25.4" {...NS} />
              {/* sideways "(" across the top of the face */}
              <path d="M5.35 11.9Q12.85 7.9 20.35 11.9" {...NS} />

              {/* headphones as "d[-_-]b": the d/b stems rise into a band arched like the top bracket;
                  stems sit ~3.2 units clear of the face brackets (whose curves reach x 1.75 and 23.95) */}
              <motion.g
                initial={false}
                animate={{ opacity: listening ? 1 : 0, y: listening ? 0 : -3 }}
                transition={SETTLE}
              >
                {/* top bracket's curve (15 wide, control 4 up) scaled to the 28.5-wide band */}
                <path d="M-1.4 23V8Q12.85 0.4 27.1 8V23" {...NS} />
                <circle cx={-4} cy={20.4} r={2.6} style={PAD} {...NS} />
                <circle cx={29.7} cy={20.4} r={2.6} style={PAD} {...NS} />
              </motion.g>

              <motion.line key={`l-${eyeKey}`} {...eyeAnim(act.leftEye, 8, 40 / size)} />
              <motion.line key={`r-${eyeKey}`} {...eyeAnim(act.rightEye, 17.7, 40 / size)} />

              <motion.path initial={false} animate={{ d: MOUTH[act.mouth] }} transition={SETTLE} {...NS} />
              {act.tongue && (
                // glyph-style "U" tongue with a centre crease, hanging off the right of the "_"
                <motion.g
                  style={{ originX: 0.5, originY: 0 }}
                  initial={{ scaleY: 0, x: 0 }}
                  animate={{
                    scaleY: [0, 0, 1.1, 1, 1.15, 1, 1.15, 1, 1.1, 1, 0, 0],
                    x: [0, 0, 0, -0.7, 0.7, -0.7, 0.7, -0.7, 0.5, 0, 0, 0],
                  }}
                  transition={loop(TONGUE_TIMES)}
                >
                  <path d="M12.7 24.6V26.6A1.5 1.5 0 0 0 15.7 26.6V24.6M14.2 24.6V25.9" {...NS} />
                </motion.g>
              )}
            </motion.g>
          </motion.g>
        </g>

        {state !== 'awake' && (
          // benji's zzz coordinates verbatim; the nested viewport shifts them beside the monkey and
          // is also the origin their view-box scale animation grows from, as on his bunny
          <svg x={12} y={4} overflow="visible">
            {listening ? (
              <g fill="currentColor" stroke="none" style={{ fontFamily: 'var(--font-notes), ui-monospace, monospace' }}>
                {/* \uFE0E keeps the notes as text glyphs, not colour emoji */}
                {/* sized so each glyph's ink (♪ 0.56em tall, ♫ 0.59em in Noto Music) optically matches the z it
                    replaces (5.5 / 4.3 / 3.6 tall incl. stroke) and is centred on that z */}
                <text className="bb-z bb-z-1" x={31.8} y={9.85} fontSize={10.5}>{'♪\uFE0E'}</text>
                <text className="bb-z bb-z-2" x={33.8} y={6.9} fontSize={8.2}>{'♪\uFE0E'}</text>
                <text className="bb-z bb-z-3" x={35.4} y={4} fontSize={6.3}>{'♫\uFE0E'}</text>
              </g>
            ) : (
              <g strokeLinejoin="round">
                <path className="bb-z bb-z-1" d="M32 5 L36 5 L32 9 L36 9" strokeWidth={1.5} />
                <path className="bb-z bb-z-2" d="M34 3 L37 3 L34 6 L37 6" strokeWidth={1.3} />
                <path className="bb-z bb-z-3" d="M36 1 L38.5 1 L36 3.5 L38.5 3.5" strokeWidth={1.1} />
              </g>
            )}
          </svg>
        )}
      </svg>
    </MotionConfig>
  )
}
