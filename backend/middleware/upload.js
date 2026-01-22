const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB (adjust if needed)
  }
  // ❌ NO fileFilter → accepts ALL file types
});

module.exports = upload;
