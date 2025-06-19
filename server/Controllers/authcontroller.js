const supabaseService = require('../services/supabaseservice');

/**
 * Register a new user with email and password
 */
const registerUser = async (req, res) => {
  try {
    console.log('Register user request received:', req.body);
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }
    
    // Password validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }
    
    // Email validation (simple regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }
    
    const result = await supabaseService.signUpWithEmail(email, password);
    
    if (result.success) {
      return res.status(201).json({
        success: true,
        message: result.message,
        user: {
          id: result.user.id,
          email: result.user.email
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        message: result.error
      });
    }
    
  } catch (error) {
    console.error('Error in registerUser controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while registering user',
      error: error.message
    });
  }
};

/**
 * Login user with email and password
 */
const loginUser = async (req, res) => {
  try {
    console.log('Login user request received:', req.body);
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }
    
    const result = await supabaseService.signInWithEmail(email, password);
    
    if (result.success) {
      // Set secure cookie with session token
      res.cookie('sb-auth-token', result.session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
      
      return res.status(200).json({
        success: true,
        message: result.message,
        user: {
          id: result.user.id,
          email: result.user.email
        }
      });
    } else {
      return res.status(401).json({
        success: false,
        message: result.error || 'Invalid credentials'
      });
    }
    
  } catch (error) {
    console.error('Error in loginUser controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while logging in',
      error: error.message
    });
  }
};

/**
 * Initiate Google OAuth login
 */
const googleLogin = async (req, res) => {
  try {
    console.log('Google login request received');
    
    const result = await supabaseService.signInWithGoogle();
    
    if (result.success) {
      return res.status(200).json({
        success: true,
        url: result.url
      });
    } else {
      return res.status(400).json({
        success: false,
        message: result.error
      });
    }
    
  } catch (error) {
    console.error('Error in googleLogin controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while initiating Google login',
      error: error.message
    });
  }
};

/**
 * Logout user
 */
const logoutUser = async (req, res) => {
  try {
    console.log('Logout request received');
    
    const result = await supabaseService.signOut();
    
    // Clear auth cookie
    res.clearCookie('sb-auth-token');
    
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
    
  } catch (error) {
    console.error('Error in logoutUser controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while logging out',
      error: error.message
    });
  }
};

/**
 * Reset password
 */
const resetPassword = async (req, res) => {
  try {
    console.log('Reset password request received:', req.body);
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    
    const result = await supabaseService.resetPassword(email);
    
    if (result.success) {
      return res.status(200).json({
        success: true,
        message: result.message
      });
    } else {
      return res.status(400).json({
        success: false,
        message: result.error
      });
    }
    
  } catch (error) {
    console.error('Error in resetPassword controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while requesting password reset',
      error: error.message
    });
  }
};

/**
 * Get current user
 */
const getCurrentUser = async (req, res) => {
  try {
    console.log('Get current user request received');
    
    const result = await supabaseService.getCurrentUser();
    
    if (result.success) {
      return res.status(200).json({
        success: true,
        user: {
          id: result.user.id,
          email: result.user.email
        }
      });
    } else {
      return res.status(401).json({
        success: false,
        message: result.message || result.error || 'Not authenticated'
      });
    }
    
  } catch (error) {
    console.error('Error in getCurrentUser controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while fetching current user',
      error: error.message
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  googleLogin,
  logoutUser,
  resetPassword,
  getCurrentUser
}; 