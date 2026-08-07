import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../LanguageContext";
import html2pdf from "html2pdf.js";
import "./StudentDashboard.css";
import "./CoopContent.css";

import {
  FaHome,
  FaFileAlt,
  FaHeart,
  FaRegHeart,
  FaSignOutAlt,
  FaSearch,
  FaUserGraduate,
  FaLanguage,
  FaCalendarAlt,
  FaEye,
  FaDownload,
  FaArrowLeft,
  FaCheck
} from "react-icons/fa";

const API_BASE = "http://localhost:5000";

function CoopContent() {
  const navigate = useNavigate();
  const langContext = typeof useLanguage === "function" ? useLanguage() : null;
  const lang = langContext?.lang || "th";
  const toggleLanguage = langContext?.toggleLanguage || (() => {});
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  // ===== ข้อมูลจริงจากฐานข้อมูล =====
  const [coopItems, setCoopItems] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ===== หน้ารายละเอียดสรุป (View Summary) =====
  const [viewingItem, setViewingItem] = useState(null); // ข้อมูลการ์ดที่กำลังดู (เพื่อโชว์ชื่อ/บริษัท)
  const [summaryData, setSummaryData] = useState(null); // ข้อมูลสรุปจริงจาก API
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const summaryRef = useRef(null);

  // ===== ช่องค้นหาด้านบน =====
  const [searchQuery, setSearchQuery] = useState("");

  // ดึงวิดีโอที่เผยแพร่แล้วทั้งหมด + รายการโปรดของผู้ใช้
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const requests = [fetch(`${API_BASE}/api/videos/search`)];
        if (currentUser?.uid) {
          requests.push(fetch(`${API_BASE}/api/favorites/${currentUser.uid}`));
        }

        const responses = await Promise.all(requests);
        const videosData = await responses[0].json();
        setCoopItems(Array.isArray(videosData) ? videosData : []);

        if (responses[1]) {
          const favData = await responses[1].json();
          setFavoriteIds(Array.isArray(favData) ? favData : []);
        }
      } catch (err) {
        console.error("Fetch coop content error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentUser?.uid]);

  const formatUploadDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "-";

    if (lang === "en") {
      return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
    }
    const thaiMonthsShort = [
      "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
      "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
    ];
    return `${d.getDate()} ${thaiMonthsShort[d.getMonth()]}${d.getFullYear() + 543}`;
  };

  const toggleFavorite = async (videoId) => {
    if (!currentUser?.uid) return;
    const isFav = favoriteIds.includes(videoId);

    // อัปเดตหน้าจอทันที (optimistic update)
    setFavoriteIds((prev) =>
      isFav ? prev.filter((id) => id !== videoId) : [...prev, videoId]
    );

    try {
      if (isFav) {
        await fetch(`${API_BASE}/api/favorites/${currentUser.uid}/${videoId}`, {
          method: "DELETE"
        });
      } else {
        await fetch(`${API_BASE}/api/favorites`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid: currentUser.uid, videoId })
        });
      }
    } catch (err) {
      console.error("Toggle favorite error:", err);
      // ถ้าเรียก API ไม่สำเร็จ ให้ย้อนสถานะกลับ
      setFavoriteIds((prev) =>
        isFav ? [...prev, videoId] : prev.filter((id) => id !== videoId)
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // เปิดหน้าสรุป: ดึง SummaryText จริงจาก DB ตาม VideoID
  const handleOpenSummary = async (item) => {
    setViewingItem(item);
    setSummaryData(null);
    setIsSummaryLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/videos/${item.VideoID}/summary`);
      if (!res.ok) {
        setSummaryData({ notFound: true });
        return;
      }
      const data = await res.json();
      setSummaryData(data);
    } catch (err) {
      console.error("Fetch summary error:", err);
      setSummaryData({ notFound: true });
    } finally {
      setIsSummaryLoading(false);
    }
  };

  const handleBackFromSummary = () => {
    setViewingItem(null);
    setSummaryData(null);
  };

  const handleWatchVideo = (item) => {
    navigate(`/video/${item.VideoID}`);
  };

  // กรองรายการตามคำค้นหาจากช่องด้านบน (ค้นหาจากตำแหน่ง, ชื่อวิดีโอ, บริษัท, หมวดหมู่, คีย์เวิร์ด)
  const filteredCoopItems = coopItems.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.trim().toLowerCase();
    const haystack = [
      item.Position,
      item.VideoTitle,
      item.CompanyName,
      item.CategoryName,
      item.Keywords
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return haystack.includes(q);
  });

  const handleDownload = () => {
    const node = summaryRef.current;
    if (!node || !viewingItem) return;

    setIsDownloading(true);

    const safeName = (viewingItem.Position || viewingItem.VideoTitle || "summary").replace(/\s+/g, "_");
    const filename = `${safeName}_summary.pdf`;

    html2pdf()
      .set({
        filename,
        margin: 10,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, backgroundColor: "#150a1f", useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["css", "legacy"] }
      })
      .from(node)
      .save()
      .then(() => {
        setIsDownloading(false);
        setShowSuccessModal(true);
        setTimeout(() => setShowSuccessModal(false), 3000);
      })
      .catch(() => {
        setIsDownloading(false);
      });
  };

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
            <div className="avatar-student" style={{ marginRight: "10px" }}>ICT</div>
            <span>ICT Cooperative</span>
          </div>

          <div className="user-profile-student">
            <div className="avatar-student">
              <FaUserGraduate />
            </div>
            <div className="user-info-student">
              <h4>{lang === "en" ? "Student & Advisor" : "นักศึกษาและอาจารย์"}</h4>
              <span className="role-tag-student">{currentUser?.username || "User Panel"}</span>
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
        <header
          className="top-header-purple"
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <div className="header-title" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              className="avatar-purple"
              style={{
                background: "rgba(139, 92, 246, 0.2)",
                color: "#c4b5fd",
                border: "1px solid rgba(139, 92, 246, 0.4)"
              }}
            >
              <FaFileAlt />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: "18px", color: "#fff" }}>
                {viewingItem
                  ? (lang === "en" ? "Summary Details" : "รายละเอียดสรุป")
                  : (lang === "en" ? "Co-op Content" : "เนื้อหาสหกิจศึกษา")}
              </h2>
              {!viewingItem && (
                <p className="subtitle-purple">
                  {lang === "en" ? "All Summary Content" : "สรุปเนื้อหาทั้งหมด"}
                </p>
              )}
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

        <div style={{ margin: "16px 0" }}>
          <button
            type="button"
            onClick={() => (viewingItem ? handleBackFromSummary() : navigate("/dashboard"))}
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
            <FaArrowLeft />{" "}
            {viewingItem
              ? (lang === "en" ? "Back" : "ย้อนกลับ")
              : (lang === "en" ? "Back to Dashboard" : "กลับไปหน้าแดชบอร์ด")}
          </button>
        </div>

        {viewingItem ? (
          <div
            ref={summaryRef}
            className="purple-card"
            style={{
              maxWidth: "820px",
              margin: "24px auto 0",
              padding: "28px clamp(20px, 4vw, 40px)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "0 0 6px" }}>
              <FaFileAlt style={{ color: "#a855f7" }} size={20} />
              <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "#fff" }}>
                {`${lang === "en" ? "Position" : "ตำแหน่ง"} ${viewingItem.Position || viewingItem.VideoTitle} | ${viewingItem.CompanyName || "-"}`}
              </h2>
            </div>
            <p style={{ margin: "0 0 20px", color: "#8b8ba0", fontSize: "13px" }}>
              {formatUploadDate(viewingItem.UploadDate)}
            </p>

            {isSummaryLoading && (
              <p style={{ color: "#c4b5fd" }}>{lang === "en" ? "Loading summary..." : "กำลังโหลดสรุป..."}</p>
            )}

            {!isSummaryLoading && summaryData?.notFound && (
              <p style={{ color: "#8b8ba0" }}>
                {lang === "en" ? "No summary available for this video yet." : "วิดีโอนี้ยังไม่มีข้อมูลสรุป"}
              </p>
            )}

            {!isSummaryLoading && summaryData && !summaryData.notFound && (
              <div>
                <p style={{ margin: 0, color: "#d4d4d8", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
                  {summaryData.SummaryText || (lang === "en" ? "No summary text." : "ไม่มีเนื้อหาสรุป")}
                </p>
              </div>
            )}

            <button
              data-html2canvas-ignore="true"
              onClick={handleDownload}
              disabled={isDownloading || isSummaryLoading || summaryData?.notFound}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "#a855f7",
                border: "none",
                borderRadius: "10px",
                padding: "12px 22px",
                color: "#fff",
                fontWeight: 700,
                fontSize: "14px",
                cursor: isDownloading ? "not-allowed" : "pointer",
                opacity: isDownloading || summaryData?.notFound ? 0.6 : 1,
                marginTop: "24px",
                boxShadow: "0 8px 20px rgba(168, 85, 247, 0.35)"
              }}
            >
              <FaDownload />{" "}
              {isDownloading
                ? (lang === "en" ? "Preparing..." : "กำลังเตรียมไฟล์...")
                : (lang === "en" ? "Download PDF" : "ดาวน์โหลด PDF")}
            </button>
          </div>
        ) : (
          <div className="coop-card-wrapper">
            <div className="coop-section-head">
              <span className="coop-status-dot"></span>
              <span>{lang === "en" ? "All Summary Content" : "สรุปเนื้อหาทั้งหมด"}</span>
            </div>

            {isLoading && (
              <p style={{ color: "#c4b5fd" }}>{lang === "en" ? "Loading..." : "กำลังโหลด..."}</p>
            )}

            {!isLoading && coopItems.length === 0 && (
              <p style={{ color: "#8b8ba0" }}>
                {lang === "en" ? "No published content yet." : "ยังไม่มีเนื้อหาที่เผยแพร่"}
              </p>
            )}

            {!isLoading && coopItems.length > 0 && filteredCoopItems.length === 0 && (
              <p style={{ color: "#8b8ba0" }}>
                {lang === "en" ? "No results match your search." : "ไม่พบข้อมูลที่ตรงกับคำค้นหา"}
              </p>
            )}

            {!isLoading && filteredCoopItems.length > 0 && (
              <div className="coop-card-list">
                {filteredCoopItems.map((item) => {
                  const isFav = favoriteIds.includes(item.VideoID);
                  return (
                    <div key={item.VideoID} className="coop-card">
                      <div className="coop-card-top">
                        <div>
                          <h3 className="coop-card-title">
                            {`${lang === "en" ? "Position" : "ตำแหน่ง"} ${item.Position || item.VideoTitle} | ${item.CompanyName || "-"}`}
                          </h3>
                          <div className="coop-card-meta">
                            <span className="coop-meta-item">
                              <FaCalendarAlt style={{ color: "#a855f7" }} />{" "}
                              {formatUploadDate(item.UploadDate)}
                            </span>
                          </div>
                        </div>

                        <button
                          className={`coop-fav-btn ${isFav ? "active" : ""}`}
                          onClick={() => toggleFavorite(item.VideoID)}
                          title={lang === "en" ? "Save to favorites" : "บันทึกรายการโปรด"}
                        >
                          {isFav ? <FaHeart /> : <FaRegHeart />}
                        </button>
                      </div>

                      <div className="coop-actions">
                        <button className="btn-view-video" onClick={() => handleWatchVideo(item)}>
                          <FaEye /> {lang === "en" ? "Watch Video" : "ดูวิดีโอ"}
                        </button>
                        <button className="btn-view-summary" onClick={() => handleOpenSummary(item)}>
                          <FaFileAlt /> {lang === "en" ? "View Summary" : "ดูสรุป"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ===== Pop-up Modal ดาวน์โหลดเสร็จสิ้น (ตรงกลางจอ) ===== */}
        {showSuccessModal && (
          <div
            onClick={() => setShowSuccessModal(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "#ffffff",
                borderRadius: "24px",
                padding: "40px 32px",
                width: "90%",
                maxWidth: "360px",
                textAlign: "center",
                boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                animation: "popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
              }}
            >
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  backgroundColor: "#dcfce7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px"
                }}
              >
                <FaCheck size={36} style={{ color: "#10b981" }} />
              </div>

              <h3
                style={{
                  color: "#1e293b",
                  fontSize: "20px",
                  fontWeight: "700",
                  margin: "0 0 10px"
                }}
              >
                {lang === "en" ? "Download Complete!" : "ดาวน์โหลดเสร็จสิ้น !"}
              </h3>

              <p
                style={{
                  color: "#64748b",
                  fontSize: "14px",
                  lineHeight: "1.5",
                  margin: 0
                }}
              >
                {lang === "en"
                  ? "File has been saved to your device and is ready to open."
                  : "ไฟล์ถูกบันทึกลงในอุปกรณ์ของคุณแล้ว สามารถเปิดได้ในทันที"}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default CoopContent;