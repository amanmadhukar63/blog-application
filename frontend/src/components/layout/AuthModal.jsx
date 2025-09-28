import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { showToast } from '../../utils/helpers';

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });
  const [loading, setLoading] = useState(false);
  
  const { login, signup } = useAuth();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      if (isLogin) {
        result = await login(formData.email, formData.password);
      } else {
        result = await signup(formData.email, formData.password, formData.fullName);
      }

      showToast(result.msg, result.status);

      if (result.status === 'success') {
        onClose();
        setFormData({ email: '', password: '', fullName: '' });
      }
    } catch (err) {
        showToast('Login Failed, Try Again', 'error');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ email: '', password: '', fullName: '' });
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={isLogin ? 'Login' : 'Sign Up'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium mb-2">
              Full Name
            </label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleInputChange}
              required={!isLogin}
              placeholder="Enter your full name"
            />
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2">
            Password
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            placeholder="Enter your password"
          />
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={loading}
        >
          {loading ? 'Loading...' : (isLogin ? 'Login' : 'Sign Up')}
        </Button>

        <div className="text-center">
          <button
            type="button"
            onClick={toggleMode}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {isLogin 
              ? "Don't have an account? Sign up" 
              : "Already have an account? Login"
            }
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AuthModal;

