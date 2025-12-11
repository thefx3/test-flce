import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminContext } from "../context/AdminContext";
import "./Dashboard.css";

import { countAllTestsAdmin, countTestsToGradeAdmin } from "../api/adminApi";

export default function DashboardPage() {
  const { token } = useContext(AdminContext);

  const testsCountQuery = useQuery({
    queryKey: ["tests", "count"],
    queryFn: () => countAllTestsAdmin(token),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const toGradeQuery = useQuery({
    queryKey: ["tests", "to-grade"],
    queryFn: () => countTestsToGradeAdmin(token),
    staleTime: 1000 * 60 * 5,
  });

  if (testsCountQuery.isLoading || toGradeQuery.isLoading) return <p>Loading...</p>;

  return (
    <div className="admin-wrapper">
      <h1>Dashboard</h1>

      <div className="statistics-overview">
        <div className="statistic-card">
          <h2>Total tests</h2>
          <p>{testsCountQuery.data.totalTests}</p>
        </div>

        <div className="statistic-card">
          <h2>Tests à corriger</h2>
          <p>{toGradeQuery.data.count}</p>
        </div>

        <div className="statistic-card">
          <h2>Taux de réussite</h2>
          <p>64 %</p>
        </div>
      </div>
    </div>
  );
}

