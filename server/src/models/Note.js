import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true },
    content: { type: String, required: true },
    slug: { type: String, unique: true, index: true, required: true },
    editKey: { type: String, required: true, select: false },
  },
  { timestamps: true }
);

export default mongoose.model("Note", NoteSchema);
