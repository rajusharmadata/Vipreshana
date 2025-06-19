import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://zvqdjuaslcaeizgtagjx.supabase.co'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2cWRqdWFzbGNhZWl6Z3RhZ2p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwNjIxNDksImV4cCI6MjA2NTYzODE0OX0.grkFwyT_4OXSMknGWG3ytxOUUbHhSuBD_y1rIsmNLo8'

// Debug logging
console.log('Initializing Supabase client with:')
console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Key (first 10 chars):', supabaseAnonKey.substring(0, 10) + '...')

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    redirectTo: window.location.origin + '/auth/callback',
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage
  },
})

// Test the connection and log the result
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Supabase auth event:', event)
})

// Backend API base URL 
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api'

// Log the API URL in use
console.log('Using API URL:', API_BASE_URL)

// For local development, check if we should use absolute or relative URLs
const isProduction = process.env.NODE_ENV === 'production'
const getApiUrl = (endpoint) => {
  // In production, use the full URL to the backend
  if (isProduction) {
    return `https://vipreshana-3.onrender.com/api/${endpoint}`.replace(/\/+/g, '/')
  }
  // In development, use the local API URL
  return `${API_BASE_URL}/${endpoint}`.replace(/\/+/g, '/')
}

// Google authentication
export const signInWithGoogle = async () => {
  try {
    console.log('Initiating Google sign in')
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/dashboard',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    })

    if (error) {
      console.error('Google sign in error:', error)
      return { success: false, error: error.message }
    }

    console.log('Google sign in initiated successfully', data)
    return { success: true, data }
  } catch (error) {
    console.error('Google sign in exception:', error)
    return { success: false, error: error.message }
  }
}

// Sign out
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('Sign out error:', error)
      return { success: false, error: error.message }
    }
    
    // Remove user data from local storage
    localStorage.removeItem('currentUser')
    return { success: true }
  } catch (error) {
    console.error('Sign out exception:', error)
    return { success: false, error: error.message }
  }
}

// Get current user
export const getCurrentUser = () => {
  // First check if we have a user in local storage
  const localUser = localStorage.getItem('currentUser')
  if (localUser) {
    return { user: JSON.parse(localUser) }
  }
  
  // Otherwise check Supabase (for Google auth)
  return supabase.auth.getUser()
}