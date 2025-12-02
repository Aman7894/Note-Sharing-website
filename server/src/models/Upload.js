import mongoose from "mongoose";

const UploadSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true },
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    slug: { type: String, unique: true, index: true, required: true },
    editKey: { type: String, required: true, select: false },
  },
  { timestamps: true }
);

export default mongoose.model("Upload", UploadSchema);
