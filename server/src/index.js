import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { nanoid } from "nanoid";
import fs from "fs";
import path from "path";
import multer from "multer";
import Note from "./models/Note.js";
import Upload from "./models/Upload.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/Note-share";

app.use(cors());
app.use(express.json());
// Files upload setup
const UPLOAD_DIR = path.join(process.cwd(), "uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const id = nanoid(16);
    const ext = path.extname(file.originalname);
    cb(null, `${id}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/api/notes", async (req, res) => {
  try {
    const items = await Note.find().sort({ createdAt: -1 }).limit(50).lean();
    return res.json(items.map(n => ({
      slug: n.slug,
      title: n.title,
      createdAt: n.createdAt,
      updatedAt: n.updatedAt,
    })));
  } catch (err) {
    console.error("List notes error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/notes", async (req, res) => {
  try {
    const { title = "", content = "" } = req.body || {};
    if (!content || typeof content !== "string") {
      return res.status(400).json({ error: "content is required" });
    }
    const slug = nanoid(8);
    const editKey = nanoid(16);
    const note = await Note.create({ title, content, slug, editKey });
    return res.status(201).json({ slug: note.slug, editKey });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "Slug collision, please retry" });
    }
    console.error("Create note error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/notes/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const note = await Note.findOne({ slug }).lean();
    if (!note) return res.status(404).json({ error: "Not found" });
    return res.json({ title: note.title, content: note.content, createdAt: note.createdAt, updatedAt: note.updatedAt });
  } catch (err) {
    console.error("Get note error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/notes/:slug/download", async (req, res) => {
  try {
    const { slug } = req.params;
    const note = await Note.findOne({ slug }).lean();
    if (!note) return res.status(404).json({ error: "Not found" });
    const title = (note.title || "note").replace(/[^a-z0-9\-\_]+/gi, "-").toLowerCase();
    const filename = `${title || "note"}.txt`;
    const content = `${note.title ? note.title + "\n\n" : ""}${note.content || ""}`;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(filename)}"`);
    res.send(content);
  } catch (err) {
    console.error("Download note error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/api/notes/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const editKey = req.header("x-edit-key");
    if (!editKey) return res.status(401).json({ error: "Missing edit key" });
    const note = await Note.findOne({ slug }).select("editKey");
    if (!note) return res.status(404).json({ error: "Not found" });
    if (note.editKey !== editKey) return res.status(403).json({ error: "Invalid edit key" });
    const { title, content } = req.body || {};
    const update = {};
    if (typeof title === "string") update.title = title;
    if (typeof content === "string") update.content = content;
    const updated = await Note.findOneAndUpdate({ slug }, update, { new: true });
    return res.json({ ok: true, updatedAt: updated.updatedAt });
  } catch (err) {
    console.error("Update note error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/api/notes/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const editKey = req.header("x-edit-key");
    if (!editKey) return res.status(401).json({ error: "Missing edit key" });
    const note = await Note.findOne({ slug }).select("editKey");
    if (!note) return res.status(404).json({ error: "Not found" });
    if (note.editKey !== editKey) return res.status(403).json({ error: "Invalid edit key" });
    await Note.deleteOne({ slug });
    return res.json({ ok: true });
  } catch (err) {
    console.error("Delete note error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Upload file
app.post("/api/files", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "file is required" });
    const { originalname, mimetype, size, filename } = req.file;
    const { title = "" } = req.body || {};
    const slug = nanoid(8);
    const editKey = nanoid(16);
    const doc = await Upload.create({
      title,
      filename,
      originalName: originalname,
      mimeType: mimetype,
      size,
      slug,
      editKey,
    });
    return res.status(201).json({ id: doc._id, slug, editKey });
  } catch (err) {
    console.error("Upload file error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// List files (recent)
app.get("/api/files", async (req, res) => {
  const items = await Upload.find().sort({ createdAt: -1 }).limit(50).lean();
  res.json(items.map(i => ({
    id: i._id,
    title: i.title,
    originalName: i.originalName,
    mimeType: i.mimeType,
    size: i.size,
    slug: i.slug,
    createdAt: i.createdAt,
  })));
});

// Get file metadata by slug
app.get("/api/files/slug/:slug", async (req, res) => {
  const { slug } = req.params;
  const f = await Upload.findOne({ slug }).lean();
  if (!f) return res.status(404).json({ error: "Not found" });
  res.json({
    id: f._id,
    title: f.title,
    originalName: f.originalName,
    mimeType: f.mimeType,
    size: f.size,
    slug: f.slug,
    createdAt: f.createdAt,
  });
});

// Download by id
app.get("/api/files/:id/download", async (req, res) => {
  try {
    const { id } = req.params;
    const f = await Upload.findById(id);
    if (!f) return res.status(404).json({ error: "Not found" });
    const filepath = path.join(UPLOAD_DIR, f.filename);
    if (!fs.existsSync(filepath)) return res.status(410).json({ error: "File missing" });
    res.setHeader("Content-Type", f.mimeType);
    res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(f.originalName)}"`);
    fs.createReadStream(filepath).pipe(res);
  } catch (err) {
    console.error("Download error", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete file (requires edit key)
app.delete("/api/files/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const editKey = req.header("x-edit-key");
    if (!editKey) return res.status(401).json({ error: "Missing edit key" });
    const f = await Upload.findById(id).select("editKey filename");
    if (!f) return res.status(404).json({ error: "Not found" });
    if (f.editKey !== editKey) return res.status(403).json({ error: "Invalid edit key" });
    const filepath = path.join(UPLOAD_DIR, f.filename);
    await Upload.deleteOne({ _id: id });
    if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
    res.json({ ok: true });
  } catch (err) {
    console.error("Delete file error", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

async function start() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
  } catch (err) {
    console.error("Failed to start server", err);
    process.exit(1);
  }
}

start();
