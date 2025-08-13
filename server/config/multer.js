import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure the uploads directory exists
const uploadsDir = "uploads/";
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

// File type filter - only accept images
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
  const fileExtension = path.extname(file.originalname).toLowerCase();

  if (
    allowedMimeTypes.includes(file.mimetype) &&
    [".jpg", ".jpeg", ".png", ".pdf"].includes(fileExtension)
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only .jpg, .jpeg, .png, and .pdf files are allowed"), false);
  }
};

// Configure file size limits and other options
const limits = {
  fileSize: 10 * 1024 * 1024, // 10 MB for PDFs
  files: 1,
};

// Create multer middleware
const upload = multer({
  storage,
  fileFilter,
  limits,
});

// Multer error handler middleware
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case "LIMIT_FILE_SIZE":
        return res.status(400).json({
          success: false,
          message: "File too large. Maximum size is 5MB.",
        });
      case "LIMIT_FILE_COUNT":
        return res.status(400).json({
          success: false,
          message: "Too many files. Only 1 file allowed.",
        });
      case "LIMIT_UNEXPECTED_FILE":
        return res.status(400).json({
          success: false,
          message: "Unexpected file field.",
        });
      default:
        return res.status(400).json({
          success: false,
          message: "File upload error: " + err.message,
        });
    }
  } else if (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
  next();
};

export default upload;
