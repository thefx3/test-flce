import { Routes, Route } from "react-router-dom";
import Menu from "shared-ui/components/Menu";

import IntroTest from "./pages/IntroTest";
import TestInterface from "./pages/TestInterface";

import MyResultsPortal from "./pages/MyResultsPortal";
import AdminDashboard from "./pages/AdminDashboard";


export default function App() {
  return (
    <>
      <Menu />

      <Routes>
        <Route path="/" element={<IntroTest />} />
        <Route path="/test" element={<TestInterface />} />
        <Route path="/results" element={<MyResultsPortal />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </>
  );
}
