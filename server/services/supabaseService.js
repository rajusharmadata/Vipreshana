const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Supabase configuration
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Logging configuration details
console.log('Supabase Config Check:', {
  hasUrl: supabaseUrl ? 'Yes' : 'No',
  hasAnonKey: supabaseAnonKey ? 'Yes' : 'No',
  isConfigComplete: supabaseUrl && supabaseAnonKey ? 'Yes' : 'No'
});

// Initialize Supabase client
let supabase;
try {
  if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('✅ Supabase client initialized successfully');
  } else {
    console.log('⚠️ Supabase client not initialized - missing credentials');
  }
} catch (error) {
  console.error('❌ Failed to initialize Supabase client:', error.message);
}

/**
 * Sign up a new user with email and password
 */
const signUpWithEmail = async (email, password) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized. Check your credentials.');
    }

    console.log(`🔐 Attempting to sign up user with email: ${email}`);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error('❌ Supabase signup error:', error.message);
      return { success: false, error: error.message };
    }

    console.log('✅ User signed up successfully:', data.user.id);
    return { 
      success: true, 
      user: data.user,
      message: 'User registered successfully. Please check your email for confirmation.'
    };
  } catch (error) {
    console.error('❌ Error in signUpWithEmail:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Sign in a user with email and password
 */
const signInWithEmail = async (email, password) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized. Check your credentials.');
    }

    console.log(`🔑 Attempting to sign in user with email: ${email}`);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('❌ Supabase signin error:', error.message);
      return { success: false, error: error.message };
    }

    console.log('✅ User signed in successfully:', data.user.id);
    return { 
      success: true, 
      user: data.user,
      session: data.session,
      message: 'Login successful'
    };
  } catch (error) {
    console.error('❌ Error in signInWithEmail:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Sign in with Google OAuth
 */
const signInWithGoogle = async () => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized. Check your credentials.');
    }

    console.log('🔑 Initiating Google OAuth sign in');
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.REACT_APP_CLIENT_URL || 'http://localhost:3000'}/auth/callback`
      }
    });

    if (error) {
      console.error('❌ Supabase Google OAuth error:', error.message);
      return { success: false, error: error.message };
    }

    // For OAuth, we return the URL to redirect to
    console.log('✅ Google OAuth flow initiated');
    return { 
      success: true,
      url: data.url,
      message: 'Please complete authentication in the browser'
    };
  } catch (error) {
    console.error('❌ Error in signInWithGoogle:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Sign out a user
 */
const signOut = async () => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized. Check your credentials.');
    }

    console.log('🚪 Signing out user');
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('❌ Supabase signout error:', error.message);
      return { success: false, error: error.message };
    }

    console.log('✅ User signed out successfully');
    return { 
      success: true,
      message: 'Signed out successfully'
    };
  } catch (error) {
    console.error('❌ Error in signOut:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send a password reset email
 */
const resetPassword = async (email) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized. Check your credentials.');
    }

    console.log(`🔄 Sending password reset email to: ${email}`);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.REACT_APP_CLIENT_URL || 'http://localhost:3000'}/reset-password`,
    });

    if (error) {
      console.error('❌ Supabase password reset error:', error.message);
      return { success: false, error: error.message };
    }

    console.log('✅ Password reset email sent successfully');
    return { 
      success: true,
      message: 'Password reset instructions sent to your email'
    };
  } catch (error) {
    console.error('❌ Error in resetPassword:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get the current user session
 */
const getCurrentUser = async () => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized. Check your credentials.');
    }

    console.log('🔍 Getting current user session');
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error('❌ Error getting session:', error.message);
      return { success: false, error: error.message };
    }

    if (!data.session) {
      console.log('ℹ️ No active session found');
      return { success: false, message: 'No active session' };
    }

    console.log('✅ Active session found for user:', data.session.user.id);
    return { 
      success: true,
      session: data.session,
      user: data.session.user
    };
  } catch (error) {
    console.error('❌ Error in getCurrentUser:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  signOut,
  resetPassword,
  getCurrentUser,
  supabase // Export for direct access if needed
}; 