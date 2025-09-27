import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { responseHandler } from "../utils/helper.js";

async function uploadImage(req, res){

  try {
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if (!coverImageLocalPath) {
      return responseHandler(res, {
        msg: 'No image file provided',
        status: 'error',
        statusCode: 400
      });
    }

    const coverImageCloudinaryPath = await uploadOnCloudinary(coverImageLocalPath);

    if (!coverImageCloudinaryPath?.url) {
      return responseHandler(res, {
        msg: 'Image upload failed',
        status: 'error',
        statusCode: 401
      });
    }

    return responseHandler(res, {
      msg: 'Image uploaded successfully',
      status: 'success',
      statusCode: 200,
      data: {
        coverImageUrl: coverImageCloudinaryPath?.secure_url,
        width: coverImageCloudinaryPath?.width,
        height: coverImageCloudinaryPath?.height,
        created_at: coverImageCloudinaryPath?.created_at,
        resource_type: coverImageCloudinaryPath?.resource_type,
        format: coverImageCloudinaryPath?.format,
      }
    });
    
  } catch (error) {
    console.error('Error uploading image:', error);
    return responseHandler(res, {
      msg: 'Error uploading image',
      status: 'error',
      statusCode: 500
    });
  }

}

export {
  uploadImage
}