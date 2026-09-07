import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../../AuthContext";

interface Vacancy {
  id: number | string;
  title: string;
  salary: string;
  role: string;
  location?: string;
  deadline?: string;
  skills?: string;
  responsibilities?: string;
}

interface VacancyApplication {
  name: string;
  email: string;
  phone: string;
  coverLetter: string;
}

const isDeadlinePassed = (deadline: string | undefined): boolean => {
  if (!deadline) return false;
  const d = new Date(deadline);
  if (isNaN(d.getTime())) return false;
  const endOfDeadlineDay = new Date(d);
  endOfDeadlineDay.setHours(23, 59, 59, 999);
  return endOfDeadlineDay.getTime() < Date.now();
};

const Vacancies = () => {
  const { user } = useAuth();
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [filter, setFilter] = useState<string>("All");
  const [selectedVacancy, setSelectedVacancy] = useState<Vacancy | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [appliedIds, setAppliedIds] = useState<Set<number | string>>(() => {
    try {
      const stored = localStorage.getItem("appliedVacancyIdsByEmail");
      if (!stored) return new Set();
      const map: Record<string, number[]> = JSON.parse(stored);
      return new Set(Object.keys(map).flatMap((emailKey) => map[emailKey] || []));
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    if (!user?.email) return;
    try {
      const stored = localStorage.getItem("appliedVacancyIdsByEmail");
      if (!stored) return;
      const map: Record<string, (string | number)[]> = JSON.parse(stored);
      const ids = map[user.email.toLowerCase()] || [];
      setAppliedIds(new Set(ids));
    } catch {
      // Ignore
    }
  }, [user]);

  const backendUrl: string = process.env.REACT_APP_BACKEND_URL || "";

  const [formData, setFormData] = useState<VacancyApplication>({
    name: "",
    email: "",
    phone: "",
    coverLetter: "",
  });

  const roles: string[] = ["All", "Cabin Crew", "Pilot", "Maintenance", "Ground Staff", "ATC", "Safety", "Management"];

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/vacancies`);
        if (!cancelled) setVacancies(res.data.data);
      } catch (err) {
        if (!cancelled) setError("Failed to load vacancies. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [backendUrl]);

  const requestSeq = React.useRef<number>(0);

  const fetchFiltered = async (role: string): Promise<void> => {
    const seq = ++requestSeq.current;
    try {
      setLoading(true);
      const res = await axios.get(`${backendUrl}/api/vacancies`, { params: { role } });
      if (seq === requestSeq.current) {
        setVacancies(res.data.data);
        setError("");
      }
    } catch (err) {
      if (seq === requestSeq.current) {
        console.error("Failed to fetch vacancies", err);
      }
    } finally {
      if (seq === requestSeq.current) setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const value: string = e.target.value;
    setFilter(value);
    fetchFiltered(value);
  };

  const openApplyModal = async (vacancy: Vacancy): Promise<void> => {
    try {
      const res = await axios.get(`${backendUrl}/api/vacancies/${vacancy.id}`);
      setSelectedVacancy(res.data.data);
      setShowModal(true);
      setSubmitted(false);
      setCvFile(null);
      setFormData({ name: "", email: "", phone: "", coverLetter: "" });
    } catch (err) {
      console.error("Failed to load vacancy details", err);
    }
  };

  const closeModal = (): void => {
    setShowModal(false);
    setSelectedVacancy(null);
    setSubmitted(false);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files && e.target.files[0];
    setCvFile(file || null);
  };

  const handleApplySubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (selectedVacancy && isDeadlinePassed(selectedVacancy.deadline)) {
      setError("Applications are closed for this vacancy — the deadline has passed.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("email", formData.email);
      fd.append("phone", formData.phone);
      fd.append("coverLetter", formData.coverLetter || "");
      if (cvFile) fd.append("cv", cvFile);
      await axios.post(`${backendUrl}/api/vacancies/${selectedVacancy!.id}/apply`, fd);
      setSubmitted(true);
      setAppliedIds((prev) => {
        const next = new Set(prev).add(selectedVacancy!.id);
        const email = formData.email.toLowerCase();
        try {
          const stored = localStorage.getItem("appliedVacancyIdsByEmail");
          const map: Record<string, (string | number)[]> = stored ? JSON.parse(stored) : {};
          map[email] = [...new Set([...(map[email] || []), selectedVacancy!.id])];
          localStorage.setItem("appliedVacancyIdsByEmail", JSON.stringify(map));
        } catch { /* ignore */ }
        return next;
      });
    } catch (err: any) {
      console.error("Failed to submit application", err);
      setError(err.response?.data?.message || "Failed to submit application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        .vac-page {
          font-family: 'Poppins', sans-serif;
          background: #f4f6fb;
          min-height: 100vh;
        }

        .vac-hero {
          background: linear-gradient(135deg, #001a3d 0%, #00509e 50%, #003f7f 100%);
          text-align: center;
          padding: 70px 20px;
          color: white;
          position: relative;
          overflow: hidden;
        }

        .vac-hero::before {
          content: '';
          position: absolute;
          top: -50%; left: -50%;
          width: 200%; height: 200%;
          background: radial-gradient(circle at 30% 70%, rgba(255,215,0,0.06) 0%, transparent 50%);
          animation: vacGlow 8s ease-in-out infinite;
        }

        .vac-hero h1 {
          position: relative;
          font-size: 2.4rem;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .vac-hero p {
          position: relative;
          font-size: 1.05rem;
          opacity: 0.9;
          max-width: 600px;
          margin: 0 auto;
        }

        @keyframes vacGlow {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -20px); }
        }

        .vac-controls {
          max-width: 1100px;
          margin: 30px auto 0;
          padding: 0 20px;
          display: flex;
          align-items: center;
          gap: 15px;
          flex-wrap: wrap;
        }

        .vac-controls label {
          font-weight: 600;
          color: #001a3d;
          font-size: 15px;
        }

        .vac-controls select {
          padding: 10px 18px;
          border: 2px solid #00509e;
          border-radius: 8px;
          font-size: 15px;
          font-family: 'Poppins', sans-serif;
          color: #001a3d;
          background: white;
          cursor: pointer;
          outline: none;
          transition: all 0.3s ease;
          min-width: 200px;
        }

        .vac-controls select:focus {
          box-shadow: 0 0 0 3px rgba(0,80,158,0.15);
        }

        .vac-table-wrap {
          max-width: 1100px;
          margin: 25px auto 50px;
          padding: 0 20px;
          overflow-x: auto;
        }

        .vac-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }

        .vac-table thead {
          background: linear-gradient(135deg, #001a3d, #00509e);
        }

        .vac-table thead th {
          color: white;
          padding: 16px 20px;
          text-align: left;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .vac-table tbody tr {
          transition: all 0.2s ease;
          animation: vacFadeIn 0.4s ease forwards;
          opacity: 0;
        }

        .vac-table tbody tr:nth-child(1) { animation-delay: 0.05s; }
        .vac-table tbody tr:nth-child(2) { animation-delay: 0.1s; }
        .vac-table tbody tr:nth-child(3) { animation-delay: 0.15s; }
        .vac-table tbody tr:nth-child(4) { animation-delay: 0.2s; }
        .vac-table tbody tr:nth-child(5) { animation-delay: 0.25s; }
        .vac-table tbody tr:nth-child(6) { animation-delay: 0.3s; }
        .vac-table tbody tr:nth-child(7) { animation-delay: 0.35s; }
        .vac-table tbody tr:nth-child(8) { animation-delay: 0.4s; }

        @keyframes vacFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .vac-table tbody tr:hover {
          background: #f0f6ff;
          transform: scale(1.005);
        }

        .vac-table tbody tr:nth-child(even) {
          background: #fafcff;
        }

        .vac-table tbody tr:nth-child(even):hover {
          background: #f0f6ff;
        }

        .vac-table td {
          padding: 15px 20px;
          border-bottom: 1px solid #eef2f7;
          font-size: 15px;
          color: #333;
          vertical-align: middle;
        }

        .vac-table td:last-child {
          text-align: center;
        }

        .vac-table .apply-btn {
          display: inline-block;
          background: linear-gradient(135deg, #ffcc00, #ffdb4d);
          color: #001a3d;
          padding: 9px 22px;
          font-size: 13px;
          font-weight: 700;
          border-radius: 25px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .vac-table .apply-btn:hover {
          background: linear-gradient(135deg, #ffdb4d, #ffe680);
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(255,204,0,0.4);
        }

        .vac-table .apply-btn:disabled {
          background: #e5e7eb;
          color: #999;
          cursor: not-allowed;
          box-shadow: none;
          transform: none;
        }

        .vac-table .deadline-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .vac-table .deadline-badge.expired {
          background: #fef2f2;
          color: #dc2626;
        }

        .vac-table .deadline-badge.open {
          background: #e6f9ee;
          color: #0a7e3f;
        }

        .vac-table .role-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          background: #e8f0fe;
          color: #00509e;
        }

        .vac-table .salary-cell {
          color: #0a7e3f;
          font-weight: 600;
        }

        .vac-table .location-cell {
          color: #666;
          font-size: 13px;
        }

        .vac-empty {
          text-align: center;
          padding: 60px 20px;
          color: #888;
          font-size: 16px;
        }

        .vac-empty span {
          font-size: 48px;
          display: block;
          margin-bottom: 15px;
        }

        /* Modal */
        .vac-modal-overlay {
          position: fixed;
          top: 0; left: 0;
          width: 100%; height: 100%;
          background: rgba(0,0,0,0.6);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          animation: vacOverlayIn 0.3s ease;
          padding: 20px;
        }

        @keyframes vacOverlayIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .vac-modal {
          background: white;
          border-radius: 16px;
          max-width: 650px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          animation: vacModalIn 0.35s ease;
          box-shadow: 0 20px 60px rgba(0,0,0,0.25);
        }

        @keyframes vacModalIn {
          from { opacity: 0; transform: scale(0.92) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        .vac-modal-header {
          background: linear-gradient(135deg, #001a3d, #00509e);
          color: white;
          padding: 25px 30px;
          border-radius: 16px 16px 0 0;
          position: relative;
        }

        .vac-modal-header h2 {
          margin: 0 0 5px;
          font-size: 1.3rem;
        }

        .vac-modal-header p {
          margin: 0;
          opacity: 0.85;
          font-size: 0.9rem;
        }

        .vac-modal-close {
          position: absolute;
          top: 15px; right: 20px;
          background: rgba(255,255,255,0.2);
          border: none;
          color: white;
          width: 32px; height: 32px;
          border-radius: 50%;
          font-size: 18px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.3s ease;
        }

        .vac-modal-close:hover {
          background: rgba(255,255,255,0.35);
        }

        .vac-modal-body {
          padding: 25px 30px;
        }

        .vac-detail-section {
          margin-bottom: 20px;
        }

        .vac-detail-section h3 {
          color: #001a3d;
          font-size: 1rem;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .vac-detail-section h3 .icon {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        }

        .vac-detail-section ul {
          margin: 0;
          padding-left: 20px;
        }

        .vac-detail-section ul li {
          padding: 5px 0;
          color: #444;
          font-size: 14px;
          line-height: 1.5;
        }

        .vac-detail-meta {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 20px;
          padding: 15px;
          background: #f8fafd;
          border-radius: 10px;
        }

        .vac-meta-item {
          display: flex;
          flex-direction: column;
        }

        .vac-meta-item label {
          font-size: 11px;
          font-weight: 600;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .vac-meta-item span {
          font-size: 14px;
          color: #001a3d;
          font-weight: 600;
        }

        .vac-apply-form {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 2px solid #eef2f7;
        }

        .vac-apply-form h3 {
          color: #001a3d;
          font-size: 1rem;
          margin-bottom: 15px;
        }

        .vac-form-group {
          margin-bottom: 14px;
        }

        .vac-form-group label {
          display: block;
          font-weight: 600;
          color: #001a3d;
          margin-bottom: 6px;
          font-size: 13px;
        }

        .vac-form-group input,
        .vac-form-group textarea {
          width: 100%;
          padding: 10px 14px;
          border: 1.5px solid #dde3ea;
          border-radius: 8px;
          font-size: 14px;
          font-family: 'Poppins', sans-serif;
          outline: none;
          transition: border-color 0.3s ease;
          box-sizing: border-box;
        }

        .vac-form-group input:focus,
        .vac-form-group textarea:focus {
          border-color: #00509e;
          box-shadow: 0 0 0 3px rgba(0,80,158,0.1);
        }

        .vac-form-group textarea {
          resize: vertical;
          min-height: 80px;
        }

        .vac-submit-btn {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #00509e, #003f7f);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          font-family: 'Poppins', sans-serif;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 5px;
        }

        .vac-submit-btn:hover {
          background: linear-gradient(135deg, #003f7f, #001a3d);
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(0,63,127,0.3);
        }

        .vac-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .vac-success-msg {
          text-align: center;
          padding: 30px 20px;
        }

        .vac-success-msg .check-icon {
          width: 60px;
          height: 60px;
          background: #e6f9ee;
          color: #0a7e3f;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          margin-bottom: 15px;
        }

        .vac-success-msg h3 {
          color: #001a3d;
          margin-bottom: 8px;
        }

        .vac-success-msg p {
          color: #666;
          font-size: 14px;
          margin-bottom: 20px;
        }

        .vac-success-msg button {
          padding: 10px 24px;
          background: #00509e;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .vac-success-msg button:hover {
          background: #003f7f;
        }

        .vac-closed-msg {
          text-align: center;
          padding: 35px 20px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 12px;
          margin-top: 10px;
        }

        .vac-closed-msg .vac-closed-icon {
          width: 60px;
          height: 60px;
          background: #dc2626;
          color: white;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          margin-bottom: 15px;
        }

        .vac-closed-msg h3 {
          color: #991b1b;
          margin-bottom: 8px;
        }

        .vac-closed-msg p {
          color: #7f1d1d;
          font-size: 14px;
          margin-bottom: 20px;
        }

        .vac-closed-msg button {
          padding: 10px 24px;
          background: #00509e;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .vac-closed-msg button:hover {
          background: #003f7f;
        }

        .vac-note {
          text-align: center;
          margin: 0 auto 50px;
          padding: 20px;
          background: #f0f6ff;
          border-radius: 12px;
          max-width: 700px;
          font-size: 0.9rem;
          color: #444;
          border: 1px solid #d6e4f5;
        }

        .vac-note a {
          color: #00509e;
          font-weight: 600;
          text-decoration: none;
        }

        .vac-note a:hover {
          text-decoration: underline;
        }

        .vac-loading {
          text-align: center;
          padding: 60px 20px;
          color: #888;
        }

        .vac-loading .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #e0e0e0;
          border-top-color: #00509e;
          border-radius: 50%;
          animation: vacSpin 0.8s linear infinite;
          margin: 0 auto 15px;
        }

        @keyframes vacSpin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .vac-hero h1 { font-size: 1.6rem; }
          .vac-controls { flex-direction: column; align-items: stretch; }
          .vac-controls select { min-width: auto; }
          .vac-modal { margin: 10px; }
          .vac-modal-body { padding: 20px; }
          .vac-detail-meta { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="vac-page">
        <div className="vac-hero">
          <h1>Career Vacancies</h1>
          <p>Explore exciting aviation opportunities worldwide. Filter by role and apply directly.</p>
        </div>

        <div className="vac-controls">
          <label htmlFor="roleFilter">Filter by Role:</label>
          <select id="roleFilter" value={filter} onChange={handleFilterChange}>
            {roles.map((r: string) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <span style={{ color: "#666", fontSize: 14 }}>
            {vacancies.length} {vacancies.length === 1 ? "vacancy" : "vacancies"} found
          </span>
        </div>

        <div className="vac-table-wrap">
          {loading ? (
            <div className="vac-loading">
              <div className="spinner"></div>
              <p>Loading vacancies...</p>
            </div>
          ) : error ? (
            <div className="vac-empty">
              <span>&#9888;</span>
              <p>{error}</p>
            </div>
          ) : vacancies.length === 0 ? (
            <div className="vac-empty">
              <span>&#128203;</span>
              <p>No vacancies found for the selected role.</p>
            </div>
          ) : (
            <table className="vac-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Salary</th>
                  <th>Role</th>
                  <th>Location</th>
                  <th>Deadline</th>
                  <th>Apply</th>
                </tr>
              </thead>
              <tbody>
                {vacancies.map((v: Vacancy) => {
                  const expired: boolean = isDeadlinePassed(v.deadline);
                  return (
                    <tr key={v.id}>
                      <td style={{ fontWeight: 600 }}>{v.title}</td>
                      <td className="salary-cell">{v.salary}</td>
                      <td><span className="role-badge">{v.role}</span></td>
                      <td className="location-cell">{v.location || "N/A"}</td>
                      <td>
                        {expired ? (
                          <span className="deadline-badge expired">Closed</span>
                        ) : (
                          <span className="deadline-badge open">{v.deadline || "Open"}</span>
                        )}
                      </td>
                      <td>
                        <button
                          className="apply-btn"
                          onClick={() => openApplyModal(v)}
                          disabled={expired || appliedIds.has(v.id)}
                        >
                          {expired ? "Closed" : appliedIds.has(v.id) ? "Applied" : "Apply Now"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="vac-note">
          Don't see what you're looking for?{" "}
          <Link to="/careers/become-an-employee">
            Submit your interest
          </Link>{" "}
          and we'll notify you when new positions open up.
        </div>

        {showModal && selectedVacancy && (
          <div className="vac-modal-overlay" onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            if (e.target === e.currentTarget) closeModal();
          }}>
            <div className="vac-modal">
              <div className="vac-modal-header">
                <h2>{selectedVacancy.title}</h2>
                <p>{selectedVacancy.role} &middot; {selectedVacancy.location}</p>
                <button className="vac-modal-close" onClick={closeModal}>&times;</button>
              </div>

              <div className="vac-modal-body">
                <div className="vac-detail-meta">
                  <div className="vac-meta-item">
                    <label>Salary</label>
                    <span>{selectedVacancy.salary}</span>
                  </div>
                  <div className="vac-meta-item">
                    <label>Location</label>
                    <span>{selectedVacancy.location || "N/A"}</span>
                  </div>
                  <div className="vac-meta-item">
                    <label>Role</label>
                    <span>{selectedVacancy.role}</span>
                  </div>
                  <div className="vac-meta-item">
                    <label>Deadline</label>
                    <span>{selectedVacancy.deadline || "Open"}</span>
                  </div>
                </div>

                {selectedVacancy.skills && (
                  <div className="vac-detail-section">
                    <h3>
                      <span className="icon" style={{ background: "#e8f0fe", color: "#00509e" }}>&#9733;</span>
                      Required Skills
                    </h3>
                    <ul>
                      {selectedVacancy.skills.split(",").map((s: string, i: number) => (
                        <li key={i}>{s.trim()}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedVacancy.responsibilities && (
                  <div className="vac-detail-section">
                    <h3>
                      <span className="icon" style={{ background: "#fff3e0", color: "#e65100" }}>&#9881;</span>
                      Responsibilities
                    </h3>
                    <ul>
                      {selectedVacancy.responsibilities.split(",").map((r: string, i: number) => (
                        <li key={i}>{r.trim()}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {isDeadlinePassed(selectedVacancy.deadline) ? (
                  <div className="vac-closed-msg">
                    <div className="vac-closed-icon">&#128274;</div>
                    <h3>Applications Closed</h3>
                    <p>
                      Unfortunately, the application deadline for this vacancy
                      ({selectedVacancy.deadline}) has already passed, so new applications are no longer accepted.
                    </p>
                    <button onClick={closeModal}>Close</button>
                  </div>
                ) : !submitted ? (
                  <div className="vac-apply-form">
                    <h3>Apply for this Position</h3>
                    <form onSubmit={handleApplySubmit}>
                      <div className="vac-form-group">
                        <label>Full Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleFormChange}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      <div className="vac-form-group">
                        <label>Email *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleFormChange}
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                      <div className="vac-form-group">
                        <label>Phone *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleFormChange}
                          placeholder="+977 98xxxxxxxx"
                          required
                        />
                      </div>
                      <div className="vac-form-group">
                        <label>Cover Letter</label>
                        <textarea
                          name="coverLetter"
                          value={formData.coverLetter}
                          onChange={handleFormChange}
                          rows={4}
                          placeholder="Tell us why you're a great fit..."
                        ></textarea>
                      </div>
                      <div className="vac-form-group">
                        <label>Upload CV (PDF, DOC, DOCX, JPG, PNG - max 5MB)</label>
                        <input
                          type="file"
                          name="cv"
                          accept=".pdf,.doc,.docx,image/jpeg,image/png"
                          onChange={handleCvChange}
                        />
                        {cvFile && (
                          <span style={{ fontSize: "12px", color: "#0a7e3f" }}>{cvFile.name}</span>
                        )}
                      </div>
                      <button type="submit" className="vac-submit-btn" disabled={submitting}>
                        {submitting ? "Submitting..." : "Submit Application"}
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="vac-success-msg">
                    <div className="check-icon">&#10003;</div>
                    <h3>Application Submitted!</h3>
                    <p>Thank you for applying. Our team will review your application and get back to you soon.</p>
                    <button onClick={closeModal}>Close</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Vacancies;
