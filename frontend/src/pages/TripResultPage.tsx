import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  MapPin, Calendar, Users, Wallet, Clock, Brain, TrendingUp,
  ShieldCheck, ArrowLeft, Heart, Trash2, Printer, BarChart3, CheckCircle2,
  Sparkles, Hotel, Car, Compass, Activity, ExternalLink, Check, CloudSun, AlertTriangle,
  Sun, SunMedium, Sunset, Lightbulb, Ticket, Utensils, Star, Plus, Minus, Calculator
} from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { toast } from 'sonner'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { tripsApi, favouritesApi, type TripResult, type Place } from '@/services/api'
import { useAuth } from '@/context/AuthContext'
import { setActivePlan } from '@/lib/activePlan'

const PIE_COLORS = ['#222222', '#008489', '#717171', '#94a3b8', '#a8a29e']

const TIME_OF_DAY_SLOTS = [
  { label: 'Morning Expedition', time: '09:00 AM – 12:30 PM', icon: <SunMedium className="w-4 h-4 text-amber-500 inline mr-1" /> },
  { label: 'Afternoon Discovery & Lunch', time: '01:00 PM – 04:30 PM', icon: <Sun className="w-4 h-4 text-amber-600 inline mr-1" /> },
  { label: 'Evening Stroll & Leisure', time: '05:00 PM – 08:30 PM', icon: <Sunset className="w-4 h-4 text-rose-500 inline mr-1" /> },
]

