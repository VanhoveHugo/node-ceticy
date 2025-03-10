import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./configCloudinary";
import path from "path";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req: any, file: any) => ({
    folder: "users",
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
    // Types MIME acceptés : JPEG et PNG
    const validMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const mimeType = validMimeTypes.includes(file.mimetype);

    // Vérification de l'extension
    const extName = /jpeg|jpg|png/.test(path.extname(file.originalname).toLowerCase());

    if (mimeType && extName) {
      return cb(null, true);
    }

    // Erreur si le type MIME ou l'extension ne correspondent pas
    cb(new Error("Le fichier '" + file.originalname + "' n'est pas un fichier image valide. Seuls les formats JPEG et PNG sont acceptés."));
  },
});

export default upload;
