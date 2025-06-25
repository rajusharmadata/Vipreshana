import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://zvqdjuaslcaeizgtagjx.supabase.co'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2cWRqdWFzbGNhZWl6Z3RhZ2p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwNjIxNDksImV4cCI6MjA2NTYzODE0OX0.grkFwyT_4OXSMknGWG3ytxOUUbHhSuBD_y1rIsmNLo8'

// Debug logging
console.log('Initializing Supabase client with:')
console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Key (first 10 chars):', supabaseAnonKey.substring(0, 10) + '...')

// Clean URL of any tokens for security
const cleanUrlOfTokens = () => {
  // Always clean URL regardless of path to ensure no tokens are ever exposed
  const currentUrl = window.location.toString();
  
  // Check for any sensitive tokens in the URL
  const hasSensitiveData = 
    currentUrl.includes('access_token') || 
    currentUrl.includes('refresh_token') ||
    currentUrl.includes('id_token') ||
    currentUrl.includes('token=') ||
    currentUrl.includes('authorization=') ||
    currentUrl.includes('auth=');
  
  // Handle auth callback paths specially
  if (window.location.pathname.includes('/auth/')) {
    // For auth callbacks, always redirect to logindashboard without exposing tokens
    window.history.replaceState(null, document.title, '/logindashboard');
    console.log('Auth callback URL cleaned and redirected to logindashboard');
    return;
  }
  
  // For any other page with tokens, just remove the query/hash part
  if (hasSensitiveData || window.location.hash || window.location.search) {
    window.history.replaceState(null, document.title, window.location.pathname);
    console.log('URL cleaned of sensitive data');
  }
};

// Clean URL before initializing Supabase
cleanUrlOfTokens();

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    redirectTo: window.location.origin + '/auth/callback',
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
    // Use secure cookie settings when possible
    cookieOptions: {
      secure: window.location.protocol === 'https:',
      sameSite: 'Lax'
    }
  },
})

// Test the connection and log the result
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Supabase auth event:', event)
  // Clean URL when auth state changes
  cleanUrlOfTokens();
})

// Backend API base URL 
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api'

// Log the API URL in use
console.log('Using API URL:', API_BASE_URL)

// For local development, check if we should use absolute or relative URLs
const isProduction = process.env.NODE_ENV === 'production'
// eslint-disable-next-line no-unused-vars
const getApiUrl = (endpoint) => {
  // In production, use the full URL to the backend
  if (isProduction) {
    return `https://vipreshana-3.onrender.com/api/${endpoint}`.replace(/\/+/g, '/')
  }
  // In development, use the local API URL
  return `${API_BASE_URL}/${endpoint}`.replace(/\/+/g, '/')
}

// Google authentication with enhanced security
export const signInWithGoogle = async () => {
  try {
    console.log('Initiating Google sign in')
    
    // Clean any existing tokens from URL before starting auth flow
    cleanUrlOfTokens();
    
    // Generate a unique state parameter for CSRF protection
    const stateParam = `security-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    
    // Store the state temporarily in sessionStorage to verify on return
    sessionStorage.setItem('oauth_state', stateParam);
    
    // Determine the redirect URL based on environment
    const redirectUrl = window.location.hostname.includes('vipreshana-2.vercel.app') 
      ? 'https://vipreshana-2.vercel.app/auth/callback'
      : window.location.origin + '/auth/callback';
      
    console.log('Using redirect URL for Google auth:', redirectUrl);
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        skipBrowserRedirect: false, // Ensure we use the proper redirect flow
        flowType: 'pkce', // Use PKCE flow for better security
        scopes: 'email profile', // Limit scope to just what we need
        state: stateParam, // Use state parameter for CSRF protection
      }
    })

    if (error) {
      console.error('Google sign in error:', error)
      return { success: false, error: error.message }
    }

    console.log('Google sign in initiated successfully')
    
    // Set up a security check to clean URL after redirect
    setTimeout(cleanUrlOfTokens, 100);
    setTimeout(cleanUrlOfTokens, 1000);
    
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

// Make supabase client available in global scope for testing and diagnostics
if (typeof window !== 'undefined') {
  window.supabase = supabase;
  
  // Add diagnostic functions to global scope
  window.vipreshanaAuth = {
    // Test authentication state detection
    testAuthDetection: () => {
      console.log('🧪 Testing authentication state detection...');
      
      // Check localStorage
      const localUser = localStorage.getItem('user');
      console.log('📦 User in localStorage:', localUser ? JSON.parse(localUser) : 'Not found');
      
      // Check Supabase session
      supabase.auth.getSession().then(({ data, error }) => {
        if (error) {
          console.error('❌ Error getting Supabase session:', error);
        } else {
          console.log('🔐 Supabase session:', data.session ? 'Active' : 'None');
          if (data.session) {
            console.log('👤 User:', data.session.user.email);
            console.log('⏰ Session expires:', new Date(data.session.expires_at * 1000).toLocaleString());
          }
        }
      });
      
      // Check if auth events are working
      window.addEventListener('authChange', (event) => {
        console.log('🔔 Auth change event received:', event.detail);
      });
      
      // Dispatch a test event
      console.log('📣 Dispatching test auth event...');
      window.dispatchEvent(new CustomEvent('authChange', { 
        detail: { isAuthenticated: true, user: { id: 'test', email: 'test@example.com' } } 
      }));
    },
    
    // Test token refresh
    testTokenRefresh: async () => {
      console.log('🧪 Testing token refresh...');
      
      try {
        const { data, error } = await supabase.auth.refreshSession();
        
        if (error) {
          console.error('❌ Error refreshing token:', error);
        } else if (data?.session) {
          console.log('✅ Token refreshed successfully');
          console.log('📊 Session expires at:', new Date(data.session.expires_at * 1000).toLocaleString());
        } else {
          console.warn('⚠️ No session returned, but no error either');
        }
      } catch (err) {
        console.error('❌ Exception during token refresh:', err);
      }
    },
    
    // Check auth configuration
    checkAuthConfig: () => {
      console.log('🧪 Checking auth configuration...');
      
      // Check environment
      const isProduction = window.location.hostname !== 'localhost' && 
                          !window.location.hostname.includes('127.0.0.1');
      console.log(`🌐 Environment: ${isProduction ? 'Production' : 'Development'}`);
      
      // Check Supabase URL
      console.log('🔗 Supabase URL:', supabaseUrl);
      
      // Check callback URL
      const callbackUrl = isProduction 
        ? 'https://vipreshana-2.vercel.app/auth/callback' 
        : window.location.origin + '/auth/callback';
      console.log('🔙 Auth callback URL:', callbackUrl);
      
      // Check for URL parameters that might indicate auth issues
      if (window.location.hash || window.location.search) {
        console.warn('⚠️ URL contains hash or search parameters that might be auth-related');
        console.log('📝 URL:', window.location.href);
      }
    }
  };
  
  console.log('✅ Auth diagnostics available via window.vipreshanaAuth');
}