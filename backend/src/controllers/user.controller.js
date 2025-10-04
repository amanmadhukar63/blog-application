import User from "../models/user.model.js";
import { 
  responseHandler, 
  validateEmail, 
  validatePassword, 
  validateFullname, 
  generateToken
} from "../utils/helper.js";

async function signup(req, res) {
  try {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
      return responseHandler(res, {
        msg: "All fields are required",
        status: "error",
        statusCode: 400,
        error: "Missing required fields"
      });
    }

    if (!validateFullname(fullname)) {
      return responseHandler(res, {
        msg: "Full name must be at least 2 characters long",
        status: "error",
        statusCode: 400,
        error: "Invalid full name"
      });
    }

    if (!validateEmail(email)) {
      return responseHandler(res, {
        msg: "Please provide a valid email address",
        status: "error",
        statusCode: 400,
        error: "Invalid email format"
      });
    }

    if (!validatePassword(password)) {
      return responseHandler(res, {
        msg: "Password must be at least 6 characters long",
        status: "error",
        statusCode: 400,
        error: "Invalid password"
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return responseHandler(res, {
        msg: "User with this email already exists",
        status: "error",
        statusCode: 409,
        error: "Email already registered"
      });
    }

    const user = await User.create({
      fullname: fullname.trim(),
      email: email.toLowerCase().trim(),
      password
    });

    const token = generateToken(user._id);

    return responseHandler(res, {
      msg: "User registered successfully",
      status: "success",
      statusCode: 201,
      data: {
        user: {
          id: user._id,
          fullname: user.fullname,
          email: user.email
        }
      },
      token
    });

  } catch (error) {
    console.error("Signup error:", error);
    return responseHandler(res, {
      msg: "Internal server error",
      status: "error",
      statusCode: 500,
      error: "Something went wrong during registration"
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return responseHandler(res, {
        msg: "Email and password are required",
        status: "error",
        statusCode: 400,
        error: "Missing required fields"
      });
    }

    if (!validateEmail(email)) {
      return responseHandler(res, {
        msg: "Please provide a valid email address",
        status: "error",
        statusCode: 400,
        error: "Invalid email format"
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return responseHandler(res, {
        msg: "User not found, please sign up",
        status: "error",
        statusCode: 401,
        error: "Authentication failed"
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return responseHandler(res, {
        msg: "Invalid Password",
        status: "error",
        statusCode: 401,
        error: "Authentication failed"
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Return success response with token
    return responseHandler(res, {
      msg: "Login successful",
      status: "success",
      statusCode: 200,
      data: {
        user: {
          id: user._id,
          fullname: user.fullname,
          email: user.email
        }
      },
      token
    });

  } catch (error) {
    console.error("Login error:", error);
    return responseHandler(res, {
      msg: "Internal server error",
      status: "error",
      statusCode: 500,
      error: "Something went wrong during login"
    });
  }
}

async function logout(req, res) {
  try {
    
    return responseHandler(res, {
      msg: "Logout successful",
      status: "success",
      statusCode: 200,
      data: {
        message: "User logged out successfully"
      }
    });

  } catch (error) {
    console.error("Logout error:", error);
    return responseHandler(res, {
      msg: "Internal server error",
      status: "error",
      statusCode: 500,
      error: "Something went wrong during logout"
    });
  }
}

async function verifyToken(req, res) {
  try {
    
    return responseHandler(res, {
      msg: "Token verified successful",
      status: "success",
      statusCode: 200,
      data: {
        message: "Token is valid"
      }
    });

  } catch (error) {
    console.error("Token verification error:", error);
    return responseHandler(res, {
      msg: "Internal server error",
      status: "error",
      statusCode: 500,
      error: "Something went wrong during verification"
    });
  }
}

export {
  login,
  signup,
  logout,
  verifyToken
};