import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL,
});

export async function createNote({ title, content }) {
  const res = await api.post("/api/notes", { title, content });
  return res.data;
}

export async function getNote(slug) {
  const res = await api.get(`/api/notes/${slug}`);
  return res.data;
}

export async function updateNote(slug, { title, content }, editKey) {
  const res = await api.put(`/api/notes/${slug}`, { title, content }, {
    headers: { "x-edit-key": editKey },
  });
  return res.data;
}

export async function deleteNote(slug, editKey) {
  const res = await api.delete(`/api/notes/${slug}`, {
    headers: { "x-edit-key": editKey },
  });
  return res.data;
}

export async function uploadFile(file, title) {
  const form = new FormData();
  if (title) form.append("title", title);
  form.append("file", file);
  const res = await api.post("/api/files", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data; // { id, slug, editKey }
}

export async function listFiles() {
  const res = await api.get("/api/files");
  return res.data;
}

export async function getFileBySlug(slug) {
  const res = await api.get(`/api/files/slug/${slug}`);
  return res.data; // { id, ... }
}

export async function getDownloadUrlById(id) {
  return `${api.defaults.baseURL}/api/files/${id}/download`;
}

export async function deleteFile(id, editKey) {
  const res = await api.delete(`/api/files/${id}`, {
    headers: { "x-edit-key": editKey },
  });
  return res.data;
}
export async function listNotes() {
  const res = await api.get('/api/notes');
  return res.data;
}
