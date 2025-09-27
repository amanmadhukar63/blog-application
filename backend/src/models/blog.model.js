import { Schema, model } from 'mongoose';

const blogSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coverImage: {
    type: String,
    default: null
  },
  published: {
    type: Boolean,
    default: false
  },
  publishedOn: {
    type: Date,
    default: null
  },
  viewCount: {
    type: Number,
    default: 0
  }
}, { 
  timestamps: true 
});

blogSchema.index({ author: 1 });
blogSchema.index({ published: 1 });
blogSchema.index({ publishedOn: -1 });
blogSchema.index({ viewCount: -1 });

// This method is defined here for handling concurrent view count increments
blogSchema.methods.incrementViewCount = async function() {
  return await this.constructor.findByIdAndUpdate(
    this._id,
    { $inc: { viewCount: 1 } },
    { new: true }
  );
};

const Blog = model('Blog', blogSchema);

export default Blog;
