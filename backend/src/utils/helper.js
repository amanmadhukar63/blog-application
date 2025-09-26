
import jwt from 'jsonwebtoken';

// Response handler with JWT token support
function responseHandler(res, {msg, status, statusCode, data = null, error = null, token = null}) {
  const responseObj = {msg, status, statusCode};
  if (data) {
    responseObj.data = data;
  }
  if (error) {
    responseObj.error = error;
  }
  
  // Set JWT token as httpOnly cookie if provided
  if (token) {
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });
  }
  
  return res.status(statusCode).json(responseObj);
}

// Input validation helpers
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

const validateFullname = (fullname) => {
  return fullname && fullname.trim().length >= 2;
};

// Generate JWT token
// Note: Set JWT_SECRET in your .env file for production
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '24h'
  });
};

// Clear JWT token cookie (for logout)
const clearToken = (res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
};

export {
  responseHandler,
  validateEmail,
  validatePassword,
  validateFullname,
  generateToken,
  clearToken
};