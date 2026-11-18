import axios from 'axios'

const API_BASE = '/api'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('voyage_token')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Destination {
  destination_id?: number
  destination: string
  country: string
  region?: string
  image?: string
  description?: string
  avg_rating: number
  avg_cost_per_day: number
  best_duration_days: number
  categories?: string[]
  best_season?: string
  latitude?: number
  longitude?: number
}

export interface Place {
  place_id: number
  place_name: string
  destination: string
  category: string
  nature_score: number
  adventure_score: number
  food_score: number
  history_score: number
  shopping_score: number
  culture_score: number
  average_cost: number
  time_needed: number
  rating: number
  location: string
  distance_from_city_centre: number
  image?: string
  description?: string
  time_of_day?: string
  time_slot?: string
  rf_probability?: number
  like_probability?: number
  like_probability_pct?: string
  composite_score?: number
  final_recommendation_score?: number
  interest_match?: number
  budget_fit?: number
  reasons?: string[]
  ml_explanation?: string
  is_free_entry?: boolean
  entry_fee?: number
  entry_label?: string
  activities?: { name: string; cost: number; desc?: string }[]
  activity_note?: string
}

export interface TripGenerateRequest {
  destination: string
  budget: number
  days: number
  group_size: number
  food_preference: string
  nature_interest: number
  adventure_interest: number
  food_interest: number
  history_interest: number
  shopping_interest: number
  culture_interest: number
  walking_comfort: string
  accommodation_type: string
  transport_preference: string
  vehicle_ownership?: string
  vehicle_type?: string
  start_date?: string
  end_date?: string
  user_id?: number
  user_email?: string
  trip_pace: string
  group_type: string
  additional_notes?: string
}

export interface TripResult {
  trip_id: number
  destination: string
  destination_info: { image: string; description: string; avg_cost_per_day: number }
  days: number
  group_size: number
  budget: number
  traveller_profile: { label: string; description: string; cluster_id: number }
  total_estimated_cost: number
  cost_per_person: number
  daily_cost: number
  staying_cost_per_day?: number
  travelling_cost_per_day?: number
  stay_details?: {
    name: string
    category: string
    type: string
    location: string
    rating: number
    rooms: number
    price_per_night: number
    cost_per_day: number
    total_cost: number
    note?: string
  }
  transport_details?: {
    mode: string
    vehicle_type: string
    vehicle_name: string
    rental_fee_per_day: number
    fuel_per_day: number
    cost_per_day: number
    total_cost: number
    note?: string
    auto_adjusted?: boolean
    adjustment_note?: string
  }
  budget_remaining: number
  over_budget: boolean
  regression_cost_estimate?: number
  regression_time_estimate?: number
  budget_breakdown: {
    accommodation: number
    transport: number
    food: number
    activities: number
    misc: number
    total: number
  }
  recommendations: Place[]
  recommended_places?: Place[]
  itinerary: Record<string, {
    day: number
    title: string
    day_title?: string
    places: (Place & { time_of_day: string })[]
    total_cost: number
    total_time: number
  }>
  constraint_report: {
    violations: string[]
    adjustments: string[]
    total_activity_hours: number
    total_activity_time_hours?: number
    available_time_hours: number
  }
  start_date?: string
  end_date?: string
  date_range_label?: string
  weather_info?: {
    destination: string
    start_date?: string
    end_date?: string
    date_range_label?: string
    month_name?: string
    season: string
    temperature: string
    condition: string
    icon: string
    description: string
    warnings: string[]
    activity_advisory?: string | Record<string, string> | string[]
    activity_advisory_list?: string[]
    packing_list: string[]
  }
  ml_insights: {
    traveller_profile: string
    cluster_description: string
    avg_rf_probability: number
    avg_recommendation_score: number
    top_place_probability: number
    models_used: string[]
  }
}

