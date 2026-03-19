// diit\src\AdminComponents\Admissions\AdmissionForm.jsx
import { useEffect } from "react";
import React, { useState } from "react";
import { toast } from "react-toastify";
import {
    doc,
    getDoc,
    setDoc,
    collection,
    serverTimestamp,
    query,
    where,
    getDocs
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { staticCourses } from "../../Components/HomePage/pages/Course/courseData";
// 🔥 Import otpTemplate for the verification mail
import { sendEmailNotification, adminAdmissionAlertTemplate, sendPushNotification, otpTemplate } from "../../services/emailService";

import { ADMIN_ALLOWED_EMAILS } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";

const BRANCHES = [
    { id: "DIIT124", name: "DIIT124 - Main Branch" },
    { id: "DIIT125", name: "DIIT125 - East Branch" }
];

// ✅ Convert YYYY-MM-DD to DD/MM/YY
const formatToDDMMYY = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
};

// ✅ Get today in YYYY-MM-DD
const getTodayInputFormat = () => {
    return new Date().toISOString().split("T")[0];
};

const INITIAL_STATE = {
    name: "",
    fatherName: "",
    motherName: "",
    course: "",
    dob: "",
    photoUrl: "",
    mobile: "",
    email: "",
    address: "",
    branch: "",
    aadharNo: "",
    gender: "",
    category: "",
    pincode: "",
    city: "",
    state: "",
    village: "",
    post: "",
    thana: "",
    qualification: "",
    admissionDate: getTodayInputFormat()
};

