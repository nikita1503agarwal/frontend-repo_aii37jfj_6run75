import { motion } from 'framer-motion'

export default function HeartOrbit({ emoji = '💖', color = '#FF6B6B', delay = 0 }) {
  const size = 160
  return (
    <div className="relative w-full h-64 sm:h-72 md:h-80">
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ border: `2px dashed ${color}55` }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
      />
      {[0, 120, 240].map((angle, i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-1/2"
          initial={{ rotate: angle }}
          animate={{ rotate: angle + 360 }}
          transition={{ repeat: Infinity, duration: 12 + i * 3, ease: 'linear', delay }}
          style={{ originX: 0, originY: 0 }}
        >
          <div
            className="-translate-x-1/2 -translate-y-1/2 text-3xl select-none"
            style={{ transform: `translate(${size}px, 0)` }}
          >
            {emoji}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
