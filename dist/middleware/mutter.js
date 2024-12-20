"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_1 = __importDefault(require("./cloudinary")); // Your cloudinary configuration
// Set up Cloudinary storage
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.default,
    params: {
        folder: 'uploads', // Cloudinary folder name
        allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'mp4', 'avi', 'mov'], // Allowed formats
        resource_type: 'auto', // Resource type (image/video/etc.)
    }, // Type assertion to bypass TypeScript error
});
const upload = (0, multer_1.default)({ storage });
exports.default = upload;
//# sourceMappingURL=mutter.js.map