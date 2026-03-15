// src/AdminComponents/Students/Exams/admin/pages/AdminExamDetail.jsx
import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useExam } from "../../context/ExamProvider";

export default function AdminExamDetail() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { exams, loading } = useExam();

  // Find the current exam details from context
  const exam = useMemo(() => exams.find((e) => e.id === examId), [examId, exams]);

  if (loading) return (
    <div className="d-flex justify-content-center py-5">
      <div className="spinner-border text-primary" role="status"></div>
    </div>
  );

  if (!exam) return (
    <div className="container py-5 text-center">
      <h5 className="text-muted">Exam details not found.</h5>
      <button className="btn btn-primary mt-3" onClick={() => navigate("/admin/exams")}>
        Back to Dashboard
      </button>
    </div>
  );

  return (
    <div className="container-fluid py-4 px-4">
      {/* Header with Back Button */}
      <div className="d-flex align-items-center gap-3 mb-4">
        <button className="btn btn-light rounded-circle shadow-sm" onClick={() => navigate("/admin/exams")}>
          <i className="bi bi-arrow-left"></i>
        </button>
        <div>
          <h4 className="fw-bold mb-0">{exam.title}</h4>
          <span className={`badge rounded-pill ${exam.status === 'Ready' ? 'bg-success' : 'bg-warning text-dark'}`}>
            {exam.status}
          </span>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Col: Exam Summary */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4">
              <h6 className="fw-bold text-muted mb-4 text-uppercase small tracking-wider">Exam Summary</h6>
              
              <div className="mb-3 d-flex justify-content-between">
                <span className="text-muted">Course:</span>
                <span className="fw-bold">{exam.course}</span>
              </div>
              <div className="mb-3 d-flex justify-content-between">
                <span className="text-muted">Exam Date:</span>
                <span className="fw-bold">{new Date(exam.date).toLocaleDateString('en-IN')}</span>
              </div>
              <div className="mb-3 d-flex justify-content-between">
                <span className="text-muted">Start Time:</span>
                <span className="fw-bold">{exam.startTime}</span>
              </div>
              <div className="mb-3 d-flex justify-content-between">
                <span className="text-muted">Duration:</span>
                <span className="fw-bold">{exam.duration} Hours</span>
              </div>
              <hr />
              <div className="mb-3 d-flex justify-content-between">
                <span className="text-muted">Total Marks:</span>
                <span className="fw-bold text-primary">{exam.totalMarks}</span>
              </div>
              <div className="mb-3 d-flex justify-content-between">
                <span className="text-muted">Passing Marks:</span>
                <span className="fw-bold text-danger">{exam.passingMarks}</span>
              </div>
              <div className="mb-0 d-flex justify-content-between">
                <span className="text-muted">Questions:</span>
                <span className="fw-bold">{exam.totalQuestions || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Quick Management Actions */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-body p-4">
              <h6 className="fw-bold text-muted mb-4 text-uppercase small tracking-wider">Management Actions</h6>
              <div className="row g-3">
                <div className="col-md-6">
                  <button 
                    className="btn btn-outline-primary w-100 py-3 rounded-3 d-flex align-items-center justify-content-center gap-2"
                    onClick={() => navigate("questions")}
                  >
                    <i className="bi bi-pencil-square fs-5"></i>
                    <span>Manage Questions</span>
                  </button>
                </div>
                <div className="col-md-6">
                  <button 
                    className="btn btn-outline-success w-100 py-3 rounded-3 d-flex align-items-center justify-content-center gap-2"
                    onClick={() => navigate("assign")}
                  >
                    <i className="bi bi-person-plus fs-5"></i>
                    <span>Assign Students</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Description/Instructions Card */}
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <h6 className="fw-bold text-muted mb-3 text-uppercase small tracking-wider">Exam Instructions</h6>
              <p className="text-dark mb-0 bg-light p-3 rounded-3">
                {exam.description || "No specific instructions provided for this exam."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}