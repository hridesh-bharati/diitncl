// src/AdminComponents/Students/StudentList.jsx
import { Card, Button, Spinner, Form } from "react-bootstrap";
import { Trash, CreditCard2Back, Eye, PersonCircle, Pencil } from "react-bootstrap-icons";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { Link } from "react-router-dom";
import AdmissionProvider from "../Admissions/AdmissionProvider";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Utility to generate full RegNo
const generateRegNo = (centerCode, course, serialNo) => {
  if (!centerCode || !course || !serialNo) return "";
  // replace spaces with _ in course
  const courseClean = course.replace(/\s+/g, "_");
  return `${centerCode}/${courseClean}/${serialNo}`;
};

export default function StudentList() {
  const [regInputs, setRegInputs] = useState({});
  const [loadingReg, setLoadingReg] = useState({});
  const [editingReg, setEditingReg] = useState({});

  const handleRegChange = (id, value) => {
    setRegInputs(prev => ({ ...prev, [id]: value }));
  };

  const startEditing = (s) => {
    setEditingReg(prev => ({ ...prev, [s.id]: true }));
    // extract serial number if already exists
    const serialNo = s.regNo ? s.regNo.split("/")[2] : "";
    setRegInputs(prev => ({ ...prev, [s.id]: serialNo }));
  };

  const saveRegNo = async (s) => {
    const serialNo = regInputs[s.id];
    if (!serialNo) return toast.error("Enter Serial Number");

    const centerCode = s.centerCode || "DIIT124"; // fallback
    const course = s.course || "Course";

    const regNo = generateRegNo(centerCode, course, serialNo);

    setLoadingReg(prev => ({ ...prev, [s.id]: true }));

    try {
      await updateDoc(doc(db, "admissions", s.id), { regNo });
      toast.success("Reg No saved: " + regNo);
      setEditingReg(prev => ({ ...prev, [s.id]: false }));
    } catch (e) {
      toast.error("Failed: " + e.message);
    } finally {
      setLoadingReg(prev => ({ ...prev, [s.id]: false }));
    }
  };

  return (
    <AdmissionProvider>
      {({ admissions, loading }) => {
        if (loading)
          return (
            <div className="vh-100 d-flex justify-content-center align-items-center">
              <Spinner />
            </div>
          );

        return (
          <div className="container-fluid p-3 bg-light min-vh-100">
            <div className="row g-3">
              {admissions.map(s => (
                <div key={s.id} className="col-12 col-sm-6 col-lg-3">
                  <Card className="border-0 shadow-sm rounded-4 h-100">
                    <Card.Body>
                      {/* PHOTO */}
                      <div className="d-flex gap-2 align-items-center mb-2">
                        {s.photoUrl ? (
                          <img
                            src={s.photoUrl}
                            alt=""
                            className="rounded-circle"
                            style={{ width: 45, height: 45, objectFit: "cover" }}
                          />
                        ) : (
                          <PersonCircle size={45} className="text-muted" />
                        )}
                        <div className="overflow-hidden">
                          <strong className="d-block text-truncate">{s.name}</strong>
                          <small className="text-muted d-block text-truncate">{s.course}</small>
                        </div>
                      </div>

                      {/* REG NO */}
                      <div className="mb-2">
                        {s.regNo && !editingReg[s.id] ? (
                          <div className="d-flex gap-2">
                            <Button size="sm" variant="light" className="flex-fill">
                              {s.regNo}
                            </Button>
                            <Button size="sm" variant="light" onClick={() => startEditing(s)}>
                              <Pencil />
                            </Button>
                          </div>
                        ) : (
                          <div className="d-flex gap-2">
                            <Form.Control
                              size="sm"
                              placeholder="Enter Serial Number"
                              value={regInputs[s.id] || ""}
                              onChange={(e) => handleRegChange(s.id, e.target.value)}
                            />
                            <Button
                              size="sm"
                              variant="success"
                              onClick={() => saveRegNo(s)}
                              disabled={loadingReg[s.id]}
                            >
                              {loadingReg[s.id] ? "Saving..." : "Save"}
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* ACTIONS */}
                      <div className="d-flex gap-2 mt-2">
                        <Link to={`/admin/students/${s.id}`} className="flex-fill">
                          <Button size="sm" variant="light" className="w-100">
                            <Eye /> View
                          </Button>
                        </Link>

                        <Link to={`/admin/students/${s.id}/certificate`} className="flex-fill">
                          <Button size="sm" variant="light" className="w-100 text-primary">
                            <CreditCard2Back /> Certificate
                          </Button>
                        </Link>

                        <Button
                          size="sm"
                          variant="light"
                          className="text-danger"
                          onClick={() => window.confirm("Delete this student?") && deleteDoc(doc(db, "admissions", s.id))}
                        >
                          <Trash />
                        </Button>
                      </div>

                    </Card.Body>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    </AdmissionProvider>
  );
}
