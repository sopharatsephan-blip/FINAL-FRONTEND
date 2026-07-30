import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../LanguageContext";
import "./StudentDashboard.css";
import "./CoopContent.css";
import "./Favorites.css";
import {
  FaHome,
  FaFileAlt,
  FaFilePdf,
  FaHeart,
  FaSignOutAlt,
  FaSearch,
  FaUserGraduate,
  FaLanguage,
  FaCalendarAlt,
  FaFileAlt as FaPages,
  FaEye,
  FaDownload
} from "react-icons/fa";

function Favorites() {
  const navigate = useNavigate();
  const langContext = typeof useLanguage === "function" ? useLanguage() : null;
  const lang = langContext?.lang || "th";
  const toggleLanguage = langContext?.toggleLanguage || (() => {});
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  // สมมติข้อมูลรายการโปรด (รายการที่เคยถูกกด favorite ไว้)
  const [favoriteItems, setFavoriteItems] = useState([
    {
      id: 1,
      titleTh: "ตำแหน่ง UX/UI Design | บริษัท อินเวิร์ซ โซลูชันส์ จำกัด",
      titleEn: "Position UX/UI Design | INVERSE SOLUTIONS CO., LTD.",
      dateTh: "30 ม.ค.2569",
      dateEn: "30 January 2026",
      pages: "5",
      keyword: "UX/UI Design",
      isFavorite: true
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");

  const toggleFavorite = (id) => {
    // เอาออกจากรายการโปรดเมื่อกดเลิกถูกใจ
    setFavoriteItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const filteredItems = favoriteItems.filter((item) => {
    const title = lang === "en" ? item.titleEn : item.titleTh;
    return title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           item.keyword.toLowerCase().includes(searchQuery.toLowerCase());
  });

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

          <p style={{ color: "#8b8ba0", fontSize: "12px", marginBottom: "8px", paddingLeft: "4px" }}>
            {lang === "en" ? "Main Menu" : "เมนูหลัก"}
          </p>

          <nav className="menu-list-purple">
            <button className="menu-item-purple" onClick={() => navigate("/dashboard")}>
              <FaHome />
              <span>{lang === "en" ? "Dashboard" : "แดชบอร์ด"}</span>
            </button>

            <button className="menu-item-purple" onClick={() => navigate("/coop-content")}>
              <FaFileAlt />
              <span>{lang === "en" ? "Co-op Content" : "เนื้อหาสหกิจศึกษา"}</span>
            </button>

            <button className="menu-item-purple" onClick={() => navigate("/download-pdf")}>
              <FaFilePdf style={{ color: "#ef4444" }} />
              <span>{lang === "en" ? "Download PDF" : "ดาวน์โหลด PDF"}</span>
            </button>

            <button className="menu-item-purple active" onClick={() => navigate("/favorites")}>
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
        <header
          className="top-header-purple"
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <div className="header-title" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              className="avatar-purple"
              style={{
                background: "rgba(239, 68, 68, 0.2)",
                color: "#ef4444",
                border: "1px solid rgba(239, 68, 68, 0.4)"
              }}
            >
              <FaHeart />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: "18px", color: "#fff", display: "flex", alignItems: "center", gap: "8px" }}>
                {lang === "en" ? "Favorites" : "รายการโปรด"}
                <span style={{ fontSize: "13px", color: "#8b8ba0", fontWeight: "normal" }}>
                  {lang === "en" ? "Saved by you" : "ที่คุณบันทึกไว้"}
                </span>
              </h2>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div className="search-box-purple">
              <FaSearch style={{ color: "#8b8ba0" }} />
              <input
                type="text"
                placeholder={lang === "en" ? "Search summary, position..." : "ค้นหาสรุป, ตำแหน่งงาน..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <button
              type="button"
              onClick={toggleLanguage}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(139, 92, 246, 0.2)",
                border: "1px solid rgba(139, 92, 246, 0.4)",
                borderRadius: "999px",
                padding: "8px 16px",
                color: "#c4b5fd",
                fontWeight: "600",
                fontSize: "13px",
                cursor: "pointer",
                whiteSpace: "nowrap"
              }}
            >
              <FaLanguage size={16} />
              <span>{lang ? lang.toUpperCase() : "EN"}</span>
            </button>
          </div>
        </header>

        {/* ===== Section รายการโปรด ===== */}
        <div className="coop-card-wrapper" style={{ marginTop: "24px" }}>
          <div className="coop-section-head">
            <span className="coop-status-dot"></span>
            <span>{lang === "en" ? "All Summary Content" : "สรุปเนื้อหาทั้งหมด"}</span>
          </div>

          {filteredItems.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                color: "#8b8ba0",
                background: "rgba(30, 27, 75, 0.4)",
                borderRadius: "16px",
                border: "1px dashed rgba(139, 92, 246, 0.3)",
                marginTop: "16px"
              }}
            >
              <FaHeart size={48} style={{ color: "rgba(239, 68, 68, 0.3)", marginBottom: "12px" }} />
              <p style={{ margin: 0, fontSize: "16px" }}>
                {lang === "en" ? "No favorite items found" : "ยังไม่มีรายการโปรดที่บันทึกไว้"}
              </p>
            </div>
          ) : (
            <div className="coop-card-list">
              {filteredItems.map((item) => (
                <div key={item.id} className="coop-card">
                  <div className="coop-card-top">
                    <div>
                      <h3 className="coop-card-title">
                        {lang === "en" ? item.titleEn : item.titleTh}
                      </h3>
                      <div className="coop-card-meta">
                        <span className="coop-meta-item">
                          <FaCalendarAlt style={{ color: "#a855f7" }} />{" "}
                          {lang === "en" ? item.dateEn : item.dateTh}
                        </span>
                        <span className="coop-meta-item">
                          <FaPages style={{ color: "#a855f7" }} />{" "}
                          {lang === "en" ? `${item.pages} pages` : `${item.pages} หน้า`}
                        </span>
                      </div>
                    </div>

                    <button
                      className="coop-fav-btn active"
                      onClick={() => toggleFavorite(item.id)}
                      title={lang === "en" ? "Remove from favorites" : "ลบออกจากรายการโปรด"}
                    >
                      <FaHeart />
                    </button>
                  </div>

                  <div className="coop-keyword-box">
                    {lang === "en" ? "Keyword" : "คีย์เวิร์ด"} :{" "}
                    <span style={{ color: "#c084fc", fontWeight: 500 }}>{item.keyword}</span>
                  </div>

                  <div className="coop-actions">
                    <button className="btn-view-video">
                      <FaEye /> {lang === "en" ? "Watch Video" : "ดูวิดีโอ"}
                    </button>
                    <button
                      className="btn-download-pdf"
                      onClick={() => navigate("/coop-content")}
                    >
                      <FaDownload /> PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Favorites;