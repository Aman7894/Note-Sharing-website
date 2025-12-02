import { useEffect, useState } from "react";
import { uploadFile, getDownloadUrlById, api } from "../lib/api";
import { Link } from "react-router-dom";

export default function UploadFile() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [theme, setTheme] = useState("light");

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

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (!file) throw new Error("Please choose a file");
      const data = await uploadFile(file, title);
      localStorage.setItem(`file:${data.id}:editKey`, data.editKey);
      setResult(data);
    } catch (err) {
      setError(err?.response?.data?.error || err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    const downloadUrl = `${api.defaults.baseURL}/api/files/${result.id}/download`;
    const shareUrl = `${window.location.origin}/file/${result.slug}`;
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 text-slate-900 dark:text-slate-100">
        <div className="max-w-2xl mx-auto p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">File Uploaded</h1>
            <div className="flex gap-2">
              <button onClick={toggleTheme} className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-800">{theme === "dark" ? "Light" : "Dark"}</button>
              <Link to="/" className="px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-900">Home</Link>
            </div>
          </div>
          <div className="space-y-2 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded shadow p-4">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Share page</p>
              <div className="flex gap-2">
                <input className="flex-1 px-3 py-2 border dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" readOnly value={shareUrl} />
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={() => navigator.clipboard.writeText(shareUrl)}>Copy</button>
              </div>
            </div>
            <a className="px-4 py-2 bg-green-600 text-white rounded inline-block hover:bg-green-700" href={downloadUrl}>
              Download file
            </a>
            <Link className="px-4 py-2 bg-blue-600 text-white rounded inline-block hover:bg-blue-700" to={`/file/${result.slug}`}>Open Share Page</Link>
            <button className="px-4 py-2 border rounded hover:bg-slate-50" onClick={() => setResult(null)}>Upload Another</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 text-slate-900 dark:text-slate-100">
      <div className="max-w-2xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Upload a File</h1>
          <div className="flex gap-2">
            <button onClick={toggleTheme} className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-800">{theme === "dark" ? "Light" : "Dark"}</button>
            <Link to="/" className="px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-900">Home</Link>
          </div>
        </div>
        <form onSubmit={onSubmit} className="space-y-4 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded shadow p-6">
          {error && <div className="p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded">{error}</div>}
          <input
            className="w-full px-4 py-2 border dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
            placeholder="Title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="file"
            className="w-full text-slate-900 dark:text-slate-100"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <button className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 hover:bg-blue-700" disabled={loading}>
            {loading ? "Uploading..." : "Upload"}
          </button>
          <div className="text-sm text-slate-600 dark:text-slate-400">Max size 10MB</div>
        </form>
      </div>
    </div>
  );
}
