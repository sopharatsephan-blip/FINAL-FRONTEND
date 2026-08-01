import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <div className="logo-area">
          <span className="logo-star">✻</span>
          <span className="logo-text">Video Summary</span>
        </div>
        <nav className="nav-links">
          <button className="btn-text" onClick={() => navigate("/login")}>
            Login
          </button>
          <button className="btn-primary" onClick={() => navigate("/Register")}>
            Get Started
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="hero-section">
        <div className="hero-content">
          <h1>
            Video Learning Summary System <br />
            <span className="highlight">For Teachers and Students</span>
          </h1>
          <p>
            A central platform enabling teachers to upload lesson videos while allowing 
            students to watch videos, read text summaries, and download notes for effective review.
          </p>
          <div className="hero-actions">
            <button className="btn-glow" onClick={() => navigate("/login")}>
              Login to Get Started 🎓
            </button>
          </div>
        </div>

        {/* Role-based Features Grid */}
        <div className="features-grid">
          <div className="feature-card">
            <h3>👨‍🏫 For Teachers</h3>
            <p>Upload lesson videos, manage contents, and automatically generate text summaries using AI.</p>
          </div>
          <div className="feature-card">
            <h3>👨‍🎓 For Students</h3>
            <p>Watch recorded video lessons, read key insights, and download summaries to review anytime.</p>
          </div>
          <div className="feature-card">
            <h3>⚡ Efficient & Fast</h3>
            <p>Save time on reviewing materials and enhance the overall teaching and learning experience.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="home-footer">
        <p>© 2026 Video Summary System. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;