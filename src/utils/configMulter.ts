import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./configCloudinary";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req: any, file: any) => ({
    folder: "users", // Dossier où stocker les images sur Cloudinary
    format: "png", // Format des fichiers (png dans ce cas)
    public_id: `${Date.now()}-${file.originalname}`, // Nom unique
  }),
});

const upload = multer({ storage });

export default upload;
