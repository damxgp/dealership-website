"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"

// Types
export interface Car {
  id: string
  make: string
  model: string
  year: number
  price: number
  type: "sale" | "rental"
  mileage: string
  fuel: string
  seats: number
  inStock: boolean
  featured: boolean
  selling: boolean
  image: string
  images?: string[]
  description: string
  dailyRate?: number
  weeklyRate?: number
  monthlyRate?: number
  available?: boolean
  // Additional car details
  bodyType?: string
  condition?: string
  engineSize?: string
  doors?: number
  cylinders?: number
  color?: string
  vin?: string
  transmission?: string
  driveType?: string
  features?: {
    interior: string[]
    exterior: string[]
    comfort: string[]
    safety: string[]
  }
  paymentOptions?: string[]
  warranty?: string[]
}

export interface Booking {
  id: string
  type: "meeting" | "rental"
  customerName: string
  customerEmail: string
  customerPhone?: string
  bookingDate: string
  bookingTime?: string
  purpose?: string
  carId?: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  notes?: string
  createdAt: string
}

export interface FAQ {
  id: string
  question: string
  answer: string
  displayOrder: number
  active: boolean
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  message: string
  status: "unread" | "read" | "replied"
  createdAt: string
}

export interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
}

export interface Settings {
  dealershipName: string
  contactEmail: string
  contactPhone: string
  address: string
  rentalEnabled: boolean
  theme: "modern" | "classic" | "bold" | "red-black" | "custom"
  customColors?: ThemeColors
  homeLayout: "layout1" | "layout2" | "layout3"
  businessHours: string
  logo?: string
}

interface AppState {
  cars: Car[]
  bookings: Booking[]
  faqs: FAQ[]
  contactMessages: ContactMessage[]
  settings: Settings
  loading: boolean
  isInitialized: boolean
}

type AppAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_INITIALIZED"; payload: boolean }
  | { type: "ADD_CAR"; payload: Car }
  | { type: "UPDATE_CAR"; payload: Car }
  | { type: "DELETE_CAR"; payload: string }
  | { type: "ADD_BOOKING"; payload: Booking }
  | { type: "UPDATE_BOOKING"; payload: Booking }
  | { type: "DELETE_BOOKING"; payload: string }
  | { type: "ADD_FAQ"; payload: FAQ }
  | { type: "UPDATE_FAQ"; payload: FAQ }
  | { type: "DELETE_FAQ"; payload: string }
  | { type: "ADD_CONTACT_MESSAGE"; payload: ContactMessage }
  | { type: "UPDATE_CONTACT_MESSAGE"; payload: ContactMessage }
  | { type: "UPDATE_SETTINGS"; payload: Partial<Settings> }
  | { type: "LOAD_DATA"; payload: Partial<AppState> }

const initialState: AppState = {
  cars: [],
  bookings: [],
  faqs: [],
  contactMessages: [],
  settings: {
    dealershipName: "Combe's Car Center",
    contactEmail: "combecarcenternv@gmail.com",
    contactPhone: "(597) 520-385",
    address: "Grote Combeweg, Paramaribo, Suriname",
    rentalEnabled: true,
    theme: "red-black",
    homeLayout: "layout1",
    businessHours: "Mon-Fri: 8:00 AM - 4:30 PM, Saturday: 8:00 AM - 4:30 PM, Sunday: Closed",
    logo: undefined,
  },
  loading: false,
  isInitialized: false,
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload }
    case "SET_INITIALIZED":
      return { ...state, isInitialized: action.payload }
    case "ADD_CAR":
      return { ...state, cars: [...state.cars, action.payload] }
    case "UPDATE_CAR":
      return {
        ...state,
        cars: state.cars.map((car) => (car.id === action.payload.id ? action.payload : car)),
      }
    case "DELETE_CAR":
      return { ...state, cars: state.cars.filter((car) => car.id !== action.payload) }
    case "ADD_BOOKING":
      return { ...state, bookings: [...state.bookings, action.payload] }
    case "UPDATE_BOOKING":
      return {
        ...state,
        bookings: state.bookings.map((booking) => (booking.id === action.payload.id ? action.payload : booking)),
      }
    case "DELETE_BOOKING":
      return { ...state, bookings: state.bookings.filter((booking) => booking.id !== action.payload) }
    case "ADD_FAQ":
      return { ...state, faqs: [...state.faqs, action.payload] }
    case "UPDATE_FAQ":
      return {
        ...state,
        faqs: state.faqs.map((faq) => (faq.id === action.payload.id ? action.payload : faq)),
      }
    case "DELETE_FAQ":
      return { ...state, faqs: state.faqs.filter((faq) => faq.id !== action.payload) }
    case "ADD_CONTACT_MESSAGE":
      return { ...state, contactMessages: [...state.contactMessages, action.payload] }
    case "UPDATE_CONTACT_MESSAGE":
      return {
        ...state,
        contactMessages: state.contactMessages.map((msg) => (msg.id === action.payload.id ? action.payload : msg)),
      }
    case "UPDATE_SETTINGS":
      return { ...state, settings: { ...state.settings, ...action.payload } }
    case "LOAD_DATA":
      return { ...state, ...action.payload }
    default:
      return state
  }
}

const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<AppAction>
} | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  useEffect(() => {
    // Load data from database on app start
    const loadData = async () => {
      try {
        dispatch({ type: "SET_LOADING", payload: true })

        // Check if database is initialized
        const response = await fetch("/api/init")
        const { initialized } = await response.json()

        if (initialized) {
          // Load all data from database
          const [carsRes, bookingsRes, faqsRes, settingsRes] = await Promise.all([
            fetch("/api/cars"),
            fetch("/api/bookings"),
            fetch("/api/faqs"),
            fetch("/api/settings"),
          ])

          const [cars, bookings, faqs, settings] = await Promise.all([
            carsRes.json(),
            bookingsRes.json(),
            faqsRes.json(),
            settingsRes.json(),
          ])

          dispatch({
            type: "LOAD_DATA",
            payload: {
              cars: cars.data || [],
              bookings: bookings.data || [],
              faqs: faqs.data || [],
              settings: { ...state.settings, ...settings.data },
              isInitialized: true,
            },
          })
        }
      } catch (error) {
        console.error("Failed to load data:", error)
      } finally {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    }

    loadData()
  }, [])

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>
}

export function useAppStore() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useAppStore must be used within an AppProvider")
  }
  return context
}
