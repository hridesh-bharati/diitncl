import React, { useEffect, useMemo, useState } from "react";
import { db } from "../../../firebase/firebase";
import { collection, onSnapshot, doc, deleteDoc, getDoc } from "firebase/firestore";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// --- 📄 PDF Styles (Wahi rahega) ---
const styles = StyleSheet.create({
  page: { padding: 30, backgroundColor: '#ffffff', fontSize: 10 },
  header: { marginBottom: 20, borderBottom: '2px solid #0d6efd', paddingBottom: 10 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#0d6efd' },
  studentInfo: { marginBottom: 20, padding: 10, backgroundColor: '#f8f9fa', borderRadius: 5 },
  row: { flexDirection: 'row', marginBottom: 5 },
  label: { width: 80, fontWeight: 'bold', color: '#6c757d' },
  value: { flex: 1, fontWeight: 'bold' },
  qCard: { marginBottom: 15, padding: 10, border: '1px solid #dee2e6', borderRadius: 5 },
  qText: { fontWeight: 'bold', marginBottom: 8, color: '#212529' },
  optionGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  optionBox: { width: '48%', padding: 5, margin: '1%', border: '1px solid #eee', borderRadius: 3 },
  correct: { backgroundColor: '#d1e7dd', borderColor: '#badbcc', color: '#0f5132' },
  wrong: { backgroundColor: '#f8d7da', borderColor: '#f5c2c7', color: '#842029' },
  scoreBadge: { position: 'absolute', top: 30, right: 30, textAlign: 'right' }
});

// --- 📋 PDF Document Component (Wahi rahega) ---
const ResultPDF = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Drishtee Computer Centre</Text>
        <Text style={{ color: '#6c757d', marginTop: 4 }}>Practice Test Performance Report</Text>
      </View>
      <View style={styles.scoreBadge}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#198754' }}>{data.score}/{data.totalQuestions}</Text>
        <Text style={{ fontSize: 10, color: '#6c757d' }}>Percentage: {data.percentage}%</Text>
      </View>
      <View style={styles.studentInfo}>
        <View style={styles.row}><Text style={styles.label}>Student:</Text><Text style={styles.value}>{data.displayName}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Reg No:</Text><Text style={styles.value}>{data.student?.regNo}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Test Paper:</Text><Text style={styles.value}>{data.testTitle}</Text></View>
      </View>
      <Text style={{ fontWeight: 'bold', marginBottom: 10, fontSize: 12 }}>Question Review:</Text>
      {data.fullDetails?.map((q, idx) => (
        <View key={idx} style={styles.qCard} wrap={false}>
          <Text style={styles.qText}>{idx + 1}. {q.question}</Text>
          <View style={styles.optionGrid}>
            {q.options.map((opt, i) => {
              const isCorrect = i === q.correctOption;
              const isSelected = i === q.selectedOption;
              const boxStyle = [styles.optionBox];
              if (isCorrect) boxStyle.push(styles.correct);
              if (isSelected && !isCorrect) boxStyle.push(styles.wrong);
              return (
                <View key={i} style={boxStyle}>
                  <Text style={{ fontSize: 9 }}>{isCorrect ? "✓ " : (isSelected ? "✕ " : "")} {opt}</Text>
                </View>
              );
            })}
          </View>
        </View>
      ))}
    </Page>
  </Document>
);

