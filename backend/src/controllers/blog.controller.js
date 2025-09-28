import Blog from '../models/blog.model.js';
import { 
  responseHandler,
  validateBlogTitle, 
  validateBlogDescription, 
  validateBlogContent 
} from '../utils/helper.js';

export const createBlog = async (req, res) => {
  try {
    
    const { title, description, content, published, coverImageUrl } = req.body;
    const authorId = req.user._id;

    if (!title || !description || !content || !coverImageUrl) {
      return responseHandler(res, {
        msg: "Title, description, content and cover Image are required",
        status: "error",
        statusCode: 400,
        error: "Missing required fields"
      });
    }

    if (!validateBlogTitle(title)) {
      return responseHandler(res, {
        msg: "Title must be between 3 and 200 characters",
        status: "error",
        statusCode: 400,
        error: "Invalid title"
      });
    }

    if (!validateBlogDescription(description)) {
      return responseHandler(res, {
        msg: "Description must be between 10 and 100 characters",
        status: "error",
        statusCode: 400,
        error: "Invalid description"
      });
    }

    if (!validateBlogContent(content)) {
      return responseHandler(res, {
        msg: "Content must be at least 50 characters long",
        status: "error",
        statusCode: 400,
        error: "Invalid content"
      });
    }
    if ( typeof published === 'undefined' || typeof published !== 'boolean') {
      return responseHandler(res, {
        msg: "Published must be a boolean value",
        status: "error",
        statusCode: 400,
        error: "Invalid published value"
      });
    }

    const blogData = {
      title: title.trim(),
      description: description.trim(),
      content: content.trim(),
      author: authorId,
      coverImage: coverImageUrl,
      published
    };

    if (blogData.published) {
      blogData.publishedOn = new Date();
    }

    await Blog.create(blogData);

    return responseHandler(res, {
      msg: "Blog created successfully",
      status: "success",
      statusCode: 201
    });

  } catch (error) {
    console.error("Create blog error:", error);
    return responseHandler(res, {
      msg: "Failed to create blog",
      status: "error",
      statusCode: 500,
      error: "Internal server error"
    });
  }
};

