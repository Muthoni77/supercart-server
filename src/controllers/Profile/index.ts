import { Request, Response, NextFunction } from "express";
import { CustomRequest, UserType } from "../../Types/Auth";
import User from "../../Models/Auth/User";
import { ProfileType } from "../../Types/Profile";
import Profile from "../../Models/Auth/Profile";
import uploadToCloudinary from "../../utils/uploadToCloudinary";

export const fetchProfile = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const email = req.user?.email;
    //check if user exists
    const userAccount = await User.findOne({ email }).populate("profile");
    if (!userAccount) return next(new Error("User not found!"));

    res.status(200).json({ success: true, user: userAccount });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const email = req.user?.email;

    const profileData: ProfileType = req.body;

    if (!profileData.dob || !profileData.country || !profileData.language)
      return next(new Error("Some inputs missing"));

    const options = {
      upsert: true, // Create a new document if it doesn't exist
      new: true, // Return the updated document
    };

    //check if user exists
    const userAccount = await User.findOne({ email });
    if (!userAccount) return next(new Error("Unauthorized Request"));

    const userProfile = await Profile.findOneAndUpdate(
      {
        userId: userAccount._id,
      },
      { ...profileData, userId: userAccount._id },
      options
    );

    const returnedUser = await User.findOne({ email }).populate("profile");

    res.status(200).json({
      success: true,
      message: "Profile was updated successfully",
      user: returnedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfilePhoto = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) next(Error("File missing"));
    const myFile: Express.Multer.File = req!.file!;
    const fileUrl = await uploadToCloudinary(myFile);
    if (!fileUrl) {
      next(Error("Failed to upload photo"));
    }

    res.status(200).json({ fileUrl });
  } catch (error) {
    next(error);
  }
};
