import React, { useState } from "react";

export default function StudentGrievance() {
    const [formData, setFormData] = useState({ name: "", rollNo: "", email: "", issueType: "Certificate", message: "" });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Grievance Data Submitted:", formData);
        setSubmitted(true);
    };

    return (
        <div className="py-5 text-white" style={{ backgroundColor: "#0f172a", minHeight: "100vh" }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6">
                        <div className="card border border-secondary p-4 p-md-5" style={{ backgroundColor: "#1e293b" }}>
                            <h3 className="fw-bold text-warning mb-2 text-center">Student Grievance Cell</h3>
                            <p className="text-white-50 small text-center mb-4">Aapki samasya ka samadhan 24-48 ghante me kiya jayega.</p>

                            {submitted ? (
                                <div className="alert alert-success text-center py-4" role="alert">
                                    <i className="bi bi-check-circle-fill fs-1 d-block mb-2"></i>
                                    <h5 className="fw-bold">Grievance Registered!</h5>
                                    <p className="small mb-0">Our support team will contact you shortly.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label small text-white-50">Full Name</label>
                                        <input type="text" required className="form-color form-control bg-dark text-white border-secondary" onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label small text-white-50">Roll No / Student ID (Optional)</label>
                                        <input type="text" className="form-control bg-dark text-white border-secondary" onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })} />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label small text-white-50">Email Address</label>
                                        <input type="email" required className="form-control bg-dark text-white border-secondary" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label small text-white-50">Category of Grievance</label>
                                        <select className="form-select bg-dark text-white border-secondary" onChange={(e) => setFormData({ ...formData, issueType: e.target.value })}>
                                            <option value="Certificate">Certificate / Marksheet Issue</option>
                                            <option value="Portal">Student Portal Login Issue</option>
                                            <option value="Class">Class / Faculty Related</option>
                                            <option value="Other">Other Issues</option>
                                        </select>
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label small text-white-50">Describe your Problem</label>
                                        <textarea rows="4" required className="form-control bg-dark text-white border-secondary" placeholder="Apni samasya vistar se likhein..." onChange={(e) => setFormData({ ...formData, message: e.target.value })}></textarea>
                                    </div>

                                    <button type="submit" className="btn btn-warning w-100 fw-bold py-2">Submit Complaint</button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}