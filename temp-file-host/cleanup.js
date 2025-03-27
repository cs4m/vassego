const fs = require("fs");
const path = require("path");

const UPLOAD_DIR = path.join(__dirname, "uploads");
const FILE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

fs.readdirSync(UPLOAD_DIR).forEach(file => {
  const filePath = path.join(UPLOAD_DIR, file);
  const stats = fs.statSync(filePath);
  if (Date.now() - stats.mtimeMs > FILE_TTL_MS) {
    fs.unlinkSync(filePath);
    console.log(`Deleted: ${file}`);
  }
});
