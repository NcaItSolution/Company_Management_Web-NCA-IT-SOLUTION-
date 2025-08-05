const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_req, file, cb) => {
    cb(null, file.originalname);
  }
});

// File filter
const fileFilter = (_req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (
    ext !== '.jpg' &&
    ext !== '.jpeg' &&
    ext !== '.webp' &&
    ext !== '.png' &&
    ext !== '.mp4' &&
    ext !== '.pdf'
  ) {
    return cb(new Error('File type not supported'), false);
  }

  cb(null, true);
};

// Multer middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
  fileFilter: fileFilter
});

module.exports = upload;
