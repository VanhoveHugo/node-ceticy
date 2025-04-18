import multer from "multer";
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from "multer-storage-cloudinary";
import path from "path";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req: any, file: any) => ({
    folder: process.env.NODE_ENV,
    public_id: `${Date.now()}-${file.originalname}`,
    transformation: [
      {
        width: 600,
        height: 800,
        crop: "fill",
        quality: "auto",
      },
    ],
  }),
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const validMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const mimeType = validMimeTypes.includes(file.mimetype);

    const extName = /jpeg|jpg|png/.test(path.extname(file.originalname).toLowerCase());

    if (mimeType && extName) {
      return cb(null, true);
    }

    cb(new Error("Le fichier '" + file.originalname + "' n'est pas un fichier image valide. Seuls les formats JPEG et PNG sont acceptés."));
  },
});

export default upload;
