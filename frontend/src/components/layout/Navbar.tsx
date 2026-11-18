import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Compass, User as UserIcon, LogOut, Sparkles, LogIn, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import { useActivePlan } from '@/lib/activePlan'

const NAV_LINKS = [
  { label: 'Explore Destinations', href: '/destinations' },
  { label: 'Plan a Trip', href: '/planner' },
  { label: 'My Trips', href: '/my-trips' },
  { label: 'About', href: '/about' },
]

export default function Navbar({ dark = false }: { dark?: boolean }) {
  // Keep dark prop signature intact for compatibility, but render clean light theme
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const { user, openAuthModal, logout } = useAuth()
  const { activePlan } = useActivePlan()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 15)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const isActive = (href: string) => location.pathname === href

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#DDDDDD] transition-all duration-200',
        scrolled ? 'shadow-sm py-3.5' : 'py-4'
      )}
    >
      <nav className="max-w-7xl mx-auto px-6 w-full">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#222222] flex items-center justify-center text-white">
              <Compass className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold text-[#222222] tracking-tight">
              VoyageGo
            </span>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center gap-7">
            {NAV_LINKS.map(link => {
              const active = isActive(link.href)
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    'text-sm transition-colors cursor-pointer py-1',
                    active
                      ? 'text-[#222222] font-semibold border-b-2 border-[#222222]'
                      : 'text-[#717171] font-medium hover:text-[#222222]'
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Active Plan Pill (Preserved across all navigation) */}
            {activePlan && (
              <Link
                to={`/trips/${activePlan.id}`}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition border shadow-xs group cursor-pointer',
                  isActive(`/trips/${activePlan.id}`)
                    ? 'bg-[#222222] text-white border-[#222222]'
                    : 'bg-teal-50 text-teal-900 border-teal-200 hover:bg-teal-100 hover:border-teal-300'
                )}
                title={`Return to your ${activePlan.destination} itinerary`}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-600"></span>
                </span>
                <Compass className="w-3.5 h-3.5 text-teal-700 group-hover:rotate-45 transition-transform" />
                <span>
                  Current Plan: <span className="font-bold">{activePlan.destination}</span> ({activePlan.days}d)
                </span>
              </Link>
            )}

            {user ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-stone-100 rounded-full border border-stone-200 text-xs font-medium text-stone-800">
                  <div className="w-5 h-5 rounded-full bg-teal-700 text-white flex items-center justify-center text-[10px] font-bold">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="max-w-[120px] truncate">{user.name}</span>
                </div>
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-2 text-stone-500 hover:text-red-600 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('login')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-stone-700 hover:text-stone-900 border border-stone-300 rounded-xl hover:bg-stone-50 transition cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Sign In
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-xl transition cursor-pointer shadow-xs"
                >
                  Register
                </button>
              </div>
            )}

            <Link to="/planner">
              <button className="bg-[#222222] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#333333] transition-colors cursor-pointer">
                Start Planning
              </button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-xl text-[#222222] hover:bg-[#F7F7F7] transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-[#DDDDDD] px-6 py-6 shadow-lg">
          <div className="flex flex-col gap-3">
            {/* Active Plan Mobile Banner */}
            {activePlan && (
              <Link
                to={`/trips/${activePlan.id}`}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl bg-teal-50 text-teal-900 border border-teal-200 text-xs font-semibold mb-2"
              >
                <span className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-teal-700" />
                  <span>Current Plan: <strong>{activePlan.destination}</strong> ({activePlan.days} Days)</span>
                </span>
                <span className="text-[10px] bg-teal-200/80 text-teal-900 px-2 py-0.5 rounded-md font-mono">View →</span>
              </Link>
            )}

            {user ? (
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-stone-200">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-teal-700 text-white flex items-center justify-center text-xs font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-stone-900">{user.name}</p>
                    <p className="text-xs text-stone-500">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout()
                    setMobileOpen(false)
                  }}
                  className="text-xs text-red-600 font-medium px-2 py-1 rounded-md hover:bg-red-50 cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="pb-3 mb-2 border-b border-stone-200 flex gap-2">
                <button
                  onClick={() => {
                    setMobileOpen(false)
                    openAuthModal('login')
                  }}
                  className="flex-1 py-2 text-xs font-semibold text-stone-700 border border-stone-300 rounded-xl hover:bg-stone-50 cursor-pointer text-center"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setMobileOpen(false)
                    openAuthModal('register')
                  }}
                  className="flex-1 py-2 text-xs font-semibold text-white bg-teal-700 rounded-xl hover:bg-teal-800 cursor-pointer text-center"
                >
                  Create Account
                </button>
              </div>
            )}

            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'text-base font-medium py-1.5 transition-colors',
                  isActive(link.href) ? 'text-[#008489] font-semibold' : 'text-[#222222] hover:text-[#008489]'
                )}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-4 mt-1 border-t border-[#DDDDDD]">
              <Link to="/planner" onClick={() => setMobileOpen(false)}>
                <button className="w-full bg-[#222222] text-white py-3 rounded-xl text-sm font-medium hover:bg-[#333333] transition-colors cursor-pointer">
                  Start Planning
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
