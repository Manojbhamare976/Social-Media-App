import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let resourceType = "image";

    if (file.mimetype.startsWith("video")) {
      resourceType = "video";
    }

    return {
      folder: "mern-social-posts",
      resource_type: resourceType,
    };
  },
});

const upload = multer({ storage });

export default upload;
