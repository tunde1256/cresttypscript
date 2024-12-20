import { StorageEngine } from 'multer';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary'; // Your cloudinary configuration

// Set up Cloudinary storage
const storage: StorageEngine = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads', // Cloudinary folder name
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'mp4', 'avi', 'mov'], // Allowed formats
    resource_type: 'auto', // Resource type (image/video/etc.)
  } as any, // Type assertion to bypass TypeScript error
});

const upload = multer({ storage });

export default upload;  // Ensure this is a default export