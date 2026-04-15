import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiUrl } from "../utils/api";
import { setUser } from "../utils/auth";

export default function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(apiUrl("/api/users/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Signup failed");
      }

      setUser(data);
      navigate("/");
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-layout">
        <aside className="auth-side">
          <h2>Create Your Account</h2>
          <p>
            Join BabyCare to save your details, place orders faster, and track
            deliveries from your dashboard.
          </p>
          <div className="auth-tip-card">
            <strong>Why sign up?</strong>
            <span>Track every purchase status</span>
            <span>Manage address and profile</span>
          </div>
          <div className="auth-tip-card auth-tip-highlight">
            <strong>Starter Perks</strong>
            <ul className="auth-tip-list">
              <li>Early access to offers</li>
              <li>Curated age-wise collections</li>
              <li>Faster checkout with saved details</li>
            </ul>
          </div>
          <Link className="auth-home-link" to="/">
            Back to Dashboard
          </Link>
        </aside>

        <div className="auth-card">
          <h1>Create Account</h1>
          <p>Register to place orders and track delivery updates.</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <label className="auth-field">
              <span>Full Name</span>
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>

            <label className="auth-field">
              <span>Email</span>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label className="auth-field">
              <span>Password</span>
              <div className="password-wrap">
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  required
                />
              </div>
            </label>

            <label className="auth-field">
              <span>Confirm Password</span>
              <div className="password-wrap">
                <input
                  type="password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={6}
                  required
                />
              </div>
            </label>

            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="auth-footnote">
            Already registered? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
