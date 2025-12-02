import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getNote, updateNote, deleteNote } from "../lib/api";

export default function ViewNote() {
  const { slug } = useParams();
  const [note, setNote] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [theme, setTheme] = useState("light");

  const editKey = localStorage.getItem(`note:${slug}:editKey`);

  useEffect(() => {
    (async () => {
      try {
        const data = await getNote(slug);
        setNote(data);
        setTitle(data.title || "");
        setContent(data.content || "");
      } catch (err) {
        setError(err?.response?.data?.error || "Failed to load note");
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

  async function onSave() {
    if (!editKey) return setError("Edit key missing; create this note to edit.");
    setSaving(true);
    setError("");
    try {
      await updateNote(slug, { title, content }, editKey);
      setEditMode(false);
      setNote({ ...note, title, content });
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to save note");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!editKey) return setError("Edit key missing; cannot delete.");
    if (!confirm("Delete this note?")) return;
    try {
      await deleteNote(slug, editKey);
      window.location.href = "/";
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to delete note");
    }
  }

  if (!note) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 text-slate-900 dark:text-slate-100">
      <div className="max-w-3xl mx-auto p-6 space-y-4">
        {error && <div className="p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded">{error}</div>}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{note.title || "Untitled"}</h1>
          <div className="flex items-center gap-2">
            <Link to="/" className="px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-900">Home</Link>
            <Link to="/upload" className="px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-900">Upload File</Link>
            <button onClick={toggleTheme} className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-800">{theme === "dark" ? "Light" : "Dark"}</button>
            {editKey && (
              <>
                {!editMode && (
                  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={() => setEditMode(true)}>Edit</button>
                )}
                <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700" onClick={onDelete}>&nbsp;&nbsp;Delete</button>
              </>
            )}
          </div>
        </div>
        {!editMode ? (
          <article className="max-w-none whitespace-pre-wrap bg-white dark:bg-slate-800 p-6 rounded border dark:border-slate-700 shadow">
            {note.content}
          </article>
        ) : (
          <div className="space-y-3">
            <input className="w-full px-3 py-2 border dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" value={title} onChange={(e) => setTitle(e.target.value)} />
            <textarea className="w-full min-h-[200px] px-3 py-2 border dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" value={content} onChange={(e) => setContent(e.target.value)} />
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 hover:bg-blue-700" disabled={saving} onClick={onSave}>{saving ? "Saving..." : "Save"}</button>
              <button className="px-4 py-2 border rounded hover:bg-slate-50" onClick={() => setEditMode(false)}>Cancel</button>
            </div>
          </div>
        )}
        <div className="text-sm text-slate-600 dark:text-slate-400">
          Created: {new Date(note.createdAt).toLocaleString()} {note.updatedAt && `(Updated: ${new Date(note.updatedAt).toLocaleString()})`}
        </div>
      </div>
    </div>
  );
}
