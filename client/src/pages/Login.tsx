import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { useAuth } from "../hooks/useAuth";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await authService.login(email, password);
      login(response.user, response.token);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page fade-in">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p>Login to access your academic dashboard</p>

        {error && <div className="alert alert-danger p-2 mb-3 fs-6">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input
              type="email"
              className="form-control auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="form-label">Password</label>
            <div className="position-relative">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control auth-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="btn btn-link position-absolute end-0 top-50 translate-middle-y text-muted text-decoration-none"
                onClick={() => setShowPassword(!showPassword)}
                style={{ zIndex: 10 }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
              </button>
            </div>
          </div>
          <button type="submit" className="btn-ss-primary w-100 mb-3" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center mt-3">
          <span className="text-muted">Don't have an account? </span>
          <Link to="/signup" className="text-primary text-decoration-none fw-semibold">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
