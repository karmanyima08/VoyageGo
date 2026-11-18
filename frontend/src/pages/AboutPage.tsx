import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Compass, MapPin, Calendar, Heart, ShieldCheck,
  CheckCircle2, Sun, Car, Hotel, Clock, ArrowRight,
  Users, Globe, Sparkles, HelpCircle, ChevronDown
} from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const STATS = [
  { value: '20+', label: 'Iconic Destinations', sub: 'Across scenic India' },
  { value: '250+', label: 'Curated Attractions', sub: 'Handpicked spots & activities' },
  { value: '3', label: 'Custom Travel Paces', sub: 'Relaxed, Balanced, Action-Packed' },
  { value: '100%', label: 'Transparent Estimates', sub: 'Zero hidden surprises' },
]

const KEY_FEATURES = [
  {
    icon: <Sparkles className="w-5 h-5 text-teal-700" />,
    iconBg: 'bg-teal-50',
    title: 'Personalized Recommendations',
    description: 'Every trip is customized around what you genuinely love—peaceful nature retreats, cultural heritage, authentic food scenes, or outdoor thrills.',
  },
  {
    icon: <ShieldCheck className="w-5 h-5 text-emerald-700" />,
    iconBg: 'bg-emerald-50',
    title: 'Transparent Budgeting',
    description: 'Gain full financial clarity upfront. We break down stay costs, transport tariffs, and activity entry fees so you know exactly where your money goes.',
  },
  {
    icon: <Clock className="w-5 h-5 text-amber-700" />,
    iconBg: 'bg-amber-50',
    title: 'Travel at Your Own Pace',
    description: 'Choose between Relaxed (5h), Balanced (7h), or Action-Packed (9h) schedules so your days match your energy levels and travel companions.',
  },
  {
    icon: <Hotel className="w-5 h-5 text-purple-700" />,
    iconBg: 'bg-purple-50',
    title: 'Curated Stays & Hostels',
    description: 'Discover verified accommodations—from social backpacker hostels to cozy boutique hotels and scenic luxury resorts—with realistic room allocations.',
  },
  {
    icon: <Car className="w-5 h-5 text-blue-700" />,
    iconBg: 'bg-blue-50',
    title: 'Smart Vehicle Options',
    description: 'Bring your personal car to save on rental fees (paying only fuel and tolls), or pick from self-drive hatchbacks, sedans, and family SUVs.',
  },
  {
    icon: <Sun className="w-5 h-5 text-rose-700" />,
    iconBg: 'bg-rose-50',
    title: 'Seasonal Weather Guidance',
    description: 'Stay prepared with historical weather trends, expected temperature ranges, and smart packing suggestions for your selected travel dates.',
  },
]

const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    title: 'Select Destination & Dates',
    desc: 'Pick your dream travel destination and enter your trip dates. VoyageGo immediately gathers local weather profiles and seasonal highlights.',
  },
  {
    step: '02',
    title: 'Share Your Style & Group Size',
    desc: 'Tell us if you are traveling solo, as a couple, or with family or friends. Rate your interests in nature, food, culture, history, and adventure.',
  },
  {
    step: '03',
    title: 'Set Your Budget & Rhythm',
    desc: 'Choose your budget ceiling and preferred travel pace—whether you want relaxed mornings with plenty of free time or a packed day of discovery.',
  },
  {
    step: '04',
    title: 'Get Your Day-by-Day Plan',
    desc: 'Receive an organized daily itinerary with morning, afternoon, and evening activities, verified stays, vehicle estimates, and easy trip saving.',
  },
]

const CORE_VALUES = [
  {
    title: 'Traveler-First Design',
    desc: 'Every feature is built to remove friction and anxiety from trip planning, ensuring you spend less time stressing and more time enjoying.',
  },
  {
    title: 'Complete Honesty & Clarity',
    desc: 'We show realistic costs with clear itemization—no unexpected hidden charges, misleading rates, or sponsored fluff.',
  },
  {
    title: 'Authentic Local Experiences',
    desc: 'We highlight authentic cultural landmarks, serene nature viewpoints, and local dining alongside popular tourist sights.',
  },
  {
    title: 'Simplicity & Flexibility',
    desc: 'Intuitive planning tools that give you full control to adjust accommodation tiers, vehicle types, and daily schedules on your terms.',
  },
]

