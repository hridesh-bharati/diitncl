import React, { useState, useCallback } from "react";
import { Button, Form, Spinner, Badge } from "react-bootstrap";
import { Trash, CreditCard2Back, Eye, Check2Circle, XCircle, Save } from "react-bootstrap-icons";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { Link } from "react-router-dom";
import AdmissionProvider from "../Admissions/AdmissionProvider";
import { toast } from "react-toastify";
import LoadingSpinner from "../Common/LoadingSpinner";
import StudentCard from "../Common/StudentCard";

const CENTER_CODE = "DIIT124";
const generateRegNo = (course, regInput) => {
  if (!course || !regInput) return "";
  const courseClean = course.replace(/\s+/g, "_").toUpperCase();
  return `${CENTER_CODE}/${courseClean}/${regInput}`;
};

export default function StudentList() {
  const [regInputs, setRegInputs] = useState({});
  const [percentageInputs, setPercentageInputs] = useState({});
  const [loadingStates, setLoadingStates] = useState({});

  const handleRegChange = useCallback((id, value) => {
    setRegInputs(prev => ({ ...prev, [id]: value }));
  }, []);

  const handlePercentageChange = useCallback((id, value) => {
    setPercentageInputs(prev => ({ ...prev, [id]: value }));
  }, []);

  const saveRegNo = useCallback(async (student) => {
    const enteredRegNo = regInputs[student.id];
    if (!enteredRegNo?.trim()) {
      toast.error("Enter Registration Number");
      return;
    }

    const regNo = generateRegNo(student.course, enteredRegNo);
    setLoadingStates(prev => ({ ...prev, [`${student.id}_reg`]: true }));

    try {
      await updateDoc(doc(db, "admissions", student.id), { regNo });
      toast.success(`Registration saved: ${regNo}`);
      setRegInputs(prev => ({ ...prev, [student.id]: "" }));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoadingStates(prev => ({ ...prev, [`${student.id}_reg`]: false }));
    }
  }, [regInputs]);

  const savePercentage = useCallback(async (student) => {
    const percentage = percentageInputs[student.id];
    if (!percentage) {
      toast.error("Enter Percentage");
      return;
    }

    const percNum = parseFloat(percentage);
    if (isNaN(percNum) || percNum < 0 || percNum > 100) {
      toast.error("Enter valid percentage (0-100)");
      return;
    }

    setLoadingStates(prev => ({ ...prev, [`${student.id}_perc`]: true }));

    try {
      await updateDoc(doc(db, "admissions", student.id), {
        percentage: percNum.toFixed(2)
      });
      toast.success(`Percentage saved: ${percNum}%`);
      setPercentageInputs(prev => ({ ...prev, [student.id]: "" }));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoadingStates(prev => ({ ...prev, [`${student.id}_perc`]: false }));
    }
  }, [percentageInputs]);

  const toggleStatus = useCallback(async (student, status) => {
    try {
      await updateDoc(doc(db, "admissions", student.id), { status });
      toast.success(`Admission ${status}`);

      if (status === "accepted") {
        setRegInputs(prev => ({ ...prev, [student.id]: "" }));
        setPercentageInputs(prev => ({ ...prev, [student.id]: "" }));
      }
    } catch (err) {
      toast.error(err.message);
    }
  }, []);

  const handleDelete = useCallback(async (student) => {
    if (window.confirm("Are you sure you want to delete this admission?")) {
      try {
        await deleteDoc(doc(db, "admissions", student.id));
        toast.success("Admission deleted");
      } catch (err) {
        toast.error(err.message);
      }
    }
  }, []);

  const renderStudentCard = useCallback((student) => {
    const status = student.status || "pending";
    const isCanceled = status === "canceled";
    const isAccepted = status === "accepted";
    const isPending = status === "pending";

    const hasRegNo = !!student.regNo;
    const hasPercentage = !!student.percentage;

    const showRegInput = isAccepted && !hasRegNo;
    const showPercentageInput = isAccepted && hasRegNo && !hasPercentage;
    const certificateEnabled = isAccepted && hasRegNo && hasPercentage;

    const isLoadingReg = loadingStates[`${student.id}_reg`];
    const isLoadingPercentage = loadingStates[`${student.id}_perc`];

    return (
      <div key={student.id} className="col-12 col-sm-6 col-lg-4">
        <StudentCard student={student} isCanceled={isCanceled}>
          {/* Registration Input */}
          {showRegInput && (
            <div className="mb-2">
              <Form.Control
                size="sm"
                placeholder="Enter reg number (e.g., 2A)"
                value={regInputs[student.id] || ""}
                onChange={(e) => handleRegChange(student.id, e.target.value)}
                disabled={isLoadingReg}
                maxLength={10}
              />
              <Button
                size="sm"
                variant="success"
                onClick={() => saveRegNo(student)}
                disabled={isLoadingReg || !regInputs[student.id]}
                className="mt-1 w-100"
              >
                {isLoadingReg ? (
                  <Spinner size="sm" animation="border" />
                ) : (
                  <>
                    <Save size={14} className="me-1" /> Save Reg No
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Percentage Input */}
          {showPercentageInput && (
            <div className="mb-2">
              <Form.Control
                size="sm"
                type="number"
                min="0"
                max="100"
                step="0.01"
                placeholder="Enter percentage (0-100)"
                value={percentageInputs[student.id] || ""}
                onChange={(e) => handlePercentageChange(student.id, e.target.value)}
                disabled={isLoadingPercentage}
              />
              <Button
                size="sm"
                variant="success"
                onClick={() => savePercentage(student)}
                disabled={isLoadingPercentage || !percentageInputs[student.id]}
                className="mt-1 w-100"
              >
                {isLoadingPercentage ? (
                  <Spinner size="sm" animation="border" />
                ) : (
                  <>
                    <Save size={14} className="me-1" /> Save Percentage
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Display Saved Info */}
          {(hasRegNo || hasPercentage) && (
            <div className="mb-2 small bg-light p-2 rounded">
              {hasRegNo && (
                <div className="d-block mb-1">
                  <strong>Reg No:</strong> {student.regNo}
                </div>
              )}
              {hasPercentage && (
                <div className="d-block">
                  <strong>Percentage:</strong> {student.percentage}%
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="d-flex gap-2 mt-3 flex-wrap">
            {!isCanceled && (
              <Link to={`/admin/students/${student.id}`} className="flex-fill">
                <Button size="sm" variant="outline-primary" className="w-100">
                  <Eye /> View
                </Button>
              </Link>
            )}

            {!isCanceled && certificateEnabled && (
              <Link to={`/admin/students/${student.id}/certificate`} className="flex-fill">
                <Button size="sm" variant="primary" className="w-100">
                  <CreditCard2Back /> Certificate
                </Button>
              </Link>
            )}

            {isPending && (
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

            <Button
              size="sm"
              variant="outline-danger"
              className="flex-fill"
              onClick={() => handleDelete(student)}
            >
              <Trash /> Delete
            </Button>
          </div>
        </StudentCard>
      </div>
    );
  }, [
    regInputs,
    percentageInputs,
    loadingStates,
    handleRegChange,
    handlePercentageChange,
    saveRegNo,
    savePercentage,
    toggleStatus,
    handleDelete
  ]);

  return (
    <AdmissionProvider>
      {({ admissions, loading }) => {
        if (loading) return <LoadingSpinner />;

        // REMOVE useMemo and calculate directly
        const pending = admissions.filter(a => a.status === "pending");
        const accepted = admissions.filter(a => a.status === "accepted");
        const canceled = admissions.filter(a => a.status === "canceled");
        const groupedAdmissions = { pending, accepted, canceled };

        return (
          <div className="container-fluid p-3 bg-light min-vh-100">
            {/* NEW ADMISSIONS */}
            <section className="mb-5">
              <div className="d-flex align-items-center mb-3">
                <h4 className="mb-0">New Admissions</h4>
                <Badge bg="warning" className="ms-2">
                  {pending.length} Pending
                </Badge>
              </div>

              {pending.length ? (
                <div className="row g-3">
                  {pending.map(renderStudentCard)}
                </div>
              ) : (
                <div className="text-center py-4 border rounded bg-white">
                  <p className="text-muted mb-0">No pending admissions</p>
                </div>
              )}
            </section>

            {/* ACCEPTED ADMISSIONS */}
            <section>
              <div className="d-flex align-items-center mb-3">
                <h4 className="mb-0">Accepted Admissions</h4>
                <Badge bg="success" className="ms-2">
                  {accepted.length} Accepted
                </Badge>
              </div>

              {accepted.length ? (
                <div className="row g-3">
                  {accepted.map(renderStudentCard)}
                </div>
              ) : (
                <div className="text-center py-4 border rounded bg-white">
                  <p className="text-muted mb-0">No accepted admissions yet</p>
                </div>
              )}
            </section>
          </div>
        );
      }}
    </AdmissionProvider>
  );
}