export default function AdminPracticeResults() {
  const [results, setResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "practiceResults"), async (snap) => {
      const list = await Promise.all(snap.docs.map(async (d) => {
        const data = d.id ? { id: d.id, ...d.data() } : d.data();
        const email = data.studentEmail?.toLowerCase().trim();
        let extra = { photoUrl: "", regNo: "N/A", name: data.studentName };
        if (email) {
          const sSnap = await getDoc(doc(db, "admissions", email));
          if (sSnap.exists()) {
            const sData = sSnap.data();
            extra.photoUrl = sData.photoUrl || "";
            extra.regNo = sData.regNo || "N/A";
            if (sData.name) extra.name = sData.name;
          }
        }
        return { ...data, student: extra, displayName: extra.name || data.studentName || "Unknown" };
      }));
      const finalData = list.filter(r => r.status === "Completed").sort((a, b) => (b.submittedAt?.seconds || 0) - (a.submittedAt?.seconds || 0));
      setResults(finalData);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filtered = useMemo(() => results.filter(r =>
    [r.displayName, r.student?.regNo, r.testTitle].some(f => f?.toLowerCase().includes(searchTerm.toLowerCase()))
  ), [results, searchTerm]);

  if (loading) return <div className="text-center p-5 mt-5"><div className="spinner-border text-primary border-4" /></div>;

  return (
    <div className="container-fluid py-3 bg-light min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-4 px-2">
        <h5 className="fw-bold mb-0 text-dark">Practice Records</h5>
        <input type="search" className="form-control form-control-sm w-auto rounded-pill border-0 shadow-sm px-3" placeholder="Search..." onChange={e => setSearchTerm(e.target.value)} />
      </div>

      <div className="row g-3">
        {filtered.map(r => (
          <div className="col-12 col-md-6 col-lg-4" key={r.id}>
            <div className="card border-0 shadow-sm rounded-4 h-100 transition-all hover-shadow">
              <div className="card-body p-3">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <img src={r.student?.photoUrl || `https://ui-avatars.com/api/?name=${r.displayName}`} className="rounded-circle border" style={{ width: 48, height: 48, objectFit: 'cover' }} alt="" />
                  <div className="overflow-hidden flex-grow-1">
                    <div className="fw-bold text-truncate text-dark">{r.displayName}</div>
                    <div className="text-primary small fw-bold">{r.student?.regNo}</div>
                  </div>
                  {/* Score aur Percent yahan card par show ho raha hai */}
                  <div className="text-end">
                    <div className="h5 fw-bold mb-0 text-success">{r.score}/{r.totalQuestions}</div>
                    <div className="text-muted fw-bold" style={{ fontSize: '11px' }}>{r.percentage}%</div>
                  </div>
                </div>

                <div className="bg-light p-2 rounded-3 mb-3 small text-secondary">
                  <i className="bi bi-journal-text me-2"></i>{r.testTitle}
                </div>

                <div className="d-flex gap-2">
                  <button className="btn btn-dark btn-sm rounded-pill flex-grow-1 py-2 fw-bold shadow-sm" onClick={() => setSelected(r)}>Details</button>
                  <PDFDownloadLink document={<ResultPDF data={r} />} fileName={`${r.displayName}_Result.pdf`}>
                    {({ loading }) => (
                      <button className="btn btn-outline-primary btn-sm rounded-circle shadow-sm">
                        <i className={`bi ${loading ? 'bi-hourglass-split' : 'bi-file-earmark-pdf'}`}></i>
                      </button>
                    )}
                  </PDFDownloadLink>
                  <button className="btn btn-outline-danger btn-sm rounded-circle shadow-sm" onClick={() => window.confirm("Delete record?") && deleteDoc(doc(db, "practiceResults", r.id))}><i className="bi bi-trash"></i></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
              <div className="modal-header bg-dark text-white border-0 py-3">
                <h6 className="mb-0">{selected.displayName} - Details</h6>
                <button className="btn-close btn-close-white" onClick={() => setSelected(null)}></button>
              </div>
              <div className="modal-body p-3 bg-light">
                {selected.fullDetails?.map((q, idx) => (
                  <div className="card border-0 shadow-sm rounded-4 mb-3 p-3" key={idx}>
                    <div className="fw-bold mb-2 text-primary small">Q{idx + 1}. {q.question}</div>
                    <div className="row g-2">
                      {q.options.map((opt, i) => {
                        const isCorrect = i === q.correctOption;
                        const isSelected = i === q.selectedOption;
                        let style = "bg-white border text-muted";
                        if (isCorrect) style = "bg-success-subtle border-success text-success fw-bold";
                        if (isSelected && !isCorrect) style = "bg-danger-subtle border-danger text-danger fw-bold";
                        return (
                          <div className="col-6" key={i}>
                            <div className={`p-2 rounded-3 small border h-100 ${style}`}>
                              {isCorrect ? "✅ " : (isSelected ? "❌ " : "")} {opt}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}