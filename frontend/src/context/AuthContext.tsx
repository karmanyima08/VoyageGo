import React, { createContext, useContext, useState, useEffect } from 'react'
import { User, authApi, tripsApi } from '@/services/api'
import { getActivePlan, setActivePlan } from '@/lib/activePlan'
import { toast } from 'sonner'

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthModalOpen: boolean
  authModalMode: 'login' | 'register'
  openAuthModal: (mode?: 'login' | 'register') => void
  closeAuthModal: () => void
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string, travel_vibe?: string) => Promise<boolean>
  demoLogin: () => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('voyage_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('voyage_token') || null
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false)
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login')

  // Verify token on mount if present
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('voyage_token')
      if (savedToken) {
        try {
          const res = await authApi.getMe(savedToken)
          setUser(res.data)
          localStorage.setItem('voyage_user', JSON.stringify(res.data))
        } catch {
          // Token expired or invalid
          localStorage.removeItem('voyage_token')
          localStorage.removeItem('voyage_user')
          setToken(null)
          setUser(null)
        }
      }
    }
    initAuth()
  }, [])

  const claimActiveGuestPlan = async (usr: User) => {
    try {
      const active = getActivePlan()
      if (active?.id && (active.is_guest !== false || !active.user_id)) {
        await tripsApi.saveToAccount(Number(active.id), usr.id, usr.email)
        setActivePlan({
          ...active,
          is_guest: false,
          user_id: usr.id,
        })
        toast.success(`🎉 Your trip to ${active.destination || 'your destination'} has been saved to your account!`)
      }
    } catch (err) {
      console.error('Failed to claim active plan on authentication:', err)
    }
  }

  const saveAuth = (tok: string, usr: User) => {
    setToken(tok)
    setUser(usr)
    localStorage.setItem('voyage_token', tok)
    localStorage.setItem('voyage_user', JSON.stringify(usr))
  }

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode)
    setIsAuthModalOpen(true)
  }

  const closeAuthModal = () => {
    setIsAuthModalOpen(false)
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const res = await authApi.login({ email, password })
      saveAuth(res.data.token, res.data.user)
      toast.success(`Welcome back, ${res.data.user.name}!`)
      setIsAuthModalOpen(false)
      await claimActiveGuestPlan(res.data.user)
      return true
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Login failed. Please check your credentials.'
      toast.error(msg)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string, travel_vibe?: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const res = await authApi.register({ name, email, password, travel_vibe })
      saveAuth(res.data.token, res.data.user)
      toast.success(`Account created! Welcome, ${res.data.user.name}!`)
      setIsAuthModalOpen(false)
      await claimActiveGuestPlan(res.data.user)
      return true
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Registration failed. Email may already be in use.'
      toast.error(msg)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const demoLogin = async (): Promise<boolean> => {
    setIsLoading(true)
    try {
      const res = await authApi.demoLogin()
      saveAuth(res.data.token, res.data.user)
      toast.success(`Authenticated as ${res.data.user.name}`)
      setIsAuthModalOpen(false)
      await claimActiveGuestPlan(res.data.user)
      return true
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Demo login failed.'
      toast.error(msg)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('voyage_token')
    localStorage.removeItem('voyage_user')
    setToken(null)
    setUser(null)
    toast.info('Signed out successfully.')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        demoLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