export default function AdmissionForm() {
    const [loading, setLoading] = useState(false);
    const [imgLoading, setImgLoading] = useState(false);
    const [isDeclared, setIsDeclared] = useState(false);
    const [form, setForm] = useState(INITIAL_STATE);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submittedData, setSubmittedData] = useState(null);

    // 🛡️ OTP STATES
    const [otpInput, setOtpInput] = useState("");
    const [generatedOtp, setGeneratedOtp] = useState(null);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [verifying, setVerifying] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (["mobile", "pincode", "aadharNo"].includes(name)) {
            if (value !== "" && !/^\d+$/.test(value)) return;
        }
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const uploadImg = async (file) => {
        if (!file) return;
        if (file.size > 50 * 1024) {
            toast.error("Photo size must be less than 50KB!");
            return;
        }
        setImgLoading(true);
        const fd = new FormData();
        fd.append("file", file);
        fd.append("upload_preset", "hridesh99!");

        try {
            const res = await fetch("https://api.cloudinary.com/v1_1/draowpiml/image/upload", {
                method: "POST",
                body: fd
            });
            const data = await res.json();
            setForm(p => ({ ...p, photoUrl: data.secure_url }));
            toast.success("Photo Uploaded Successfully");
        } catch (e) {
            toast.error("Upload failed");
        } finally {
            setImgLoading(false);
        }
    };

    useEffect(() => {
        const savedPhoto = localStorage.getItem("editedPhoto");
        if (savedPhoto) {
            const processEditedPhoto = async () => {
                try {
                    const res = await fetch(savedPhoto);
                    const blob = await res.blob();
                    if (blob.size > 0) {
                        const file = new File([blob], "edited_photo.jpg", { type: "image/jpeg" });
                        await uploadImg(file);
                        localStorage.removeItem("editedPhoto");
                    }
                } catch (err) {
                    console.error("Error processing edited photo:", err);
                }
            };
            processEditedPhoto();
        }
    }, []);

    // 📧 OTP SEND LOGIC
    const handleSendOtp = async () => {
        if (!form.email || !form.name) {
            return toast.warning("Please enter Name and Email first!");
        }
        setVerifying(true);
        const newOtp = Math.floor(100000 + Math.random() * 900000);
        
        const success = await sendEmailNotification(
            form.email, 
            "Verify your Email - DIIT Admission", 
            otpTemplate(form.name, newOtp)
        );

        if (success) {
            setGeneratedOtp(newOtp);
            setOtpSent(true);
            toast.success("Verification code sent to " + form.email);
        } else {
            toast.error("Failed to send OTP. Try again.");
        }
        setVerifying(false);
    };

    // ✅ OTP VERIFY LOGIC
    const handleVerifyOtp = () => {
        if (otpInput === String(generatedOtp)) {
            setIsEmailVerified(true);
            toast.success("Email Verified! ✅");
        } else {
            toast.error("Invalid OTP!");
        }
    };

    const handleAutoAddress = (e) => {
        if (e.target.checked) {
            const { village, post, thana, city, state, pincode } = form;
            if (!village || !pincode) {
                toast.warning("Please fill village and pincode first!");
                return;
            }
            const fullAddr = `Vill: ${village}, PO: ${post}, PS: ${thana}, Dist: ${city}, State: ${state} - ${pincode}`;
            setForm(prev => ({ ...prev, address: fullAddr }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check verification first
        if (!isEmailVerified) return toast.error("Please verify your email first!");

        if (form.aadharNo?.trim()) {
            if (!/^\d{12}$/.test(form.aadharNo)) {
                return toast.error("Aadhar must be exactly 12 digits");
            }
        }

        if (form.mobile && form.mobile.length !== 10) return toast.error("Mobile number must be 10 digits");
        if (!form.photoUrl) return toast.error("Please upload Photo");
        if (!isDeclared) return toast.error("Please accept the Declaration");

        setLoading(true);
        const applicationId = "DCC-" + Math.floor(100000 + Math.random() * 900000);

        try {
            const email = form.email.trim().toLowerCase();
            const docRef = doc(db, "admissions", email);
            const existing = await getDoc(docRef);

            if (existing.exists()) {
                setLoading(false);
                return toast.error("Email already registered!");
            }

            const formattedAdmissionDate = formatToDDMMYY(form.admissionDate);
            const formattedDob = form.dob ? formatToDDMMYY(form.dob) : "";

            const finalData = {
                ...form,
                applicationId,
                email,
                admissionDate: formattedAdmissionDate,
                dob: formattedDob,
                status: "pending",
                createdAt: serverTimestamp(),
                appliedDate: new Date().toISOString()
            };
            if (!finalData.aadharNo) {
                delete finalData.aadharNo;
            }
            await setDoc(docRef, finalData);

            // Notify Admins
            const fetchAndNotifyAdmins = async () => {
                try {
                    const qAdmin = query(collection(db, "users"), where("role", "==", "admin"));
                    const adminSnap = await getDocs(qAdmin);
                    adminSnap.forEach((doc) => {
                        const adminData = doc.data();
                        if (adminData.pushSubscription) {
                            sendPushNotification(
                                adminData,
                                "New Admission Alert! 🎓",
                                `${form.name} has applied for ${form.course}.`,
                                "/admin/students"
                            );
                        }
                    });
                } catch (err) {
                    console.error("Admin Push Error:", err);
                }
            };

            fetchAndNotifyAdmins();

            Promise.all(
                ADMIN_ALLOWED_EMAILS.map(adminEmail =>
                    sendEmailNotification(
                        adminEmail,
                        `New Admission: ${form.name}`,
                        adminAdmissionAlertTemplate(finalData)
                    )
                )
            ).catch(err => console.error("Background Email Error:", err));

            setSubmittedData(finalData);
            setIsSubmitted(true);
            window.scrollTo(0, 0);
            new Audio("/audio/ring.mp3").play().catch(() => { });
            toast.success("Admission Submitted Successfully!");

        } catch (e) {
            console.error("Submission Error:", e);
            toast.error("System Error: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    // ===================== RECEIPT VIEW =====================
    if (isSubmitted) {
        return (
            <div className="container py-5 mb-5 mb-lg-0">
                <div className="receipt-box mx-auto p-4 bg-white border shadow" id="print-area">
                    <div className="text-center mb-4 border-bottom pb-3">
                        <img src="images/icon/logo.png" alt="Logo" style={{ height: '60px' }} className="mb-2" />
                        <h2 className="receipt-main-title">DRISHTEE COMPUTER CENTER</h2>
                        <p className="receipt-sub-title text-uppercase">A complete I.T. institute</p>
                        <div className="mt-2">
                            <span className="badge bg-dark px-4 py-2">ADMISSION SLIP - 2026</span>
                        </div>
                    </div>

                    <div className="row g-0 border">
                        <div className="col-8 p-3">
                            <table className="table table-sm table-borderless mb-0" style={{ fontSize: '13px' }}>
                                <tbody>
                                    <tr>
                                        <th width="40%">Application ID:</th>
                                        <td className="fw-bold text-primary">{submittedData.applicationId}</td>                                    </tr>
                                    <tr>
                                        <th>Study Center:</th>
                                        <td>{submittedData.branch}</td>
                                    </tr>
                                    <tr>
                                        <th>Course:</th>
                                        <td className="fw-bold text-danger">{submittedData.course}</td>
                                    </tr>
                                    <tr>
                                        <th>Qualification:</th>
                                        <td>{submittedData.qualification}</td>
                                    </tr>
                                    <tr>
                                        <th>Admission Date:</th>
                                        <td>{submittedData.admissionDate}</td>
                                    </tr>
                                    <tr>
                                        <th>Student Name:</th>
                                        <td className="fw-bold">{submittedData.name}</td>
                                    </tr>
                                    <tr>
                                        <th>Father's Name:</th>
                                        <td>{submittedData.fatherName}</td>
                                    </tr>
                                    <tr>
                                        <th>Mother's Name:</th>
                                        <td>{submittedData.motherName}</td>
                                    </tr>
                                    <tr>
                                        <th>Date of Birth:</th>
                                        <td>{submittedData.dob}</td>
                                    </tr>
                                    <tr>
                                        <th>Gender:</th>
                                        <td>{submittedData.gender}</td>
                                    </tr>
                                    <tr>
                                        <th>Aadhar No:</th>
                                        <td>{submittedData.aadharNo || "—"}</td>
                                    </tr>
                                    <tr>
                                        <th>Mobile:</th>
                                        <td>{submittedData.mobile}</td>
                                    </tr>
                                    <tr>
                                        <th>Email:</th>
                                        <td>{submittedData.email}</td>
                                    </tr>
                                    <tr>
                                        <th colSpan="2" className="pt-2 text-muted border-top text-uppercase" style={{ fontSize: '10px' }}>
                                            Address Details:
                                        </th>
                                    </tr>
                                    <tr>
                                        <td colSpan="2" className="small">
                                            <strong>Village:</strong> {submittedData.village}<br />
                                            <strong>Post:</strong> {submittedData.post}<br />
                                            <strong>Thana:</strong> {submittedData.thana}<br />
                                            <strong>City:</strong> {submittedData.city}<br />
                                            <strong>State:</strong> {submittedData.state}<br />
                                            <strong>Pincode:</strong> {submittedData.pincode}<br />
                                            <strong>Full Address:</strong> {submittedData.address}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="col-4 border-start d-flex flex-column align-items-center justify-content-center p-2 bg-light">
                            <img
                                src={submittedData.photoUrl}
                                alt="Student"
                                style={{ width: '130px', height: '150px', objectFit: 'cover', border: '2px solid #001529' }}
                            />
                            <div className="mt-5 text-center">
                                <div style={{ height: '40px' }}></div>
                                <small className="border-top pt-1 d-block px-2 fw-bold">Authorized Signatory</small>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-4 no-print d-flex justify-content-center gap-3">
                    <button onClick={() => window.print()} className="btn btn-dark px-4">
                        <i className="bi bi-printer me-2"></i> PRINT SLIP
                    </button>
                    <button onClick={() => window.location.reload()} className="btn btn-outline-primary px-4">
                        <i className="bi bi-house-door me-2"></i> NEW ADMISSION
                    </button>
                </div>
            </div>
        );
    }

    // ===================== FORM VIEW =====================
    return (
        <div className="admission-bg pt-2 pb-5 mb-5">
            <div className="container">
                <div className="admission-card shadow-lg bg-white">
                    <div className="gov-header p-3 p-md-4 text-center">
                        <div className="row">
                            <div className="text-center col-md-12">
                                <h1 className="main-title fw-bold m-0">DRISHTEE COMPUTER CENTER</h1>
                                <p className="sub-title m-0 fw-semibold text-uppercase">An ISO 9001:2015 Certified I.T. Institute</p>
                            </div>
                        </div>
                        <div className="mt-3">
                            <span className="form-tagline">ONLINE ADMISSION PORTAL - SESSION 2026-27</span>
                        </div>
                    </div>

                    <div className="card-body p-4 p-lg-5">
                        <form onSubmit={handleSubmit}>
                            {/* SECTION I - CENTER & COURSE SELECTION */}
                            <SectionHeading icon={<i className="bi bi-building"></i>} title="I. CENTER & COURSE SELECTION" />
                            <div className="row g-4 mb-5">
                                <div className="col-lg-8">
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="gov-label">Choose Center *</label>
                                            <select
                                                className="form-select gov-input"
                                                name="branch"
                                                value={form.branch}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">-- Select Branch --</option>
                                                {BRANCHES.map(b => (
                                                    <option key={b.id} value={b.id}>{b.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="gov-label">Select Course *</label>
                                            <select
                                                className="form-select gov-input"
                                                name="course"
                                                value={form.course}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">-- Select Course --</option>
                                                {staticCourses.map(c => (
                                                    <option key={c.id} value={c.name}>{c.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="col-12">
                                            <label className="gov-label">Admission Date *</label>
                                            <input
                                                type="date"
                                                className="form-control gov-input"
                                                name="admissionDate"
                                                value={form.admissionDate}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4 text-center order-first order-lg-0">
                                    <div className="photo-frame mx-auto mb-2">
                                        <img
                                            src={form.photoUrl || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                                            alt="User"
                                        />
                                        <label className="upload-icon shadow">
                                            {imgLoading ? <i className="bi bi-arrow-repeat spin"></i> : <i className="bi bi-camera"></i>}
                                            <input
                                                type="file"
                                                hidden
                                                accept="image/*"
                                                onChange={e => uploadImg(e.target.files[0])}
                                            />
                                        </label>
                                    </div>
                                    <span className="fw-bold text-muted small">STUDENT PHOTO (MAX 50KB)</span> <br />
                                    <Link to="/photo-editor?mode=admission">Edit</Link>
                                </div>
                            </div>

                            {/* SECTION II - PERSONAL DETAILS */}
                            <SectionHeading icon={<i className="bi bi-person"></i>} title="II. PERSONAL DETAILS" />
                            <div className="row g-3 mb-5">
                                <div className="col-md-4">
                                    <label className="gov-label">Student Full Name *</label>
                                    <input
                                        type="text"
                                        className="form-control gov-input"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label className="gov-label">Father's Name *</label>
                                    <input
                                        type="text"
                                        className="form-control gov-input"
                                        name="fatherName"
                                        value={form.fatherName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label className="gov-label">Mother's Name *</label>
                                    <input
                                        type="text"
                                        className="form-control gov-input"
                                        name="motherName"
                                        value={form.motherName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label className="gov-label">Date of Birth *</label>
                                    <input
                                        type="date"
                                        className="form-control gov-input"
                                        name="dob"
                                        value={form.dob}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label className="gov-label">Gender *</label>
                                    <select
                                        className="form-select gov-input"
                                        name="gender"
                                        value={form.gender}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="col-md-4">
                                    <label className="gov-label">
                                        Aadhar Number <span className="text-muted">(Optional)</span>
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control gov-input"
                                        name="aadharNo"
                                        value={form.aadharNo}
                                        onChange={handleChange}
                                        maxLength="12"
                                        placeholder="Enter 12 digit Aadhar (optional)"
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="gov-label">Category *</label>
                                    <select
                                        className="form-select gov-input"
                                        name="category"
                                        value={form.category}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        <option value="GEN">General (GEN)</option>
                                        <option value="OBC">OBC</option>
                                        <option value="SC">SC</option>
                                        <option value="ST">ST</option>
                                        <option value="EWS">EWS</option>
                                    </select>
                                </div>

                                <div className="col-6">
                                    <label className="gov-label">Highest Qualification *</label>
                                    <input
                                        type="text"
                                        className="form-control gov-input"
                                        name="qualification"
                                        value={form.qualification}
                                        onChange={handleChange}
                                        placeholder="e.g. 10th, 12th, Graduate"
                                        required
                                    />
                                </div>
                            </div>

                            {/* SECTION III - CONTACT DETAILS */}
                            <SectionHeading icon={<i className="bi bi-telephone"></i>} title="III. CONTACT INFORMATION" />
                            <div className="row g-3 mb-5">
                                <div className="col-md-6">
                                    <label className="gov-label">Mobile Number *</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light"><i className="bi bi-telephone text-muted"></i></span>
                                        <input
                                            type="text"
                                            className="form-control gov-input"
                                            name="mobile"
                                            value={form.mobile}
                                            onChange={handleChange}
                                            maxLength="10"
                                            placeholder="10 Digit Mobile No."
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label className="gov-label">Email Address *</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light"><i className="bi bi-envelope text-muted"></i></span>
                                        <input
                                            type="email"
                                            className={`form-control gov-input ${isEmailVerified ? 'border-success' : ''}`}
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            placeholder="example@mail.com"
                                            disabled={isEmailVerified}
                                            required
                                        />
                                        {!isEmailVerified && (
                                            <button 
                                                type="button" 
                                                className="btn btn-dark btn-sm px-3"
                                                onClick={handleSendOtp}
                                                disabled={verifying}
                                            >
                                                {verifying ? "..." : otpSent ? "Resend" : "Send OTP"}
                                            </button>
                                        )}
                                    </div>
                                    {otpSent && !isEmailVerified && (
                                        <div className="mt-2 p-2 border rounded bg-light d-flex gap-2 align-items-center">
                                            <input
                                                type="text"
                                                className="form-control form-control-sm text-center fw-bold"
                                                placeholder="6-Digit OTP"
                                                maxLength="6"
                                                style={{ letterSpacing: '2px' }}
                                                value={otpInput}
                                                onChange={(e) => setOtpInput(e.target.value)}
                                            />
                                            <button type="button" className="btn btn-success btn-sm px-3" onClick={handleVerifyOtp}>
                                                VERIFY
                                            </button>
                                        </div>
                                    )}
                                    {isEmailVerified && <small className="text-success fw-bold">Verified ✅</small>}
                                </div>
                            </div>

                            {/* SECTION IV - ADDRESS DETAILS */}
                            <SectionHeading icon={<i className="bi bi-geo-alt"></i>} title="IV. ADDRESS DETAILS" />
                            <div className="row g-3 mb-5">
                                <div className="col-md-3">
                                    <label className="gov-label">Pincode *</label>
                                    <input
                                        type="text"
                                        className="form-control gov-input highlight-box"
                                        name="pincode"
                                        value={form.pincode}
                                        onChange={handleChange}
                                        maxLength="6"
                                        placeholder="Enter Pincode"
                                        required
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label className="gov-label">Village/Town *</label>
                                    <input
                                        type="text"
                                        className="form-control gov-input"
                                        name="village"
                                        value={form.village}
                                        onChange={handleChange}
                                        placeholder="Village name"
                                        required
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label className="gov-label">Post Office *</label>
                                    <input
                                        type="text"
                                        className="form-control gov-input"
                                        name="post"
                                        value={form.post}
                                        onChange={handleChange}
                                        placeholder="Post Office"
                                        required
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label className="gov-label">Police Station *</label>
                                    <input
                                        type="text"
                                        className="form-control gov-input"
                                        name="thana"
                                        value={form.thana}
                                        onChange={handleChange}
                                        placeholder="Police Station"
                                        required
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label className="gov-label">District/City *</label>
                                    <input
                                        type="text"
                                        className="form-control gov-input"
                                        name="city"
                                        value={form.city}
                                        onChange={handleChange}
                                        placeholder="District"
                                        required
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label className="gov-label">State *</label>
                                    <input
                                        type="text"
                                        className="form-control gov-input"
                                        name="state"
                                        value={form.state}
                                        onChange={handleChange}
                                        placeholder="State"
                                        required
                                    />
                                </div>

                                <div className="col-12 mt-4">
                                    <div className="form-check form-switch mb-2">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="syncAddr"
                                            onChange={handleAutoAddress}
                                        />
                                        <label className="form-check-label fw-bold text-primary small" htmlFor="syncAddr">
                                            Auto Complete Address from above fields
                                        </label>
                                    </div>
                                    <textarea
                                        className="form-control gov-input"
                                        name="address"
                                        value={form.address}
                                        onChange={handleChange}
                                        rows="2"
                                        placeholder="Full permanent address..."
                                        required
                                    />
                                </div>
                            </div>

                            {/* DECLARATION */}
                            <div className="declaration-box p-3 mb-4">
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={isDeclared}
                                        onChange={(e) => setIsDeclared(e.target.checked)}
                                        id="decl"
                                    />
                                    <label className="form-check-label small fw-bold" htmlFor="decl">
                                        I hereby declare that all provided details are correct and I will abide by the rules of the center.
                                    </label>
                                </div>
                            </div>

                            {/* SUBMIT BUTTON */}
                            <button
                                type="submit"
                                className="btn-final-submit w-100 shadow"
                                disabled={loading || !isEmailVerified}
                            >
                                {loading ? (
                                    <><i className="bi bi-arrow-repeat spin me-2"></i> PROCESSING...</>
                                ) : (
                                    <><i className="bi bi-check-circle me-2"></i> FINALIZE ADMISSION</>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <style>{`
                .admission-bg { background: #e9ecef; min-height: 100vh; font-family: 'Segoe UI', sans-serif; }
                .admission-card { border-radius: 12px; overflow: hidden; border: none; }
                
                .gov-header { background: #001529; color: white; border-bottom: 6px solid #f57c00; }
                .main-title { font-size: 1.5rem; letter-spacing: 1px; }
                .sub-title { font-size: 0.75rem; color: #ffca28; }
                .form-tagline { background: rgba(255,255,255,0.1); padding: 5px 15px; border-radius: 20px; font-size: 10px; font-weight: 600; display: inline-block; }

                .section-heading-bar { 
                    background: #f8f9fa; 
                    border-left: 5px solid #001529; 
                    padding: 12px 15px; 
                    margin-bottom: 20px; 
                    border-radius: 0 4px 4px 0;
                }
                
                .gov-label { font-size: 11px; font-weight: 800; color: #555; text-transform: uppercase; margin-bottom: 5px; letter-spacing: 0.3px; }
                .gov-input { border-radius: 5px; border: 1px solid #ced4da; padding: 10px; font-size: 14px; transition: 0.3s; }
                .gov-input:focus { border-color: #001529; box-shadow: 0 0 0 0.2rem rgba(0,21,41,0.25); }
                .input-group-text { border: 1px solid #ced4da; border-right: none; }
                .highlight-box { border: 2px solid #001529 !important; }

                .photo-frame { width: 140px; height: 170px; border: 2px solid #001529; position: relative; background: #fdfdfd; padding: 5px; }
                .photo-frame img { width: 100%; height: 100%; object-fit: cover; }
                .upload-icon { position: absolute; bottom: -10px; right: -10px; background: #f57c00; color: white; width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; border: 2px solid #fff; transition: 0.3s; }
                .upload-icon:hover { background: #ff9800; transform: scale(1.1); }

                .declaration-box { background: #fff8e1; border: 1px solid #ffe082; border-radius: 8px; }
                .btn-final-submit { background: #001529; color: white; border: none; padding: 15px; font-weight: bold; font-size: 18px; border-radius: 8px; transition: 0.3s; }
                .btn-final-submit:hover:not(:disabled) { background: #002a52; transform: translateY(-2px); }
                .btn-final-submit:disabled { opacity: 0.7; cursor: not-allowed; }

                .receipt-main-title { font-size: 24px; font-weight: 800; color: #001529; margin: 0; }
                .receipt-sub-title { font-size: 12px; letter-spacing: 2px; font-weight: 600; color: #555; }

                @media (min-width: 992px) {
                    .main-title { font-size: 2.5rem; }
                    .sub-title { font-size: 1rem; }
                    .section-heading-bar h6 { font-size: 18px !important; }
                    .gov-label { font-size: 13px; }
                    .gov-input { padding: 12px; }
                }

                .spin { animation: rotate 1s linear infinite; }
                @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

                @media print { 
                    .no-print { display: none !important; } 
                    .container { width: 100% !important; max-width: 100% !important; padding: 0; }
                    .receipt-box { box-shadow: none !important; border: 1px solid #000 !important; }
                }
            `}</style>
        </div>
    );
}

const SectionHeading = ({ icon, title }) => (
    <div className="section-heading-bar shadow-sm">
        <h6 className="m-0 fw-bold d-flex align-items-center" style={{ color: "#001529", fontSize: '15px' }}>
            <span className="me-2 text-primary">{icon}</span> {title}
        </h6>
    </div>
);