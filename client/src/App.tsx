import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import Stores from "./pages/Stores";
function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/stores" element={<Stores />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["barber", "customer"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
