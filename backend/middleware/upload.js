const path = require('path');
const fs = require('fs');
const multer = require('multer');
const config = require('../config/config');

const uploadDir = path.join(__dirname, '../uploads/settings');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = (file.mimetype === 'image/png') ? '.png' : '.jpg';
    cb(null, `settings-${Date.now()}${ext}`);
  },
});

const allowedMimes = config.IMAGE_UPLOAD_ALLOWED_MIMES;

const fileFilter = (req, file, cb) => {
  if (allowedMimes && allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images are allowed.'), false);
  }
};

exports.uploadSettingsImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: config.IMAGE_UPLOAD_MAX_SIZE_BYTES },
}).single('file');
