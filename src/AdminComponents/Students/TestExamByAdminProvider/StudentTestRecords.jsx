import React from "react";
import { useParams } from "react-router-dom";
import AdminPracticeResults from "./AdminPracticeResults";

export default function StudentTestRecords() {
    const { id: studentEmail } = useParams();
    return (
        <AdminPracticeResults
            preSelectedEmail={studentEmail?.toLowerCase()}
            isStudentView={true}
        />
    );
}