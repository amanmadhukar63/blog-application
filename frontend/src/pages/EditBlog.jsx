import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, Trash2, Upload, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { API_BASE_URL } from '../utils/config';
import { getLocalStorage, showToast } from '../utils/helpers';

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    coverImageUrl: '',
    published: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [uploading, setUploading] = useState(false);

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
        setFormData({
          title: blog.data.blog.title,
          description: blog.data.blog.description,
          content: blog.data.blog.content,
          coverImageUrl: blog.data.blog.coverImage,
          published: blog.data.blog.published
        });
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${getLocalStorage('token')}`
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();

      showToast(data.msg, data.status);

    } catch (error) {
      console.error('Error updating blog:', error);
      showToast('Failed to update blog. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
      try {
        const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        const data = await response.json();

        showToast(data.msg, data.status);

        if (data.status === 'success') {
          navigate('/my-blogs');
        }
      } catch (error) {
        console.error('Error deleting blog:', error);
        showToast('Failed to delete blog. Please try again.', 'error');
      }
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append('coverImage', file);

      const response = await fetch(`${API_BASE_URL}/upload/image`, {
        method: 'POST',
        headers: {
          'authorization': `Bearer ${getLocalStorage('token')}`
        },
        body: form
      });
      const data = await response.json();

      showToast(data.msg, data.status);
      if (data.status == 'success') {
        setFormData(prev => ({ ...prev, coverImageUrl: data.data.coverImageUrl }));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      showToast(error.message || 'Error uploading image', 'error');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleClearImage = () => {
    setFormData(prev => ({ ...prev, coverImageUrl: '' }));
  };

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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button asChild variant="ghost" className="mb-4">
          <button onClick={() => navigate(-1)} className='flex items-center'>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
        </Button>
        <h1 className="text-3xl font-bold">Edit Blog</h1>
        <p className="text-muted-foreground">
          Update your blog content and settings.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <Card>
              <CardHeader>
                <CardTitle>Blog Title</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter your blog title..."
                  required
                />
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Write a brief description of your blog..."
                  className="w-full min-h-[100px] p-3 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                />
              </CardContent>
            </Card>

            {/* Content */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Content</CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewMode(!previewMode)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {previewMode ? 'Edit' : 'Preview'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {previewMode ? (
                  <div 
                    className="prose prose-lg max-w-none dark:prose-invert min-h-[400px] p-4 border border-input rounded-md"
                    dangerouslySetInnerHTML={{ __html: formData.content }}
                  />
                ) : (
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    placeholder="Write your blog content here... You can use HTML tags for formatting."
                    className="w-full min-h-[400px] p-3 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 font-mono text-sm"
                    required
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Cover Image */}
            <Card>
              <CardHeader>
                <CardTitle>Cover Image</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input
                    name="coverImageUrl"
                    value={formData.coverImageUrl}
                    onChange={handleInputChange}
                    placeholder="Enter image URL..."
                  />
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                    <Button type="button" variant="outline" disabled className="whitespace-nowrap">
                      <Upload className="h-4 w-4 mr-2" />
                      {uploading ? 'Uploading...' : 'Upload Image'}
                    </Button>
                  </div>
                  {formData.coverImageUrl && (
                    <div className="relative aspect-video overflow-hidden rounded-md">
                      <button
                        type="button"
                        onClick={handleClearImage}
                        className="absolute top-2 right-2 inline-flex items-center justify-center h-8 w-8 rounded-full bg-background/80 border border-input hover:bg-background"
                        aria-label="Clear image"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <img
                        src={formData.coverImageUrl}
                        alt="Cover preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Publish Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Publish Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="published"
                      checked={formData.published}
                      onChange={handleInputChange}
                      className="rounded border-input"
                    />
                    <span className="text-sm">Published</span>
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Uncheck to save as draft
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate(`/blog/${id}`)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview Blog
                  </Button>

                  <Button
                    type="button"
                    variant="destructive"
                    className="w-full"
                    onClick={handleDelete}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Blog
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditBlog;

