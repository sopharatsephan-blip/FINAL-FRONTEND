import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "./LanguageContext";
import "./Login.css";

function Login() {
  const { t, lang, toggleLanguage } = useLanguage();
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
        localStorage.setItem("user", JSON.stringify(data.user));

        // ✅ เช็ค role แล้วค่อย navigate ตามสิทธิ์
        if (data.user.roleId === "R001") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      } else {
        setErrorMessage(data.message || (lang === 'en' ? "Login failed" : "เกิดข้อผิดพลาดในการเข้าสู่ระบบ"));
      }
    } catch (error) {
      console.error("Login Error:", error);
      setErrorMessage(
        lang === 'en' 
          ? "Unable to connect to server." 
          : "ไม่สามารถเชื่อมต่อ Server ได้"
      );
    }
  };

  return (
    <div className="login-container" style={{ position: "relative" }}>
      {/* 🌐 ปุ่มสลับภาษาบังคับลอยหน้าสุด */}
      <button 
        type="button"
        onClick={toggleLanguage}
        style={{
          position: "fixed",
          top: "24px",
          right: "24px",
          padding: "8px 18px",
          background: "#8b5cf6",
          border: "2px solid #ffffff",
          color: "#ffffff",
          borderRadius: "30px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontWeight: "bold",
          fontSize: "0.9rem",
          boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
          zIndex: 999999,
          outline: "none"
        }}
      >
        <span style={{ fontSize: "1.1rem" }}>🌐</span>
        <span>{lang ? lang.toUpperCase() : 'EN'}</span>
      </button>

      {/* ฝั่งซ้าย: แผงข้อมูล */}
      <div className="info-panel">
        <div className="content-wrapper">
          <div className="logo-icon" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>✻</div>
          <h1>
            Video <br />
            Summary System
          </h1>
          <p>
            {lang === 'en' 
              ? "Platform for teachers to upload lesson videos and students to watch, read summaries, and download notes efficiently."
              : "แพลตฟอร์มสำหรับอาจารย์ในการอัปโหลดวิดีโอบทเรียน และนิสิตสามารถรับชม อ่านบทสรุป และดาวน์โหลดโน้ตได้อย่างมีประสิทธิภาพ"}
          </p>
          <footer>© 2026 Video Summary System. All rights reserved.</footer>
        </div>
      </div>

      {/* ฝั่งขวา: ฟอร์ม Login */}
      <form className="login-box" onSubmit={handleLogin}>
        <div className="form-header">
          <h2>Video Summary</h2>
          <h3>{t.loginTitle}</h3>
          <p className="subtitle">
            {t.dontHaveAccount}{" "}
            <a href="/register">{t.signUpNow}</a>
          </p>
        </div>

        <input
          type="text"
          placeholder={t.usernameLabel}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder={t.passwordLabel}
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
          {t.loginBtn}
        </button>

        <p className="forgot-password">
          {t.forgotPassword}{" "}
          <a href="/reset-password">{t.clickHere}</a>
        </p>
      </form>
    </div>
  );
}

export default Login;