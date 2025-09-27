import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { responseHandler } from '../utils/helper.js';

export const authenticateToken = async (req, res, next) => {
  try {

    let token = req.cookies.token;

    if (!token) {
      return responseHandler(res, {
        msg: "Access denied. No token provided.",
        status: "error",
        statusCode: 401,
        error: "Authentication required"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return responseHandler(res, {
        msg: "Invalid token. User not found.",
        status: "error",
        statusCode: 401,
        error: "Authentication failed"
      });
    }

    req.user = user;
    next();

  } catch (error) {
    console.error("Auth middleware error:", error);
    
    if (error.name === 'JsonWebTokenError') {
      return responseHandler(res, {
        msg: "Invalid token.",
        status: "error",
        statusCode: 401,
        error: "Authentication failed"
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return responseHandler(res, {
        msg: "Token expired. Please login again.",
        status: "error",
        statusCode: 401,
        error: "Token expired"
      });
    }

    return responseHandler(res, {
      msg: "Authentication failed.",
      status: "error",
      statusCode: 401,
      error: "Invalid token"
    });
  }
};
