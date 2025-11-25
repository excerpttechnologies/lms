"use client";

import React, { useEffect, useState } from "react";

type Course = {
  _id: string;
  title: string;
  slug?: string;
  description?: string;
  modules?: Module[];
  teacherId?: any;
};

type Module = {
  _id?: string;
  title: string;
  description?: string;
  order: number;
  lessons?: any[];
};

export default function CourseModulesFrontend() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form state for new module / edit
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState<number>(1);
  const [saving, setSaving] = useState(false);

  // editingModuleIndex === null => add mode, otherwise edit mode
  // This stores the actual index in selectedCourse.modules (not the sorted display index)
  const [editingModuleIndex, setEditingModuleIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchCourses() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/courses", {
        credentials: "include",
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || `HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();

      const sss = localStorage.getItem("user");
      const dd = sss ? JSON.parse(sss) : null;

      const allCourses: Course[] = Array.isArray(data) ? data : data?.data || [];

      // filter by teacherId - robust handling if teacherId is populated
      const ff = dd
        ? allCourses.filter((course: Course) => {
            const tid = course.teacherId
              ? typeof course.teacherId === "string"
                ? course.teacherId
                : (course.teacherId as any)._id ?? String((course.teacherId as any))
              : "";
            return String(tid) === String(dd._id);
          })
        : [];

      setCourses(ff);
    } catch (e: any) {
      setError(e.message || "Failed to load courses");
      console.error("Fetch courses error:", e);
    } finally {
      setLoading(false);
    }
  }

  async function fetchCourseDetails(courseId: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/courses/${courseId}`, {
        credentials: "include",
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || `HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();

      setSelectedCourse(data.data || data);
      // clear any edit state when selecting a new course
      resetForm();
      setEditingModuleIndex(null);
    } catch (e: any) {
      setError(e.message || "Failed to load course");
      console.error("Fetch course details error:", e);
    } finally {
      setLoading(false);
    }
  }

  // Helper: given a module from the displayed (sorted) list, return its actual index in selectedCourse.modules
  function getActualModuleIndex(moduleItem: Module, fallbackIndex: number) {
    if (!selectedCourse?.modules) return fallbackIndex;
    if (moduleItem._id) {
      const found = selectedCourse.modules.findIndex((m) => m._id === moduleItem._id);
      if (found !== -1) return found;
    }
    // fallback: try to find by reference/equality or by matching title+order
    const idxByRef = selectedCourse.modules.indexOf(moduleItem as any);
    if (idxByRef !== -1) return idxByRef;

    // last fallback: match title and order (not perfect but better than wrong index)
    const idxByProps = selectedCourse.modules.findIndex(
      (m) => m.title === moduleItem.title && (m.order ?? 0) === (moduleItem.order ?? 0)
    );
    return idxByProps !== -1 ? idxByProps : fallbackIndex;
  }

  // Add module (existing function, slightly adapted to clear edit mode)
  async function handleAddModule() {
    if (!selectedCourse) return;

    setSaving(true);
    setError(null);

    if (!title.trim()) {
      setError("Module title is required");
      setSaving(false);
      return;
    }

    // If editingModuleIndex is set, call update flow instead
    if (editingModuleIndex !== null) {
      await handleUpdateModule(editingModuleIndex);
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim() || undefined,
      order: Number(order),
    };

    try {
      const res = await fetch(`/api/courses/${selectedCourse._id}/modules`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: res.statusText }));
        if (res.status === 401) {
          throw new Error("You must be logged in to add modules");
        } else if (res.status === 403) {
          throw new Error("Access denied. You must be the course teacher or admin.");
        } else {
          throw new Error(errorData.message || `HTTP ${res.status}: ${res.statusText}`);
        }
      }

      const response = await res.json();

      // Prefer server-returned modules, otherwise refetch
      if (response.data?.modules) {
        setSelectedCourse({
          ...selectedCourse,
          modules: response.data.modules,
        });
      } else if (response.modules) {
        setSelectedCourse({
          ...selectedCourse,
          modules: response.modules,
        });
      } else {
        // fallback: refetch course details
        await fetchCourseDetails(selectedCourse._id);
      }

      // Reset form
      resetForm();
      setError(null);
    } catch (e: any) {
      setError(e.message || "Failed to add module");
      console.error("Add module error:", e);
    } finally {
      setSaving(false);
    }
  }

  // Update module (PUT)
  async function handleUpdateModule(moduleIndex: number) {
    if (!selectedCourse) return;

    setSaving(true);
    setError(null);

    if (!title.trim()) {
      setError("Module title is required");
      setSaving(false);
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim() || undefined,
      order: Number(order),
    };

    try {
      const res = await fetch(
        `/api/courses/${selectedCourse._id}/modules/${moduleIndex}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ message: res.statusText }));
        if (res.status === 401) {
          throw new Error("You must be logged in to update modules");
        } else if (res.status === 403) {
          throw new Error("Access denied. You must be the course teacher or admin.");
        } else {
          throw new Error(errData.message || `HTTP ${res.status}: ${res.statusText}`);
        }
      }

      const response = await res.json();

      // If server returns updated modules, use them
      if (response.data?.modules) {
        setSelectedCourse((prev) =>
          prev ? { ...prev, modules: response.data.modules } : prev
        );
      } else if (response.modules) {
        setSelectedCourse((prev) =>
          prev ? { ...prev, modules: response.modules } : prev
        );
      } else {
        // fallback: refetch course details
        await fetchCourseDetails(selectedCourse._id);
      }

      // Clear edit mode
      setEditingModuleIndex(null);
      resetForm();
    } catch (e: any) {
      setError(e.message || "Failed to update module");
      console.error("Update module error:", e);
    } finally {
      setSaving(false);
    }
  }

  // Delete module
  async function handleDeleteModuleFromDisplay(moduleItem: Module, displayIdx: number) {
    if (!selectedCourse) return;

    const actualIdx = getActualModuleIndex(moduleItem, displayIdx);

    const confirmed = window.confirm(
      "Are you sure you want to delete this module? This action cannot be undone."
    );
    if (!confirmed) return;

    setSaving(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/courses/${selectedCourse._id}/modules/${actualIdx}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ message: res.statusText }));
        if (res.status === 401) {
          throw new Error("You must be logged in to delete modules");
        } else if (res.status === 403) {
          throw new Error("Access denied. You must be the course teacher or admin.");
        } else {
          throw new Error(errData.message || `HTTP ${res.status}: ${res.statusText}`);
        }
      }

      const response = await res.json();

      // If server returns updated modules, use them
      if (response.data?.modules) {
        setSelectedCourse((prev) =>
          prev ? { ...prev, modules: response.data.modules } : prev
        );
      } else if (response.modules) {
        setSelectedCourse((prev) =>
          prev ? { ...prev, modules: response.modules } : prev
        );
      } else {
        // fallback: refetch course details
        await fetchCourseDetails(selectedCourse._id);
      }

      // If we were editing the deleted module, cancel edit
      if (editingModuleIndex !== null && editingModuleIndex === actualIdx) {
        setEditingModuleIndex(null);
        resetForm();
      }
    } catch (e: any) {
      setError(e.message || "Failed to delete module");
      console.error("Delete module error:", e);
    } finally {
      setSaving(false);
    }
  }

  // Start editing a module (we accept the displayed module and its display index)
  function startEditingModuleFromDisplay(moduleItem: Module, displayIdx: number) {
    if (!selectedCourse || !selectedCourse.modules) return;
    // find actual index in stored array
    const actualIdx = getActualModuleIndex(moduleItem, displayIdx);
    if (actualIdx === -1) return;

    const mod = selectedCourse.modules[actualIdx];
    if (!mod) return;

    setEditingModuleIndex(actualIdx);
    setTitle(mod.title || "");
    setDescription(mod.description || "");
    setOrder(mod.order ?? actualIdx);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingModuleIndex(null);
    resetForm();
  }

  function resetForm() {
    setTitle("");
    setDescription("");
    setOrder(1);
    setError(null);
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Course & Module Manager</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Courses List */}
        <div className="col-span-1 bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-medium">Courses</h2>
            <button
              className="text-sm underline hover:text-blue-600 disabled:opacity-50"
              onClick={() => fetchCourses()}
              disabled={loading}
            >
              Refresh
            </button>
          </div>

          {loading && !selectedCourse && (
            <p className="text-sm text-gray-500">Loading...</p>
          )}

          <ul className="space-y-2">
            {courses.length === 0 && !loading && (
              <li className="text-sm text-gray-500">No courses found</li>
            )}
            {courses.map((c) => (
              <li
                key={c._id}
                className={`p-2 rounded hover:bg-gray-50 cursor-pointer transition ${
                  selectedCourse?._id === c._id ? "bg-blue-50 border border-blue-300" : "border border-transparent"
                }`}
                onClick={() => fetchCourseDetails(c._id)}
              >
                <div className="font-medium text-sm">{c.title}</div>
                {c.slug && <div className="text-xs text-gray-500">{c.slug}</div>}
              </li>
            ))}
          </ul>
        </div>

        {/* Course Details & Modules */}
        <div className="col-span-2 bg-white rounded-lg shadow p-4">
          {!selectedCourse ? (
            <div className="text-center py-10 text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <p>Select a course to view and manage modules</p>
            </div>
          ) : (
            <>
              {/* Course Header */}
              <div className="mb-6 pb-4 border-b">
                <h2 className="text-xl font-semibold mb-1">{selectedCourse.title}</h2>
                {selectedCourse.description && (
                  <p className="text-sm text-gray-600">{selectedCourse.description}</p>
                )}
              </div>

              {/* Modules List */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-lg">Modules</h3>
                  <span className="text-xs text-gray-500">
                    {selectedCourse.modules?.length || 0} module(s)
                  </span>
                </div>

                {(!selectedCourse.modules || selectedCourse.modules.length === 0) ? (
                  <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded text-center">
                    No modules yet. Add your first module below.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {(
                      selectedCourse.modules.slice() // shallow copy
                    )
                      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                      .map((m, displayIdx) => {
                        // compute actual index in the stored (unsorted) array:
                        const actualIdx = getActualModuleIndex(m, displayIdx);
                        return (
                          <div key={m._id || displayIdx} className="p-3 border rounded bg-gray-50 hover:bg-gray-100 transition">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded">
                                    #{m.order}
                                  </span>
                                  <span className="font-medium">{m.title}</span>
                                </div>
                                {m.description && (
                                  <p className="text-sm text-gray-600 mt-1 ml-10">{m.description}</p>
                                )}
                                {m.lessons && m.lessons.length > 0 && (
                                  <div className="text-xs text-gray-500 mt-1 ml-10">
                                    {m.lessons.length} lesson(s)
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center gap-2 ml-4">
                                <button
                                  className="text-xs px-2 py-1 border rounded hover:bg-white"
                                  onClick={() => startEditingModuleFromDisplay(m, displayIdx)}
                                  disabled={saving}
                                >
                                  Edit
                                </button>

                                <button
                                  className="text-xs px-2 py-1 border rounded hover:bg-white text-red-600"
                                  onClick={() => handleDeleteModuleFromDisplay(m, displayIdx)}
                                  disabled={saving}
                                >
                                  Delete
                                </button>

                                {m._id && (
                                  <div className="text-xs text-green-600 ml-2 flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Saved
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>

              {/* Add / Edit Module Form */}
              <div className="border-t pt-6">
                <h3 className="font-medium mb-4 text-lg">
                  {editingModuleIndex === null ? "Add New Module" : `Edit Module #${editingModuleIndex + 1}`}
                </h3>

                {error && (
                  <div className="mb-4 text-red-600 text-sm p-3 bg-red-50 border border-red-200 rounded flex items-start gap-2">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Introduction to React"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Brief description of the module content..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Order <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="w-32 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={order}
                      onChange={(e) => setOrder(Number(e.target.value))}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Module display order (lower numbers appear first)
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={handleAddModule}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
                      disabled={saving || !title.trim()}
                    >
                      {saving ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Saving...
                        </span>
                      ) : editingModuleIndex === null ? (
                        "Add Module"
                      ) : (
                        "Save changes"
                      )}
                    </button>

                    {editingModuleIndex !== null && (
                      <button
                        onClick={cancelEdit}
                        className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition"
                        disabled={saving}
                      >
                        Cancel edit
                      </button>
                    )}

                    {editingModuleIndex === null && (
                      <button
                        onClick={resetForm}
                        className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition"
                        disabled={saving}
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
