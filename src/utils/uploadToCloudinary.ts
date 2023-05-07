import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (
  photo: Express.Multer.File
): Promise<string | boolean> => {
  try {
    let response: string | boolean = "";
    await cloudinary.uploader.upload(
      photo.path,
      { folder: "superCart" },
      (error: any, result: any) => {
        if (error) {
          console.error(error);
          response = false;
        } else {
          const url: string = result.secure_url;
          response = url;
        }
      }
    );

    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    return false;
  }
};

export default uploadToCloudinary;