export interface SavedTrip {
  id: number
  name: string
  destination: string
  days: number
  start_date?: string
  end_date?: string
  date_range_label?: string
  group_size: number
  budget: number
  status: string
  created_at?: string
  total_cost?: number
  staying_cost_per_day?: number
  travelling_cost_per_day?: number
  hotel_name?: string
  vehicle_name?: string
  image?: string
  traveller_profile?: string
  weather_condition?: string
  weather_icon?: string
  weather_temp?: string
  destination_info?: { image?: string; description?: string }
}

export interface User {
  id: number
  name: string
  email: string
  travel_vibe?: string
  created_at?: string
}

export interface AuthResponse {
  token: string
  user: User
}

// ─── API Functions ────────────────────────────────────────────────────────────

export const destinationsApi = {
  getAll: (params?: { search?: string; category?: string; min_rating?: number; max_budget?: number; sort_by?: string }) =>
    api.get<{ destinations: Destination[]; total: number }>('/destinations', { params }),

  getByName: (name: string) =>
    api.get<{ destination: Destination; places: Place[] }>(`/destinations/${encodeURIComponent(name)}`),

  getNames: () =>
    api.get<{ names: string[] }>('/destinations/names'),
}

export const tripsApi = {
  generate: (data: TripGenerateRequest) =>
    api.post<TripResult>('/trips/generate', data),

  getAll: (params?: { user_session?: string; user_id?: number } | string) => {
    const queryParams = typeof params === 'string' ? { user_session: params } : params
    return api.get<{ trips: SavedTrip[] }>('/trips', { params: queryParams })
  },

  getById: (id: number) =>
    api.get<TripResult & { id: number }>(`/trips/${id}`),

  update: (id: number, data: { itinerary?: Record<string, unknown>; name?: string; status?: string; total_cost?: number }) =>
    api.put(`/trips/${id}`, data),

  delete: (id: number) =>
    api.delete(`/trips/${id}`),

  saveToAccount: (id: number, user_id: number, user_email: string) =>
    api.post(`/trips/${id}/save-to-account`, null, { params: { user_id, user_email } }),
}

export const authApi = {
  register: (data: { name: string; email: string; password: string; travel_vibe?: string }) =>
    api.post<AuthResponse>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data),

  demoLogin: () =>
    api.post<AuthResponse>('/auth/demo-login'),

  getMe: (token: string) =>
    api.get<User>('/auth/me', { params: { token } }),
}

export const favouritesApi = {
  add: (data: { item_type: string; item_id: string; item_name: string; item_image?: string }) =>
    api.post('/favourites', { ...data, user_session: 'demo' }),

  getAll: () =>
    api.get<{ favourites: Array<{ id: number; item_type: string; item_id: string; item_name: string; item_image?: string }> }>('/favourites', {
      params: { user_session: 'demo' }
    }),

  remove: (id: number) =>
    api.delete(`/favourites/${id}`),
}

export const mlApi = {
  getMetrics: () => api.get('/ml/metrics'),
  getClassification: () => api.get('/ml/classification'),
  getClustering: () => api.get('/ml/clustering'),
  getRegression: () => api.get('/ml/regression'),
  getFeatureImportance: () => api.get('/ml/feature-importance'),
  train: () => api.post('/ml/train'),
  getDatasetStats: () => api.get('/ml/dataset-stats'),
}

export const healthApi = {
  check: () => api.get('/health'),
}

export const updatePlaceImage = async (data: { place_name: string; destination?: string; image_url: string }) => {
  const res = await api.put('/places/image', data)
  return res.data
}

export const updateDestinationImage = async (data: { destination: string; image_url: string }) => {
  const res = await api.put('/destinations/image', data)
  return res.data
}

export interface ImageUploadResponse {
  success: boolean
  image_url: string
  filename: string
  trips_updated?: number
  place_name?: string
  destination?: string
  message: string
}

export const uploadImageFromLaptop = async (data: {
  filename: string
  data_base64: string
  place_name?: string
  destination?: string
  item_type?: 'place' | 'destination'
}) => {
  const res = await api.post<ImageUploadResponse>('/upload-image', data)
  return res.data
}

export const getAllPlaces = async (destination?: string, search?: string) => {
  const res = await api.get<{ places: Place[]; total: number }>('/places', {
    params: { destination, search }
  })
  return res.data
}
