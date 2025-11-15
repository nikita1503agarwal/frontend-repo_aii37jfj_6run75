import { useEffect, useMemo, useState } from 'react'
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

export default function AnimatedMessage({ frames = [], theme = 'default', caption = '' }) {
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
      <div className="relative backdrop-blur-xl bg-white/50 border border-white/40 rounded-3xl p-6 md:p-8 shadow-xl">
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