const FAQS = [
  {
    q: 'Is VoyageGo completely free to use?',
    a: 'Yes! Exploring destinations, creating customized day-by-day itineraries, and saving your plans to your account is completely free of charge.',
  },
  {
    q: 'How are the trip budget estimates calculated?',
    a: 'Our budget estimates combine real hotel and hostel tariffs per room, vehicle rental or fuel/toll costs based on group size, and actual admission tickets for activities and attractions.',
  },
  {
    q: 'Can I use my own car or bike for the trip?',
    a: 'Yes, absolutely! When planning your trip, select "Personal Vehicle". The planner will remove vehicle rental charges and calculate only estimated fuel and toll expenses.',
  },
  {
    q: 'What does the "Travel Pace" option mean?',
    a: 'Travel Pace controls how many hours of activities are scheduled each day. "Relaxed" schedules about 5 hours daily with plenty of downtime, "Balanced" plans around 7 hours, and "Action-Packed" schedules up to 9 hours for travelers who want to see as much as possible.',
  },
  {
    q: 'Can I save and revisit my planned trips?',
    a: 'Yes. Once you generate a trip plan, you can save it to your "My Trips" dashboard and return to view your itinerary, hotel information, and cost breakdown anytime.',
  },
]

export default function AboutPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex flex-col justify-between">
      <div>
        <Navbar />

        {/* HERO SECTION */}
        <section className="pt-32 pb-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#008489] bg-[#008489]/10 border border-[#008489]/20 px-3.5 py-1 rounded-full inline-block mb-4">
              About VoyageGo
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold text-[#222222] tracking-tight mb-4">
              Travel Planning Made Simple, Thoughtful & Transparent
            </h1>
            <p className="text-[#717171] text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-8">
              We believe that planning your next getaway should be as inspiring as the trip itself. VoyageGo brings together curated destinations, personalized day-by-day schedules, and honest cost breakdowns—all in one place.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/planner">
                <button className="px-6 py-3 rounded-xl bg-[#222222] hover:bg-[#333333] text-white font-medium text-sm shadow-sm transition-all cursor-pointer flex items-center gap-2">
                  <span>Start Planning a Trip</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <Link to="/destinations">
                <button className="px-6 py-3 rounded-xl bg-white border border-[#DDDDDD] hover:bg-stone-50 text-[#222222] font-medium text-sm shadow-sm transition-all cursor-pointer">
                  Explore Destinations
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* STATS STRIP */}
        <section className="max-w-6xl mx-auto px-6 pb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((s) => (
              <div key={s.label} className="bg-white rounded-2xl border border-[#DDDDDD] p-6 shadow-sm text-center">
                <div className="text-3xl sm:text-4xl font-bold text-[#222222] mb-1">{s.value}</div>
                <div className="text-sm font-semibold text-[#222222] mb-0.5">{s.label}</div>
                <div className="text-xs text-[#717171]">{s.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* OUR STORY & MISSION */}
        <section className="max-w-6xl mx-auto px-6 pb-16">
          <div className="bg-white rounded-2xl border border-[#DDDDDD] p-8 sm:p-12 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#008489] block">
                  Our Mission & Story
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#222222] tracking-tight">
                  Crafted for Travelers Who Value Time, Peace of Mind & Authentic Discovery
                </h2>
                <p className="text-sm text-[#717171] leading-relaxed">
                  Anyone who has planned a vacation knows the hassle: dozens of open browser tabs, confusing itineraries, guesswork about how long to spend at each spot, and surprise expenses that bust the budget before the trip even begins.
                </p>
                <p className="text-sm text-[#717171] leading-relaxed">
                  We built VoyageGo to make travel effortless. Whether you are traveling solo on a budget, planning a romantic weekend retreat, or organizing a road trip with friends, VoyageGo generates a clear, actionable itinerary that balances your travel rhythm, accommodation preferences, and budget limits.
                </p>
                <div className="pt-2 flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 text-xs font-medium text-[#222222] bg-[#F7F7F7] border border-[#DDDDDD] px-3.5 py-1.5 rounded-full">
                    <CheckCircle2 className="w-4 h-4 text-[#008489]" />
                    <span>Zero guesswork</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-[#222222] bg-[#F7F7F7] border border-[#DDDDDD] px-3.5 py-1.5 rounded-full">
                    <CheckCircle2 className="w-4 h-4 text-[#008489]" />
                    <span>Realistic budgets</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-[#222222] bg-[#F7F7F7] border border-[#DDDDDD] px-3.5 py-1.5 rounded-full">
                    <CheckCircle2 className="w-4 h-4 text-[#008489]" />
                    <span>Balanced daily pacing</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 bg-[#F7F7F7] rounded-xl border border-[#DDDDDD] p-6 space-y-4">
                <h3 className="text-base font-bold text-[#222222]">Why Travelers Love VoyageGo</h3>
                <ul className="space-y-3.5 text-xs text-[#717171]">
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">✓</span>
                    <span><strong>Tailored to your passions:</strong> Sights and activities selected around your personal preferences in nature, food, culture, and adventure.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">✓</span>
                    <span><strong>Honest cost itemization:</strong> Transparent estimates for hotel rooms, vehicle fuel or rental, and entry fees with zero hidden markups.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">✓</span>
                    <span><strong>Paced for humans:</strong> Daily schedules divided neatly into Morning, Afternoon, and Evening so you never feel rushed.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">✓</span>
                    <span><strong>Weather-aware planning:</strong> Travel advice and packing notes matched to the exact season and climate of your trip.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* WHAT WE OFFER / KEY FEATURES */}
        <section className="max-w-6xl mx-auto px-6 pb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#008489] block mb-1">
              What We Offer
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#222222] tracking-tight">
              Thoughtfully Designed for Every Kind of Journey
            </h2>
            <p className="text-xs sm:text-sm text-[#717171] mt-2 leading-relaxed">
              From weekend getaways to week-long road trips, VoyageGo gives you everything you need to plan and enjoy your travel.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {KEY_FEATURES.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-2xl border border-[#DDDDDD] p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className={`w-10 h-10 rounded-xl ${feature.iconBg} flex items-center justify-center mb-4`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-base font-bold text-[#222222] mb-2">{feature.title}</h3>
                  <p className="text-xs sm:text-sm text-[#717171] leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS (USER JOURNEY) */}
        <section className="max-w-6xl mx-auto px-6 pb-16">
          <div className="bg-white rounded-2xl border border-[#DDDDDD] p-8 sm:p-10 shadow-sm">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#008489] block mb-1">
                Simple & Seamless
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#222222] tracking-tight">
                How It Works in 4 Easy Steps
              </h2>
              <p className="text-xs sm:text-sm text-[#717171] mt-1">
                Go from an idea to a fully planned itinerary in less than two minutes.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {HOW_IT_WORKS_STEPS.map((s) => (
                <div key={s.step} className="p-5 rounded-xl bg-[#F7F7F7] border border-[#DDDDDD] flex flex-col justify-between">
                  <div>
                    <span className="w-8 h-8 rounded-lg bg-[#222222] text-white flex items-center justify-center text-xs font-mono font-bold mb-3">
                      {s.step}
                    </span>
                    <h3 className="text-sm font-bold text-[#222222] mb-1.5">{s.title}</h3>
                    <p className="text-xs text-[#717171] leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link to="/planner">
                <button className="px-6 py-2.5 rounded-xl bg-[#222222] hover:bg-[#333333] text-white font-medium text-xs shadow-sm transition-all cursor-pointer">
                  Try the Trip Planner Now →
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* OUR CORE VALUES */}
        <section className="max-w-6xl mx-auto px-6 pb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#008489] block mb-1">
              What Guides Us
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#222222] tracking-tight">
              Our Core Values
            </h2>
            <p className="text-xs sm:text-sm text-[#717171] mt-1">
              Principles that shape every feature and recommendation we provide.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CORE_VALUES.map((v) => (
              <div key={v.title} className="bg-white rounded-2xl border border-[#DDDDDD] p-6 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-[#222222] mb-3">
                  <Heart className="w-4 h-4 text-[#008489]" />
                </div>
                <h3 className="text-sm font-bold text-[#222222] mb-2">{v.title}</h3>
                <p className="text-xs text-[#717171] leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQS */}
        <section className="max-w-4xl mx-auto px-6 pb-20">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#008489] block mb-1">
              Common Questions
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#222222] tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-[#717171] mt-1">
              Everything you need to know about planning trips with VoyageGo.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx
              return (
                <div
                  key={faq.q}
                  className="bg-white rounded-xl border border-[#DDDDDD] overflow-hidden transition-all shadow-2xs"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-stone-50 transition-colors"
                  >
                    <span className="text-sm font-semibold text-[#222222]">{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#717171] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#717171] leading-relaxed border-t border-[#F0F0F0]">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* FINAL CALL TO ACTION */}
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <div className="bg-[#222222] text-white rounded-3xl p-8 sm:p-12 text-center shadow-md relative overflow-hidden">
            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-400 block">
                Start Exploring Today
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
                Ready to Experience Stress-Free Travel Planning?
              </h2>
              <p className="text-stone-300 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
                Discover incredible destinations, pick your favorite travel pace, and generate a customized day-by-day plan in moments.
              </p>
              <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                <Link to="/planner">
                  <button className="px-6 py-3 rounded-xl bg-white hover:bg-stone-100 text-[#222222] font-semibold text-xs shadow-sm transition-all cursor-pointer">
                    Plan Your First Trip Now
                  </button>
                </Link>
                <Link to="/destinations">
                  <button className="px-6 py-3 rounded-xl bg-transparent border border-white/30 hover:bg-white/10 text-white font-medium text-xs transition-all cursor-pointer">
                    Browse All Destinations
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  )
}
