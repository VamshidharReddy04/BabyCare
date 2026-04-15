import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { apiUrl } from "../utils/api";
import { setUser } from "../utils/auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const nextPath = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("next") || "/";
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(apiUrl("/api/users/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      setUser(data);
      navigate(nextPath);
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-layout">
        <aside className="auth-side">
          <h2>Welcome Back</h2>
          <p>
            Sign in to track your orders, update your profile, and continue
            checkout faster.
          </p>
          <div className="auth-tip-card">
            <strong>Quick Tip</strong>
            <span>You can sign in using your email or username.</span>
            <span>Keep your password private for account safety.</span>
          </div>
          <div className="auth-tip-card auth-tip-highlight">
            <strong>Parent Benefits</strong>
            <ul className="auth-tip-list">
              <li>Real-time order tracking</li>
              <li>Fast reorders in one click</li>
              <li>Profile-based baby essentials</li>
            </ul>
          </div>
          <Link className="auth-home-link" to="/">
            Back to Dashboard
          </Link>
        </aside>

        <div className="auth-card">
          <h1>Sign In</h1>
          <p>Access your BabyCare account.</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <label className="auth-field">
              <span>Email or Username</span>
              <input
                type="text"
                placeholder="Enter email or username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </label>

            <label className="auth-field">
              <span>Password</span>
              <div className="password-wrap">
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </label>

            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="auth-footnote">
            New customer? <Link to="/signup">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
