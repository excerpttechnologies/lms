// src/components/CreateCourseForm.tsx
"use client";
import React, { useEffect, useState } from "react";

type FormState = {
  title: string;
  description: string;
  shortDescription?: string;
  category?: string;
  level?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  price?: number | "";
  capacity?: number | "";
  tags?: string; // comma separated
};

type Course = {
  id?: string | number;
  title: string;
  description: string;
  shortDescription?: string;
  category?: string;
  level?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  price?: number;
  capacity?: number;
  tags?: string[];
  createdAt?: string;
  [key: string]: any;
};

export default function CreateCourseForm() {
  const [form, setForm] = useState<FormState>({
    title: "",
    description: "",
    shortDescription: "",
    category: "",
    level: "BEGINNER",
    price: "",
    capacity: "",
    tags: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // courses list state
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [coursesError, setCoursesError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

 const fetchCourses = async (signal?: AbortSignal) => {
  setLoadingCourses(true);
  setCoursesError(null);
  try {
    const res = await fetch("/api/courses", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal,
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json?.message || "Failed to fetch courses");
    }

    // API returns: { success, message, data:[...] }
    setCourses(Array.isArray(json.data) ? json.data : []);
  } catch (err: any) {
    if (err.name !== "AbortError") {
      setCoursesError(err.message || "Something went wrong fetching courses");
    }
  } finally {
    setLoadingCourses(false);
  }
};


  useEffect(() => {
    const ac = new AbortController();
    fetchCourses(ac.signal);
    return () => ac.abort();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        title: form.title,
        description: form.description,
        shortDescription: form.shortDescription,
        category: form.category,
        level: form.level,
        price: form.price === "" ? undefined : Number(form.price),
        capacity: form.capacity === "" ? undefined : Number(form.capacity),
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : undefined,
      };

      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.message || "Failed to create course");
      }

      setSuccess("Course created successfully");

      // reset form
      setForm({
        title: "",
        description: "",
        shortDescription: "",
        category: "",
        level: "BEGINNER",
        price: "",
        capacity: "",
        tags: "",
      });

      // refresh courses list
      fetchCourses();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (iso?: string) => {
    if (!iso) return "-";
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso;
    }
  };

  return (
    <div className="lg:grid lg:grid-cols-2 h-screen">

      {/* LEFT SECTION — FORM + COURSES TABLE */}
      <div className="bg-base-100 flex flex-col items-center justify-start p-6 overflow-auto">
        <div className="w-full max-w-3xl">

          <div className="mb-6">
            <h3 className="text-base-content text-2xl font-semibold">Create Course</h3>
            <p className="text-base-content/80">Welcome back! Select method to login:</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>

            {/* Alerts */}
            {error && (
              <div className="p-3 rounded bg-red-50 border border-red-200 text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 rounded bg-green-50 border border-green-200 text-green-700">
                {success}
              </div>
            )}

            {/* Title */}
            <div>
              <label htmlFor="title" className="font-medium">Title*</label>
              <input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="Enter course title"
                required
              />
            </div>

            {/* Short Description */}
            <div>
              <label htmlFor="shortDescription" className="font-medium">Short description</label>
              <input
                id="shortDescription"
                name="shortDescription"
                value={form.shortDescription}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="One-line summary (optional)"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="font-medium">Description*</label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                className="textarea textarea-bordered w-full"
                placeholder="Describe the course"
                required
              ></textarea>
            </div>

            {/* Category & Level */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-medium" htmlFor="category">Category</label>
                <input
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  placeholder="e.g. Design, Programming"
                />
              </div>

              <div>
                <label className="font-medium" htmlFor="level">Level</label>
                <select
                  id="level"
                  name="level"
                  value={form.level}
                  onChange={handleChange}
                  className="select select-bordered w-full"
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>
              </div>
            </div>

            {/* Price & Capacity */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-medium" htmlFor="price">Price</label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  value={form.price as any}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  placeholder="0 for free"
                />
              </div>

              <div>
                <label className="font-medium" htmlFor="capacity">Capacity</label>
                <input
                  id="capacity"
                  name="capacity"
                  type="number"
                  value={form.capacity as any}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  placeholder="Max students"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="font-medium" htmlFor="tags">Tags (comma separated)</label>
              <input
                id="tags"
                name="tags"
                value={form.tags}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="ui, react, node"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Course"}
            </button>

          </form>

          {/* Courses Table */}
          <div className="mt-8">
            <h4 className="text-lg font-semibold mb-3">Courses</h4>

            {loadingCourses ? (
              <div className="p-4">Loading courses...</div>
            ) : coursesError ? (
              <div className="p-3 rounded bg-red-50 border border-red-200 text-red-700">
                {coursesError}
              </div>
            ) : courses.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground">No courses found.</div>
            ) : (
              <div className="overflow-x-auto border rounded">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th className="text-left">Title</th>
                      <th className="text-left">Category</th>
                      <th className="text-left">Level</th>
                      <th className="text-right">Price</th>
                      <th className="text-right">Capacity</th>
                      <th className="text-left">Tags</th>
                      <th className="text-left">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((c, idx) => (
                      <tr key={c.id ?? idx}>
                        <td>{c.title}</td>
                        <td>{c.category ?? "-"}</td>
                        <td>{c.level ?? "-"}</td>
                        <td className="text-right">{typeof c.price === "number" ? c.price : "-"}</td>
                        <td className="text-right">{c.capacity ?? "-"}</td>
                        <td>{Array.isArray(c.tags) ? c.tags.join(", ") : (c.tags ?? "-")}</td>
                        <td>{formatDate(c.createdAt)}</td>
                        <td>
                           <button>edit</button>
                           <button>delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT SECTION — IMAGE + TEXT */}
      <div className="relative hidden lg:flex items-center justify-center bg-neutral text-white px-10">
        <div className="max-w-lg">
          <h1 className="text-3xl font-bold mb-4">
            Welcome back! Please sign in to your FlyonUI account
          </h1>

          <p className="opacity-80 mb-6">
            Thank you for registering! Please check your inbox and click the verification link to activate your account.
          </p>

          <img
            src="https://cdn.flyonui.com/fy-assets/avatar/avatar-1.png"
            alt="avatar"
            className="rounded-full w-20 h-20 border-4 border-white shadow"
          />
        </div>
      </div>
    </div>
  );
}
