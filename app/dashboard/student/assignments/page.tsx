"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import { useParams } from "next/navigation";

// -------------------------------
// Types (same as your original)
// -------------------------------
export interface Question {
  question: string;
  type: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "SHORT_ANSWER" | "ESSAY";
  options?: string[];
  correctAnswer?: string | string[];
  points: number;
  order: number;
}

export interface Assignment {
  _id: string;
  title: string;
  description?: string;
  type?: string;
  instructions?: string;
  status: string;
  totalPoints?: number;
  passingScore?: number;
  dueDate?: string;
  allowLateSubmission?: boolean;
  latePenalty?: number;
  maxAttempts?: number;
  timeLimit?: number;
  courseId?: { _id: string; title?: string } | null;
  questions: Question[];
}

export interface AnswerEntry {
  questionId: string;
  answer: string | string[];
}

export interface SubmissionResponse {
  _id: string;
  assignmentId: string;
  studentId: string;
  status: string;
  score?: number;
  attemptNumber: number;
  submittedAt: string;
}

interface IUserLS {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

interface IEnrollment {
  _id: string;
  studentId: string | { _id: string };
  courseId: string | { _id: string; title?: string };
}

interface IAssignment {
  _id: string;
  courseId: { _id: string; title?: string } | string;
  title: string;
  description?: string;
  type?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse<T> {
  success?: boolean;
  data: T;
}

// -------------------------------
// Component
// -------------------------------
export default function AssignmentSubmitClient(): React.ReactElement {
  const params = useParams();
  const routeId = (params && (params as any).id) ?? null;

  const [assignmentId, setAssignmentMydataId] = useState<string | null>(routeId);
  const mountedRef = useRef(true);

  // assignment states
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [answers, setAnswers] = useState<AnswerEntry[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [result, setResult] = useState<SubmissionResponse | null>(null);
  const [alert, setAlert] = useState<{ type: string; message: string } | null>(null);

  const startedAtRef = useRef<number>(0);
  const timerRef = useRef<number | null>(null);
  const [timeSpentSec, setTimeSpentSec] = useState<number>(0);

  // stable localStorage key
  const LOCAL_STORAGE_KEY = useMemo(
    () => (assignmentId ? `assignment_draft_${assignmentId}` : "assignment_draft_unknown"),
    [assignmentId]
  );

  // If no route param, attempt to find an assignment based on enrollments -> assignments
  useEffect(() => {
    mountedRef.current = true;

    // if we already have an assignmentId from route, skip discovery logic
    if (assignmentId) {
      return () => {
        mountedRef.current = false;
      };
    }

    async function discoverAssignmentForUser() {
      try {
        console.log("[STEP] start: AssignmentsLogic (discover)");

        // 1) read user from localStorage
        const dd = localStorage.getItem("user");
        const ee: IUserLS | null = dd ? JSON.parse(dd) : null;
        const userId = ee?._id;
        if (!userId) {
          console.warn("[INFO] No user id found in localStorage. Aborting discovery.");
          return;
        }

        // 2) fetch enrollments
        const enrollRes = await fetch("/api/enrollments/my", {
          credentials: "include",
        });
        const enrollJson: ApiResponse<IEnrollment[]> = await enrollRes.json();
        const enrollments = enrollJson?.data ?? [];

        // 3) filter enrollments for this student
        const myEnrollments = enrollments.filter((e) => {
          const sid = typeof e.studentId === "string" ? e.studentId : (e.studentId as any)?._id;
          return sid === userId;
        });

        const enrolledCourseIds = Array.from(
          new Set(
            myEnrollments
              .map((e) => (typeof e.courseId === "string" ? e.courseId : (e.courseId as any)?._id))
              .filter(Boolean) as string[]
          )
        );

        if (enrolledCourseIds.length === 0) {
          console.info("[INFO] No enrolled courses found for user.");
          return;
        }

        // 5) fetch assignments
        const assignRes = await fetch("/api/assignments", {
          credentials: "include",
        });
        const assignJson: ApiResponse<IAssignment[]> = await assignRes.json();
        const allAssignments = assignJson?.data ?? [];

        // 6) filter assignments by enrolled course ids
        const matched = allAssignments.filter((a) => {
          const cid = typeof a.courseId === "string" ? a.courseId : (a.courseId as any)?._id;
          return cid && enrolledCourseIds.includes(cid);
        });

        if (matched.length === 0) {
          console.info("[INFO] No assignments matched enrolled courses.");
          return;
        }

        if (mountedRef.current) {
          setAssignmentMydataId(matched[0]._id);
        }
      } catch (err) {
        console.error("[ERROR] Exception while discovering assignment:", err);
      }
    }

    discoverAssignmentForUser();

    return () => {
      mountedRef.current = false;
    };
  }, [assignmentId]);

  // Load assignment when assignmentId is set/changes
  useEffect(() => {
    let mounted = true;
    mountedRef.current = true;

    if (!assignmentId) {
      setError("No assignment ID found in route.");
      setLoading(false);
      return () => {
        mountedRef.current = false;
      };
    }

    setLoading(true);
    setError(null);

    (async () => {
      try {
        const res = await fetch(`/api/assignments/${assignmentId}`, { credentials: "include" });
        if (!res.ok) {
          const json = await res.json().catch(() => ({}));
          throw new Error(json?.message || `Failed to load assignment (${res.status})`);
        }
        const json = await res.json();
        if (!mounted) return;
        const a: Assignment = (json && json.data) || json;
        setAssignment(a ?? null);

        // load draft or init answers
        const draft = (() => {
          try {
            const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
            return raw ? JSON.parse(raw) : null;
          } catch {
            return null;
          }
        })();

        if (draft && Array.isArray(draft.answers)) {
          setAnswers(draft.answers as AnswerEntry[]);
        } else if (a) {
          const initial = (a.questions || []).map((q, idx) => ({
            questionId: idx.toString(),
            answer: Array.isArray(q.correctAnswer) ? [] : "",
          }));
          setAnswers(initial);
        }

        startedAtRef.current = Date.now();
        timerRef.current = window.setInterval(() => {
          setTimeSpentSec(Math.floor((Date.now() - startedAtRef.current) / 1000));
        }, 1000);

        setLoading(false);
      } catch (err: unknown) {
        if (!mounted) return;
        const message = err instanceof Error ? err.message : String(err);
        setError(message || "Failed to load assignment");
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
      mountedRef.current = false;
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignmentId, LOCAL_STORAGE_KEY]);

  // autosave
  useEffect(() => {
    if (!assignment) return;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ answers }));
    } catch {
      // ignore storage errors
    }
  }, [answers, assignment, LOCAL_STORAGE_KEY]);

  function setAnswer(questionId: string, value: string | string[]) {
    setAnswers((prev) => {
      const copy = [...prev];
      const idx = copy.findIndex((x) => x.questionId === questionId);
      if (idx === -1) {
        copy.push({ questionId, answer: value });
      } else {
        copy[idx] = { ...copy[idx], answer: value };
      }
      return copy;
    });
  }

  function toggleMulti(questionId: string, option: string) {
    setAnswers((prev) => {
      const copy = [...prev];
      const idx = copy.findIndex((x) => x.questionId === questionId);
      if (idx === -1) return prev;

      const current = Array.isArray(copy[idx].answer) ? [...copy[idx].answer] : [];
      const pos = current.indexOf(option);
      if (pos === -1) current.push(option);
      else current.splice(pos, 1);

      copy[idx] = { ...copy[idx], answer: current };
      return copy;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!assignmentId) {
      setAlert({ type: "danger", message: "Missing assignment ID." });
      return;
    }

    setSubmitting(true);
    setAlert(null);

    const payload = {
      answers,
      timeSpent: timeSpentSec,
    };

    try {
      const res = await fetch(`/api/assignments/${assignmentId}/submit`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json?.message || `Submission failed (${res.status})`);
      }

      const data: SubmissionResponse = json.data || json;
      setResult(data ?? null);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }

      setAlert({ type: "success", message: json.message || "Submitted successfully" });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setAlert({ type: "danger", message: message || "Submission failed" });
    } finally {
      setSubmitting(false);
    }
  }

