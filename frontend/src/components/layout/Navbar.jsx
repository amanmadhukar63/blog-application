import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { Sun, Moon, User, LogOut, BookOpen, Edit3, Menu, X } from 'lucide-react';
import Button from '../ui/Button';
import AuthModal from './AuthModal';
import { showToast } from '../../utils/helpers';
import { useGlobalContext } from '../../context/GlobalContext';

const Navbar = () => {
  const { logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showInfo, setShowInfo] = useState(true);

  const { user, isAuthenticated } = useGlobalContext();

  const navigate = useNavigate();

  async function handleLogout() {
    try {
      const result = await logout();

      if(result.status === 'success') {
        navigate('/');
        setIsUserMenuOpen(false);
      }

      showToast(result.msg, result.status);

    } catch (error) {
      showToast('Logout Failed, Try Again', 'error');
    }
  }

  return (
    <>
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        {showInfo && (
          <div className='px-4 text-foreground/60 text-sm bg-yellow-100 flex justify-between items-center'>
            <p className='text-black'>The first request may take a few moments to respond, due to backend inactivity.</p>
            <button onClick={() => setShowInfo(false)} className='p-2 hover:bg-yellow-200 rounded-md'>x</button>
          </div>
        )}
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className='flex items-center space-x-2'>
              <div className="md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </Button>
              </div>
              <Link to="/" className="flex items-center space-x-2">
                <BookOpen className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold">BlogApp</span>
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <Link 
                to="/explore" 
                className="text-foreground/60 hover:text-foreground transition-colors"
              >
                Explore
              </Link>
              
              {isAuthenticated && (
                <>
                  <Link 
                    to="/my-blogs" 
                    className="text-foreground/60 hover:text-foreground transition-colors"
                  >
                    My Blogs
                  </Link>
                  <Link 
                    to="/create-blog" 
                    className="text-foreground/60 hover:text-foreground transition-colors"
                  >
                    Create Blog
                  </Link>
                </>
              )}
            </div>

            

            <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="h-9 w-9"
                >
                  {isDark ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </Button>

              {isAuthenticated ? (
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="h-9 w-9"
                  >
                    <User className="h-4 w-4" />
                  </Button>
                  
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-md shadow-lg z-50">
                      <div className="py-1">
                        <div className="px-4 py-2 text-sm text-muted-foreground border-b border-border">
                          {user?.fullname || user?.email}
                        </div>
                        <button
                          className="flex items-center w-full px-4 py-2 text-sm hover:bg-accent"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Link to="/my-blogs" className='flex items-center'>
                            <BookOpen className="h-4 w-4 mr-2" />
                            My Blogs
                          </Link>
                        </button>
                        <button
                          className="flex items-center w-full px-4 py-2 text-sm hover:bg-accent"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Link to="/create-blog" className='flex items-center'>
                            <Edit3 className="h-4 w-4 mr-2" />
                            Create Blog
                          </Link>
                        </button>
                        <button
                          className="flex items-center w-full px-4 py-2 text-sm hover:bg-accent text-destructive"
                          onClick={handleLogout}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Button onClick={() => setIsAuthModalOpen(true)}>
                  Login / Signup
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container mx-auto px-4 py-4">
            <div className="space-y-2">
              <Link 
                to="/explore" 
                className="block px-4 py-2 text-foreground/60 hover:text-foreground hover:bg-accent rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Explore
              </Link>
              
              {isAuthenticated && (
                <>
                  <Link 
                    to="/my-blogs" 
                    className="block px-4 py-2 text-foreground/60 hover:text-foreground hover:bg-accent rounded-md transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Blogs
                  </Link>
                  <Link 
                    to="/create-blog" 
                    className="block px-4 py-2 text-foreground/60 hover:text-foreground hover:bg-accent rounded-md transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Create Blog
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {isUserMenuOpen && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}

      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-30 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
