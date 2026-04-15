import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import App from "./App";
import "./App.css";
import AdminPage from "./pages/AdminPage";
import CheckoutPage from "./pages/CheckoutPage";
import LoginPage from "./pages/LoginPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import ProfilePage from "./pages/ProfilePage";
import SignupPage from "./pages/SignupPage";
import { getUser } from "./utils/auth";

function RequireAuth({ children }) {
  const location = useLocation();
  const user = getUser();

  if (!user?.token) {
    const next = encodeURIComponent(location.pathname || "/");
    return <Navigate to={`/login?next=${next}`} replace />;
  }

  return children;
}

function RequireAdmin({ children }) {
  const user = getUser();

  if (!user?.token) {
    return <Navigate to="/login?next=%2Fadmin" replace />;
  }

  if (!user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function RequireCustomer({ children }) {
  const location = useLocation();
  const user = getUser();

  if (!user?.token) {
    const next = encodeURIComponent(location.pathname || "/");
    return <Navigate to={`/login?next=${next}`} replace />;
  }

  if (user.isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/checkout"
          element={
            <RequireCustomer>
              <CheckoutPage />
            </RequireCustomer>
          }
        />
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminPage />
            </RequireAdmin>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <ProfilePage />
            </RequireAuth>
          }
        />
        <Route
          path="/my-orders"
          element={
            <RequireCustomer>
              <MyOrdersPage />
            </RequireCustomer>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