export const getAllBlogs = async (req, res) => {
  try {

    const { page=1, limit=12 } = req.body;
    const skip = (page - 1) * limit;

    const blogs = await Blog.find({
      published: true
    })
      .select('-content')
      .populate('author', 'fullname email')
      .sort({
        'createdAt': -1
      })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalBlogs = await Blog.countDocuments({published: true});
    const totalPages = Math.ceil(totalBlogs / limit);

    return responseHandler(res, {
      msg: "Blogs retrieved successfully",
      status: "success",
      statusCode: 200,
      data: {
        blogs,
        pagination: {
          currentPage: page,
          totalPages,
          totalBlogs,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error("Get blogs error:", error);
    return responseHandler(res, {
      msg: "Failed to retrieve blogs",
      status: "error",
      statusCode: 500,
      error: "Internal server error"
    });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id).populate('author', 'fullname email');
    
    if (!blog) {
      return responseHandler(res, {
        msg: "Blog not found",
        status: "error",
        statusCode: 404,
        error: "Blog does not exist"
      });
    }

    // Increment view count atomically
    await blog.incrementViewCount();

    return responseHandler(res, {
      msg: "Blog retrieved successfully",
      status: "success",
      statusCode: 200,
      data: { blog }
    });

  } catch (error) {
    console.error("Get blog error:", error);
    return responseHandler(res, {
      msg: "Failed to retrieve blog",
      status: "error",
      statusCode: 500,
      error: "Internal server error"
    });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const authorId = req.user._id;

    const blog = await Blog.findById(id);
    if (!blog) {
      return responseHandler(res, {
        msg: "Blog not found",
        status: "error",
        statusCode: 404,
        error: "Blog does not exist"
      });
    }

    if (blog.author.toString() !== authorId.toString()) {
      return responseHandler(res, {
        msg: "Unauthorized to update this blog",
        status: "error",
        statusCode: 403,
        error: "Access denied"
      });
    }

    const { title, description, content, published, coverImageUrl } = req.body;

    if (title && !validateBlogTitle(title)) {
      return responseHandler(res, {
        msg: "Title must be between 3 and 200 characters",
        status: "error",
        statusCode: 400,
        error: "Invalid title"
      });
    }

    if (description && !validateBlogDescription(description)) {
      return responseHandler(res, {
        msg: "Description must be between 10 and 100 characters",
        status: "error",
        statusCode: 400,
        error: "Invalid description"
      });
    }

    if (content && !validateBlogContent(content)) {
      return responseHandler(res, {
        msg: "Content must be at least 50 characters long",
        status: "error",
        statusCode: 400,
        error: "Invalid content"
      });
    }

    const updateData = {};
    if (title) updateData.title = title.trim();
    if (description) updateData.description = description.trim();
    if (content) updateData.content = content.trim();
    if (coverImageUrl && coverImageUrl !== blog.coverImage) updateData.coverImage = coverImageUrl;
    
    if (published !== undefined) {
      updateData.published = published ? true : false;
      if (updateData.published && !blog.publishedOn) {
        updateData.publishedOn = new Date();
      }
    }

    await Blog.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    return responseHandler(res, {
      msg: "Blog updated successfully",
      status: "success",
      statusCode: 200
    });

  } catch (error) {
    console.error("Update blog error:", error);
    return responseHandler(res, {
      msg: "Failed to update blog",
      status: "error",
      statusCode: 500,
      error: "Internal server error"
    });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const authorId = req.user._id;

    const blog = await Blog.findById(id);
    if (!blog) {
      return responseHandler(res, {
        msg: "Blog not found",
        status: "error",
        statusCode: 404,
        error: "Blog does not exist"
      });
    }

    if (blog.author.toString() !== authorId.toString()) {
      return responseHandler(res, {
        msg: "Unauthorized to delete this blog",
        status: "error",
        statusCode: 403,
        error: "Access denied"
      });
    }

    await Blog.findByIdAndDelete(id);

    return responseHandler(res, {
      msg: "Blog deleted successfully",
      status: "success",
      statusCode: 200,
      data: { message: "Blog has been deleted" }
    });

  } catch (error) {
    console.error("Delete blog error:", error);
    return responseHandler(res, {
      msg: "Failed to delete blog",
      status: "error",
      statusCode: 500,
      error: "Internal server error"
    });
  }
};

export const getMyBlogs = async (req, res) => {
  try {
    const authorId = req.user._id;
    const { page=1, limit=12, published=true} = req.body;
    const skip = (page - 1) * limit;

    const query = { 
      author: authorId,
      published: published ? true : false
    };

    const blogs = await Blog.find(query)
      .select('-content')
      .populate('author', 'fullname email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalBlogs = await Blog.countDocuments(query);
    const totalPages = Math.ceil(totalBlogs / limit);

    return responseHandler(res, {
      msg: "Your blogs retrieved successfully",
      status: "success",
      statusCode: 200,
      data: {
        blogs,
        pagination: {
          currentPage: page,
          totalPages,
          totalBlogs,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error("Get my blogs error:", error);
    return responseHandler(res, {
      msg: "Failed to retrieve your blogs",
      status: "error",
      statusCode: 500,
      error: "Internal server error"
    });
  }
};

export const togglePublishStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const authorId = req.user._id;

    const blog = await Blog.findById(id);
    if (!blog) {
      return responseHandler(res, {
        msg: "Blog not found",
        status: "error",
        statusCode: 404,
        error: "Blog does not exist"
      });
    }

    if (blog.author.toString() !== authorId.toString()) {
      return responseHandler(res, {
        msg: "Unauthorized to modify this blog",
        status: "error",
        statusCode: 403,
        error: "Access denied"
      });
    }

    const updateData = {
      published: !blog.published
    };

    if (updateData.published && !blog.publishedOn) {
      updateData.publishedOn = new Date();
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('author', 'fullname email');

    return responseHandler(res, {
      msg: `Blog ${updatedBlog.published ? 'published' : 'unpublished'} successfully`,
      status: "success",
      statusCode: 200,
      data: { blog: updatedBlog }
    });

  } catch (error) {
    console.error("Toggle publish status error:", error);
    return responseHandler(res, {
      msg: "Failed to update blog status",
      status: "error",
      statusCode: 500,
      error: "Internal server error"
    });
  }
};
