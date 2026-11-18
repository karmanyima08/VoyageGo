import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Star, MapPin, ArrowRight, Clock, Sparkles, Compass,
  Mountain, Waves, Landmark, Trees, Utensils
} from 'lucide-react'
import { TemplateNavigation, TemplateHero } from '@/components/ui/saa-s-template'
import Footer from '@/components/layout/Footer'
import { destinationsApi, type Destination } from '@/services/api'

interface VibeOption {
  id: string
  label: string
  icon: React.ReactNode
  keywords: string[]
}

const VIBES: VibeOption[] = [
  {
    id: 'all',
    label: 'All Destinations',
    icon: <Compass className="w-4 h-4" />,
    keywords: [],
  },
  {
    id: 'beach',
    label: 'Coastal & Beaches',
    icon: <Waves className="w-4 h-4" />,
    keywords: ['Beach', 'Coastal', 'Lagoon', 'Islands', 'Relaxation', 'Water'],
  },
  {
    id: 'mountains',
    label: 'Mountains & Treks',
    icon: <Mountain className="w-4 h-4" />,
    keywords: ['Mountain', 'Adventure', 'Nature', 'Himalayan', 'Valley', 'Passes'],
  },
  {
    id: 'heritage',
    label: 'Heritage & Forts',
    icon: <Landmark className="w-4 h-4" />,
    keywords: ['History', 'Heritage', 'Fort', 'Palace', 'Monuments', 'Temple'],
  },
  {
    id: 'nature',
    label: 'Nature & Scenic',
    icon: <Trees className="w-4 h-4" />,
    keywords: ['Nature', 'Wildlife', 'Scenic', 'Waterfalls', 'Lake', 'Flora'],
  },
  {
    id: 'culture',
    label: 'Food & Culture',
    icon: <Utensils className="w-4 h-4" />,
    keywords: ['Food', 'Culture', 'Shopping', 'Spiritual', 'Arts', 'Ghats'],
  },
]

export default function HomePage() {
  const [allDestinations, setAllDestinations] = useState<Destination[]>([])
  const [selectedVibe, setSelectedVibe] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    destinationsApi.getAll({ sort_by: 'avg_rating' })
      .then(res => setAllDestinations(res.data.destinations || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Filter destinations based on selected vibe keywords
  const filteredDestinations = useMemo(() => {
    if (selectedVibe === 'all') {
      return allDestinations.slice(0, 9)
    }
    const vibe = VIBES.find(v => v.id === selectedVibe)
    if (!vibe) return allDestinations.slice(0, 9)

    const matches = allDestinations.filter(dest => {
      const cats = dest.categories || []
      const text = `${dest.destination} ${dest.region || ''} ${dest.description || ''}`.toLowerCase()
      return (
        vibe.keywords.some(k => cats.includes(k)) ||
        vibe.keywords.some(k => text.includes(k.toLowerCase()))
      )
    })

    return matches.length > 0 ? matches.slice(0, 9) : allDestinations.slice(0, 6)
  }, [allDestinations, selectedVibe])

  return (
    <div className="min-h-screen bg-[#F7F7F7] text-[#222222]">
      {/* Navigation & Hero */}
      <TemplateNavigation />
      <TemplateHero />

      {/* Featured Destinations Showcase with Vibe Filter Strip (Suggestion A) */}
      <section className="py-20 px-6 bg-white border-t border-[#DDDDDD] w-full">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#008489] font-bold block mb-1">
                Handpicked Places
              </span>
              <h2 className="text-3xl font-bold text-[#222222] tracking-tight">
                Explore Destinations by Travel Style
              </h2>
              <p className="text-[#717171] text-sm mt-1">
                Filter by your preferred travel mood to find curated spots, stay tariffs, and activity estimates
              </p>
            </div>
            <Link
              to="/destinations"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#008489] hover:underline transition-colors shrink-0"
            >
              <span>Browse all {allDestinations.length || '20+'} destinations</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* VIBE FILTER STRIP (Lucide SVG Icons, No Simple Emojis) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
            {VIBES.map(vibe => {
              const active = selectedVibe === vibe.id
              return (
                <button
                  key={vibe.id}
                  onClick={() => setSelectedVibe(vibe.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                    active
                      ? 'bg-[#222222] text-white border-[#222222] shadow-xs'
                      : 'bg-[#F7F7F7] text-[#717171] border-[#DDDDDD] hover:bg-stone-200/60 hover:text-[#222222]'
                  }`}
                >
                  <span className={active ? 'text-white' : 'text-[#008489]'}>
                    {vibe.icon}
                  </span>
                  <span>{vibe.label}</span>
                </button>
              )
            })}
          </div>

          {/* Destinations Grid with Smooth Animation */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-84 rounded-2xl bg-[#F7F7F7] border border-[#DDDDDD] animate-pulse" />
              ))}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedVibe}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredDestinations.map(dest => (
                  <Link
                    key={dest.destination}
                    to={`/destinations/${encodeURIComponent(dest.destination)}`}
                    className="group bg-white rounded-2xl overflow-hidden border border-[#DDDDDD] hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div>
                      <div className="h-56 overflow-hidden relative">
                        <img
                          src={dest.image}
                          alt={dest.destination}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80'
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/95 px-2.5 py-1 rounded-full text-xs font-semibold text-[#222222] shadow-sm">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{dest.avg_rating}</span>
                        </div>
                        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
                          {(dest.categories || []).slice(0, 2).map(c => (
                            <span
                              key={c}
                              className="bg-black/60 backdrop-blur-xs text-white text-xs rounded-full px-2.5 py-0.5"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="p-5">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-[#222222] group-hover:text-[#008489] transition-colors">
                            {dest.destination}
                          </h3>
                          <span className="text-xs text-[#717171] flex items-center gap-1 font-normal">
                            <MapPin className="w-3.5 h-3.5 text-[#717171]" />
                            <span>{dest.region || dest.country}</span>
                          </span>
                        </div>
                        <p className="text-xs text-[#717171] line-clamp-2 leading-relaxed">
                          {dest.description}
                        </p>
                      </div>
                    </div>

                    <div className="px-5 pb-5 pt-0">
                      <div className="flex items-center justify-between pt-3 border-t border-[#DDDDDD] text-xs">
                        <span className="text-[#717171]">
                          <strong className="text-[#222222] font-semibold text-sm">₹{dest.avg_cost_per_day?.toLocaleString('en-IN')}</strong> / day
                        </span>
                        <span className="text-[#717171] flex items-center gap-1 font-normal">
                          <Clock className="w-3.5 h-3.5 text-[#717171]" />
                          <span>{dest.best_duration_days} days ideal</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-20 px-6 bg-[#222222] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-stone-300 text-xs font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>VoyageGo Intelligent Itinerary Engine</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Ready to Plan Your Next Journey?
          </h2>
          <p className="text-stone-300 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Select your destination, dates, budget, group size, and vehicle preferences. Generate an optimized day-by-day itinerary with stay fees and activity costs in seconds.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/planner">
              <button className="bg-white text-[#222222] rounded-xl font-medium px-8 py-3.5 hover:bg-stone-100 transition-colors cursor-pointer text-sm">
                Start Planning a Trip
              </button>
            </Link>
            <Link to="/about">
              <button className="border border-white/40 text-white rounded-xl font-medium px-8 py-3.5 hover:bg-white/10 transition-colors cursor-pointer text-sm">
                About VoyageGo
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
