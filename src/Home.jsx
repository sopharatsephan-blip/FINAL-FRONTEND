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
          <img className="brand-logo-image" src="/video-summary-logo.png" alt="" />
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
            Upload lesson videos, explore AI summaries, and revisit key ideas whenever you need.
          </p>
          <div className="hero-actions">
            <button className="btn-glow" onClick={() => navigate("/login")}>
              Login to Get Started
            </button>
          </div>
        </div>

        {/* Role-based Features Grid */}
        <div className="features-grid">
          <div className="feature-card">
            <h3>For Teachers</h3>
            <p>Upload lesson videos and create summaries with AI.</p>
          </div>
          <div className="feature-card">
            <h3>For Students</h3>
            <p>Watch lessons, review summaries, and download notes anytime.</p>
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
