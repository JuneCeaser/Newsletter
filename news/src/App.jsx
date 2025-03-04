import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from "./components/AdminLogin";
import Dashboard from "./components/Dashboard";
import ViewSubscribers from "./components/ViewSubscribers";
import ViewNewsletters from "./components/ViewNewsletters";
import AdminSignup from "./components/AdminSignup";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/signup" element={<AdminSignup />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/view-newsletters" element={<ViewNewsletters />} />
          <Route path="/ViewSubscribers" element={<ViewSubscribers />} />
        </Route>

        <Route path="/" element={<AdminLogin />} />
      </Routes>
    </Router>
  );
}

export default App;
