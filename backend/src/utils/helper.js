
import jwt from 'jsonwebtoken';

function responseHandler(res, {msg, status, statusCode, data = null, error = null, token = null}) {
  const responseObj = {msg, status, statusCode};
  if (data) {
    responseObj.data = data;
  }
  if (error) {
    responseObj.error = error;
  }
  
  if (token) {
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000
    });
  }
  
  return res.status(statusCode).json(responseObj);
}

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

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '24h'
  });
};

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