import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ บันทึกข้อมูลผู้ใช้
        localStorage.setItem("user", JSON.stringify(data.user));

        // 🚀 วาร์ปพุ่งตรงไปหน้า Admin Dashboard ทันที!
        navigate("/admin");
      } else {
        setErrorMessage(data.message || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setErrorMessage("ไม่สามารถเชื่อมต่อ Server ได้ (ตรวจสอบการรัน node server.js)");
    }
  };

  return (
    <div className="login-container">
      {/* ฝั่งซ้าย: แผงข้อมูลธีมเดียวกับ Home */}
      <div className="info-panel">
        <div className="content-wrapper">
          <div className="logo-icon" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>✻</div>
          <h1>
            Video <br />
            Summary System
          </h1>
          <p>
            Platform for teachers to upload lesson videos and students to watch, 
            read summaries, and download notes efficiently.
          </p>
          <footer>© 2026 Video Summary System. All rights reserved.</footer>
        </div>
      </div>

      {/* ฝั่งขวา: ฟอร์ม Login โทนสีเข้ม */}
      <form className="login-box" onSubmit={handleLogin}>
        <div className="form-header">
          <h2>Video Summary</h2>
          <h3>Welcome Back!</h3>
          <p className="subtitle">
            Don't have an account? <a href="/register">Sign up now</a>
          </p>
        </div>

        <input
          type="text"
          placeholder="Username or Email Address"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {errorMessage && (
          <p style={{ color: "#ff4d4f", fontSize: "14px", margin: "5px 0 10px 0", textAlign: "left" }}>
            ⚠️ {errorMessage}
          </p>
        )}

        <button type="submit" className="btn-login-now">
          Login Now
        </button>

        <div className="divider">or</div>

        <button type="button" className="btn-google">
          <span className="google-icon">G</span>
          Login with Google
        </button>

        <p className="forgot-password">
          Forgot password? <a href="/reset-password">Click here</a>
        </p>
      </form>
    </div>
  );
}

export default Login;