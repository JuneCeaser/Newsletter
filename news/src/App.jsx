import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from "./components/AdminLogin";
import Dashboard from "./components/Dashboard";
import ViewSubscribers from "./components/ViewSubscribers";
import ViewNewsletters from "./components/ViewNewsletters";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/view-newsletters" element={<ViewNewsletters />} />
        <Route path="/ViewSubscribers" element={<ViewSubscribers />} />
        <Route path="/" element={<AdminLogin />} /> {/* Default to login */}
      </Routes>
    </Router>
  );
}

export default App;
