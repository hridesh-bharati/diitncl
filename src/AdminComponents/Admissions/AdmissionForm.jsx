import React, { useState } from "react";
import { toast } from "react-toastify";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import {
    FaUser, FaUserTie, FaUserFriends, FaGraduationCap,
    FaCalendarAlt, FaHome, FaPhone, FaEnvelope,
    FaCamera, FaSpinner, FaFileSignature
} from "react-icons/fa";

// Import the central data source
import { staticCourses } from "../../Components/HomePage/pages/Course/courseData";

const INITIAL_STATE = {
    name: "", fatherName: "", motherName: "", course: "",
    dob: "", photoUrl: "", mobile: "", email: "", address: ""
};

export default function AdmissionForm() {
    const [loading, setLoading] = useState(false);
    const [imgLoading, setImgLoading] = useState(false);
    const [form, setForm] = useState(INITIAL_STATE);

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const uploadImg = async (file) => {
        if (!file) return;

        const maxSize = 100 * 1024;
        if (file.size > maxSize) {
            toast.error("Image must be smaller than 100KB. Please compress it.");
            return;
        }

        setImgLoading(true);
        try {
            const fd = new FormData();
            fd.append("file", file);
            fd.append("upload_preset", "hridesh99!");
            fd.append("cloud_name", "draowpiml");

            const res = await fetch(
                "https://api.cloudinary.com/v1_1/draowpiml/image/upload",
                { method: "POST", body: fd }
            );

            const data = await res.json();
            if (!res.ok) throw new Error(data.error?.message || "Upload failed");

            setForm(p => ({ ...p, photoUrl: data.secure_url }));
            toast.success("Photo uploaded!");
        } catch (e) {
            toast.error(e.message);
        } finally {
            setImgLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.photoUrl) return toast.error("Please upload student photo");

        setLoading(true);
        try {
            await addDoc(collection(db, "admissions"), {
                ...form,
                status: "pending",
                createdAt: serverTimestamp(),
            });
            toast.success("🎉 Admission Submitted Successfully!");
            setForm(INITIAL_STATE);
        } catch (e) {
            toast.error("Database Error: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-vh-100 bg-light-blue py-4">
            <div className="container">
                <div className="card shadow-lg border-0 overflow-hidden mx-auto" style={{ maxWidth: '800px' }}>

                    <div className="card-header bg-primary d-flex justify-content-center align-items-center text-white py-4">
                        <FaFileSignature className="fs-2 me-3" />
                        <h2 className="mb-0 fw-bold text-center">
                            STUDENT ADMISSION <span className="d-none d-lg-inline">FORM</span>
                        </h2>
                    </div>

                    <div className="card-body p-4 p-md-5">
                        {/* Photo Section */}
                        <div className="text-center mb-5">
                            <div className="position-relative d-inline-block">
                                <div className="photo-frame p-1 border border-3 border-primary rounded-circle bg-white shadow">
                                    <img
                                        src={form.photoUrl || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                                        className="rounded-circle object-fit-cover"
                                        width="140" height="140" alt="Student"
                                    />
                                </div>
                                <label className="photo-upload-btn position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-2 shadow cursor-pointer">
                                    {imgLoading ? <FaSpinner className="spin" /> : <FaCamera />}
                                    <input type="file" hidden accept="image/*" onChange={e => uploadImg(e.target.files[0])} />
                                </label>
                            </div>
                            <p className="text-muted mt-2 small">Max size: 100KB</p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="row g-4">
                                <SectionTitle icon={<FaUser />} title="Personal Details" />

                                <FormInput label="Full Name" name="name" value={form.name} onChange={handleChange} icon={<FaUser color="#0d6efd" />} />

                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <select
                                            className="form-select"
                                            name="course"
                                            value={form.course}
                                            onChange={handleChange}
                                            required
                                            style={{ borderLeft: '4px solid #198754' }}
                                        >
                                            <option value="">Select Course</option>
                                            {/* Mapping directly from staticCourses data */}
                                            {staticCourses.map((course) => (
                                                <option key={course.id} value={course.name}>
                                                    {course.name}
                                                </option>
                                            ))}
                                        </select>
                                        <label><FaGraduationCap className="me-2 text-success" />Course *</label>
                                    </div>
                                </div>

                                <FormInput label="Date of Birth" name="dob" type="date" value={form.dob} onChange={handleChange} icon={<FaCalendarAlt color="#fd7e14" />} />

                                <SectionTitle icon={<FaUserFriends />} title="Guardian Details" />
                                <FormInput label="Father's Name" name="fatherName" value={form.fatherName} onChange={handleChange} icon={<FaUserTie color="#6f42c1" />} />
                                <FormInput label="Mother's Name" name="motherName" value={form.motherName} onChange={handleChange} icon={<FaUserFriends color="#d63384" />} />

                                <SectionTitle icon={<FaPhone />} title="Contact Information" />
                                <FormInput label="Mobile Number" name="mobile" type="tel" value={form.mobile} onChange={handleChange} icon={<FaPhone color="#20c997" />} pattern="[6-9][0-9]{9}" maxLength="10" />
                                <FormInput label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} icon={<FaEnvelope color="#dc3545" />} />

                                <div className="col-12">
                                    <div className="form-floating">
                                        <textarea className="form-control" name="address" value={form.address} onChange={handleChange} required style={{ borderLeft: '4px solid #0dcaf0', minHeight: '100px' }} placeholder="Address" />
                                        <label><FaHome className="me-2 text-info" />Complete Address *</label>
                                    </div>
                                </div>

                                <div className="col-12 mt-4">
                                    <button type="submit" className="btn btn-primary btn-lg w-100 py-3 fw-bold" disabled={loading || imgLoading}>
                                        {loading ? <><FaSpinner className="spin me-2" /> Submitting...</> : "SUBMIT"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div className="card-footer bg-light d-flex justify-content-between small text-muted mb-5 pb-5">
                        <span>© {new Date().getFullYear()} Drishtee Computer Center</span>
                        <span> : 9918151032</span>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .bg-light-blue { background: linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 100%); }
                .photo-frame img { border: 3px solid #e9ecef; }
                .photo-upload-btn:hover { transform: scale(1.1); background-color: #0b5ed7 !important; }
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .form-control, .form-select { border-left-width: 4px !important; }
            `}</style>
        </div>
    );
}

// Helper Components
const SectionTitle = ({ icon, title }) => (
    <div className="col-12 mt-4">
        <h5 className="border-bottom pb-2 text-primary">{icon} <span className="ms-2">{title}</span></h5>
    </div>
);

const FormInput = ({ label, icon, ...props }) => (
    <div className="col-md-6">
        <div className="form-floating">
            <input
                className="form-control"
                required
                placeholder={label}
                style={{ borderLeft: `4px solid ${props.iconColor || '#0d6efd'}` }}
                {...props}
            />
            <label>{icon}<span className="ms-2">{label} *</span></label>
        </div>
    </div>
);