  // Render helpers
  function renderQuestion(q: Question, idx: number) {
    const qId = idx.toString();
    const entry = answers.find((a) => a.questionId === qId);
    const val = entry?.answer ?? (Array.isArray(q.correctAnswer) ? [] : "");

    return (
      <div className="card mb-3" key={qId}>
        <div className="card-body">
          <h6 className="card-title">
            {idx + 1}. {q.question}
          </h6>

          {q.type === "MULTIPLE_CHOICE" && Array.isArray(q.options) && (
            <div>
              {Array.isArray(q.correctAnswer) ? (
                q.options.map((opt, i) => (
                  <div className="form-check" key={i}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`q_${qId}_opt_${i}`}
                      checked={Array.isArray(val) && val.includes(opt)}
                      onChange={() => toggleMulti(qId, opt)}
                    />
                    <label className="form-check-label" htmlFor={`q_${qId}_opt_${i}`}>
                      {opt}
                    </label>
                  </div>
                ))
              ) : (
                q.options.map((opt, i) => (
                  <div className="form-check" key={i}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name={`q_${qId}`}
                      id={`q_${qId}_opt_${i}`}
                      checked={val === opt}
                      onChange={() => setAnswer(qId, opt)}
                    />
                    <label className="form-check-label" htmlFor={`q_${qId}_opt_${i}`}>
                      {opt}
                    </label>
                  </div>
                ))
              )}
            </div>
          )}

          {q.type === "TRUE_FALSE" && (
            <div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name={`q_${qId}`}
                  id={`q_${qId}_true`}
                  checked={val === "true"}
                  onChange={() => setAnswer(qId, "true")}
                />
                <label className="form-check-label" htmlFor={`q_${qId}_true`}>
                  True
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name={`q_${qId}`}
                  id={`q_${qId}_false`}
                  checked={val === "false"}
                  onChange={() => setAnswer(qId, "false")}
                />
                <label className="form-check-label" htmlFor={`q_${qId}_false`}>
                  False
                </label>
              </div>
            </div>
          )}

          {(q.type === "SHORT_ANSWER" || q.type === "ESSAY") && (
            <textarea
              className="form-control"
              rows={q.type === "ESSAY" ? 6 : 2}
              value={typeof val === "string" ? val : ""}
              onChange={(e) => setAnswer(qId, e.target.value)}
            />
          )}

          <div className="mt-2 text-muted small">Points: {q.points ?? "-"} • Type: {q.type}</div>
        </div>
      </div>
    );
  }

