module.exports = {
  PORT: process.env.PORT || 3000,
  ADMIN_USER: process.env.ADMIN_USER || "admin",
  ADMIN_PASS: process.env.ADMIN_PASS || "password123", // change before production
  UPLOAD_DIR: process.env.UPLOAD_DIR || "../uploads"
};
