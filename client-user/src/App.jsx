import { useState } from "react";
import Menu from "shared-ui/components/Menu";
import TestInterface from "./pages/TestInterface";
import MyResultsPortal from "./pages/MyResultsPortal";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  const [view, setView] = useState("home");

  return (
    <>
      <Menu onChangeView={setView} />

      {view === "home" && <TestInterface />}
      {view === "student" && <MyResultsPortal />}
      {view === "admin" && <AdminDashboard />}
      
    </>
  );
}