  // UI
  if (!assignmentId) return <div className="p-4">No assignment ID found in route.</div>;
  if (loading) return <div className="p-4">Loading assignment...</div>;
  if (error) return <div className="alert alert-danger m-4">{error}</div>;
  if (!assignment) return <div className="alert alert-warning m-4">Assignment not found.</div>;

  return (
    <div className="container my-4">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="mb-3">
            <h3>{assignment.title}</h3>
            <p className="text-muted mb-1">Course: {assignment.courseId?.title || "—"}</p>
            {assignment.description && <p className="mb-1">{assignment.description}</p>}
            <div className="small text-muted">
              Due: {assignment.dueDate ? new Date(assignment.dueDate).toLocaleString() : "No deadline"}
            </div>
            <div className="small text-muted">Status: {assignment.status}</div>
          </div>

          {alert && (
            <div className={`alert alert-${alert.type}`} role="alert">
              {alert.message}
            </div>
          )}

          {result && (
            <div className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">Submission result</h5>
                <p className="mb-1">
                  Status: <strong>{result.status}</strong>
                </p>
                {result.score !== undefined && (
                  <p className="mb-1">
                    Score: <strong>{result.score}</strong>
                  </p>
                )}
                <p className="mb-0">
                  Attempt: {result.attemptNumber} • Submitted at: {new Date(result.submittedAt).toLocaleString()}
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {assignment.questions && assignment.questions.length === 0 && (
              <div className="alert alert-info">No questions available for this assignment.</div>
            )}

            {assignment.questions && assignment.questions.map((q, idx) => renderQuestion(q, idx))}

            <div className="d-flex justify-content-between align-items-center mt-3">
              <div>
                <small className="text-muted">
                  Time spent: {Math.floor(timeSpentSec / 60)}m {timeSpentSec % 60}s
                </small>
                {assignment.allowLateSubmission === false &&
                  assignment.dueDate &&
                  new Date() > new Date(assignment.dueDate) && (
                    <div className="text-danger small">Warning: Assignment deadline has passed. Late submissions are not allowed.</div>
                  )}
              </div>

              <div>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit Assignment"}
                </button>
              </div>
            </div>
          </form>

          <div className="mt-3 small text-muted">Draft is autosaved in your browser. You can continue later.</div>
        </div>
      </div>
    </div>
  );
}
