import { useState, useEffect, useContext } from "react";
import { countAllTestsAdmin, countTestsToGradeAdmin } from "../api/adminApi";
import { AdminContext } from "../context/AdminContext";
import "./Dashboard.css";

export default function DashboardPage() {
  const { token } = useContext(AdminContext);
  const [countTest, setCountTests] = useState(0);
  const [toGrade, setToGrade] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await countAllTestsAdmin(token);
        const res1 = await countTestsToGradeAdmin(token);

        setCountTests(res.totalTests ?? res.count ?? 0);
        setToGrade(res1?.count ?? res1 ?? 0);
      } catch (err) {
        console.error("Error fetching test count:", err);
        setError("Impossible de récupérer le nombre de tests");
      } finally {
        setLoading(false);
      }
    }
    if (token) load();
  }, [token]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="admin-wrapper">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
      </div>

      <div className="statistics-overview">
        <div className="statistic-card">
          <h2>Total tests</h2>
          <p>{countTest}</p>
        </div>
        <div className="statistic-card">
          <h2>Tests à corriger</h2>
          <p>{toGrade}</p>
        </div>
        <div className="statistic-card">
          <h2>Taux de réussite</h2>
          <p>50%</p>
        </div>
      </div>
    </div>
  );
}
