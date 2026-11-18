import React, { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { getActivePlan } from '@/lib/activePlan'
import { X, Lock, Mail, User as UserIcon, Sparkles, Compass, ShieldCheck } from 'lucide-react'

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, login, register, isLoading, authModalMode } = useAuth()
  const [isRegister, setIsRegister] = useState(authModalMode === 'register')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [travelVibe, setTravelVibe] = useState('Balanced Explorer')
  const [activePlan, setActivePlanState] = useState(getActivePlan())

  useEffect(() => {
    setIsRegister(authModalMode === 'register')
    setActivePlanState(getActivePlan())
  }, [authModalMode, isAuthModalOpen])

  if (!isAuthModalOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isRegister) {
      if (!name.trim()) return
      await register(name, email, password, travelVibe)
    } else {
      await login(email, password)
    }
  }

  const vibes = [
    'Balanced Explorer',
    'Adventure Seeker',
    'Heritage & Culture Buff',
    'Food & Culinary Lover',
    'Nature & Wildlife Fan',
    'Relaxed Vacationer'
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-teal-800 via-teal-900 to-stone-900 px-6 py-6 text-white relative">
          <button
            onClick={closeAuthModal}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-teal-500/20 backdrop-blur-sm text-teal-200">
              <Compass className="w-4 h-4" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-300">
              VoyageGo Travel Account
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white">
            {isRegister ? 'Create Your Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-teal-100/90 mt-1">
            {isRegister
              ? 'Save your custom itineraries, sync trips across devices, and manage bookings.'
              : 'Sign in to access your saved trips and personalized plans.'}
          </p>

          {/* Active plan save highlight */}
          {activePlan && (activePlan.is_guest !== false || !activePlan.user_id) && (
            <div className="mt-3 p-2.5 rounded-xl bg-teal-950/60 border border-teal-400/30 flex items-center gap-2 text-xs text-teal-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>
                Your current itinerary for <strong className="text-white">{activePlan.destination} ({activePlan.days} Days)</strong> will be saved to your account upon signing in!
              </span>
            </div>
          )}
        </div>

        {/* Mode switcher tabs */}
        <div className="flex border-b border-stone-200 bg-stone-50">
          <button
            type="button"
            onClick={() => setIsRegister(false)}
            className={`flex-1 py-3 text-xs font-semibold text-center transition-colors cursor-pointer ${
              !isRegister
                ? 'text-[#222222] border-b-2 border-[#222222] bg-white'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsRegister(true)}
            className={`flex-1 py-3 text-xs font-semibold text-center transition-colors cursor-pointer ${
              isRegister
                ? 'text-[#222222] border-b-2 border-[#222222] bg-white'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Create Free Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Maya Sharma"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 text-sm focus:ring-2 focus:ring-teal-600 focus:outline-none transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 text-sm focus:ring-2 focus:ring-teal-600 focus:outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 text-sm focus:ring-2 focus:ring-teal-600 focus:outline-none transition"
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Primary Travel Style
              </label>
              <select
                value={travelVibe}
                onChange={(e) => setTravelVibe(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 text-sm focus:ring-2 focus:ring-teal-600 focus:outline-none transition"
              >
                {vibes.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 rounded-xl font-semibold text-sm text-white bg-teal-700 hover:bg-teal-800 disabled:opacity-50 transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <ShieldCheck className="w-4 h-4" />
            )}
            {isRegister ? 'Save Itinerary & Create Account' : 'Sign In & Sync'}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-xs text-teal-700 hover:underline font-medium cursor-pointer"
            >
              {isRegister
                ? 'Already have an account? Sign In'
                : "Don't have an account yet? Create one in seconds"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
