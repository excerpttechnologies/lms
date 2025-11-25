"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

// Types
export type StudentRef = {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string | null;
};

export type Submission = {
  _id: string;
  assignmentId: string;
  studentId: StudentRef | null;
  status: "LATE" | "SUBMITTED" | "GRADED" | string;
  score?: number | null;
  attemptNumber: number;
  submittedAt: string;
  answers?: Array<{ questionId: string; answer: string | string[] }>;
  timeSpent?: number;
};

export default function AssignmentSubmissionsClient(): React.ReactElement {
 
  const assignmentId = "69245b1252b8f534867b1de0";

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selected, setSelected] = useState<Submission | null>(null);
  const [grading, setGrading] = useState<{ score?: number; feedback?: string } | null>(null);
  const [savingGrade, setSavingGrade] = useState<boolean>(false);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  useEffect(() => {
    if (!assignmentId) return;
    fetchSubmissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignmentId]);

  async function fetchSubmissions() {
    if (!assignmentId) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/assignments/${assignmentId}/submissions`, {
        credentials: "include",
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message || `Failed to load (${res.status})`);
      const data = json.data ?? json;
      setSubmissions(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  function filteredList(): Submission[] {
    if (filterStatus === "ALL") return submissions;
    return submissions.filter((s) => s.status === filterStatus);
  }

  function openDetail(sub: Submission) {
    setSelected(sub);
    setGrading({ score: sub.score ?? undefined, feedback: undefined });
  }

  function closeDetail() {
    setSelected(null);
    setGrading(null);
  }

  function onChangeScore(v: string) {
    const n = v === "" ? undefined : Number(v);
    setGrading((g) => ({ ...(g ?? {}), score: n }));
  }

  function onChangeFeedback(v: string) {
    setGrading((g) => ({ ...(g ?? {}), feedback: v }));
  }

  async function saveGrade() {
    if (!selected || !assignmentId) return;
    if (grading == null) return;
    setSavingGrade(true);

    try {
      // NOTE: backend route for grading may vary. This UI sends a PUT to /api/submissions/:id
      // with { score, status: 'GRADED', feedback } — adapt if your backend uses a different path.
      const res = await fetch(`/api/submissions/${selected._id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score: grading.score, status: "GRADED", feedback: grading.feedback }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message || `Failed to save (${res.status})`);

      // update the local list
      setSubmissions((prev) => prev.map((p) => (p._id === selected._id ? { ...p, score: grading.score ?? p.score, status: "GRADED" } : p)));
      setSelected((s) => (s ? { ...s, score: grading.score ?? s.score, status: "GRADED" } : s));
      closeDetail();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSavingGrade(false);
    }
  }

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Submissions</h4>
        <div>
          <button className="btn btn-secondary me-2" onClick={() => fetchSubmissions()} disabled={loading}>
            Refresh
          </button>
          <select className="form-select d-inline-block w-auto" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="ALL">All</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="LATE">Late</option>
            <option value="GRADED">Graded</option>
          </select>
        </div>
      </div>

      {loading && <div className="p-3">Loading submissions...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && submissions.length === 0 && <div className="alert alert-info">No submissions found.</div>}

      {!loading && submissions.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Student</th>
                <th>Email</th>
                <th>Status</th>
                <th>Score</th>
                <th>Attempt</th>
                <th>Submitted At</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredList().map((s) => (
                <tr key={s._id}>
                  <td>
                    {s.studentId ? `${s.studentId.firstName ?? ""} ${s.studentId.lastName ?? ""}`.trim() : "—"}
                  </td>
                  <td>{s.studentId?.email ?? "—"}</td>
                  <td>{s.status}</td>
                  <td>{s.score ?? "—"}</td>
                  <td>{s.attemptNumber}</td>
                  <td>{new Date(s.submittedAt).toLocaleString()}</td>
                  <td>
                    <div className="btn-group" role="group">
                      <button className="btn btn-sm btn-outline-primary" onClick={() => openDetail(s)}>View</button>
                      <button className="btn btn-sm btn-outline-success" onClick={() => openDetail(s)}>Grade</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal - Submission Detail */}
      {selected && (
        <div className="modal show d-block" tabIndex={-1} role="dialog">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Submission - {selected.studentId ? (((`${selected.studentId.firstName ?? ""} ${selected.studentId.lastName ?? ""}`).trim() || selected.studentId.email) ?? "Student") : "Student"}
                </h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={closeDetail}></button>
              </div>
              <div className="modal-body">
                <div className="mb-2">
                  <strong>Status:</strong> {selected.status} • <strong>Attempt:</strong> {selected.attemptNumber} • <strong>Submitted:</strong> {new Date(selected.submittedAt).toLocaleString()}
                </div>

                <div className="mb-3">
                  <h6>Answers</h6>
                  {selected.answers && selected.answers.length > 0 ? (
                    selected.answers.map((a, i) => (
                      <div key={i} className="card mb-2">
                        <div className="card-body">
                          <div className="small text-muted">Question ID: {a.questionId}</div>
                          <div>{Array.isArray(a.answer) ? a.answer.join(", ") : a.answer}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-muted">No answers included (might be file submissions or auto-graded only).</div>
                  )}
                </div>

                <div>
                  <h6>Grade</h6>
                  <div className="mb-2">
                    <label className="form-label">Score</label>
                    <input className="form-control" type="number" min={0} value={grading?.score ?? ""} onChange={(e) => onChangeScore(e.target.value)} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Feedback (optional)</label>
                    <textarea className="form-control" rows={3} value={grading?.feedback ?? ""} onChange={(e) => onChangeFeedback(e.target.value)} />
                  </div>
                </div>

                {error && <div className="alert alert-danger">{error}</div>}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeDetail}>Close</button>
                <button type="button" className="btn btn-primary" onClick={saveGrade} disabled={savingGrade}>{savingGrade ? 'Saving...' : 'Save Grade'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
