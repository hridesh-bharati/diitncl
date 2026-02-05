// src/AdminComponents/Students/StudentList.jsx
import { Card, Button, Spinner, Form, Badge } from "react-bootstrap";
import { Trash, CreditCard2Back, Eye, PersonCircle, Check2Circle, XCircle, Save } from "react-bootstrap-icons";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { Link } from "react-router-dom";
import AdmissionProvider from "../Admissions/AdmissionProvider";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ========================
// Fixed center code variable
// ========================
const CENTER_CODE = "DIIT124";

// ========================
// Helper to generate Reg No
// ========================
const generateRegNo = (course, enteredRegNo) => {
  if (!course || !enteredRegNo) return "";
  const courseClean = course.replace(/\s+/g, "_").toUpperCase();
  return `${CENTER_CODE}/${courseClean}/${enteredRegNo}`;
};

export default function StudentList() {
  const [regInputs, setRegInputs] = useState({});
  const [percentageInputs, setPercentageInputs] = useState({});
  const [loadingReg, setLoadingReg] = useState({});
  const [loadingPercentage, setLoadingPercentage] = useState({});
  const [savedRegNos, setSavedRegNos] = useState({});
  const [savedPercentages, setSavedPercentages] = useState({});

  // Input handlers
  const handleRegChange = (id, value) => setRegInputs(prev => ({ ...prev, [id]: value }));
  const handlePercentageChange = (id, value) => setPercentageInputs(prev => ({ ...prev, [id]: value }));

  // Save Reg No
  const saveRegNo = async (student) => {
    const enteredRegNo = regInputs[student.id];
    if (!enteredRegNo) return toast.error("Enter Registration Number");

    const regNo = generateRegNo(student.course, enteredRegNo);

    setLoadingReg(prev => ({ ...prev, [student.id]: true }));
    try {
      await updateDoc(doc(db, "admissions", student.id), { regNo });
      toast.success("Registration Number saved: " + regNo);
      
      // Mark as saved locally
      setSavedRegNos(prev => ({ ...prev, [student.id]: true }));
      setSavedPercentages(prev => ({ ...prev, [student.id]: false })); // Reset percentage saved state
      
      // Clear the input
      setRegInputs(prev => ({ ...prev, [student.id]: "" }));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoadingReg(prev => ({ ...prev, [student.id]: false }));
    }
  };

  // Save Percentage
  const savePercentage = async (student) => {
    const percentage = percentageInputs[student.id];
    if (!percentage) return toast.error("Enter Percentage");
    
    // Validate percentage
    const percNum = parseFloat(percentage);
    if (isNaN(percNum) || percNum < 0 || percNum > 100) {
      return toast.error("Enter valid percentage (0-100)");
    }

    setLoadingPercentage(prev => ({ ...prev, [student.id]: true }));
    try {
      await updateDoc(doc(db, "admissions", student.id), { percentage: percNum.toString() });
      toast.success("Percentage saved: " + percNum + "%");
      
      // Mark as saved locally
      setSavedPercentages(prev => ({ ...prev, [student.id]: true }));
      
      // Clear the input
      setPercentageInputs(prev => ({ ...prev, [student.id]: "" }));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoadingPercentage(prev => ({ ...prev, [student.id]: false }));
    }
  };

  // Toggle Admission Status
  const toggleStatus = async (student, status) => {
    try {
      await updateDoc(doc(db, "admissions", student.id), { status });
      toast.success(`Admission ${status}`);
      
      // If accepting, reset saved states
      if (status === "accepted") {
        setSavedRegNos(prev => ({ ...prev, [student.id]: false }));
        setSavedPercentages(prev => ({ ...prev, [student.id]: false }));
        setRegInputs(prev => ({ ...prev, [student.id]: "" }));
        setPercentageInputs(prev => ({ ...prev, [student.id]: "" }));
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Delete admission
  const handleDelete = async (student) => {
    if (window.confirm("Are you sure you want to delete this admission?")) {
      try {
        await deleteDoc(doc(db, "admissions", student.id));
        toast.success("Admission deleted");
      } catch (err) {
        toast.error(err.message);
      }
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

        if (!admissions.length) return <p className="text-center mt-5">No admissions found.</p>;

        return (
          <div className="container-fluid p-3 bg-light min-vh-100">
            <div className="row g-3">
              {admissions.map(student => {
                const status = student.status || "pending";
                const isCanceled = status === "canceled";
                const isAccepted = status === "accepted";
                
                // Check what data exists
                const hasRegNo = !!student.regNo;
                const hasPercentage = !!student.percentage;
                
                // Check what has been saved in current session
                const regSavedInSession = savedRegNos[student.id] || hasRegNo;
                const percentageSavedInSession = savedPercentages[student.id] || hasPercentage;
                
                // Determine what to show
                const showAcceptCancel = status === "pending";
                const showRegInput = isAccepted && !regSavedInSession;
                const showPercentageInput = isAccepted && regSavedInSession && !percentageSavedInSession;
                
                // Certificate button enabled condition
                const certificateEnabled = regSavedInSession && percentageSavedInSession;

                return (
                  <div key={student.id} className="col-12 col-sm-6 col-lg-3">
                    <Card className={`border-0 shadow-sm rounded-4 h-100 ${isCanceled ? "opacity-50" : ""}`}>
                      <Card.Body className={isCanceled ? "pointer-events-none" : ""}>
                        {/* Status Badge */}
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <Badge 
                            bg={
                              status === "accepted" ? "success" : 
                              status === "canceled" ? "danger" : 
                              "warning"
                            }
                            className="text-uppercase"
                          >
                            {status}
                          </Badge>
                          
                          {/* Display saved Reg No */}
                          {regSavedInSession && (
                            <small className="text-muted text-truncate ms-2">
                              {student.regNo || "Reg No saved"}
                            </small>
                          )}
                        </div>

                        {/* PHOTO + NAME */}
                        <div className="d-flex gap-2 align-items-center mb-3">
                          {student.photoUrl ? (
                            <img
                              src={student.photoUrl}
                              alt=""
                              className="rounded-circle"
                              style={{ width: 45, height: 45, objectFit: "cover" }}
                            />
                          ) : (
                            <PersonCircle size={45} className="text-muted" />
                          )}
                          <div className="overflow-hidden">
                            <strong className="d-block text-truncate">{student.name}</strong>
                            <small className="text-muted d-block text-truncate">{student.course}</small>
                          </div>
                        </div>

                        {/* REG NO INPUT - Shows after acceptance, before saving */}
                        {showRegInput && (
                          <div className="mb-2">
                            <div className="d-flex gap-1 align-items-center mb-1">
                              <small className="text-muted">Registration Number</small>
                            </div>
                            <div className="d-flex gap-2">
                              <Form.Control
                                size="sm"
                                placeholder="e.g., 2A"
                                value={regInputs[student.id] || ""}
                                onChange={e => handleRegChange(student.id, e.target.value)}
                                disabled={loadingReg[student.id]}
                              />
                              <Button
                                size="sm"
                                variant="success"
                                onClick={() => saveRegNo(student)}
                                disabled={loadingReg[student.id] || !regInputs[student.id]}
                                className="d-flex align-items-center"
                              >
                                {loadingReg[student.id] ? (
                                  <Spinner size="sm" animation="border" />
                                ) : (
                                  <>
                                    <Save size={14} className="me-1" /> Save
                                  </>
                                )}
                              </Button>
                            </div>
                            <small className="text-muted mt-1 d-block">
                              Format: {CENTER_CODE}/{student.course?.replace(/\s+/g, "_").toUpperCase()}/[Your Input]
                            </small>
                          </div>
                        )}

                        {/* PERCENTAGE INPUT - Shows only after Reg No is saved */}
                        {showPercentageInput && (
                          <div className="mb-2">
                            <div className="d-flex gap-1 align-items-center mb-1">
                              <small className="text-muted">Percentage</small>
                              {hasPercentage && (
                                <Badge bg="success" className="ms-2" pill>
                                  Saved
                                </Badge>
                              )}
                            </div>
                            <div className="d-flex gap-2">
                              <Form.Control
                                size="sm"
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                                placeholder="e.g., 85.5"
                                value={percentageInputs[student.id] || ""}
                                onChange={e => handlePercentageChange(student.id, e.target.value)}
                                disabled={loadingPercentage[student.id]}
                              />
                              <Button
                                size="sm"
                                variant="success"
                                onClick={() => savePercentage(student)}
                                disabled={loadingPercentage[student.id] || !percentageInputs[student.id]}
                                className="d-flex align-items-center"
                              >
                                {loadingPercentage[student.id] ? (
                                  <Spinner size="sm" animation="border" />
                                ) : (
                                  <>
                                    <Save size={14} className="me-1" /> Save
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* Display saved info */}
                        {(regSavedInSession || percentageSavedInSession) && (
                          <div className="mb-2">
                            {regSavedInSession && (
                              <small className="d-block">
                                <strong>Reg No:</strong> {student.regNo}
                              </small>
                            )}
                            {percentageSavedInSession && (
                              <small className="d-block">
                                <strong>Percentage:</strong> {student.percentage}%
                              </small>
                            )}
                          </div>
                        )}

                        {/* ACTIONS */}
                        <div className="d-flex gap-2 mt-3 flex-wrap">
                          {/* View Button - Always visible if not canceled */}
                          {!isCanceled && (
                            <Link to={`/admin/students/${student.id}`} className="flex-fill">
                              <Button size="sm" variant="outline-primary" className="w-100">
                                <Eye /> View
                              </Button>
                            </Link>
                          )}

                          {/* Certificate Button - Only enabled when both saved */}
                          {!isCanceled && certificateEnabled && (
                            <Link to={`/admin/students/${student.id}/certificate`} className="flex-fill">
                              <Button
                                size="sm"
                                variant="primary"
                                className="w-100"
                              >
                                <CreditCard2Back /> Certificate
                              </Button>
                            </Link>
                          )}

                          {/* Accept/Cancel Buttons - Only for pending status */}
                          {showAcceptCancel && (
                            <>
                              <Button
                                size="sm"
                                variant="success"
                                className="flex-fill"
                                onClick={() => toggleStatus(student, "accepted")}
                              >
                                <Check2Circle /> Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="danger"
                                className="flex-fill"
                                onClick={() => toggleStatus(student, "canceled")}
                              >
                                <XCircle /> Cancel
                              </Button>
                            </>
                          )}

                          {/* Delete Button - Always visible */}
                          <Button
                            size="sm"
                            variant="outline-danger"
                            className="flex-fill"
                            onClick={() => handleDelete(student)}
                          >
                            <Trash /> Delete
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }}
    </AdmissionProvider>
  );
}