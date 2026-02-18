// src/AdminComponents/Admissions/StudentCard.jsx
import React, { useState, useEffect } from "react";
import { Card, Button, Form, Badge } from "react-bootstrap";
import { Trash, PersonCircle, Check2Circle, PencilFill, Calendar } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";

const STATUS_COLORS = { accepted: "success", canceled: "danger", pending: "warning" };
const BRANCH_DISPLAY = { DIIT124: "Main Branch", DIIT125: "East Branch" };

const StudentCard = React.memo(({ student, onSave, onDelete }) => {
  const { isAdmin } = useAuth();

  const [regNumber, setRegNumber] = useState("");
  const [percent, setPercent] = useState("");
  const [issDate, setIssDate] = useState("");
  const [admissionDate, setAdmissionDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingDuplicate, setCheckingDuplicate] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [isValidDigit, setIsValidDigit] = useState(false);
  const [editingRegNo, setEditingRegNo] = useState(false);

  useEffect(() => {
    setPercent(student.percentage || "");
    setIssDate(student.issueDate || "");
    setAdmissionDate(student.admissionDate || "");
    setRegNumber("");
    setIsDuplicate(false);
    setEditingRegNo(false);
  }, [student]);

  const status = student.status || "pending";
  const isAccepted = status === "accepted";
  const canSaveFinal = (percent !== student.percentage ||
    issDate !== student.issueDate ||
    admissionDate !== student.admissionDate) &&
    (percent && issDate && admissionDate);
  const regNo = student.regNo;
  const studentBranch = student.branch || student.centerCode;
  const studentCourse = student.course;

  // Extract current reg number digits
  useEffect(() => {
    if (regNo && editingRegNo) {
      const parts = regNo.split('/');
      const lastPart = parts[parts.length - 1];
      if (lastPart && /^\d+$/.test(lastPart)) {
        setRegNumber(lastPart);
      }
    }
  }, [regNo, editingRegNo]);

  // ✅ CHECK IF INPUT IS ONLY DIGITS
  useEffect(() => {
    if (regNumber.trim()) {
      const digitsOnly = /^\d+$/.test(regNumber.trim());
      setIsValidDigit(digitsOnly);
    } else {
      setIsValidDigit(false);
    }
  }, [regNumber]);

  const checkDuplicateRegNo = async (branch, regNum, currentRegNo = null) => {
    if (!branch || !regNum) return false;
    try {
      const q = query(collection(db, "admissions"), where("regNo", "!=", null));
      const snapshot = await getDocs(q);
      let isDuplicate = false;
      snapshot.docs.forEach(doc => {
        if (doc.id === student.id) return;
        const data = doc.data();
        const existingRegNo = data.regNo;
        const existingBranch = data.branch || data.centerCode;
        if (existingRegNo && existingBranch === branch) {
          const pattern = new RegExp(`${branch}/[^/]+/${regNum}$`);
          if (pattern.test(existingRegNo)) {
            // Skip if it's the same as current reg no (editing case)
            if (currentRegNo && existingRegNo === currentRegNo) return;
            isDuplicate = true;
          }
        }
      });
      return isDuplicate;
    } catch (error) {
      console.error("Error checking duplicate:", error);
      return false;
    }
  };

  useEffect(() => {
    const checkDuplicate = async () => {
      if (!studentBranch || !regNumber.trim() || !isValidDigit) {
        setIsDuplicate(false);
        return;
      }
      setCheckingDuplicate(true);
      const duplicate = await checkDuplicateRegNo(studentBranch, regNumber.trim(), regNo);
      setIsDuplicate(duplicate);
      setCheckingDuplicate(false);
    };
    const debounceTimer = setTimeout(checkDuplicate, 500);
    return () => clearTimeout(debounceTimer);
  }, [regNumber, studentBranch, isValidDigit, regNo]);

  const handleGenerateRegNo = async () => {
    if (!isAdmin) return toast.error("Unauthorized: Admin only");
    if (!studentBranch) return toast.error("❌ Student branch not found!");
    if (!regNumber.trim()) return toast.error("Please enter registration number");
    if (!isValidDigit) return toast.error("❌ Only digits allowed!");

    setLoading(true);
    try {
      const courseCode = studentCourse.replace(/\s+/g, "").toUpperCase();
      const duplicate = await checkDuplicateRegNo(studentBranch, regNumber.trim(), regNo);

      if (duplicate) {
        toast.error(`❌ Reg no ${regNumber.trim()} already exists in ${BRANCH_DISPLAY[studentBranch]}!`);
        setLoading(false);
        return;
      }

      const finalRegNo = `${studentBranch}/${courseCode}/${regNumber.trim()}`;

      await onSave(student.id, {
        regNo: finalRegNo,
        branch: studentBranch,
        centerCode: studentBranch
      });

      toast.success(`Registration Number Updated: ${finalRegNo}`);
      setEditingRegNo(false);
    } catch (error) {
      toast.error("Failed to update registration number");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!isAdmin) return toast.error("Unauthorized: Admin only");
    setLoading(true);
    try {
      const data = { status: newStatus };
      if (newStatus === "accepted") data.admissionDate = new Date().toISOString().split('T')[0];
      await onSave(student.id, data);
      toast.success(`✅ Status updated to ${newStatus}`);
    } catch {
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFinal = async () => {
    if (!isAdmin) return;
    setLoading(true);
    try {
      await onSave(student.id, {
        percentage: Number(percent),
        issueDate: issDate,
        admissionDate: admissionDate
      });
      toast.success("✅ Marks, Issue Date & Admission Date Saved!");
    } catch {
      toast.error("Failed to save");
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <Card className="border-0 shadow-sm rounded-4 mb-3">
        <Card.Body className="p-3">
          <ReadOnlyView student={student} status={status} />
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="border-0 mb-4 mb-lg-0 shadow-sm rounded-4 overflow-hidden">
      <Card.Body className="p-3">
        <HeaderSection student={student} status={status} />
        {studentBranch && (
          <div className="mb-2">
            <Badge bg={studentBranch === "DIIT124" ? "primary" : "info"}
              className="bg-opacity-10 rounded-pill px-3 py-2"
              style={{ color: studentBranch === "DIIT124" ? "#0d6efd" : "#0dcaf0", fontWeight: "500" }}>
               {BRANCH_DISPLAY[studentBranch] || studentBranch}
            </Badge>
          </div>
        )}
        <div className="rounded-4">
          {isAccepted ? (
            <AcceptedView
              regNumber={regNumber}
              setRegNumber={setRegNumber}
              percent={percent}
              setPercent={setPercent}
              issDate={issDate}
              setIssDate={setIssDate}
              admissionDate={admissionDate}
              setAdmissionDate={setAdmissionDate}
              canSaveFinal={canSaveFinal}
              onGenerateRegNo={handleGenerateRegNo}
              onSaveFinal={handleSaveFinal}
              loading={loading}
              checkingDuplicate={checkingDuplicate}
              isDuplicate={isDuplicate}
              isValidDigit={isValidDigit}
              regNo={regNo}
              studentBranch={studentBranch}
              studentCourse={studentCourse}
              editingRegNo={editingRegNo}
              setEditingRegNo={setEditingRegNo}
            />
          ) : (
            <PendingView />
          )}
        </div>
        <BottomActions
          student={student}
          onDelete={onDelete}
          status={status}
          onStatusChange={handleStatusChange}
          loading={loading}
          isAdmin={isAdmin}
        />
      </Card.Body>
    </Card>
  );
});

const HeaderSection = ({ student, status }) => {
  const studentBranch = student.branch || student.centerCode;
  return (
    <div className="d-flex align-items-center gap-3 mb-3">
      <div className="position-relative">
        {student.photoUrl ? (
          <img src={student.photoUrl} alt="" className="rounded-circle shadow-sm"
            style={{ width: "60px", height: "60px", objectFit: "cover" }} />
        ) : (
          <div className="rounded-circle bg-light d-flex align-items-center justify-content-center"
            style={{ width: "60px", height: "60px" }}>
            <PersonCircle size={32} className="text-secondary" />
          </div>
        )}
        <div className={`position-absolute bottom-0 end-0 p-1 bg-${STATUS_COLORS[status]} rounded-circle border border-2 border-white`}
          style={{ width: "14px", height: "14px" }} />
      </div>
      <div className="flex-grow-1">
        <h6 className="fw-bold mb-0 text-dark">{student.name}</h6>
        <div className="text-muted small mb-1">{student.course}</div>
      </div>
      <div className="text-end">
        {student.percentage &&
          <div className="text-success fw-bolder h5 mb-0">{student.percentage}%</div>
        }
      </div>
    </div>
  );
};

const AcceptedView = ({
  regNumber, setRegNumber, percent, setPercent,
  issDate, setIssDate, admissionDate, setAdmissionDate,
  canSaveFinal, onGenerateRegNo, onSaveFinal, loading,
  checkingDuplicate, isDuplicate, isValidDigit,
  regNo, studentBranch, studentCourse, editingRegNo, setEditingRegNo
}) => (
  <>
    {!regNo ? (
      <div className="bg-white p-2 rounded-3 shadow-sm">
        <div className="mb-2">
          <small className="text-muted">
            Branch: <strong className="text-primary">{studentBranch} ({BRANCH_DISPLAY[studentBranch] || studentBranch})</strong>
          </small>
        </div>

        <Form.Control
          size="sm"
          placeholder="Enter Registration Number"
          value={regNumber}
          onChange={e => {
            const val = e.target.value.replace(/[^0-9]/g, '');
            setRegNumber(val);
          }}
          className={`mb-2 ${!isValidDigit && regNumber ? 'is-invalid' : ''}`}
        />

        {!isValidDigit && regNumber && (
          <small className="text-danger d-block mb-2">❌ Only digits allowed</small>
        )}

        <Button
          size="sm"
          variant="primary"
          className="w-100 rounded-pill fw-bold py-2 mb-2"
          onClick={onGenerateRegNo}
          disabled={!regNumber.trim() || !studentBranch || loading || isDuplicate || checkingDuplicate || !isValidDigit}
        >
          {loading ? 'Generating...' : 'GENERATE'}
        </Button>

        {checkingDuplicate && (
          <small className="text-muted d-block text-center">Checking availability...</small>
        )}
        {!checkingDuplicate && isDuplicate && (
          <small className="text-danger d-block text-center">Reg no {regNumber} already exists!</small>
        )}
        {!checkingDuplicate && !isDuplicate && regNumber && isValidDigit && (
          <small className="text-success d-block text-center">Available</small>
        )}
      </div>
    ) : (
      <div className="d-flex flex-column gap-3">
        <div className="bg-light p-3 rounded-3">
          {!editingRegNo ? (
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted d-block mb-1">Registration Number:</small>
                <strong className="text-primary fs-6">{regNo}</strong>
              </div>
              <Button
                variant="success"
                size="sm"
                className="p-1 px-2"
                onClick={() => setEditingRegNo(true)}
              >
                <PencilFill size={12} />
              </Button>

            </div>
          ) : (
            // ✅ EDIT MODE
            <div className="mt-2">
              <small className="text-muted d-block mb-1">Edit Registration Number:</small>
              <Form.Control
                size="sm"
                placeholder="Enter new number (Digits Only)"
                value={regNumber}
                onChange={e => {
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  setRegNumber(val);
                }}
                className={`mb-2 ${!isValidDigit && regNumber ? 'is-invalid' : ''}`}
              />

              {!isValidDigit && regNumber && (
                <small className="text-danger d-block mb-2">Only digits allowed</small>
              )}

              <div className="d-flex gap-2">
                <Button
                  size="sm"
                  variant="success"
                  className="flex-grow-1 rounded-pill fw-bold py-2"
                  onClick={onGenerateRegNo}
                  disabled={!regNumber.trim() || loading || isDuplicate || checkingDuplicate || !isValidDigit}
                >
                  {loading ? 'Updating...' : 'UPDATE'}
                </Button>
                <Button
                  size="sm"
                  variant="outline-secondary"
                  className="rounded-pill py-2 px-3"
                  onClick={() => {
                    setEditingRegNo(false);
                    setRegNumber('');
                  }}
                >
                  Cancel
                </Button>
              </div>

              {checkingDuplicate && (
                <small className="text-muted d-block mt-2">Checking availability...</small>
              )}
              {!checkingDuplicate && isDuplicate && (
                <small className="text-danger d-block mt-2">Reg no {regNumber} already exists!</small>
              )}
              {!checkingDuplicate && !isDuplicate && regNumber && isValidDigit && (
                <small className="text-success d-block mt-2">Available</small>
              )}
            </div>
          )}
        </div>

        {/* PERCENTAGE, ISSUE DATE & ADMISSION DATE SECTION - SIRF TAB JAB EDIT MODE NA HO */}
        {!editingRegNo && (
          <>
            <div className="row g-2">
              <div className="col-12">
                <div className="small text-secondary mb-1 fw-medium">Percentage</div>
                <Form.Control
                  type="number"
                  size="sm"
                  placeholder="%"
                  value={percent}
                  onChange={e => setPercent(e.target.value)}
                  className="border-0 shadow-sm rounded-3 py-2 text-center fw-bold"
                />
              </div>
              <div className="col-6">
                <div className="small text-secondary mb-1 fw-medium">Adm Date</div>
                <Form.Control
                  type="date"
                  size="sm"
                  value={admissionDate}
                  onChange={e => setAdmissionDate(e.target.value)}
                  className="border-0 shadow-sm rounded-3 py-2"
                />
              </div>
              <div className="col-6">
                <div className="small text-secondary mb-1 fw-medium">Issue Date</div>
                <Form.Control
                  type="date"
                  size="sm"
                  value={issDate}
                  onChange={e => setIssDate(e.target.value)}
                  className="border-0 shadow-sm rounded-3 py-2"
                />
              </div>

            </div>

            {canSaveFinal && (
              <Button
                variant="success"
                size="sm"
                className="w-100 rounded-pill fw-bold shadow-sm py-2"
                onClick={onSaveFinal}
                disabled={loading}
              >
                {loading ? 'Saving...' : <><Check2Circle size={16} className="me-2" /> SAVE ALL CHANGES</>}
              </Button>
            )}
          </>
        )}
      </div>
    )}
  </>
);

const PendingView = () => (
  <div className="text-center py-2 text-muted small">
    Awaiting enrollment confirmation
  </div>
);

const BottomActions = ({ student, onDelete, status, onStatusChange, loading, isAdmin }) => (
  <div className="mt-3 pt-2">
    <div className="d-flex gap-2">
      <Link to={`/admin/students/${student.id}`} className="flex-fill">
        <Button variant="outline-light" size="sm"
          className="w-100 rounded-pill text-dark border fw-medium py-2">
          Profile
        </Button>
      </Link>
      {isAdmin && (
        <Button variant="outline-danger" size="sm" className="rounded-pill border-0"
          onClick={() => onDelete(student.id)}>
          <Trash size={18} />
        </Button>
      )}
    </div>
    {status === "pending" && isAdmin && (
      <div className="d-flex gap-2 mt-3 pt-3 border-top">
        <Button variant="success" className="flex-grow-1 rounded-pill py-2 border-0 fw-bold shadow-sm"
          onClick={() => onStatusChange("accepted")} disabled={loading}>
          APPROVE
        </Button>
        <Button variant="danger" className="flex-grow-1 rounded-pill py-2 border-0 fw-medium shadow-sm"
          onClick={() => onStatusChange("canceled")} disabled={loading}>
          REJECT
        </Button>
      </div>
    )}
  </div>
);

const ReadOnlyView = ({ student, status }) => {
  const studentBranch = student.branch || student.centerCode;
  return (
    <>
      <HeaderSection student={student} status={status} />
      {student.regNo && (
        <div className="mt-2 mb-2">
          <Badge bg="primary" className="bg-opacity-10 text-primary rounded-pill px-3 py-2">
            🏷️ {student.regNo}
          </Badge>
        </div>
      )}
      {studentBranch && (
        <div className="mt-2 mb-2">
          <Badge bg="secondary" className="bg-opacity-10 text-secondary rounded-pill px-2">
            {BRANCH_DISPLAY[studentBranch] || studentBranch}
          </Badge>
        </div>
      )}
      <div className="mt-3 text-center">
        <Badge bg={STATUS_COLORS[status]} className="px-3 py-2 rounded-pill">
          {status.toUpperCase()}
        </Badge>
        {student.percentage && (
          <div className="mt-2">
            <small className="text-muted">Marks: </small>
            <strong className="text-success">{student.percentage}%</strong>
          </div>
        )}
        {student.admissionDate && (
          <div className="mt-1">
            <small className="text-muted">Admission: </small>
            <strong className="text-primary">{student.admissionDate}</strong>
          </div>
        )}
      </div>
    </>
  );
};

export default StudentCard;