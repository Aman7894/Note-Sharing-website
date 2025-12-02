import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getFileBySlug, getDownloadUrlById, deleteFile } from "../lib/api";

export default function ViewFile() {
  const { slug } = useParams();
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    (async () => {
      try {
        const data = await getFileBySlug(slug);
        setFile(data);
      } catch (err) {
        setError(err?.response?.data?.error || "Failed to load file");
      }
    })();
  }, [slug]);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const next = saved === "dark" ? "dark" : "light";
    setTheme(next);
    if (next === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    if (next === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }

  if (!file) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  const downloadUrl = getDownloadUrlById(file.id);
  const editKey = localStorage.getItem(`file:${file.id}:editKey`);

  async function onDelete() {
    if (!editKey) return setError("Missing edit key; cannot delete.");
    if (!confirm("Delete this file?")) return;
    setDeleting(true);
    try {
      await deleteFile(file.id, editKey);
      window.location.href = "/";
    } catch (err) {
      setError(err?.response?.data?.error || "Delete failed");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 text-slate-900 dark:text-slate-100">
      <div className="max-w-3xl mx-auto p-6 space-y-4">
        {error && <div className="p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded">{error}</div>}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{file.title || file.originalName}</h1>
          <div className="flex items-center gap-2">
            <Link to="/" className="px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-900">Home</Link>
            <Link to="/upload" className="px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-900">Upload File</Link>
            <button onClick={toggleTheme} className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-800">{theme === "dark" ? "Light" : "Dark"}</button>
          </div>
        </div>
        <div className="space-y-1 text-slate-700 dark:text-slate-300">
          <div>Original name: {file.originalName}</div>
          <div>Size: {(file.size / 1024).toFixed(1)} KB</div>
          <div>Type: {file.mimeType}</div>
        </div>
        <a className="px-4 py-2 bg-green-600 text-white rounded inline-block hover:bg-green-700" href={downloadUrl}>Download</a>
        {editKey && (
          <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700" onClick={onDelete} disabled={deleting}>
            {deleting ? "Deleting..." : "Delete"}
          </button>
        )}
        <div className="text-sm text-slate-600 dark:text-slate-400">
          Uploaded: {new Date(file.createdAt).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
