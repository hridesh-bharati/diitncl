import React, { useState } from "react";
import { toast } from "react-toastify";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import {
    FaUser, FaCamera, FaSpinner, FaBuilding, FaMapMarkerAlt,
    FaCheckCircle, FaEnvelope, FaPrint, FaHome, FaPhoneAlt
} from "react-icons/fa";
import { staticCourses } from "../../Components/HomePage/pages/Course/courseData";

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

// ✅ Get today in YYYY-MM-DD (for input type="date")
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
    admissionDate: getTodayInputFormat() // ✅ default today
};

export default function AdmissionForm() {
    const [loading, setLoading] = useState(false);
    const [imgLoading, setImgLoading] = useState(false);
    const [isDeclared, setIsDeclared] = useState(false);
    const [form, setForm] = useState(INITIAL_STATE);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submittedData, setSubmittedData] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Only allow digits for specific fields
        if (["mobile", "pincode", "aadharNo"].includes(name)) {
            if (value !== "" && !/^\d+$/.test(value)) return;
        }

        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handlePincodeChange = async (e) => {
        const pin = e.target.value;
        setForm(prev => ({ ...prev, pincode: pin }));

        if (pin.length === 6) {
            try {
                const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
                const data = await res.json();

                if (data[0].Status === "Success") {
                    const info = data[0].PostOffice[0];
                    setForm(prev => ({
                        ...prev,
                        state: info.State,
                        city: info.District,
                        village: info.Name,
                        post: info.Name,
                        thana: info.Block || info.District
                    }));
                    toast.success("Location updated from pincode!");
                } else {
                    toast.error("Invalid Pincode");
                }
            } catch (err) {
                toast.error("Pincode API Error");
            }
        }
    };

    const handleAutoAddress = (e) => {
        if (e.target.checked) {
            const { village, post, thana, city, state, pincode } = form;

            if (!village || !pincode) {
                toast.warning("Please fill pincode first!");
                return;
            }

            const fullAddr = `Vill: ${village}, PO: ${post}, PS: ${thana}, Dist: ${city}, State: ${state} - ${pincode}`;
            setForm(prev => ({ ...prev, address: fullAddr }));
        }
    };

    const uploadImg = async (file) => {
        if (!file) return;

        if (file.size > 50 * 1024) { // 50KB limit
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (form.aadharNo && form.aadharNo.length !== 12) {
            return toast.error("Aadhar must be 12 digits");
        }

        if (form.mobile && form.mobile.length !== 10) {
            return toast.error("Mobile number must be 10 digits");
        }

        if (!form.photoUrl) {
            return toast.error("Please upload Photo");
        }

        if (!isDeclared) {
            return toast.error("Please accept the Declaration");
        }

        setLoading(true);

        try {
            // ✅ Format dates before saving
            const formattedAdmissionDate = formatToDDMMYY(form.admissionDate);
            const formattedDob = form.dob ? formatToDDMMYY(form.dob) : "";

            const finalData = {
                ...form,
                admissionDate: formattedAdmissionDate,
                dob: formattedDob,
                status: "pending",
                createdAt: serverTimestamp(),
                appliedDate: new Date().toISOString()
            };

            await addDoc(collection(db, "admissions"), finalData);

            // Set submitted data for receipt
            setSubmittedData({
                ...form,
                admissionDate: formattedAdmissionDate,
                dob: formattedDob
            });

            setIsSubmitted(true);
            window.scrollTo(0, 0);

        } catch (e) {
            toast.error("Error: " + e.message);
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
                                        <td className="fw-bold text-primary">DCC-{Math.floor(100000 + Math.random() * 900000)}</td>
                                    </tr>
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
                        <FaPrint className="me-2" /> PRINT SLIP
                    </button>
                    <button onClick={() => window.location.reload()} className="btn btn-outline-primary px-4">
                        <FaHome className="me-2" /> NEW ADMISSION
                    </button>
                </div>
            </div>
        );
    }

    // ===================== FORM VIEW =====================
    return (
        <div className="admission-bg pt-4 pb-5">
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
                            <SectionHeading icon={<FaBuilding />} title="I. CENTER & COURSE SELECTION" />
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
                                            {imgLoading ? <FaSpinner className="spin" /> : <FaCamera />}
                                            <input
                                                type="file"
                                                hidden
                                                accept="image/*"
                                                onChange={e => uploadImg(e.target.files[0])}
                                            />
                                        </label>
                                    </div>
                                    <span className="fw-bold text-muted small">STUDENT PHOTO (MAX 50KB)</span>
                                </div>
                            </div>

                            {/* SECTION II - PERSONAL DETAILS */}
                            <SectionHeading icon={<FaUser />} title="II. PERSONAL DETAILS" />
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
                                    <label className="gov-label">Aadhar Number</label>
                                    <input
                                        type="text"
                                        className="form-control gov-input"
                                        name="aadharNo"
                                        value={form.aadharNo}
                                        onChange={handleChange}
                                        maxLength="12"
                                        placeholder="12 digit Aadhar"
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
                            <SectionHeading icon={<FaPhoneAlt />} title="III. CONTACT INFORMATION" />
                            <div className="row g-3 mb-5">
                                <div className="col-md-6">
                                    <label className="gov-label">Mobile Number *</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light"><FaPhoneAlt className="text-muted" /></span>
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
                                        <span className="input-group-text bg-light"><FaEnvelope className="text-muted" /></span>
                                        <input
                                            type="email"
                                            className="form-control gov-input"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            placeholder="example@mail.com"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* SECTION IV - ADDRESS DETAILS */}
                            <SectionHeading icon={<FaMapMarkerAlt />} title="IV. ADDRESS DETAILS" />
                            <div className="row g-3 mb-5">
                                <div className="col-md-3">
                                    <label className="gov-label">Pincode *</label>
                                    <input
                                        type="text"
                                        className="form-control gov-input highlight-box"
                                        name="pincode"
                                        value={form.pincode}
                                        onChange={handlePincodeChange}
                                        maxLength="6"
                                        placeholder="Type Pincode..."
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
                                            Auto-Generate Complete Address from above fields
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
                                disabled={loading}
                            >
                                {loading ? (
                                    <><FaSpinner className="spin me-2" /> PROCESSING...</>
                                ) : (
                                    <><FaCheckCircle className="me-2" /> FINALIZE ADMISSION</>
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