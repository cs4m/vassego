const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const app = express();

const UPLOAD_DIR = path.join(__dirname, "uploads");
const MAX_FILE_SIZE = 5 * 1024 * 1024 * 1024; // 5GB
const FILE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

app.use(express.static("public"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const unique = crypto.randomBytes(6).toString("hex");
    cb(null, `${Date.now()}-${unique}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE }
});

app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded.");
  const fileUrl = `/file/${req.file.filename}`;
  res.send({ url: fileUrl });
});

app.get("/file/:filename", (req, res) => {
  const filePath = path.join(UPLOAD_DIR, req.params.filename);
  if (fs.existsSync(filePath)) res.download(filePath);
  else res.status(404).send("File not found.");
});

app.listen(3000, () => console.log("Server started on port 3000"));
