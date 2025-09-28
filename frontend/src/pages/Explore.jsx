import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, User, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { API_BASE_URL } from '../utils/config';
import { showToast, truncateText } from '../utils/helpers';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const Explore = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    const filtered = blogs.filter(blog =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.author.fullname.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBlogs(filtered);
  }, [searchTerm, blogs]);

  async function fetchBlogs(page=1) {
    try {
      setLoading(true);

      const blogsData = await fetch(
        `${API_BASE_URL}/blogs/all`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            page,
            limit: 12
          })
        }
      );
      const blogs = await blogsData.json();

      if(blogs.status === 'success') {
        setBlogs(blogs.data.blogs);
        setFilteredBlogs(blogs.data.blogs);
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading blogs...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Explore Blogs</h1>
        <p className="text-muted-foreground mb-6">
          Discover amazing stories and insights from our community of writers.
        </p>
        
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search blogs, authors, or topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredBlogs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            {searchTerm ? 'No blogs found matching your search.' : 'No blogs available yet.'}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((blog) => (
            <Card key={blog._id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video overflow-hidden">
                <img
                  src={blog.coverImage}
                  alt={blog.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-2 pb-2">{blog.title}</CardTitle>
                <CardDescription className="line-clamp-2 h-11">
                  {truncateText(blog.description)+truncateText(blog.description)+truncateText(blog.description)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {blog.author.fullname}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(blog.publishedOn).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Eye className="h-4 w-4 mr-1" />
                    {blog.viewCount} views
                  </div>
                </div>
                <Button className="w-full mt-4">
                  <Link to={`/blog/${blog._id}`}>
                    Read More
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <div className='flex my-8'>
        <button
          className="text-muted-foreground mx-2 disabled:opacity-40" 
          onClick={() => {
            fetchBlogs(pagination.currentPage - 1);
          }}
          disabled={!pagination.hasPrev}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
        </button>
        <p className="text-muted-foreground mx-2">
          {`${pagination.currentPage} / ${pagination.totalPages} Pages`}
        </p>
        <button
          className="text-muted-foreground mx-2 disabled:opacity-40" 
          onClick={() => {
            fetchBlogs(pagination.currentPage + 1);
          }}
          disabled={!pagination.hasNext}
        >
          <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Explore;


