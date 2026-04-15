import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../utils/api";
import { authHeader, clearUser, getUser, setUser } from "../utils/auth";

const EMPTY_ADDRESS = {
  street: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const user = useMemo(() => getUser(), []);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    address: EMPTY_ADDRESS,
  });

  useEffect(() => {
    if (!user?.token) {
      navigate("/login?next=/profile");
      return;
    }

    const loadProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(apiUrl("/api/users/profile"), {
          headers: authHeader(),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Could not load profile");
        }

        setForm({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          password: "",
          address: {
            ...EMPTY_ADDRESS,
            ...(data.address || {}),
          },
        });
      } catch (err) {
        setError(err.message || "Could not load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate, user]);

  const onChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onAddressChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      address: { ...prev.address, [key]: value },
    }));
  };

  const handleLogout = () => {
    clearUser();
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
      };
      if (form.password) payload.password = form.password;

      const res = await fetch(apiUrl("/api/users/profile"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Could not update profile");
      }

      setUser(data);
      setForm((prev) => ({ ...prev, password: "" }));
      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(err.message || "Could not update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-head">
          <button
            className="btn-outline profile-back-btn"
            type="button"
            onClick={() => navigate("/")}
          >
            ← Back to Dashboard
          </button>
          <h1>My Profile</h1>
          <p>Update your personal details and shipping address.</p>
        </div>

        <div className="profile-actions">
          <button
            className="btn-outline"
            type="button"
            onClick={() => navigate("/my-orders")}
          >
            My Orders
          </button>
          <button
            className="btn-outline"
            type="button"
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </button>
          <button className="btn-danger" type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="checkout-grid-2">
            <input
              type="text"
              placeholder="Full name"
              value={form.name}
              onChange={(e) => onChange("name", e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => onChange("email", e.target.value)}
              required
            />
          </div>

          <div className="checkout-grid-2">
            <input
              type="text"
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => onChange("phone", e.target.value)}
            />
            <input
              type="password"
              placeholder="New password (optional)"
              value={form.password}
              onChange={(e) => onChange("password", e.target.value)}
              minLength={6}
            />
          </div>

          <input
            type="text"
            placeholder="Street address"
            value={form.address.street}
            onChange={(e) => onAddressChange("street", e.target.value)}
          />

          <div className="checkout-grid-2">
            <input
              type="text"
              placeholder="City"
              value={form.address.city}
              onChange={(e) => onAddressChange("city", e.target.value)}
            />
            <input
              type="text"
              placeholder="State"
              value={form.address.state}
              onChange={(e) => onAddressChange("state", e.target.value)}
            />
          </div>

          <div className="checkout-grid-2">
            <input
              type="text"
              placeholder="Pincode"
              value={form.address.pincode}
              onChange={(e) => onAddressChange("pincode", e.target.value)}
            />
            <input
              type="text"
              placeholder="Country"
              value={form.address.country}
              onChange={(e) => onAddressChange("country", e.target.value)}
            />
          </div>

          <button className="btn-primary" disabled={saving} type="submit">
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
