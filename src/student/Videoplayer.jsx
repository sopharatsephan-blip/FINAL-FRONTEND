import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "../LanguageContext";
import "./StudentDashboard.css";

import {
  FaHome,
  FaFileAlt,
  FaHeart,
  FaSignOutAlt,
  FaArrowLeft
} from "react-icons/fa";

const API_BASE = "http://localhost:5000";

function VideoPlayer() {
  const navigate = useNavigate();
  const { id } = useParams();
  const langContext = typeof useLanguage === "function" ? useLanguage() : null;
  const lang = langContext?.lang || "th";
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  const [video, setVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchVideo = async () => {
      setIsLoading(true);
      setNotFound(false);
      try {
        const res = await fetch(`${API_BASE}/api/videos/${id}`);
        if (!res.ok) {
          setNotFound(true);
          return;
        }
        const data = await res.json();
        setVideo(data);
      } catch (err) {
        console.error("Fetch video error:", err);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchVideo();
  }, [id]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // VideoPath ในฐานข้อมูลเก็บเป็น "uploads/videos/xxx.mp4" (ไม่มี / นำหน้า)
  const videoUrl = video?.VideoPath
    ? `${API_BASE}/${video.VideoPath.replace(/^\/+/, "")}`
    : null;

  return (
    <div className="admin-purple-container student-dashboard-container student-content-page admin-dashboard-page">
      {/* ===== Sidebar ===== */}
      <aside className="sidebar-purple">
        <div>
          <button
            type="button"
            className="brand-logo-purple"
            onClick={() => navigate("/dashboard")}
          >
            <img className="brand-logo-image" src="/video-summary-logo.png" alt="" />
            <span>ICT Video Summary</span>
          </button>

          <div className="student-account-actions">
            <div className="user-profile-student">
              <div className="avatar-purple">
                {(currentUser?.firstName || currentUser?.username || "S").charAt(0).toUpperCase()}
              </div>
              <div className="user-info-purple">
                <h4>
                  {currentUser
                    ? [currentUser.firstName, currentUser.lastName].filter(Boolean).join(" ") || currentUser.username || (lang === "en" ? "User" : "ผู้ใช้")
                    : lang === "en" ? "User" : "ผู้ใช้"}
                </h4>
                <span className="role-tag">{lang === "en" ? "Student" : "นักศึกษา"}</span>
              </div>
            </div>
            <button
              type="button"
              className="student-profile-logout"
              onClick={handleLogout}
              aria-label={lang === "en" ? "Log out" : "ออกจากระบบ"}
              title={lang === "en" ? "Log out" : "ออกจากระบบ"}
            >
              <FaSignOutAlt aria-hidden="true" />
            </button>
          </div>

          <nav className="menu-list-purple">
            <button className="menu-item-purple" onClick={() => navigate("/dashboard")}>
              <FaHome />
              <span>{lang === "en" ? "Dashboard" : "แดชบอร์ด"}</span>
            </button>

            <button className="menu-item-purple active" onClick={() => navigate("/coop-content")}>
              <FaFileAlt />
              <span>{lang === "en" ? "Co-op Content" : "เนื้อหาสหกิจศึกษา"}</span>
            </button>

            <button className="menu-item-purple" onClick={() => navigate("/favorites")}>
              <FaHeart style={{ color: "#ef4444" }} />
              <span>{lang === "en" ? "Favorites" : "รายการโปรด"}</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* ===== Main Content ===== */}
      <main className="main-content-purple student-video-main">
        <div className="student-video-toolbar">
          <button
            type="button"
            onClick={() => navigate("/coop-content")}
            className="student-video-back"
          >
            <FaArrowLeft /> {lang === "en" ? "Back to Co-op Content" : "กลับไปหน้าเนื้อหาสหกิจศึกษา"}
          </button>
        </div>

        {isLoading && (
          <p className="student-video-message" role="status">{lang === "en" ? "Loading video..." : "กำลังโหลดวิดีโอ..."}</p>
        )}

        {!isLoading && notFound && (
          <div className="purple-card student-video-card">
            <p className="student-video-message">
              {lang === "en" ? "Video not found." : "ไม่พบวิดีโอนี้ในระบบ"}
            </p>
          </div>
        )}

        {!isLoading && video && !notFound && (
          <article className="purple-card student-video-card">
            <h1 className="student-video-title">
              {`${lang === "en" ? "Position" : "ตำแหน่ง"} ${video.Position || video.VideoTitle} | ${video.CompanyName || "-"}`}
            </h1>
            <p className="student-video-meta">
              {video.CategoryName || "-"}
              {video.UploadDate ? ` · ${new Date(video.UploadDate).toLocaleDateString(lang === "en" ? "en-GB" : "th-TH")}` : ""}
            </p>

            {videoUrl ? (
              <video
                key={videoUrl}
                controls
                className="student-video-element"
              >
                <source src={videoUrl} />
                {lang === "en"
                  ? "Your browser does not support the video tag."
                  : "เบราว์เซอร์ของคุณไม่รองรับการเล่นวิดีโอ"}
              </video>
            ) : (
              <p className="student-video-message">
                {lang === "en" ? "No video file available." : "ไม่พบไฟล์วิดีโอ"}
              </p>
            )}

            {video.SummaryText && (
              <section className="student-video-summary">
                <h2>
                  {lang === "en" ? "Summary" : "สรุปเนื้อหา"}
                </h2>
                <p>
                  {video.SummaryText}
                </p>
              </section>
            )}
          </article>
        )}
      </main>
    </div>
  );
}

export default VideoPlayer;
