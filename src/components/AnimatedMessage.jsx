import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const motionVariants = {
  float: {
    initial: { y: 10, opacity: 0 },
    animate: { y: [10, -6, 10], opacity: 1 },
    transition: { repeat: Infinity, duration: 3, ease: 'easeInOut' }
  },
  bounce: {
    initial: { y: -10, opacity: 0 },
    animate: { y: [0, -14, 0], opacity: 1 },
    transition: { repeat: Infinity, duration: 1.4, ease: 'easeInOut' }
  },
  pulse: {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: [0.95, 1.05, 0.95], opacity: 1 },
    transition: { repeat: Infinity, duration: 2.2, ease: 'easeInOut' }
  },
  spin: {
    initial: { rotate: 0, opacity: 0 },
    animate: { rotate: 360, opacity: 1 },
    transition: { repeat: Infinity, duration: 6, ease: 'linear' }
  },
  slide: {
    initial: { x: -10, opacity: 0 },
    animate: { x: [0, 6, 0], opacity: 1 },
    transition: { repeat: Infinity, duration: 2.4, ease: 'easeInOut' }
  }
}

function OverlayLayer({ overlays = [] }) {
  // Render decorative overlays (confetti, petals, characters)
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {overlays.map((layer, i) => (
        <div key={i} className="absolute inset-0">
          {layer.items.map((it, idx) => (
            <motion.span
              key={idx}
              className="absolute select-none"
              style={{
                left: `${it.x * 100}%`,
                top: `${it.y * 100}%`,
                fontSize: `${it.size}px`,
                filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.15))'
              }}
              initial={{ opacity: 0, y: 6, scale: 0.98 }}
              animate={{
                opacity: [0.4, 1, 0.7, 1],
                y: [0, -8, 0, -6],
                rotate: layer.type === 'confetti' ? [0, 45, -45, 0] : 0,
                scale: [1, 1.06, 1],
              }}
              transition={{ delay: it.delay, duration: it.duration, repeat: Infinity, ease: 'easeInOut' }}
            >
              {it.emoji}
            </motion.span>
          ))}
        </div>
      ))}
    </div>
  )
}

export default function AnimatedMessage({ frames = [], theme = 'default', caption = '', overlays = [] }) {
  const [index, setIndex] = useState(0)
  const frame = frames[index] || {}

  useEffect(() => {
    if (!frames.length) return
    const id = setInterval(() => setIndex((i) => (i + 1) % frames.length), Math.max(1800, (frame.duration || 2.4) * 1000))
    return () => clearInterval(id)
  }, [frames, frame.duration])

  const accent = useMemo(() => {
    switch (theme) {
      case 'romance':
        return 'from-rose-300/40 via-rose-200/30 to-fuchsia-200/40'
      case 'gratitude':
        return 'from-amber-200/40 via-orange-100/30 to-yellow-200/40'
      case 'missyou':
        return 'from-indigo-200/40 via-sky-200/30 to-violet-200/40'
      case 'apology':
        return 'from-orange-200/40 via-amber-100/30 to-slate-200/40'
      case 'celebration':
        return 'from-pink-200/40 via-yellow-200/30 to-green-200/40'
      default:
        return 'from-pink-200/40 via-blue-200/30 to-emerald-200/40'
    }
  }, [theme])

  return (
    <div className={`relative w-full`}>
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent} blur-2xl rounded-3xl opacity-60`}/>

      {/* Overlays layer */}
      <OverlayLayer overlays={overlays} />

      <div className="relative backdrop-blur-xl bg-white/50 border border-white/40 rounded-3xl p-6 md:p-8 shadow-xl overflow-hidden">
        <div className="flex items-center gap-3 text-2xl md:text-3xl">
          <AnimatePresence mode="wait">
            <motion.div key={index}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="shrink-0"
            >
              <motion.span {...motionVariants[frame.motion || 'float']}>{frame.emoji || '✨'}</motion.span>
            </motion.div>
          </AnimatePresence>
          <div className="flex-1 min-h-[2.5rem]">
            <AnimatePresence mode="wait">
              <motion.p
                key={frame.text || 'empty'}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35 }}
                className="text-slate-800/90 leading-relaxed"
              >
                {frame.text || '...'}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
        {caption ? (
          <div className="mt-4 text-sm text-slate-600/80">{caption}</div>
        ) : null}
      </div>
    </div>
  )
}
