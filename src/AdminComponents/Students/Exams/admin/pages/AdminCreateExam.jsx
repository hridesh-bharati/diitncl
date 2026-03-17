// src/AdminComponents/Students/Exams/admin/pages/AdminCreateExam.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useExam } from "../../context/ExamProvider";
import BackButton from "../../../../../Components/HelperCmp/BackButton/BackButton";

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

  // 🔥 UPDATED: End Time with AM/PM Format
  const calculateEndTime = (start, durationHrs) => {
    if (!start) return "";
    const [hours, minutes] = start.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0);

    // Duration add karein
    date.setMinutes(date.getMinutes() + (durationHrs * 60));

    // 12-hour format with AM/PM
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Auto calculate end time before saving
    const endTime = calculateEndTime(formData.startTime, parseFloat(formData.duration));

    const examId = await createExam({
      ...formData,
      endTime: endTime, // 👈 Ab ye DB mein save hoga aur email template mein dikhega
      duration: parseFloat(formData.duration),
      totalMarks: Number(formData.totalMarks),
      passingMarks: Number(formData.passingMarks),
      totalQuestions: 0,
      status: "Draft"
    });

    if (examId) navigate(`../${examId}/questions`);
  };

  return (
    <div className="container-fluid p-0 bg-light min-vh-100">
      <div className="d-flex align-items-center p-3 bg-white border-bottom sticky-top shadow-sm">
        <BackButton />   Create New Paper
      </div>

      <div className="container p-3">
        <form onSubmit={handleSubmit} className="bg-white p-4 border shadow-sm rounded-0">
          <div className="row g-3">
            <div className="col-12">
              <label className="small fw-bold text-muted mb-1 uppercase">Exam Title *</label>
              <input type="text" name="title" className="form-control rounded-0 shadow-none" placeholder="Ex: Final Theory Exam." onChange={handleChange} required />
            </div>

            <div className="col-12">
              <label className="small fw-bold text-muted mb-1 uppercase">Select Course *</label>
              <select name="course" className="form-select rounded-0 shadow-none" onChange={handleChange} required>
                <option value="">Choose...</option>
                {courses?.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="col-6">
              <label className="small fw-bold text-muted mb-1 uppercase">Date *</label>
              <input type="date" name="date" className="form-control rounded-0 shadow-none" onChange={handleChange} required />
            </div>

            <div className="col-6">
              <label className="small fw-bold text-muted mb-1 uppercase">Start Time *</label>
              <input type="time" name="startTime" className="form-control rounded-0 shadow-none" onChange={handleChange} required />
            </div>

            <div className="col-6">
              <label className="small fw-bold text-muted mb-1 uppercase">Duration (Hrs)</label>
              <input type="number" name="duration" className="form-control rounded-0 shadow-none" step="0.5" defaultValue="1" onChange={handleChange} />
            </div>

            <div className="col-6">
              <label className="small fw-bold text-muted mb-1 uppercase">Passing Marks</label>
              <input type="number" name="passingMarks" className="form-control rounded-0 shadow-none" defaultValue="33" onChange={handleChange} />
            </div>

            {/* 🔥 Preview logic (Optional but good for Admin) */}
            {formData.startTime && (
              <div className="col-12">
                <div className="alert alert-info py-2 rounded-0 small border-0 shadow-sm">
                  <i className="bi bi-clock-fill me-2"></i>
                  Exam Schedule:
                  <strong className="ms-1">
                    {/* Start Time ko format karne ke liye */}
                    {new Date(`2000-01-01T${formData.startTime}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                  </strong>
                  <span className="mx-2">to</span>
                  <strong className="text-danger">
                    {calculateEndTime(formData.startTime, parseFloat(formData.duration))}
                  </strong>
                </div>
              </div>
            )}

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