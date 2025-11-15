import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Spline from '@splinetool/react-spline'
import { Heart, Sparkles, ArrowRight } from 'lucide-react'
import AnimatedMessage from './components/AnimatedMessage'
import HeartOrbit from './components/HeartOrbit'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function App() {
  const [input, setInput] = useState('You are my favorite person. Thank you for being you. I miss you when we are apart, but you are always in my heart. 💖')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({ frames: [], theme: 'default', caption: '', tags: [], overlays: [] })
  const [error, setError] = useState('')

  useEffect(() => {
    // Prefetch with default message
    handleAnimate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleAnimate(e) {
    e?.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${BACKEND}/api/animate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      })
      if (!res.ok) throw new Error('Failed to generate animation')
      const json = await res.json()
      setData(json)
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-50 to-white text-slate-800">
      {/* Hero with Spline cover */}
      <section className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
        <Spline scene="https://prod.spline.design/ESO6PnMadasO0hU3/scene.splinecode" style={{ width: '100%', height: '100%' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/0 to-white/80 pointer-events-none" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 backdrop-blur border border-white/50 text-pink-600">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Love letter animations</span>
            </div>
            <h1 className="mt-4 text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900">
              Turn long messages into cute animations
            </h1>
            <p className="mt-4 text-lg md:text-xl text-slate-600">
              Designed for couples to express emotions in a playful, heartfelt way.
            </p>
          </div>
        </div>
      </section>

      {/* Creator section */}
      <section className="-mt-24 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            <div className="space-y-6">
              <form onSubmit={handleAnimate} className="backdrop-blur-xl bg-white/60 border border-white/50 rounded-3xl p-6 shadow-xl">
                <label className="block text-sm font-medium text-slate-600 mb-2">Your message</label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Pour your heart out..."
                  className="w-full h-40 md:h-48 p-4 rounded-2xl bg-white/70 border border-white/60 focus:outline-none focus:ring-2 focus:ring-pink-300 placeholder-slate-400"
                />
                <div className="mt-4 flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-pink-600 text-white font-semibold shadow-lg shadow-pink-600/20 hover:bg-pink-500 transition disabled:opacity-60"
                  >
                    <Heart className="w-5 h-5" />
                    {loading ? 'Animating...' : 'Animate my feelings'}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  {error ? <span className="text-sm text-rose-600">{error}</span> : null}
                </div>
              </form>

              <div className="backdrop-blur-xl bg-white/60 border border-white/50 rounded-3xl p-6 shadow-xl">
                <div className="text-sm text-slate-600 mb-3">Suggested moods</div>
                <div className="flex flex-wrap gap-2">
                  {["romance", "gratitude", "miss you", "apology", "celebration"].map((m) => (
                    <button
                      key={m}
                      onClick={() => setInput(`${m === 'romance' ? 'I love you' : m === 'gratitude' ? 'Thank you' : m === 'miss you' ? 'I miss you' : m === 'apology' ? 'I am sorry' : 'Let\'s celebrate!'} — you mean the world to me.`)}
                      className="px-4 py-2 rounded-full bg-white/70 border border-white/60 hover:bg-white text-slate-700 text-sm"
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <AnimatedMessage frames={data.frames} theme={data.theme} caption={data.caption} overlays={data.overlays} />
              <div className="backdrop-blur-xl bg-white/60 border border-white/50 rounded-3xl p-6 shadow-xl">
                <div className="text-sm text-slate-600 mb-2">Vibes detected</div>
                <div className="flex flex-wrap gap-2">
                  {(data.tags || []).length ? data.tags.map((t) => (
                    <span key={t} className="px-3 py-1 rounded-full bg-pink-50 text-pink-700 border border-pink-200 text-xs">{t}</span>
                  )) : <span className="text-slate-500 text-sm">We will sense the mood from your message.</span>}
                </div>
                <div className="mt-4">
                  <HeartOrbit emoji={data.theme === 'celebration' ? '🎉' : data.theme === 'apology' ? '💛' : '💖'} color={data.theme === 'apology' ? '#F59E0B' : '#EC4899'} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-16 py-10 text-center text-slate-500">
        Built with care to help you say it beautifully.
      </footer>
    </div>
  )
}
