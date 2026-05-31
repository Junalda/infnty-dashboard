export type UserRole = 'customer' | 'partner' | 'admin'
export type SubscriptionStatus = 'active' | 'cancelled' | 'past_due' | 'trialing'
export type Pillar = 'rehearsal' | 'content' | 'soundlab'
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'
export type BookingType = 'subscription' | 'loose'
export type PaymentStatus = 'paid' | 'pending' | 'failed' | 'cancelled'
export type ContentProjectStatus = 'planned' | 'filmed' | 'editing' | 'review' | 'delivered'
export type SoundLabProjectStatus = 'idea' | 'writing' | 'ai_production' | 'recording' | 'final_mix' | 'released'

export interface Profile {
  id: string
  role: UserRole
  full_name: string | null
  email: string
  phone: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface SubscriptionPlan {
  id: string
  name: string
  pillar: Pillar
  tier: string
  price_monthly: number
  included_hours: number | null
  stripe_price_id: string | null
  features: string[]
  created_at: string
}

export interface Subscription {
  id: string
  user_id: string
  plan_id: string
  status: SubscriptionStatus
  stripe_subscription_id: string | null
  current_period_start: string
  current_period_end: string
  created_at: string
  plan?: SubscriptionPlan
}

export interface HourBalance {
  id: string
  user_id: string
  month_year: string
  included_hours: number
  used_hours: number
  rollover_hours: number
  rollover_expiry: string | null
  created_at: string
  updated_at: string
}

export interface Room {
  id: string
  name: string
  pillar: Pillar
  description: string | null
  capacity: number
  hourly_rate: number
  is_active: boolean
  created_at: string
}

export interface Booking {
  id: string
  user_id: string
  room_id: string
  start_time: string
  end_time: string
  buffer_end_time: string
  status: BookingStatus
  booking_type: BookingType
  hours_used: number
  total_price: number
  payment_id: string | null
  notes: string | null
  created_at: string
  updated_at: string
  room?: Room
  user?: Profile
}

export interface Payment {
  id: string
  user_id: string
  booking_id: string | null
  subscription_id: string | null
  amount: number
  currency: string
  status: PaymentStatus
  payment_method: string | null
  stripe_payment_intent_id: string | null
  stripe_session_id: string | null
  description: string | null
  created_at: string
}

export interface UploadedFile {
  id: string
  user_id: string
  uploaded_by: string
  project_type: 'content' | 'soundlab'
  project_id: string | null
  file_name: string
  file_url: string
  file_size: number
  mime_type: string
  created_at: string
}

export interface ContentProject {
  id: string
  user_id: string
  partner_id: string | null
  title: string
  status: ContentProjectStatus
  production_day: string | null
  notes: string | null
  created_at: string
  updated_at: string
  files?: UploadedFile[]
  partner?: Profile
}

export interface SoundLabProject {
  id: string
  user_id: string
  partner_id: string | null
  title: string
  status: SoundLabProjectStatus
  genre: string | null
  notes: string | null
  created_at: string
  updated_at: string
  files?: UploadedFile[]
  partner?: Profile
}

export interface PartnerAssignment {
  id: string
  partner_id: string
  client_id: string
  project_type: 'content' | 'soundlab'
  project_id: string
  assigned_at: string
}

export interface EmailNotification {
  id: string
  user_id: string
  type: string
  subject: string
  sent_at: string
  status: string
}

export interface DashboardStats {
  totalBookings: number
  upcomingBookings: number
  hoursUsed: number
  hoursRemaining: number
  activeSubscriptions: number
  totalRevenue?: number
}

export interface TimeSlot {
  start: Date
  end: Date
  available: boolean
}
