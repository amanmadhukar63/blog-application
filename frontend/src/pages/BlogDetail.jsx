import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, Eye, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { getInitials } from '../utils/helpers';
import { API_BASE_URL } from '../utils/config';

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if(id) getBlogData(id);
  }, [id]);

  async function getBlogData(id){
    try {
      setLoading(true);

      const blogData = await fetch(
        `${API_BASE_URL}/blogs/${id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      const blog = await blogData.json();

      if(blog.status === 'success') {
        setBlog(blog.data.blog);
      }
      else {
        console.error('Failed to fetch blogs:', {blogs});
        setError('Blog not found');
      }
      setLoading(false);
      
    } catch (error) {
      setLoading(false);
      console.error('Error, while fetch blog by id',error);
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading blog...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Blog Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The blog you're looking for doesn't exist or has been removed.
          </p>
          <Button>
            <Link to="/explore">Back to Explore</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost">
          <Link to="/explore" className='flex items-center'>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Explore
          </Link>
        </Button>
      </div>

      <div className="mb-8">
        <div className="aspect-video overflow-hidden rounded-lg mb-6">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>
        
        <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
        <p className="text-xl text-muted-foreground mb-6">{blog.description}</p>
        
        <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            {blog.author.fullname}
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            {new Date(blog.publishedOn).toLocaleDateString()}
          </div>
          <div className="flex items-center">
            <Eye className="h-4 w-4 mr-2" />
            {blog.viewCount} views
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-8">
          <div 
            className="prose prose-lg max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg mr-4">
              {getInitials(blog.author.fullname)}
            </div>
            <div>
              <h3 className="font-semibold">{blog.author.fullname}</h3>
              <p className="text-muted-foreground">Author</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogDetail;


