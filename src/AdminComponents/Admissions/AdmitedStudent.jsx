import React, { useState } from "react";
import { Button, Form, InputGroup, Dropdown, Card, Row, Col, Container } from "react-bootstrap";
import { Trash, Eye, Search, Filter } from "react-bootstrap-icons";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { Link } from "react-router-dom";
import AdmissionProvider from "./AdmissionProvider";
import { toast } from "react-toastify";
import LoadingSpinner from "../Common/LoadingSpinner";
import StudentCard from "../Common/StudentCard"; 

export default function AdmittedStudentList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const handleDelete = async (id) => {
    if (window.confirm("Permanent delete this admission?")) {
      try {
        await deleteDoc(doc(db, "admissions", id));
        toast.success("Record deleted");
      } catch (err) { toast.error(err.message); }
    }
  };

  return (
    <AdmissionProvider>
      {({ admissions, loading }) => {
        if (loading) return <LoadingSpinner />;

        const filtered = admissions.filter(s => {
          const searchMatch = s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              s.course?.toLowerCase().includes(searchTerm.toLowerCase());
          const filterMatch = filterStatus === "all" || s.status === filterStatus;
          return searchMatch && filterMatch;
        });

        return (
          <Container fluid className="py-4 bg-light min-vh-100">
            {/* SEARCH & FILTER BAR */}
            <div className="d-flex flex-column flex-md-row gap-3 mb-4 justify-content-center align-items-center">
              <InputGroup className="shadow-sm rounded-pill overflow-hidden border-0" style={{ maxWidth: "500px" }}>
                <InputGroup.Text className="bg-white border-0 ps-4"><Search className="text-muted"/></InputGroup.Text>
                <Form.Control 
                  className="border-0 shadow-none py-2" 
                  placeholder="Search students..." 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                />
              </InputGroup>

              <Dropdown onSelect={(val) => setFilterStatus(val)}>
                <Dropdown.Toggle variant="white" className="shadow-sm border-0 rounded-pill px-4 py-2 fw-bold">
                  <Filter className="me-2"/> {filterStatus.toUpperCase()}
                </Dropdown.Toggle>
                <Dropdown.Menu className="border-0 shadow">
                  <Dropdown.Item eventKey="all">All Friends</Dropdown.Item>
                  <Dropdown.Item eventKey="accepted">Accepted</Dropdown.Item>
                  <Dropdown.Item eventKey="pending">Pending</Dropdown.Item>
                  <Dropdown.Item eventKey="canceled">Canceled</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>

            {/* LIST GRID */}
            <Row className="g-3">
              {filtered.map((student) => (
                <Col key={student.id} xs={12} sm={6} md={4} lg={3} xl={2}>
                  <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden fb-card">
                    <StudentCard student={student}>
                      <div className="d-flex flex-column gap-2 mt-2 px-2 pb-3">
                        <Link to={`/admin/students/${student.id}`} className="text-decoration-none">
                          <Button variant="primary" size="sm" className="w-100 fw-bold rounded-3 py-2">
                            View Profile
                          </Button>
                        </Link>
                        <Button 
                          variant="light" 
                          size="sm" 
                          className="w-100 fw-bold text-danger rounded-3"
                          onClick={() => handleDelete(student.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </StudentCard>
                  </Card>
                </Col>
              ))}
            </Row>

            <style>{`
              .fb-card { transition: transform 0.2s; }
              .fb-card:hover { transform: scale(1.02); }
              /* Hide StudentCard's internal children wrapper padding if needed */
              .student-card .card-body { padding: 0 !important; }
            `}</style>
          </Container>
        );
      }}
    </AdmissionProvider>
  );
}