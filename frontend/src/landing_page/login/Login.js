import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("https://trading-app-backend-gilt.vercel.app/login", formData);
      const token = res.data.token;
      const user = res.data.user;

      localStorage.setItem("token", token);

      // Pass user as query param to dashboard
      const userEncoded = encodeURIComponent(JSON.stringify(user));
      const DASHBOARD_URL =
        process.env.REACT_APP_DASHBOARD_URL || "http://localhost:3001";
      window.location.href = `${DASHBOARD_URL}?user=${userEncoded}`;

    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <h2 className="mb-4 text-center">Log in to your TradeWave account</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label>Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            onChange={handleChange}
            value={formData.email}
            required
          />
        </div>
        <div className="form-group mb-4">
          <label>Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            onChange={handleChange}
            value={formData.password}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
