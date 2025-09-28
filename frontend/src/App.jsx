import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Explore from './pages/Explore';
import MyBlogs from './pages/MyBlogs';
import BlogDetail from './pages/BlogDetail';
import CreateBlog from './pages/CreateBlog';
import EditBlog from './pages/EditBlog';
import { Toaster } from 'react-hot-toast';
import { GlobalContextProvider } from './context/GlobalContext.jsx';

function App() {
  return (
    <GlobalContextProvider>
      <Router>
        <div className="min-h-screen bg-background text-foreground">
          <Navbar />
          <Toaster />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/blog/:id" element={<BlogDetail />} />
              
              <Route 
                path="/my-blogs" 
                element={
                  <ProtectedRoute>
                    <MyBlogs />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/create-blog" 
                element={
                  <ProtectedRoute>
                    <CreateBlog />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/edit-blog/:id" 
                element={
                  <ProtectedRoute>
                    <EditBlog />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
        </div>
      </Router>
    </GlobalContextProvider>
  );
}

export default App;
