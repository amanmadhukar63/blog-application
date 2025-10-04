import { getLocalStorage, setLocalStorage, validateEmail, validatePassword } from '../utils/helpers.js';
import { API_BASE_URL } from '../utils/config.js';
import { useGlobalContext } from '../context/GlobalContext.jsx';

export const useAuth = () => {

  const { setUser } = useGlobalContext();

  const login = async (email, password) => {
    try {

      if(validateEmail(email) === false) {
        return {
          status: 'error',
          msg: 'Please enter a valid email address.'
        }
      }

      if(validatePassword(password) === false) {
        return {
          status: 'error',
          msg: 'Password must be at least 6 characters long.'
        }
      }

      const response = await fetch(
        `${API_BASE_URL}/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        }
      );
      const data = await response.json();

      if(data.status === 'success') {
        setUser(data.data.user);
        setLocalStorage('user', data.data.user);
        setLocalStorage('token', data.token);
      }

      return data;
      
    } catch (error) {
      console.error('Login error:', error);
      return {
        status: 'error',
        msg: 'Login failed. Please try again.'
      }
    }
  };

  const signup = async (fullName, email, password) => {
    try {

      if(!fullName || fullName.trim().length === 0) {
        return {
          status: 'error',
          msg: 'Full name is required.'
        }
      }

      if(validateEmail(email) === false) {
        return {
          status: 'error',
          msg: 'Please enter a valid email address.'
        }
      }

      if(validatePassword(password) === false) {
        return {
          status: 'error',
          msg: 'Password must be at least 6 characters long.'
        }
      }

      const response = await fetch(
        `${API_BASE_URL}/auth/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            fullname: fullName,
            email,
            password 
          })
        }
      );
      const data = await response.json();

      if(data.status === 'success') {
        setUser(data.data.user);
        setLocalStorage('user', data.data.user);
        setLocalStorage('token', data.token);
      }

      return data;
      
    } catch (error) {
      console.error('Login error:', error);
      return {
        status: 'error',
        msg: 'Login failed. Please try again.'
      }
    }
  };

  const verifyToken = async () => {
    try {

      const response = await fetch(
        `${API_BASE_URL}/auth/verifyToken`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${getLocalStorage('token')}`
          }
        }
      );
      const data = await response.json();

      if(data.status === 'error') {
        await logout();
        return {
          status: 'error',
          msg: 'Verification failed. Please Login'
        };
      }

      return data;
      
    } catch (error) {
      console.error('Verification error:', error);
      await logout();
      return {
        status: 'error',
        msg: 'Verification failed. Please Login'
      }
    }
  };

  const logout = async () => {
    try {

      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');

      return {
        status: 'success',
        msg: 'Logged out successfully.'
      };

    } catch (error) {
      return {
        status: 'error',
        msg: 'Logout failed. Please try again.'
      }
    }
  };

  return {
    login,
    signup,
    logout,
    verifyToken
  };
};

