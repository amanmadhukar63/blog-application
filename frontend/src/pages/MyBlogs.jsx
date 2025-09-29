import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Eye, EyeOff, Calendar, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { getLocalStorage, showToast, truncateText } from '../utils/helpers';
import { API_BASE_URL } from '../utils/config';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const MyBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('published');
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  async function fetchBlogs(page=1, published=true) {
    try {
      setLoading(true);

      const blogsData = await fetch(
        `${API_BASE_URL}/blogs/my-blogs`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${getLocalStorage('token')}`
          },
          body: JSON.stringify({
            page,
            limit: 12,
            published
          })
        }
      );
      const blogs = await blogsData.json();

      if(blogs.status === 'success') {
        setBlogs(blogs.data.blogs);
        setPagination(blogs.data.pagination);
      }
      else {
        console.error('Failed to fetch blogs:', {blogs});
        showToast('Failed to fetch blogs', 'error');
      }
      setLoading(false);
      
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setLoading(false);
    }
  }

  const handleDelete = async (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        
        const deleteResponse = await fetch(
          `${API_BASE_URL}/blogs/${blogId}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'authorization': `Bearer ${getLocalStorage('token')}`
            }
          } 
        );
        const deleteResult = await deleteResponse.json();

        showToast(deleteResult.msg, deleteResult.status);

        if (deleteResult.status === 'success') {
          setBlogs(blogs.filter(blog => blog._id !== blogId));
        }

      } catch (error) {
        showToast('Failed to delete blog. Please try again.', 'error');
        console.error('Error deleting blog:', error);
      }
    }
  };

  const handleTogglePublish = async (blogId) => {
    try {
        
      const toggleResponse = await fetch(
        `${API_BASE_URL}/blogs/toggle-publish/${blogId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${getLocalStorage('token')}`
          }
        } 
      );
      const toggleResult = await toggleResponse.json();

      showToast(toggleResult.msg, toggleResult.status);

      if (toggleResult.status === 'success') {
        setBlogs(blogs.filter(blog => blog._id !== blogId));
      }

    } catch (error) {
      showToast(`Failed to ${activeTab==='published' ? 'Unpublish' : 'Publish'} blog. Please try again.`, 'error');
      console.error('Error toggle publish blog:', error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your blogs...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">My Blogs</h1>
        <p className="text-muted-foreground mb-6">
          Manage your published blogs and drafts.
        </p>
        
        <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
          <button
            onClick={() => {
              if(activeTab !== 'published') fetchBlogs(1, true);
              setActiveTab('published');
            }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'published'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Published
          </button>
          <button
            onClick={() => {
              if(activeTab !== 'drafts') fetchBlogs(1, false);
              setActiveTab('drafts');
            }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'drafts'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Drafts
          </button>
        </div>
      </div>

      <div className="mb-8">
        <Button>
          <Link to="/create-blog">
            Create New Blog
          </Link>
        </Button>
      </div>
      {
        blogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">
              {activeTab === 'published' ? "You haven't published any blogs yet." : "You don't have any draft blogs."}
            </p>
            <Button>
              <Link to="/create-blog">{activeTab === 'published' ? "Create Your First Blog" : "Create a New Draft"}</Link>
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <Card key={blog._id} className="overflow-hidden">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={blog.coverImage}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-2 pb-2">{blog.title}</CardTitle>
                  <CardDescription className="line-clamp-2 h-11">
                    {truncateText(blog.description)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      { activeTab==="drafts" ? "- -" : new Date(blog.publishedOn).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      {blog.viewCount} views
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Link to={`/blog/${blog._id}`}>
                        View
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Link to={`/edit-blog/${blog._id}`} className='flex items-center justify-center'>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTogglePublish(blog._id)}
                    >
                      { activeTab==="drafts" ? <Eye className='h-4 w-4' /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(blog._id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )
      }
      <div className='flex my-8'>
        <button
          className="text-muted-foreground mx-2 disabled:opacity-40" 
          onClick={() => {
            fetchBlogs(pagination.currentPage - 1, activeTab === 'published');
          }}
          disabled={!pagination?.hasPrev}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
        </button>
        <p className="text-muted-foreground mx-2">
          {`${pagination?.currentPage} / ${pagination?.totalPages} Pages`}
        </p>
        <button
          className="text-muted-foreground mx-2 disabled:opacity-40" 
          onClick={() => {
            fetchBlogs(pagination?.currentPage + 1, activeTab === 'published');
          }}
          disabled={!pagination?.hasNext}
        >
          <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default MyBlogs;

