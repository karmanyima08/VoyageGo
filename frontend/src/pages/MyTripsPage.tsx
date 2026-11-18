import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Trash2, MapPin, Sparkles, ArrowRight, Hotel, Car, Calendar,
  CloudSun, UserCheck, LogIn, User, Compass, Heart
} from 'lucide-react'
import { toast } from 'sonner'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { tripsApi, favouritesApi, type SavedTrip } from '@/services/api'
import { useAuth } from '@/context/AuthContext'
import { useActivePlan } from '@/lib/activePlan'

export default function MyTripsPage() {
  const { user, openAuthModal, demoLogin } = useAuth()
  const { activePlan, clearActivePlan } = useActivePlan()
  const [trips, setTrips] = useState<SavedTrip[]>([])
  const [favourites, setFavourites] = useState<Array<{ id: number; item_name: string; item_image?: string; item_type: string; item_id?: string }>>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'trips' | 'favourites'>('trips')
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const loadData = async () => {
    setLoading(true)
    try {
      if (!user) {
        setTrips([])
        setFavourites([])
        setLoading(false)
        return
      }
      const params = { user_id: user.id, user_session: user.email }
      const [tripsRes, favsRes] = await Promise.all([tripsApi.getAll(params), favouritesApi.getAll()])
      setTrips(tripsRes.data.trips)
      setFavourites(favsRes.data.favourites)
    } catch {
      toast.error('Failed to load trips from database')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [user])

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return
    setDeletingId(id)
    try {
      await tripsApi.delete(id)
      setTrips(prev => prev.filter(t => t.id !== id))
      toast.success('Trip plan deleted')
    } catch {
      toast.error('Could not delete trip')
    } finally {
      setDeletingId(null)
    }
  }

  const handleRemoveFav = async (id: number, name: string) => {
    try {
      await favouritesApi.remove(id)
      setFavourites(prev => prev.filter(f => f.id !== id))
      toast.success(`Removed ${name} from favourites`)
    } catch {
      toast.error('Could not remove favourite')
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex flex-col justify-between">
      <div>
        <Navbar />

        <div className="max-w-7xl mx-auto px-6 pt-32 pb-16">
          {/* User Account / Auth Banner */}
          {!user ? (
            activePlan ? (
              <div className="mb-8 p-4 rounded-2xl bg-amber-50/95 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs animate-in fade-in">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 text-amber-800" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-amber-950">
                      You have 1 unsaved draft plan: {activePlan.destination} ({activePlan.days} Days)
                    </h4>
                    <p className="text-xs text-amber-800">
                      Create an account to save this itinerary permanently to your dashboard before your guest session expires.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openAuthModal('register')}
                    className="px-4 py-2.5 rounded-xl bg-[#222222] hover:bg-[#333333] text-white text-xs font-semibold transition cursor-pointer shadow-xs flex items-center gap-1.5"
                  >
                    <Heart className="w-3.5 h-3.5" />
                    Sign Up & Save Plan
                  </button>
                </div>
              </div>
            ) : (
              <div className="mb-8 p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                    <User className="w-5 h-5 text-amber-800" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-amber-950">
                      Browsing in Guest Mode
                    </h4>
                    <p className="text-xs text-amber-800">
                      Sign in to sync your planned trips permanently to your account and access them from any device.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openAuthModal('login')}
                    className="px-4 py-2 rounded-xl bg-[#222222] hover:bg-[#333333] text-white text-xs font-semibold transition cursor-pointer"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => openAuthModal('register')}
                    className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold transition cursor-pointer"
                  >
                    Register
                  </button>
                </div>
              </div>
            )
          ) : (
            <div className="mb-8 p-4 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-700 text-white flex items-center justify-center font-bold text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-teal-950">
                      {user.name}'s Travel Dashboard
                    </h4>
                    <span className="text-[10px] font-medium bg-teal-200/60 text-teal-900 px-2 py-0.5 rounded-full">
                      {user.travel_vibe || 'Traveler'}
                    </span>
                  </div>
                  <p className="text-xs text-teal-700">
                    {user.email} · All saved itineraries are backed up to your account.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#222222] tracking-tight">
                My Trips & Saved Places
              </h1>
              <p className="text-[#717171] text-sm mt-1">
                View and manage your custom itineraries, day-by-day schedules, and bookmarked destinations.
              </p>
            </div>

            <Link
              to="/planner"
              className="px-5 py-2.5 rounded-xl bg-[#222222] hover:bg-[#333333] text-white text-xs font-medium transition-all shadow-sm flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" /> Plan New Trip
            </Link>
          </div>

          {/* Tab Selector - Underline style */}
          <div className="flex gap-6 mb-8 border-b border-[#DDDDDD] pb-3">
            <button
              onClick={() => setActiveTab('trips')}
              className={`text-sm font-semibold transition-all cursor-pointer pb-1 border-b-2 ${
                activeTab === 'trips'
                  ? 'text-[#222222] border-[#222222]'
                  : 'text-[#717171] border-transparent hover:text-[#222222]'
              }`}
            >
              Planned Trips ({trips.length})
            </button>
            <button
              onClick={() => setActiveTab('favourites')}
              className={`text-sm font-semibold transition-all cursor-pointer pb-1 border-b-2 ${
                activeTab === 'favourites'
                  ? 'text-[#222222] border-[#222222]'
                  : 'text-[#717171] border-transparent hover:text-[#222222]'
              }`}
            >
              Saved Places ({favourites.length})
            </button>
          </div>

          {/* Content */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-64 rounded-2xl bg-stone-100 animate-pulse border border-[#DDDDDD]" />
              ))}
            </div>
          ) : activeTab === 'trips' ? (
            trips.length === 0 ? (
              !user && activePlan ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                      </span>
                      <h3 className="font-bold text-[#222222] text-sm uppercase tracking-wider">
                        Current Trip Draft (Guest Preview)
                      </h3>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm('Discard your unsaved draft plan?')) {
                          clearActivePlan()
                          toast.info('Draft itinerary discarded')
                        }
                      }}
                      className="text-xs text-[#717171] hover:text-red-600 transition cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Discard Draft
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl overflow-hidden border border-amber-300 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between ring-2 ring-amber-100">
                      <div>
                        <div className="h-48 relative overflow-hidden bg-stone-100">
                          <img
                            src={
                              activePlan.image ||
                              'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80'
                            }
                            alt={activePlan.destination}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
                          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 text-xs font-semibold text-[#222222] shadow-sm flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#222222]" /> {activePlan.destination}
                          </span>
                          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-amber-600 text-white text-[11px] font-bold shadow-xs">
                            Unsaved Draft
                          </span>
                          <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between text-xs">
                            <span className="text-stone-200 font-medium">
                              {activePlan.days} Days · {activePlan.group_size || 2} Travellers
                            </span>
                            {activePlan.date_range_label && (
                              <span className="bg-white/25 backdrop-blur-xs px-2 py-0.5 rounded-md text-[11px] font-mono flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-white" />
                                <span>{activePlan.date_range_label}</span>
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="p-5">
                          <h3 className="font-bold text-[#222222] text-base mb-1">
                            {activePlan.destination} Expedition
                          </h3>
                          <p className="text-xs text-[#717171] mb-4">
                            Calculated Budget: ₹{(activePlan.budget || activePlan.total_cost || 0).toLocaleString()}
                          </p>
                          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 mb-4 flex items-start gap-2">
                            <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                            <span>
                              This itinerary is currently held in your browser. Sign up to permanently save it to your account!
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-5 pt-0 flex items-center gap-2">
                        <Link
                          to={`/trips/${activePlan.id}`}
                          className="flex-1 py-2.5 rounded-xl bg-[#222222] hover:bg-[#333333] text-white text-xs font-semibold text-center transition cursor-pointer shadow-xs"
                        >
                          View Full Plan →
                        </Link>
                        <button
                          onClick={() => openAuthModal('register')}
                          className="flex-1 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold text-center transition cursor-pointer shadow-xs flex items-center justify-center gap-1"
                        >
                          <Heart className="w-3.5 h-3.5" />
                          <span>Sign Up & Save</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-2xl border border-[#DDDDDD] p-8 max-w-lg mx-auto shadow-sm">
                  <div className="w-14 h-14 rounded-2xl bg-[#F7F7F7] text-[#222222] flex items-center justify-center mx-auto mb-4 border border-[#DDDDDD]">
                    <Compass className="w-7 h-7 text-[#008489]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#222222]">
                    {!user ? 'No Planned Trips in Guest Mode' : 'No Trips Saved Yet'}
                  </h3>
                  <p className="text-xs text-[#717171] mt-1 mb-6 leading-relaxed">
                    {!user
                      ? 'Guest itineraries are saved temporarily during your session. Sign in or create an account to permanently save and manage your travel plans.'
                      : "You haven't planned any trips yet. Start designing your custom journey now!"}
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    {!user ? (
                      <button
                        onClick={() => openAuthModal('register')}
                        className="px-5 py-2.5 rounded-xl bg-[#222222] hover:bg-[#333333] text-white text-xs font-semibold transition cursor-pointer"
                      >
                        Create Free Account
                      </button>
                    ) : (
                      <Link
                        to="/planner"
                        className="px-5 py-2.5 rounded-xl bg-[#222222] text-white text-xs font-medium hover:bg-[#333] transition-colors inline-block"
                      >
                        Start Trip Planner →
                      </Link>
                    )}
                  </div>
                </div>
              )
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trips.map(trip => (
                  <div
                    key={trip.id}
                    className="group bg-white rounded-2xl overflow-hidden border border-[#DDDDDD] shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                  >
                    <div>
                      <div className="h-48 relative overflow-hidden bg-stone-100">
                        <img
                          src={
                            trip.image ||
                            trip.destination_info?.image ||
                            'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80'
                          }
                          alt={trip.destination}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 text-xs font-medium text-[#222222] shadow-sm flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#222222]" /> {trip.destination}
                        </span>

                        <div className="absolute top-3 right-3 flex items-center gap-1.5">
                          {trip.weather_icon && (
                            <span className="px-2 py-0.5 rounded-full bg-black/60 text-white text-[11px] backdrop-blur-xs flex items-center gap-1">
                              <span>{trip.weather_icon}</span>
                              {trip.weather_temp && <span className="font-mono">{trip.weather_temp.split('to')[0]}</span>}
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded-full bg-black/60 text-white text-[11px] font-mono">
                            #{trip.id}
                          </span>
                        </div>

                        <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between text-xs">
                          <span className="text-stone-200">
                            {trip.days} Days · {trip.group_size} Travellers
                          </span>
                          {(trip.date_range_label || trip.start_date) && (
                            <span className="bg-white/25 backdrop-blur-xs px-2 py-0.5 rounded-md text-[11px] font-mono flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-white" />
                              <span>{trip.date_range_label || (trip.start_date && trip.end_date ? `${trip.start_date} – ${trip.end_date}` : trip.start_date)}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-5">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-[#222222] text-base truncate">
                            {trip.destination} Expedition
                          </h3>
                          {trip.traveller_profile && (
                            <span className="text-[10px] font-medium bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full shrink-0">
                              {trip.traveller_profile}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-stone-600 font-medium mb-3">
                          <Calendar className="w-3.5 h-3.5 text-teal-700" />
                          <span>
                            {trip.date_range_label || (trip.start_date && trip.end_date ? `${trip.start_date} – ${trip.end_date}` : trip.start_date ? `Travel: ${trip.start_date}` : `${trip.days} Days duration`)}
                          </span>
                        </div>

                        {/* Stay & Vehicle Specs */}
                        {(trip.hotel_name || trip.vehicle_name) && (
                          <div className="mb-3 p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1 text-xs">
                            {trip.hotel_name && (
                              <div className="flex items-center gap-1.5 text-stone-700 truncate" title={trip.hotel_name}>
                                <Hotel className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                                <span className="truncate">{trip.hotel_name.split('(')[0]}</span>
                              </div>
                            )}
                            {trip.vehicle_name && (
                              <div className="flex items-center gap-1.5 text-stone-700 truncate" title={trip.vehicle_name}>
                                <Car className="w-3.5 h-3.5 text-stone-600 shrink-0" />
                                <span className="truncate">{trip.vehicle_name}</span>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="p-3 rounded-xl bg-[#F7F7F7] border border-[#DDDDDD] space-y-1 text-xs">
                          <div className="flex justify-between items-center">
                            <span className="text-[#717171]">Total Estimated:</span>
                            <strong className="text-[#222222] font-mono font-semibold">
                              ₹{trip.total_cost ? trip.total_cost.toLocaleString('en-IN') : 'N/A'}
                            </strong>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[#717171]">Target Budget:</span>
                            <span className="text-[#008489] font-mono font-medium">
                              ₹{trip.budget?.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 pt-0 flex gap-2">
                      <Link
                        to={`/trips/${trip.id}`}
                        className="flex-1 py-2 rounded-xl bg-[#222222] hover:bg-[#333333] text-white text-xs font-medium text-center transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>View Itinerary</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(trip.id, trip.destination)}
                        disabled={deletingId === trip.id}
                        className="p-2 rounded-xl border border-[#DDDDDD] text-[#717171] hover:text-rose-600 hover:bg-stone-100 transition-colors cursor-pointer"
                        title="Delete Trip Plan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            favourites.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-[#DDDDDD] p-8 max-w-lg mx-auto shadow-sm">
                <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto mb-3 text-rose-500">
                  <Heart className="w-6 h-6 fill-rose-500" />
                </div>
                <h3 className="text-lg font-semibold text-[#222222]">No Saved Places Yet</h3>
                <p className="text-xs text-[#717171] mt-1 mb-6 leading-relaxed">
                  Browse through destinations or itineraries and save your favorites to view them anytime here.
                </p>
                <Link
                  to="/destinations"
                  className="px-5 py-2.5 rounded-xl bg-[#222222] text-white text-xs font-medium hover:bg-[#333] transition-colors inline-block"
                >
                  Browse Destinations →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {favourites.map(fav => {
                  const isTrip = fav.item_type === 'trip'
                  const cleanName = fav.item_name.replace(/\s*\(\d+\s*Days?\)/i, '').trim()
                  const viewUrl = isTrip && fav.item_id
                    ? `/trips/${fav.item_id}`
                    : `/destinations/${encodeURIComponent(cleanName)}`

                  return (
                    <div
                      key={fav.id}
                      className="p-4 rounded-2xl bg-white border border-[#DDDDDD] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                    >
                      <div>
                        <div className="h-36 rounded-xl overflow-hidden mb-3 relative bg-stone-100">
                          <img
                            src={fav.item_image || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&q=80'}
                            alt={fav.item_name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                            loading="lazy"
                          />
                          <span
                            className={`absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-xs ${
                              isTrip ? 'bg-teal-700 text-white' : 'bg-white/95 text-[#222222]'
                            }`}
                          >
                            {isTrip ? 'Saved Trip Itinerary' : 'Destination'}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#222222] text-sm mb-1 truncate">{fav.item_name}</h4>
                          <span className="text-[11px] text-[#717171] block mb-3">
                            {isTrip ? 'Custom Day-by-Day Itinerary' : 'Destination Highlight'}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2 border-t border-[#EEEEEE]">
                        <Link
                          to={viewUrl}
                          className="flex-1 py-2 text-center rounded-xl bg-[#222222] hover:bg-[#333333] text-white text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1 shadow-xs"
                        >
                          <span>{isTrip ? 'View Itinerary' : 'Explore'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleRemoveFav(fav.id, fav.item_name)}
                          className="p-2 rounded-xl text-[#717171] hover:text-rose-600 hover:bg-stone-100 border border-stone-200 transition-colors cursor-pointer"
                          title="Remove from saved"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
