import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { Sun, Moon, User, LogOut, BookOpen, Edit3, Menu, X } from 'lucide-react';
import Button from '../ui/Button';
import AuthModal from './AuthModal';

const Navbar = () => {
  const { user, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
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
                          {user?.fullName || user?.email}
                        </div>
                        <button
                          className="flex items-center w-full px-4 py-2 text-sm hover:bg-accent"
                        >
                          <BookOpen className="h-4 w-4 mr-2" />
                          My Blogs
                        </button>
                        <button
                          className="flex items-center w-full px-4 py-2 text-sm hover:bg-accent"
                        >
                          <Edit3 className="h-4 w-4 mr-2" />
                          Create Blog
                        </button>
                        <button
                          className="flex items-center w-full px-4 py-2 text-sm hover:bg-accent text-destructive"
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
