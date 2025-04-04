import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("https://trading-app-backend-gilt.vercel.app/signup", formData);
      localStorage.setItem("token", res.data.token); // Store JWT
      localStorage.setItem("user", JSON.stringify(res.data.user)); // Save user too
      window.location.href =
        process.env.REACT_APP_DASHBOARD_URL || "http://localhost:3001"; // Or wherever you want
    } catch (err) {
      console.error("Signup failed:", err.response?.data);
      setError(err.response?.data?.message || "Signup failed.");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <h2 className="mb-4 text-center">Create Your TradeWave Account</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label>Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group mb-3">
          <label>Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group mb-4">
          <label>Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
