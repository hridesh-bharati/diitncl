// src/AdminComponents/Students/Exams/admin/pages/AdminCreateExam.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useExam } from "../../context/ExamProvider";

export default function AdminCreateExam() {
  const navigate = useNavigate();
  const { courses, createExam, loading } = useExam();
  const [formData, setFormData] = useState({
    title: "",
    course: "",
    date: "",
    startTime: "",
    duration: 1,
    totalMarks: 100,
    passingMarks: 33
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const examId = await createExam({
      ...formData,
      duration: parseFloat(formData.duration),
      totalMarks: Number(formData.totalMarks),
      passingMarks: Number(formData.passingMarks),
      totalQuestions: 0, status: "Draft"
    });
    if (examId) navigate(`../${examId}/questions`);
  };

  return (
    <div className="container-fluid p-0 bg-light min-vh-100">
      {/* Top Header - Radius 0 */}
      <div className="d-flex align-items-center p-3 bg-white border-bottom sticky-top shadow-sm">
        <button className="btn btn-light btn-sm rounded-0 me-3" onClick={() => navigate("..")}>
          <i className="bi bi-chevron-left"></i>
        </button>
        <h6 className="fw-bold mb-0 text-uppercase letter-spacing-1">Create New Paper</h6>
      </div>

      <div className="container p-3">
        <form onSubmit={handleSubmit} className="bg-white p-4 border shadow-sm rounded-0">
          <div className="row g-3">
            <div className="col-12">
              <label className="small fw-bold text-muted mb-1 uppercase">Exam Title *</label>
              <input type="text" name="title" className="form-control rounded-0  shadow-none" placeholder="Ex: Final Theory Exam." onChange={handleChange} required />
            </div>

            <div className="col-12">
              <label className="small fw-bold text-muted mb-1 uppercase">Select Course *</label>
              <select name="course" className="form-select rounded-0  shadow-none" onChange={handleChange} required>
                <option value="">Choose...</option>
                {courses?.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="col-6">
              <label className="small fw-bold text-muted mb-1 uppercase">Date *</label>
              <input type="date" name="date" className="form-control rounded-0  shadow-none" onChange={handleChange} required />
            </div>

            <div className="col-6">
              <label className="small fw-bold text-muted mb-1 uppercase">Time *</label>
              <input type="time" name="startTime" className="form-control rounded-0  shadow-none" onChange={handleChange} required />
            </div>

            <div className="col-6">
              <label className="small fw-bold text-muted mb-1 uppercase">Hrs</label>
              <input type="number" name="duration" className="form-control rounded-0  shadow-none" step="0.5" defaultValue="1" onChange={handleChange} />
            </div>

            <div className="col-6">
              <label className="small fw-bold text-muted mb-1 uppercase">Passing</label>
              <input type="number" name="passingMarks" className="form-control rounded-0  shadow-none" defaultValue="33" onChange={handleChange} />
            </div>

            <div className="col-12 mt-4">
              <button type="submit" className="btn btn-primary w-100 py-3 rounded-0 fw-bold shadow-sm" disabled={loading}>
                {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : 'NEXT: ADD QUESTIONS'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}