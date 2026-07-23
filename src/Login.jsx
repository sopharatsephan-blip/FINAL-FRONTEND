import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log({ email, password });
    alert(`Logging in with: ${email}`);
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
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

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