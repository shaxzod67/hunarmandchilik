import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import MyOrders from "./pages/MyOrders";
import SellerOrders from "./pages/SellerOrders";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/my-orders" element={<MyOrders />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="seller">
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/seller-orders"
          element={
            <ProtectedRoute role="seller">
              <SellerOrders />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;