export default function TripResultPage() {
  const { id } = useParams<{ id: string }>()
  const { user, openAuthModal } = useAuth()
  const [tripData, setTripData] = useState<TripResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSavedFav, setIsSavedFav] = useState(false)
  const [isClaimed, setIsClaimed] = useState(false)
  const [activeTab, setActiveTab] = useState<'itinerary' | 'stays_transport' | 'budget'>('itinerary')
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>('all')
  const [splitGroupCount, setSplitGroupCount] = useState<number>(2)

  // If user signs in or logs in while viewing this trip, automatically save it permanently
  useEffect(() => {
    if (user && id && !isClaimed) {
      tripsApi.saveToAccount(Number(id), user.id, user.email)
        .then(() => setIsClaimed(true))
        .catch(() => {})
    }
  }, [user, id])

  const fetchTrip = () => {
    if (!id) return
    setLoading(true)
    tripsApi.getById(Number(id))
      .then(res => {
        const raw = res.data as any
        let mlResults = raw.ml_results
        if (typeof mlResults === 'string') {
          try {
            mlResults = JSON.parse(mlResults)
          } catch {
            mlResults = {}
          }
        }
        let data = (mlResults && typeof mlResults === 'object' ? { ...mlResults, ...raw, trip_id: raw.id } : raw) as TripResult

        let itinerary = data.itinerary || raw.itinerary || {}
        if (typeof itinerary === 'string') {
          try {
            itinerary = JSON.parse(itinerary)
          } catch {
            itinerary = {}
          }
        }
        data.itinerary = itinerary

        let budgetBreakdown = data.budget_breakdown || raw.budget_breakdown
        if (typeof budgetBreakdown === 'string') {
          try {
            budgetBreakdown = JSON.parse(budgetBreakdown)
          } catch {
            budgetBreakdown = { accommodation: 0, transport: 0, food: 0, activities: 0, misc: 0, total: 0 }
          }
        }
        data.budget_breakdown = budgetBreakdown || { accommodation: 0, transport: 0, food: 0, activities: 0, misc: 0, total: 0 }

        if (!data.destination_info) {
          data.destination_info = {
            image: raw.image || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1400&q=80',
            description: '',
            avg_cost_per_day: 0,
          }
        }

        data.destination = data.destination || raw.destination || 'Destination'
        data.days = data.days || raw.days || Object.keys(data.itinerary || {}).length || 3
        data.budget = data.budget || raw.budget || 25000
        data.group_size = data.group_size || raw.group_size || 2
        data.start_date = data.start_date || raw.start_date
        data.end_date = data.end_date || raw.end_date
        data.date_range_label = data.date_range_label || raw.date_range_label || (data.start_date && data.end_date ? `${data.start_date} – ${data.end_date}` : data.start_date)

        setTripData(data)
        if (data.group_size) {
          setSplitGroupCount(data.group_size)
        }
        // Persist active plan state across browser navigation
        setActivePlan({
          id: Number(raw.id || id),
          destination: data.destination,
          days: data.days,
          budget: data.budget,
          group_size: data.group_size,
          start_date: data.start_date,
          end_date: data.end_date,
          date_range_label: data.date_range_label,
          image: data.destination_info?.image || raw.image,
          total_cost: data.total_estimated_cost || raw.total_cost,
          is_guest: !user,
          user_id: user?.id,
          created_at: raw.created_at || new Date().toISOString(),
        })
      })
      .catch((err) => {
        console.error('Failed to load trip results:', err)
        toast.error('Failed to load trip results')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchTrip()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] flex flex-col justify-between">
        <Navbar />
        <div className="pt-32 max-w-7xl mx-auto px-6 py-12 w-full animate-pulse">
          <div className="h-64 rounded-2xl bg-stone-100 border border-[#DDDDDD] mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-28 rounded-xl bg-stone-100 border border-[#DDDDDD]" />)}
          </div>
          <div className="h-96 rounded-2xl bg-stone-100 border border-[#DDDDDD]" />
        </div>
        <Footer />
      </div>
    )
  }

  if (!tripData) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] flex flex-col justify-between">
        <Navbar />
        <div className="pt-36 text-center py-20 px-6 max-w-md mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-white text-[#222222] flex items-center justify-center mx-auto mb-4 border border-[#DDDDDD] shadow-sm">
            <Compass className="w-7 h-7 text-[#008489]" />
          </div>
          <h2 className="text-xl font-bold text-[#222222]">Trip Not Found</h2>
          <p className="text-[#717171] mt-2 mb-6 text-sm">
            Could not locate the requested trip plan. It might have been deleted or the ID is invalid.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              to="/my-trips"
              className="px-5 py-2.5 rounded-xl border border-[#DDDDDD] bg-white text-[#222222] text-sm font-semibold hover:bg-stone-50 transition-colors inline-block"
            >
              My Saved Trips
            </Link>
            <Link
              to="/planner"
              className="px-5 py-2.5 rounded-xl bg-[#222222] text-white text-sm font-medium hover:bg-[#333] transition-colors inline-block"
            >
              Generate a New Trip
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Prepare budget chart data
  const budgetBreakdownData = [
    { name: 'Accommodation', value: tripData.budget_breakdown?.accommodation || 0 },
    { name: 'Transport', value: tripData.budget_breakdown?.transport || 0 },
    { name: 'Food & Dining', value: tripData.budget_breakdown?.food || 0 },
    { name: 'Activities & Entries', value: tripData.budget_breakdown?.activities || 0 },
    { name: 'Miscellaneous', value: tripData.budget_breakdown?.misc || 0 },
  ].filter(item => item.value > 0)

  // Remove place from a day itinerary
  const handleRemoveFromDay = async (dayKey: string, placeIdx: number) => {
    if (!tripData.itinerary) return
    const updatedItinerary = { ...tripData.itinerary }
    if (updatedItinerary[dayKey]) {
      const places = [...updatedItinerary[dayKey].places]
      const removed = places.splice(placeIdx, 1)[0]
      updatedItinerary[dayKey].places = places
      updatedItinerary[dayKey].total_cost = places.reduce((sum, p) => sum + (p.average_cost || 0), 0)
      updatedItinerary[dayKey].total_time = places.reduce((sum, p) => sum + (p.time_needed || 0), 0)

      // Recalculate global costs
      const newActivitiesCost = Object.values(updatedItinerary).reduce((sum, d) => sum + d.total_cost, 0)
      const currentMisc = tripData.budget_breakdown?.misc || 0
      const currentAcc = tripData.budget_breakdown?.accommodation || 0
      const currentTrans = tripData.budget_breakdown?.transport || 0
      const currentFood = tripData.budget_breakdown?.food || 0

      const newTotalCost = currentAcc + currentTrans + currentFood + newActivitiesCost + currentMisc
      const newRemaining = Math.max(0, (tripData.budget || 0) - newTotalCost)

      setTripData({
        ...tripData,
        itinerary: updatedItinerary,
        total_estimated_cost: newTotalCost,
        budget_remaining: newRemaining,
        budget_breakdown: {
          ...tripData.budget_breakdown!,
          activities: newActivitiesCost,
        },
      })

      toast.success(`Removed ${removed?.place_name} from Day ${dayKey}. Costs updated!`)

      // Persist update to database
      if (id) {
        tripsApi.update(Number(id), {
          itinerary: updatedItinerary,
          total_cost: newTotalCost,
        }).catch(() => {})
      }
    }
  }

  const handleToggleFavorite = async () => {
    if (!user) {
      toast.info('Create a free account or sign in to permanently save your itinerary!')
      openAuthModal('register')
      return
    }
    try {
      if (isSavedFav) {
        setIsSavedFav(false)
        toast.info('Removed from saved trips')
      } else {
        await favouritesApi.add({
          item_type: 'trip',
          item_id: String(id),
          item_name: `${tripData.destination} (${tripData.days} Days)`,
          item_image: tripData.destination_info?.image,
        })
        setIsSavedFav(true)
        toast.success(`Saved trip #${id} to your personal dashboard!`)
      }
    } catch {
      toast.error('Could not update saved trips')
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const dayKeys = Object.keys(tripData.itinerary || {}).sort((a, b) => Number(a) - Number(b))
  const displayedDayKeys = selectedDayFilter === 'all' ? dayKeys : [selectedDayFilter]

  // Derived staying & travelling metrics
  const stayingCostPerDay = tripData.staying_cost_per_day || 
    (tripData.budget_breakdown?.accommodation ? Math.round(tripData.budget_breakdown.accommodation / Math.max(1, tripData.days)) : 0)
  const travellingCostPerDay = tripData.travelling_cost_per_day || 
    (tripData.budget_breakdown?.transport ? Math.round(tripData.budget_breakdown.transport / Math.max(1, tripData.days)) : 0)

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex flex-col justify-between">
      <div>
        <Navbar />

        {/* HERO HEADER */}
        <div className="pt-28 px-6 pb-8">
          <div className="max-w-7xl mx-auto">
            {/* Guest Ephemeral Mode Notice */}
            {!user && !isClaimed && (
              <div className="mb-6 p-4 rounded-2xl bg-amber-50/90 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs shadow-xs">
                <div className="flex items-center gap-3 text-amber-900">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-amber-700" />
                  </div>
                  <div>
                    <span className="font-bold block text-sm text-[#222222]">Save Your Itinerary</span>
                    <span className="text-[#717171]">
                      You're currently previewing as a guest. Create an account to permanently save this plan and access it from any device.
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => openAuthModal('register')}
                  className="px-4 py-2.5 rounded-xl bg-[#222222] hover:bg-[#333333] text-white text-xs font-semibold whitespace-nowrap cursor-pointer transition shadow-xs flex items-center gap-1.5"
                >
                  <Heart className="w-3.5 h-3.5" />
                  Create Account to Save
                </button>
              </div>
            )}

            {/* Top Navigation Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <Link
                to="/planner"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#DDDDDD] text-xs font-medium text-[#222222] hover:bg-[#F7F7F7] shadow-sm transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Planner
              </Link>

              <div className="flex items-center gap-2.5">
                {!user ? (
                  <button
                    onClick={() => {
                      toast.info('Create an account or sign in to permanently save your itinerary!')
                      openAuthModal('register')
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-teal-700 hover:bg-teal-800 text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Heart className="w-3.5 h-3.5" />
                    <span>Save Itinerary</span>
                  </button>
                ) : (
                  <button
                    onClick={handleToggleFavorite}
                    className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                      isSavedFav
                        ? 'bg-rose-50 text-rose-600 border-rose-200'
                        : 'bg-white text-[#222222] border-[#DDDDDD] hover:bg-[#F7F7F7]'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isSavedFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                    <span>{isSavedFav ? 'Saved to Hub' : 'Save Itinerary'}</span>
                  </button>
                )}

                <button
                  onClick={handlePrint}
                  className="px-4 py-2 rounded-xl bg-white border border-[#DDDDDD] text-xs font-medium text-[#222222] hover:bg-[#F7F7F7] shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Print / Export</span>
                </button>
              </div>
            </div>

            {/* Visual Destination Card Header */}
            <div className="relative rounded-2xl overflow-hidden bg-white border border-[#DDDDDD] shadow-sm">
              <div className="h-64 sm:h-80 w-full relative">
                <img
                  src={tripData.destination_info?.image || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1400&q=80'}
                  alt={tripData.destination}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1400&q=80'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

                <div className="absolute top-5 left-5 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm text-xs font-medium text-[#222222] shadow-sm flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#222222]" /> {tripData.destination}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm text-xs font-medium text-[#222222] shadow-sm flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#222222]" />
                    {tripData.date_range_label || 
                      (tripData.start_date && tripData.end_date 
                        ? `${tripData.start_date} to ${tripData.end_date}` 
                        : tripData.start_date 
                        ? `From ${tripData.start_date}`
                        : `${tripData.days} Days`)} · {tripData.group_size} Travellers
                  </span>
                </div>

                <div className="absolute bottom-5 left-5 right-5 text-white flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1 text-white">
                      {tripData.destination} Travel Itinerary
                    </h1>
                    <p className="text-xs sm:text-sm text-stone-200 max-w-2xl line-clamp-2">
                      {tripData.destination_info?.description || 'Your personalized travel plan with day-wise sightseeing, confirmed hotel stay, and transport schedule.'}
                    </p>
                  </div>

                  {/* Travel Persona / Style Badge */}
                  <div className="p-3.5 rounded-xl bg-white/95 backdrop-blur-sm text-[#222222] shadow-sm text-left md:text-right border border-white/50">
                    <span className="text-xs text-[#717171] font-medium block">
                      Your Travel Vibe
                    </span>
                    <div className="text-sm font-semibold text-[#222222] flex items-center md:justify-end gap-1.5 mt-0.5">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>{tripData.traveller_profile?.label || 'Curated Leisure'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4 KEY REAL-WORLD METRICS CARDS */}
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-white border-t border-[#DDDDDD]">
                {/* 1. Total Trip Cost */}
                <div className="bg-[#F7F7F7] rounded-xl border border-[#DDDDDD] p-4">
                  <span className="text-xs text-[#717171] flex items-center gap-1.5 mb-1 font-medium">
                    <Wallet className="w-4 h-4 text-[#717171]" /> Total Estimated Cost
                  </span>
                  <div className="text-xl font-bold text-[#222222] font-mono">
                    ₹{tripData.total_estimated_cost?.toLocaleString('en-IN')}
                  </div>
                  <span className="text-xs text-[#717171]">
                    Target Budget: ₹{tripData.budget?.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* 2. Staying Cost per Day */}
                <div className="bg-[#F7F7F7] rounded-xl border border-[#DDDDDD] p-4">
                  <span className="text-xs text-[#717171] flex items-center gap-1.5 mb-1 font-medium">
                    <Hotel className="w-4 h-4 text-[#008489]" /> Staying Cost / Day
                  </span>
                  <div className="text-xl font-bold text-[#008489] font-mono">
                    ₹{stayingCostPerDay.toLocaleString('en-IN')}{' '}
                    <span className="text-xs font-normal text-[#717171]">/ night</span>
                  </div>
                  <span className="text-xs text-[#717171] truncate block" title={tripData.stay_details?.name}>
                    {tripData.stay_details?.name ? tripData.stay_details.name.split('(')[0] : 'Curated Stay'}
                  </span>
                </div>

                {/* 3. Travelling Cost per Day */}
                <div className="bg-[#F7F7F7] rounded-xl border border-[#DDDDDD] p-4">
                  <span className="text-xs text-[#717171] flex items-center gap-1.5 mb-1 font-medium">
                    <Car className="w-4 h-4 text-[#222222]" /> Travelling Cost / Day
                  </span>
                  <div className="text-xl font-bold text-[#222222] font-mono">
                    ₹{travellingCostPerDay.toLocaleString('en-IN')}{' '}
                    <span className="text-xs font-normal text-[#717171]">/ day</span>
                  </div>
                  <span className="text-xs text-[#717171] truncate block" title={tripData.transport_details?.vehicle_name}>
                    {tripData.transport_details?.vehicle_type || 'Vehicle'} · {tripData.transport_details?.mode || 'Rental'}
                  </span>
                </div>

                {/* 4. Daily Cost Per Person */}
                <div className="bg-[#F7F7F7] rounded-xl border border-[#DDDDDD] p-4">
                  <span className="text-xs text-[#717171] flex items-center gap-1.5 mb-1 font-medium">
                    <Users className="w-4 h-4 text-[#717171]" /> Cost Per Person
                  </span>
                  <div className="text-xl font-bold text-[#222222] font-mono">
                    ₹{Math.round((tripData.cost_per_person || 0) / Math.max(1, tripData.days || 1)).toLocaleString('en-IN')}{' '}
                    <span className="text-xs font-normal text-[#717171]">/ day</span>
                  </div>
                  <span className="text-xs text-[#717171]">
                    Total ₹{tripData.cost_per_person?.toLocaleString('en-IN')} / traveller
                  </span>
                </div>
              </div>
            </div>

            {/* WEATHER ADVISORY & SEASONAL ALERTS CARD */}
            {tripData.weather_info && (
              <div className="mt-6 bg-white rounded-2xl border border-[#DDDDDD] p-5 sm:p-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#EEEEEE]">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center shadow-xs">
                      <CloudSun className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs uppercase font-semibold tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                          {tripData.weather_info.season}
                        </span>
                        {(tripData.date_range_label || tripData.weather_info.date_range_label || tripData.start_date) && (
                          <span className="text-xs text-stone-500 font-mono font-medium flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-[#008489]" />
                            <span>{tripData.date_range_label || tripData.weather_info.date_range_label || (tripData.start_date && tripData.end_date ? `${tripData.start_date} – ${tripData.end_date}` : tripData.start_date)}</span>
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-[#222222] mt-0.5">
                        Predicted Weather: {tripData.weather_info.condition} ({tripData.weather_info.temperature})
                      </h3>
                    </div>
                  </div>

                  <div className="text-xs text-stone-500 max-w-md">
                    {tripData.weather_info.description}
                  </div>
                </div>

                {/* Warnings & Suggestions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {/* Safety / Travel Warnings */}
                  <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4">
                    <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5 mb-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      Seasonal Travel Warnings & Advisory
                    </span>
                    <ul className="space-y-1.5 text-xs text-amber-950">
                      {(Array.isArray(tripData.weather_info.warnings) ? tripData.weather_info.warnings : []).map((w, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-amber-600 font-bold">•</span>
                          <span>{w}</span>
                        </li>
                      ))}
                      {(!tripData.weather_info.warnings || tripData.weather_info.warnings.length === 0) && (
                        <li className="text-xs text-emerald-700 font-medium flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>No hazardous weather or seasonal travel bans expected for these dates.</span>
                        </li>
                      )}
                    </ul>
                    {tripData.weather_info.activity_advisory && (
                      <div className="mt-2.5 pt-2 border-t border-amber-200/60 text-xs text-amber-800 font-medium flex items-center gap-1.5">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>
                          {typeof tripData.weather_info.activity_advisory === 'string'
                            ? tripData.weather_info.activity_advisory
                            : Array.isArray(tripData.weather_info.activity_advisory)
                            ? tripData.weather_info.activity_advisory.join(' • ')
                            : typeof tripData.weather_info.activity_advisory === 'object'
                            ? Object.entries(tripData.weather_info.activity_advisory).map(([k, v]) => `${k.replace('_', ' ')}: ${v}`).join(' • ')
                            : String(tripData.weather_info.activity_advisory)
                          }
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Smart Packing Checklist */}
                  <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
                    <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5 mb-2">
                      <Check className="w-4 h-4 text-teal-700" />
                      Smart Packing Suggestions
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {(tripData.weather_info.packing_list || []).map((item, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-xs text-stone-700 font-medium flex items-center gap-1"
                        >
                          <Check className="w-3 h-3 text-teal-600" />
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB SELECTOR NAVIGATION - Underline Style */}
            <div className="border-b border-[#DDDDDD] flex items-center gap-6 overflow-x-auto mt-8 scrollbar-none">
              {[
                { id: 'itinerary', label: 'Day-Wise Itinerary & Activities', icon: Calendar },
                { id: 'stays_transport', label: 'Stay & Vehicle Details', icon: Hotel },
                { id: 'budget', label: 'Budget & Cost Breakdown', icon: BarChart3 },
              ].map(tab => {
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`pb-3 text-sm font-medium transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap border-b-2 ${
                      isActive
                        ? 'text-[#222222] border-[#222222]'
                        : 'text-[#717171] border-transparent hover:text-[#222222] hover:border-[#DDDDDD]'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>

            {/* TAB CONTENTS */}
            <div className="mt-8">
              {/* TAB 1: DAY-WISE ITINERARY */}
              {activeTab === 'itinerary' && (
                <div className="space-y-6">
                  {/* Day filter pills */}
                  <div className="flex items-center justify-between flex-wrap gap-3 bg-white p-4 rounded-xl border border-[#DDDDDD] shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#717171]">Filter:</span>
                      <button
                        onClick={() => setSelectedDayFilter('all')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                          selectedDayFilter === 'all'
                            ? 'bg-[#222222] text-white'
                            : 'border border-[#DDDDDD] bg-white text-[#222222] hover:bg-[#F7F7F7]'
                        }`}
                      >
                        All {dayKeys.length} Days
                      </button>
                      {dayKeys.map(k => (
                        <button
                          key={k}
                          onClick={() => setSelectedDayFilter(k)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                            selectedDayFilter === k
                              ? 'bg-[#222222] text-white'
                              : 'border border-[#DDDDDD] bg-white text-[#222222] hover:bg-[#F7F7F7]'
                          }`}
                        >
                          Day {k}
                        </button>
                      ))}
                    </div>

                    <span className="text-xs text-[#717171]">
                      Click trash icon to customize activities; costs update automatically.
                    </span>
                  </div>

                  {/* Day Cards Loop */}
                  <div className="space-y-6">
                    {displayedDayKeys.map(dayKey => {
                      const day = (tripData.itinerary || {})[dayKey]
                      if (!day) return null

                      return (
                        <div
                          key={dayKey}
                          className="bg-white rounded-2xl border border-[#DDDDDD] shadow-sm overflow-hidden"
                        >
                          {/* Day Banner */}
                          <div className="bg-[#F7F7F7] border-b border-[#DDDDDD] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <span className="w-9 h-9 rounded-xl bg-[#222222] text-white font-bold flex items-center justify-center text-sm">
                                {dayKey}
                              </span>
                              <div>
                                <h3 className="text-base font-semibold text-[#222222]">
                                  {day.day_title || `Day ${dayKey} Schedule`}
                                </h3>
                                <p className="text-xs text-[#717171]">
                                  {day.places?.length || 0} Scheduled Attractions · {day.total_time?.toFixed(1) || '0'}h sightseeing
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 text-xs">
                              <span className="text-[#222222] bg-white px-3 py-1.5 rounded-lg border border-[#DDDDDD]">
                                Day Sightseeing Budget: <strong className="font-semibold">₹{day.total_cost?.toLocaleString('en-IN')}</strong>
                              </span>
                            </div>
                          </div>

                          {/* Activities list */}
                          <div className="p-5 sm:p-6 space-y-5">
                            {day.places && day.places.length > 0 ? (
                              day.places.map((place: Place, pIdx: number) => {
                                const slot = TIME_OF_DAY_SLOTS[pIdx % TIME_OF_DAY_SLOTS.length]
                                const isFree = place.is_free_entry ?? (place.average_cost === 0)
                                const hasActivities = place.activities && place.activities.length > 0

                                return (
                                  <div
                                    key={place.place_name + pIdx}
                                    className="bg-[#F7F7F7] rounded-xl border border-[#DDDDDD] p-5 flex flex-col gap-4 group"
                                  >
                                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
                                        {/* Place Photo thumbnail */}
                                        <div className="w-full sm:w-32 h-24 rounded-lg overflow-hidden relative flex-shrink-0 bg-stone-200 group/img">
                                          <img
                                            src={
                                              place.image ||
                                              `https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&q=80`
                                            }
                                            alt={place.place_name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            referrerPolicy="no-referrer"
                                            loading="lazy"
                                            onError={(e) => {
                                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&q=80'
                                            }}
                                          />
                                          <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-white/95 text-[10px] font-semibold text-[#222222] flex items-center gap-0.5">
                                            <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                                            <span>{place.rating}</span>
                                          </div>
                                        </div>

                                        {/* Details */}
                                        <div className="space-y-1.5 flex-1">
                                          <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-xs font-semibold text-[#008489]">
                                              {slot.icon} {place.time_of_day ? `${place.time_of_day} Expedition` : slot.label}
                                            </span>
                                            <span className="text-xs text-[#717171]">
                                              · {place.time_slot || slot.time}
                                            </span>
                                          </div>

                                          <div className="flex items-center gap-2 flex-wrap">
                                            <h4 className="text-base font-semibold text-[#222222]">
                                              {place.place_name}
                                            </h4>

                                            {/* Entry Badge: Free vs Ticket */}
                                            {isFree ? (
                                              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold flex items-center gap-1">
                                                <Check className="w-3 h-3" /> Free Entry
                                              </span>
                                            ) : (
                                              <span className="px-2 py-0.5 rounded-md bg-stone-100 text-[#222222] border border-[#DDDDDD] text-[11px] font-semibold">
                                                {place.entry_label || `Entry: ₹${place.average_cost}`}
                                              </span>
                                            )}
                                          </div>

                                          <p className="text-xs text-[#717171] leading-relaxed">
                                            {place.description || `${place.category} attraction located in ${tripData.destination}`}
                                          </p>

                                          <div className="flex flex-wrap items-center gap-3 pt-0.5 text-xs text-[#717171]">
                                            <span>Category: <strong className="text-[#222222]">{place.category}</strong></span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                              <Clock className="w-3 h-3 text-[#717171]" /> Time needed: {place.time_needed}h
                                            </span>
                                            {place.location && (
                                              <>
                                                <span>•</span>
                                                <span className="flex items-center gap-1">
                                                  <MapPin className="w-3 h-3 text-[#717171]" /> {place.location}
                                                </span>
                                              </>
                                            )}
                                          </div>
                                        </div>
                                      </div>

                                      {/* Remove button */}
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveFromDay(dayKey, pIdx)}
                                        title="Remove activity from day"
                                        className="p-2 rounded-lg text-[#717171] hover:text-rose-600 hover:bg-stone-200/50 transition-colors cursor-pointer self-start md:self-center"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>

                                    {/* AVAILABLE ACTIVITIES & ADVENTURE SPORTS */}
                                    {hasActivities ? (
                                      <div className="mt-1 pt-3 border-t border-[#DDDDDD]/70">
                                        <span className="text-[11px] font-semibold text-[#222222] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                          <Activity className="w-3.5 h-3.5 text-[#008489]" />
                                          <span>Available Adventure Sports & Activities:</span>
                                        </span>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                                          {place.activities!.map((act, aIdx) => (
                                            <div
                                              key={aIdx}
                                              className="bg-white p-2.5 rounded-lg border border-[#DDDDDD] flex items-start justify-between gap-2 shadow-2xs"
                                            >
                                              <div>
                                                <div className="text-xs font-semibold text-[#222222]">{act.name}</div>
                                                {act.desc && (
                                                  <div className="text-[11px] text-[#717171] mt-0.5 line-clamp-1">
                                                    {act.desc}
                                                  </div>
                                                )}
                                              </div>
                                              <span className="px-2 py-0.5 rounded-md bg-[#222222] text-white text-xs font-bold font-mono whitespace-nowrap">
                                                ₹{act.cost.toLocaleString('en-IN')}
                                              </span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="mt-0 pt-2 border-t border-[#DDDDDD]/50 text-xs text-[#717171] flex items-center gap-1.5">
                                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                                        <span>Free to explore · Sightseeing & Photography</span>
                                      </div>
                                    )}
                                  </div>
                                )
                              })
                            ) : (
                              <div className="text-center py-6 text-[#717171] text-xs">
                                No activities scheduled for Day {dayKey}.
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: STAY & TRANSPORT DETAILS */}
              {activeTab === 'stays_transport' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* ACCOMMODATION / STAY CARD */}
                    <div className="bg-white rounded-2xl border border-[#DDDDDD] p-6 shadow-sm flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="px-3 py-1 rounded-full bg-[#F7F7F7] text-xs font-semibold text-[#008489] border border-[#DDDDDD] flex items-center gap-1.5">
                            <Hotel className="w-3.5 h-3.5 text-[#008489]" /> Selected Accommodation
                          </span>
                          <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                            <span>{tripData.stay_details?.rating || 4.5} Rating</span>
                          </span>
                        </div>

                        <div>
                          <h3 className="text-xl font-bold text-[#222222]">
                            {tripData.stay_details?.name || 'Curated City Hotel'}
                          </h3>
                          <p className="text-xs text-[#717171] mt-1">
                            {tripData.stay_details?.type || 'Comfort Boutique Stay'} · {tripData.stay_details?.location || tripData.destination}
                          </p>
                        </div>

                        <div className="bg-[#F7F7F7] p-4 rounded-xl border border-[#DDDDDD] space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-[#717171]">Staying Cost Per Night:</span>
                            <span className="font-bold text-[#222222] font-mono">
                              ₹{(tripData.stay_details?.price_per_night || stayingCostPerDay).toLocaleString('en-IN')} / night
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[#717171]">Rooms Allocated:</span>
                            <span className="font-medium text-[#222222]">
                              {tripData.stay_details?.rooms || Math.ceil(tripData.group_size / 2)} Room(s) (for {tripData.group_size} travellers)
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[#717171]">Daily Staying Cost:</span>
                            <span className="font-bold text-[#008489] font-mono">
                              ₹{stayingCostPerDay.toLocaleString('en-IN')} / day
                            </span>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-[#DDDDDD]">
                            <span className="font-semibold text-[#222222]">Total Stay Expenditure ({tripData.days} Nights):</span>
                            <span className="font-bold text-base text-[#222222] font-mono">
                              ₹{(tripData.stay_details?.total_cost || (stayingCostPerDay * tripData.days)).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>

                        <div className="text-[11px] text-[#717171] leading-relaxed flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Includes complimentary high-speed WiFi, breakfast options, and easy access to local sightseeing routes.</span>
                        </div>
                      </div>
                    </div>

                    {/* VEHICLE / TRANSPORTATION CARD */}
                    <div className="bg-white rounded-2xl border border-[#DDDDDD] p-6 shadow-sm flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="px-3 py-1 rounded-full bg-[#F7F7F7] text-xs font-semibold text-[#222222] border border-[#DDDDDD] flex items-center gap-1.5">
                            <Car className="w-3.5 h-3.5 text-[#222222]" /> Local Travel & Vehicle
                          </span>
                          <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-md">
                            {tripData.transport_details?.mode === 'Private' ? 'Own Vehicle' : 'Rental Mode'}
                          </span>
                        </div>

                        <div>
                          <h3 className="text-xl font-bold text-[#222222]">
                            {tripData.transport_details?.vehicle_name || 'Hatchback Vehicle'}
                          </h3>
                          <p className="text-xs text-[#717171] mt-1">
                            {tripData.transport_details?.vehicle_type || 'Car'} · {tripData.transport_details?.mode === 'Private' ? 'Private Vehicle' : 'Self-Drive Rental'}
                          </p>
                        </div>

                        <div className="bg-[#F7F7F7] p-4 rounded-xl border border-[#DDDDDD] space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-[#717171]">Vehicle Rental Fee:</span>
                            <span className="font-bold text-[#222222] font-mono">
                              {tripData.transport_details?.mode === 'Private' 
                                ? '₹0 / day (Personal Car/Bike)'
                                : `₹${(tripData.transport_details?.rental_fee_per_day || 1400).toLocaleString('en-IN')} / day`}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[#717171]">Est. Fuel, Tolls & Parking:</span>
                            <span className="font-medium text-[#222222] font-mono">
                              ₹{(tripData.transport_details?.fuel_per_day || 550).toLocaleString('en-IN')} / day
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[#717171]">Daily Travelling Cost:</span>
                            <span className="font-bold text-[#222222] font-mono">
                              ₹{travellingCostPerDay.toLocaleString('en-IN')} / day
                            </span>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-[#DDDDDD]">
                            <span className="font-semibold text-[#222222]">Total Travel Expenditure ({tripData.days} Days):</span>
                            <span className="font-bold text-base text-[#222222] font-mono">
                              ₹{(tripData.transport_details?.total_cost || (travellingCostPerDay * tripData.days)).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>

                        {tripData.transport_details?.adjustment_note && (
                          <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-center gap-1.5">
                            <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>{tripData.transport_details.adjustment_note}</span>
                          </div>
                        )}

                        <div className="text-[11px] text-[#717171] leading-relaxed flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Flexible door-to-door mobility covering all {tripData.days} days of sightseeing, morning expeditions, and transfers.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: BUDGET & COST BREAKDOWN */}
              {activeTab === 'budget' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Budget breakdown Donut chart */}
                  <div className="bg-white rounded-2xl border border-[#DDDDDD] p-6 shadow-sm">
                    <h3 className="text-base font-semibold text-[#222222] mb-1">
                      Budget Allocation Breakdown
                    </h3>
                    <p className="text-xs text-[#717171] mb-4">
                      Estimated division of your ₹{tripData.total_estimated_cost?.toLocaleString('en-IN')} total trip cost
                    </p>

                    <div className="h-60 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={budgetBreakdownData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={80}
                            paddingAngle={3}
                          >
                            {budgetBreakdownData.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: any) => `₹${Number(value).toLocaleString('en-IN')}`} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                      {budgetBreakdownData.map((item, idx) => (
                        <div key={item.name} className="flex items-center gap-2 p-2 rounded-lg bg-[#F7F7F7] border border-[#DDDDDD]">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }} />
                          <span className="text-[#717171] truncate">{item.name}:</span>
                          <strong className="text-[#222222] font-mono">₹{item.value.toLocaleString('en-IN')}</strong>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Daily Expense Overview Card */}
                  <div className="bg-white rounded-2xl border border-[#DDDDDD] p-6 shadow-sm space-y-5">
                    <div>
                      <h3 className="text-base font-semibold text-[#222222] mb-1">
                        Daily Expense Summary
                      </h3>
                      <p className="text-xs text-[#717171]">
                        Itemized expenses calculated per day for {tripData.group_size} traveller(s)
                      </p>
                    </div>

                    <div className="bg-[#F7F7F7] rounded-xl border border-[#DDDDDD] p-5 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#717171] flex items-center gap-1.5">
                          <Hotel className="w-3.5 h-3.5 text-[#008489]" /> Staying Fee Per Day:
                        </span>
                        <strong className="text-[#222222] font-mono">₹{stayingCostPerDay.toLocaleString('en-IN')}/day</strong>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#717171] flex items-center gap-1.5">
                          <Car className="w-3.5 h-3.5 text-[#008489]" /> Travelling Cost Per Day:
                        </span>
                        <strong className="text-[#222222] font-mono">₹{travellingCostPerDay.toLocaleString('en-IN')}/day</strong>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#717171] flex items-center gap-1.5">
                          <Utensils className="w-3.5 h-3.5 text-[#008489]" /> Food & Dining Per Day:
                        </span>
                        <strong className="text-[#222222] font-mono">
                          ₹{Math.round((tripData.budget_breakdown?.food || 0) / Math.max(1, tripData.days)).toLocaleString('en-IN')}/day
                        </strong>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#717171] flex items-center gap-1.5">
                          <Ticket className="w-3.5 h-3.5 text-[#008489]" /> Sightseeing & Entries:
                        </span>
                        <strong className="text-[#222222] font-mono">
                          ₹{(tripData.budget_breakdown?.activities || 0).toLocaleString('en-IN')} (Total)
                        </strong>
                      </div>
                      <div className="flex items-center justify-between text-xs pt-3 border-t border-[#DDDDDD]">
                        <span className="font-semibold text-[#222222]">Estimated Total Expenditure:</span>
                        <strong className="text-base text-[#008489] font-mono">
                          ₹{tripData.total_estimated_cost?.toLocaleString('en-IN')}
                        </strong>
                      </div>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs space-y-1">
                      <div className="font-semibold text-emerald-900">Budget Compliance:</div>
                      <div>
                        Target Budget: ₹{tripData.budget?.toLocaleString('en-IN')} · Buffer Remaining: ₹{tripData.budget_remaining?.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  {/* Group Cost Split Calculator */}
                  <div className="bg-white rounded-2xl border border-[#DDDDDD] p-6 shadow-sm space-y-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#EEEEEE]">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
                            <Users className="w-4 h-4 text-teal-700" />
                          </div>
                          <h3 className="text-base font-bold text-[#222222]">
                            Group Expense Split Calculator
                          </h3>
                        </div>
                        <p className="text-xs text-[#717171]">
                          Simulate fair cost-sharing across friends, family, or travel companions.
                        </p>
                      </div>

                      {/* Stepper with high-contrast, clearly visible + / - buttons */}
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-xs font-semibold text-[#717171] uppercase tracking-wider">
                          Splitting among:
                        </span>
                        
                        <div className="flex items-center gap-2 bg-[#F7F7F7] p-1.5 rounded-2xl border border-stone-200">
                          <button
                            type="button"
                            onClick={() => setSplitGroupCount(prev => Math.max(1, prev - 1))}
                            disabled={splitGroupCount <= 1}
                            aria-label="Decrease group size"
                            className="w-8 h-8 rounded-xl bg-white hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed text-[#222222] border border-stone-200 shadow-2xs flex items-center justify-center transition-all cursor-pointer active:scale-95"
                          >
                            <Minus className="w-4 h-4 text-stone-700 stroke-[2.5]" />
                          </button>

                          <div className="min-w-[85px] text-center px-2">
                            <span className="text-sm font-bold text-[#222222] font-mono block">
                              {splitGroupCount}
                            </span>
                            <span className="text-[10px] text-[#717171] uppercase font-semibold tracking-wider block">
                              {splitGroupCount === 1 ? 'person' : 'people'}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => setSplitGroupCount(prev => Math.min(20, prev + 1))}
                            disabled={splitGroupCount >= 20}
                            aria-label="Increase group size"
                            className="w-8 h-8 rounded-xl bg-teal-700 hover:bg-teal-800 disabled:opacity-30 disabled:cursor-not-allowed text-white shadow-xs flex items-center justify-center transition-all cursor-pointer active:scale-95"
                          >
                            <Plus className="w-4 h-4 text-white stroke-[2.5]" />
                          </button>
                        </div>

                        {/* Quick Presets */}
                        <div className="hidden sm:flex items-center gap-1">
                          {[2, 4, 6, 8].map(count => (
                            <button
                              key={count}
                              type="button"
                              onClick={() => setSplitGroupCount(count)}
                              className={`px-2 py-1 text-xs font-semibold rounded-lg border transition cursor-pointer ${
                                splitGroupCount === count
                                  ? 'bg-[#222222] text-white border-[#222222]'
                                  : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                              }`}
                            >
                              {count}p
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Breakdown per person cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                      <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#717171] mb-1">
                            <Hotel className="w-3.5 h-3.5 text-stone-500" />
                            <span>Stay / Hotel</span>
                          </div>
                          <div className="text-base font-bold text-[#222222] font-mono">
                            ₹{Math.round(((tripData.budget_breakdown?.accommodation || 0)) / Math.max(1, splitGroupCount)).toLocaleString('en-IN')}
                          </div>
                        </div>
                        <span className="text-[10px] text-stone-400 mt-1">per person total</span>
                      </div>

                      <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#717171] mb-1">
                            <Car className="w-3.5 h-3.5 text-stone-500" />
                            <span>Vehicle / Fuel</span>
                          </div>
                          <div className="text-base font-bold text-[#222222] font-mono">
                            ₹{Math.round(((tripData.budget_breakdown?.transport || 0)) / Math.max(1, splitGroupCount)).toLocaleString('en-IN')}
                          </div>
                        </div>
                        <span className="text-[10px] text-stone-400 mt-1">per person total</span>
                      </div>

                      <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#717171] mb-1">
                            <Utensils className="w-3.5 h-3.5 text-stone-500" />
                            <span>Food & Dining</span>
                          </div>
                          <div className="text-base font-bold text-[#222222] font-mono">
                            ₹{Math.round(((tripData.budget_breakdown?.food || 0)) / Math.max(1, splitGroupCount)).toLocaleString('en-IN')}
                          </div>
                        </div>
                        <span className="text-[10px] text-stone-400 mt-1">per person total</span>
                      </div>

                      <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#717171] mb-1">
                            <Ticket className="w-3.5 h-3.5 text-stone-500" />
                            <span>Activities</span>
                          </div>
                          <div className="text-base font-bold text-[#222222] font-mono">
                            ₹{Math.round(((tripData.budget_breakdown?.activities || 0)) / Math.max(1, splitGroupCount)).toLocaleString('en-IN')}
                          </div>
                        </div>
                        <span className="text-[10px] text-stone-400 mt-1">per person total</span>
                      </div>

                      <div className="col-span-2 lg:col-span-1 p-3.5 bg-teal-50 border border-teal-200 rounded-xl flex flex-col justify-between ring-1 ring-teal-300/60 shadow-xs">
                        <div>
                          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-teal-900 mb-1">
                            <Wallet className="w-3.5 h-3.5 text-teal-700" />
                            <span>Total Share</span>
                          </div>
                          <div className="text-lg font-bold text-teal-950 font-mono">
                            ₹{Math.round(((tripData.total_estimated_cost || 0)) / Math.max(1, splitGroupCount)).toLocaleString('en-IN')}
                          </div>
                        </div>
                        <span className="text-[11px] font-semibold text-teal-800 mt-1 font-mono">
                          ₹{Math.round(((tripData.total_estimated_cost || 0)) / Math.max(1, splitGroupCount) / Math.max(1, tripData.days)).toLocaleString('en-IN')} / day
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 text-[11px] text-[#717171] flex items-center justify-between border-t border-[#EEEEEE]">
                      <span>
                        Calculated from total itinerary cost of ₹{tripData.total_estimated_cost?.toLocaleString('en-IN')} split among {splitGroupCount} {splitGroupCount === 1 ? 'member' : 'members'}.
                      </span>
                      <span className="font-semibold text-teal-800">
                        ₹{Math.round(((tripData.total_estimated_cost || 0)) / Math.max(1, splitGroupCount)).toLocaleString('en-IN')} each
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
