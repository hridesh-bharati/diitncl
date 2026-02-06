import React, { useCallback } from "react";
import { Button, Badge } from "react-bootstrap";
import { Trash, Eye, Check2Circle, XCircle } from "react-bootstrap-icons";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { Link } from "react-router-dom";
import AdmissionProvider from "./AdmissionProvider";
import { toast } from "react-toastify";
import LoadingSpinner from "../Common/LoadingSpinner";
import StudentCard from "../Common/StudentCard";

const STATUS_CONFIG = {
  pending: { color: "warning", label: "Pending" },
  accepted: { color: "success", label: "Accepted" },
  canceled: { color: "danger", label: "Canceled" }
};

export default function AdmittedStudentList() {
  const toggleStatus = useCallback(async (student, status) => {
    try {
      await updateDoc(doc(db, "admissions", student.id), { status });
      toast.success(`Admission ${status}`);
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

  const renderAdmissionCard = useCallback((student) => {
    const status = student.status || "pending";
    const isPending = status === "pending";
    const isCanceled = status === "canceled";

    return (
      <div key={student.id} className="col-12 col-sm-6 col-lg-4">
        <StudentCard student={student} isCanceled={isCanceled}>
          <div className="d-flex gap-2 mt-3 flex-wrap">
            <Link to={`/admin/students/${student.id}`} className="flex-fill">
              <Button size="sm" variant="outline-primary" className="w-100">
                <Eye /> View
              </Button>
            </Link>

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
  }, [toggleStatus, handleDelete]);

  return (
    <AdmissionProvider>
      {({ admissions, loading }) => {
        if (loading) return <LoadingSpinner />;

        if (!admissions.length) {
          return (
            <div className="container-fluid p-3 min-vh-100">
              <p className="text-center mt-5">No admissions found.</p>
            </div>
          );
        }

        return (
          <div className="container-fluid p-3 bg-light min-vh-100">
            <h4 className="mb-3">
              All Admissions
              <Badge bg="info" className="ms-2">
                {admissions.length}
              </Badge>
            </h4>
            
            <div className="row g-3">
              {admissions.map(renderAdmissionCard)}
            </div>
          </div>
        );
      }}
    </AdmissionProvider>
  );
}