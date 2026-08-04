import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "../LanguageContext";
import "./StudentDashboard.css";

import {
  FaHome,
  FaFileAlt,
  FaHeart,
  FaSignOutAlt,
  FaUserGraduate,
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
    <div className="admin-purple-container">
      {/* ===== Sidebar ===== */}
      <aside className="sidebar-purple">
        <div>
          <div
            className="brand-logo-purple"
            onClick={() => navigate("/dashboard")}
            style={{ cursor: "pointer" }}
          >
            <div className="avatar-purple" style={{ marginRight: "10px" }}>ICT</div>
            <span>ICT Cooperative</span>
          </div>

          <div className="user-profile-purple">
            <div className="avatar-purple">
              <FaUserGraduate />
            </div>
            <div className="user-info-purple">
              <h4>{lang === "en" ? "Student & Advisor" : "นักศึกษาและอาจารย์"}</h4>
              <span className="role-tag">{currentUser?.username || "User Panel"}</span>
            </div>
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

        <div className="sidebar-footer-purple">
          <button className="logout-btn-purple" onClick={handleLogout}>
            <FaSignOutAlt />
            <span>{lang === "en" ? "Logout" : "ออกจากระบบ"}</span>
          </button>
        </div>
      </aside>

      {/* ===== Main Content ===== */}
      <main className="main-content-purple">
        <div style={{ margin: "0 0 20px" }}>
          <button
            type="button"
            onClick={() => navigate("/coop-content")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(139, 92, 246, 0.12)",
              border: "1px solid rgba(139, 92, 246, 0.4)",
              borderRadius: "999px",
              padding: "8px 16px",
              color: "#c4b5fd",
              fontWeight: 600,
              fontSize: "13px",
              cursor: "pointer"
            }}
          >
            <FaArrowLeft /> {lang === "en" ? "Back to Co-op Content" : "กลับไปหน้าเนื้อหาสหกิจศึกษา"}
          </button>
        </div>

        {isLoading && (
          <p style={{ color: "#c4b5fd" }}>{lang === "en" ? "Loading video..." : "กำลังโหลดวิดีโอ..."}</p>
        )}

        {!isLoading && notFound && (
          <div className="purple-card">
            <p style={{ color: "#8b8ba0", margin: 0 }}>
              {lang === "en" ? "Video not found." : "ไม่พบวิดีโอนี้ในระบบ"}
            </p>
          </div>
        )}

        {!isLoading && video && !notFound && (
          <div className="purple-card" style={{ maxWidth: "900px", margin: "0 auto" }}>
            <h2 style={{ margin: "0 0 4px", fontSize: "18px", color: "#fff" }}>
              {`${lang === "en" ? "Position" : "ตำแหน่ง"} ${video.Position || video.VideoTitle} | ${video.CompanyName || "-"}`}
            </h2>
            <p style={{ margin: "0 0 20px", color: "#8b8ba0", fontSize: "13px" }}>
              {video.CategoryName || "-"}
              {video.UploadDate ? ` · ${new Date(video.UploadDate).toLocaleDateString(lang === "en" ? "en-GB" : "th-TH")}` : ""}
            </p>

            {videoUrl ? (
              <video
                key={videoUrl}
                controls
                style={{
                  width: "100%",
                  borderRadius: "12px",
                  background: "#000",
                  maxHeight: "520px"
                }}
              >
                <source src={videoUrl} />
                {lang === "en"
                  ? "Your browser does not support the video tag."
                  : "เบราว์เซอร์ของคุณไม่รองรับการเล่นวิดีโอ"}
              </video>
            ) : (
              <p style={{ color: "#8b8ba0" }}>
                {lang === "en" ? "No video file available." : "ไม่พบไฟล์วิดีโอ"}
              </p>
            )}

            {video.SummaryText && (
              <div style={{ marginTop: "24px" }}>
                <h3 style={{ color: "#a855f7", fontSize: "15px", fontWeight: 700, margin: "0 0 8px" }}>
                  {lang === "en" ? "Summary" : "สรุปเนื้อหา"}
                </h3>
                <p style={{ margin: 0, color: "#d4d4d8", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
                  {video.SummaryText}
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default VideoPlayer;