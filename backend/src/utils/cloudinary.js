import { v2 as cloudinary } from "cloudinary";
import fs from 'fs';

async function uploadOnCloudinary(localFilePath) {

  try {

    const uploadResult = await cloudinary.uploader.upload(
        localFilePath, 
        {
            resource_type: "auto",
        }
    );
    fs.unlinkSync(localFilePath);

    return uploadResult;

  } catch (error) {
      fs.unlinkSync(localFilePath);
      console.log('File upload failed, file removed from server',error);
      return error;
  }
}

export {
  uploadOnCloudinary
};