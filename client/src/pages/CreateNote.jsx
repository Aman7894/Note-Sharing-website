import { useEffect, useState } from "react";
import { createNote, listNotes, listFiles, api } from "../lib/api";
import { Link } from "react-router-dom";

export default function CreateNote() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recentNotes, setRecentNotes] = useState([]);
  const [recentFiles, setRecentFiles] = useState([]);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    Promise.all([listNotes(), listFiles()])
      .then(([notes, files]) => {
        setRecentNotes(notes);
        setRecentFiles(files);
      })
      .catch(() => void 0);
  }, []);

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
      const data = await createNote({ title, content });
      localStorage.setItem(`note:${data.slug}:editKey`, data.editKey);
      setResult(data);
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to create note");
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    const shareUrl = `${window.location.origin}/note/${result.slug}`;
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-2xl mx-auto p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Note Created</h1>
            <Link to="/upload" className="px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-900">Upload File</Link>
          </div>
          <div className="space-y-3 bg-white border rounded shadow p-4">
            <div>
              <p className="text-sm text-gray-600">Shareable link</p>
              <div className="flex items-center gap-2">
                <input className="flex-1 px-3 py-2 border rounded" readOnly value={shareUrl} />
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={() => navigator.clipboard.writeText(shareUrl)}>Copy</button>
              </div>
            </div>
            <Link className="px-4 py-2 bg-green-600 text-white rounded inline-block hover:bg-green-700" to={`/note/${result.slug}`}>View Note</Link>
            <button className="px-4 py-2 border rounded hover:bg-slate-50" onClick={() => setResult(null)}>Create Another</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 text-slate-900 dark:text-slate-100">
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Share a Note</h1>
          <div className="flex gap-2">
            <button onClick={toggleTheme} className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-800">
              {theme === "dark" ? "Light" : "Dark"}
            </button>
            <Link to="/upload" className="px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-900">Upload File</Link>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Recent Notes</h2>
              <Link to="/" className="px-3 py-2 bg-slate-800 text-white rounded hover:bg-slate-900">Refresh</Link>
            </div>
            <div className="grid gap-3">
              {recentNotes.length === 0 && (
                <div className="text-slate-500 dark:text-slate-400">No notes yet</div>
              )}
              {recentNotes.map(n => (
                <div key={n.slug} className="flex items-center justify-between border dark:border-slate-700 rounded p-3">
                  <div>
                    <div className="font-medium">{n.title || 'Untitled'}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">{new Date(n.createdAt).toLocaleString()}</div>
                  </div>
                  <Link to={`/note/${n.slug}`} className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">View</Link>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Recent Uploads</h2>
            </div>
            <div className="grid gap-3">
              {recentFiles.length === 0 && (
                <div className="text-slate-500 dark:text-slate-400">No uploads yet</div>
              )}
              {recentFiles.map(f => (
                <div key={f.id} className="flex items-center justify-between border dark:border-slate-700 rounded p-3">
                  <div>
                    <div className="font-medium">{f.title || f.originalName}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">{(f.size/1024).toFixed(1)} KB • {f.mimeType}</div>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/file/${f.slug}`} className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Open</Link>
                    <a href={`${api.defaults.baseURL}/api/files/${f.id}/download`} className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700">Download</a>
                  </div>
                </div>
              ))}
            </div>
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
          <textarea
            className="w-full min-h-[200px] px-4 py-2 border dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
            placeholder="Write your note content..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Note"}
          </button>
        </form>
      </div>
    </div>
  );
}
