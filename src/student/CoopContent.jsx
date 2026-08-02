import React, { useState, useRef } from "react";
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
  FaFileAlt as FaPages,
  FaEye,
  FaDownload,
  FaArrowLeft,
  FaCheck
} from "react-icons/fa";

function CoopContent() {
  const navigate = useNavigate();
  const langContext = typeof useLanguage === "function" ? useLanguage() : null;
  const lang = langContext?.lang || "th";
  const toggleLanguage = langContext?.toggleLanguage || (() => {});
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  const [coopItems, setCoopItems] = useState([
    {
      id: 1,
      titleTh: "ตำแหน่ง UX/UI Design | บริษัท อินเวิร์ซ โซลูชันส์ จำกัด",
      titleEn: "Position UX/UI Design | INVERSE SOLUTIONS CO., LTD.",
      dateTh: "30 ม.ค.2569",
      dateEn: "30 January 2026",
      pages: "5",
      keyword: "UX/UI Design",
      isFavorite: false,
      summaryEn: [
        { title: "Company / Organization Name", body: "A private company specializing in software design, website, and mobile application development located in Phuket." },
        { title: "Position and Job Responsibilities", body: "Internship position in UI/UX design, responsible for analyzing user requirements, creating wireframes and web interfaces, as well as testing and making design improvements based on feedback." },
        { title: "Projects or Tasks During Internship", intro: "Designed 3 back-end web systems using Figma, including:", body: ["Company Data Management System", "Driver & Vehicle Management System", "Car Booking System & Spa System for masseuse management, queue booking, and products"] },
        { title: "Problems Encountered and Solutions", body: "Encountered issues in aligning designs with user expectations; solved by continuously receiving team feedback and iteratively improving designs." },
        { title: "Key Takeaways & Experience Gained", body: "Learned practical teamwork, effective communication, and enhanced skills in design and analytical thinking." },
        { title: "Future Career Outlook", body: "Inclined toward pursuing a career path in UI/UX and system design based on internship experiences." },
        { title: "Recommendation for This Internship Site", body: "Highly recommended due to hands-on projects, helpful team mentorship, and a welcoming atmosphere." },
        { title: "Suggestions for Juniors", body: "Stay open to continuous learning, build diverse skill sets, and actively express ideas to grow professionally." }
      ],
      summaryTh: [
        { title: "ชื่อบริษัท / องค์กร", body: "บริษัทเอกชนที่เชี่ยวชาญด้านการออกแบบซอฟต์แวร์ เว็บไซต์ และแอปพลิเคชันมือถือ ตั้งอยู่ในจังหวัดภูเก็ต" },
        { title: "ตำแหน่งและหน้าที่ความรับผิดชอบ", body: "ตำแหน่งฝึกงานด้านการออกแบบ UI/UX รับผิดชอบวิเคราะห์ความต้องการของผู้ใช้ ออกแบบไวร์เฟรมและหน้าเว็บ รวมถึงทดสอบและปรับปรุงงานออกแบบตามฟีดแบ็ก" },
        { title: "โปรเจกต์หรืองานที่ได้รับมอบหมายระหว่างฝึกงาน", intro: "ออกแบบระบบเว็บฝั่งหลังบ้าน 3 ระบบด้วย Figma ได้แก่", body: ["ระบบจัดการข้อมูลบริษัท", "ระบบจัดการคนขับรถและยานพาหนะ", "ระบบจองรถและระบบสปาสำหรับจัดการพนักงานนวด การจองคิว และสินค้า"] },
        { title: "ปัญหาที่พบและแนวทางแก้ไข", body: "พบปัญหาการออกแบบให้ตรงกับความคาดหวังของผู้ใช้ แก้ไขโดยรับฟีดแบ็กจากทีมอย่างต่อเนื่องและปรับปรุงงานออกแบบซ้ำ ๆ" },
        { title: "สิ่งที่ได้เรียนรู้และประสบการณ์ที่ได้รับ", body: "ได้เรียนรู้การทำงานเป็นทีม การสื่อสารที่มีประสิทธิภาพ และพัฒนาทักษะการออกแบบและการคิดวิเคราะห์" },
        { title: "แนวทางอาชีพในอนาคต", body: "มีแนวโน้มจะเลือกเส้นทางอาชีพด้าน UI/UX และการออกแบบระบบจากประสบการณ์ฝึกงานครั้งนี้" },
        { title: "คำแนะนำสำหรับสถานประกอบการนี้", body: "แนะนำอย่างยิ่ง เนื่องจากได้ลงมือทำงานจริง มีพี่เลี้ยงทีมงานที่ช่วยเหลือดี และบรรยากาศเป็นกันเอง" },
        { title: "ข้อเสนอแนะสำหรับรุ่นน้อง", body: "เปิดใจเรียนรู้อย่างต่อเนื่อง สร้างทักษะที่หลากหลาย และกล้าแสดงความคิดเห็นเพื่อพัฒนาตนเองในสายอาชีพ" }
      ]
    },
    {
      id: 2,
      titleTh: "ตำแหน่ง Graphic บริษัท PRINT UP",
      titleEn: "Position Graphic | PRINT UP CO., LTD.",
      dateTh: "30 ม.ค.2569",
      dateEn: "30 January 2026",
      pages: "5",
      keyword: "Graphic",
      isFavorite: false,
      summaryEn: [
        { title: "Company / Organization Name", body: "A printing and graphic production company, PRINT UP CO., LTD., offering design and print services for business clients." },
        { title: "Position and Job Responsibilities", body: "Internship position in Graphic Design, responsible for producing artwork, preparing print-ready files, and coordinating with the production team." },
        { title: "Projects or Tasks During Internship", intro: "Produced design work for client campaigns, including:", body: ["Company branding and logo refresh", "Packaging and label artwork", "Promotional banners and social media graphics"] },
        { title: "Problems Encountered and Solutions", body: "Faced tight deadlines and revision requests; managed by prioritizing tasks and communicating clearly with the design team." },
        { title: "Key Takeaways & Experience Gained", body: "Gained hands-on experience with print production standards, color management, and client communication." },
        { title: "Future Career Outlook", body: "Interested in pursuing a career in graphic design or brand design after graduation." },
        { title: "Recommendation for This Internship Site", body: "Recommended for students who want real production experience and direct client-facing design work." },
        { title: "Suggestions for Juniors", body: "Practice software skills beforehand and be open to feedback, since revisions are a normal part of the design process." }
      ],
      summaryTh: [
        { title: "ชื่อบริษัท / องค์กร", body: "บริษัท พริ้นท์อัพ จำกัด ผู้ให้บริการงานพิมพ์และกราฟิก ให้บริการออกแบบและพิมพ์งานสำหรับลูกค้าธุรกิจ" },
        { title: "ตำแหน่งและหน้าที่ความรับผิดชอบ", body: "ตำแหน่งฝึกงานด้านกราฟิกดีไซน์ รับผิดชอบผลิตงานอาร์ตเวิร์ก จัดเตรียมไฟล์สำหรับพิมพ์ และประสานงานกับทีมผลิต" },
        { title: "โปรเจกต์หรืองานที่ได้รับมอบหมายระหว่างฝึกงาน", intro: "ผลิตงานออกแบบให้ลูกค้าหลายแคมเปญ ได้แก่", body: ["งานปรับปรุงโลโก้และภาพลักษณ์บริษัท", "งานออกแบบบรรจุภัณฑ์และฉลากสินค้า", "แบนเนอร์โปรโมชันและกราฟิกสำหรับโซเชียลมีเดีย"] },
        { title: "ปัญหาที่พบและแนวทางแก้ไข", body: "พบปัญหาเรื่องกำหนดเวลาที่กระชั้นชิดและการแก้ไขงานบ่อยครั้ง แก้ไขโดยจัดลำดับความสำคัญของงานและสื่อสารกับทีมออกแบบอย่างชัดเจน" },
        { title: "สิ่งที่ได้เรียนรู้และประสบการณ์ที่ได้รับ", body: "ได้เรียนรู้มาตรฐานงานพิมพ์ การจัดการสี และการสื่อสารกับลูกค้า" },
        { title: "แนวทางอาชีพในอนาคต", body: "สนใจประกอบอาชีพด้านกราฟิกดีไซน์หรือแบรนด์ดีไซน์หลังสำเร็จการศึกษา" },
        { title: "คำแนะนำสำหรับสถานประกอบการนี้", body: "แนะนำสำหรับนักศึกษาที่ต้องการประสบการณ์งานผลิตจริงและงานออกแบบที่ต้องพบลูกค้าโดยตรง" },
        { title: "ข้อเสนอแนะสำหรับรุ่นน้อง", body: "ฝึกฝนการใช้โปรแกรมมาก่อนล่วงหน้า และเปิดใจรับฟีดแบ็ก เพราะการแก้ไขงานเป็นส่วนหนึ่งของกระบวนการออกแบบ" }
      ]
    },
    {
      id: 3,
      titleTh: "ตำแหน่ง web Developer บริษัท IO-HOPE ENTERPRISE",
      titleEn: "Position Web Developer | IO-HOPE ENTERPRISE",
      dateTh: "30 ม.ค.2569",
      dateEn: "30 January 2026",
      pages: "5",
      keyword: "web Developer",
      isFavorite: false,
      summaryEn: [
        { title: "Company / Organization Name", body: "IO-HOPE ENTERPRISE, a software and web development company providing custom web applications for clients." },
        { title: "Position and Job Responsibilities", body: "Internship position in Web Development, responsible for building front-end interfaces, connecting APIs, and fixing bugs reported by the QA team." },
        { title: "Projects or Tasks During Internship", intro: "Developed features for an internal web system, including:", body: ["Student dashboard and search/filter functions", "Video content management pages", "API integration between front-end and back-end"] },
        { title: "Problems Encountered and Solutions", body: "Encountered bugs related to state management and API response handling; resolved through debugging, code review, and mentor guidance." },
        { title: "Key Takeaways & Experience Gained", body: "Strengthened skills in React, REST APIs, and working within a real development workflow using version control." },
        { title: "Future Career Outlook", body: "Interested in continuing a career as a front-end or full-stack web developer." },
        { title: "Recommendation for This Internship Site", body: "Recommended for students who want to work on real production code with an experienced development team." },
        { title: "Suggestions for Juniors", body: "Build a solid foundation in JavaScript and version control (Git) before starting, and don't hesitate to ask questions." }
      ],
      summaryTh: [
        { title: "ชื่อบริษัท / องค์กร", body: "บริษัท IO-HOPE ENTERPRISE ผู้พัฒนาซอฟต์แวร์และเว็บแอปพลิเคชันสำหรับลูกค้า" },
        { title: "ตำแหน่งและหน้าที่ความรับผิดชอบ", body: "ตำแหน่งฝึกงานด้าน Web Developer รับผิดชอบพัฒนาหน้าเว็บฝั่งผู้ใช้ เชื่อมต่อ API และแก้ไขบั๊กที่ทีม QA แจ้ง" },
        { title: "โปรเจกต์หรืองานที่ได้รับมอบหมายระหว่างฝึกงาน", intro: "พัฒนาฟีเจอร์ให้ระบบเว็บภายในองค์กร ได้แก่", body: ["หน้าแดชบอร์ดนักศึกษาและฟังก์ชันค้นหา/กรองข้อมูล", "หน้าจัดการเนื้อหาวิดีโอ", "การเชื่อมต่อ API ระหว่างฝั่งหน้าบ้านและหลังบ้าน"] },
        { title: "ปัญหาที่พบและแนวทางแก้ไข", body: "พบปัญหาเรื่องการจัดการสเตตและการรับส่งข้อมูลจาก API แก้ไขโดยการดีบัก ตรวจสอบโค้ดร่วมกับทีม และคำแนะนำจากพี่เลี้ยง" },
        { title: "สิ่งที่ได้เรียนรู้และประสบการณ์ที่ได้รับ", body: "พัฒนาทักษะ React, REST API และการทำงานร่วมกับทีมพัฒนาจริงโดยใช้ระบบควบคุมเวอร์ชัน" },
        { title: "แนวทางอาชีพในอนาคต", body: "สนใจประกอบอาชีพเป็น Front-end หรือ Full-stack Web Developer ต่อไป" },
        { title: "คำแนะนำสำหรับสถานประกอบการนี้", body: "แนะนำสำหรับนักศึกษาที่ต้องการทำงานกับโค้ดจริงร่วมกับทีมพัฒนาที่มีประสบการณ์" },
        { title: "ข้อเสนอแนะสำหรับรุ่นน้อง", body: "ควรมีพื้นฐาน JavaScript และ Git ที่แน่นก่อนเริ่มฝึกงาน และอย่ากลัวที่จะถามเมื่อไม่เข้าใจ" }
      ]
    }
  ]);

  const [viewingItem, setViewingItem] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const summaryRef = useRef(null);

  const toggleFavorite = (id) => {
    setCoopItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleOpenSummary = (item) => {
    setViewingItem(item);
  };

  const handleBackFromSummary = () => {
    setViewingItem(null);
  };

  const handleDownload = (item) => {
    const node = summaryRef.current;
    if (!node) return;

    setIsDownloading(true);

    const filename = `${item.keyword.replace(/\s+/g, "_")}_summary.pdf`;

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
        // แสดง Modal 3 วินาทีแล้วซ่อนอัตโนมัติ
        setTimeout(() => setShowSuccessModal(false), 3000);
      })
      .catch(() => {
        setIsDownloading(false);
      });
  };

  const summary = viewingItem ? (lang === "en" ? viewingItem.summaryEn : viewingItem.summaryTh) : null;

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
            onClick={() => navigate("/dashboard")}
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
            <FaArrowLeft /> {lang === "en" ? "Back to Dashboard" : "กลับไปหน้าแดชบอร์ด"}
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
            <button
              data-html2canvas-ignore="true"
              onClick={handleBackFromSummary}
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
              <FaArrowLeft /> {lang === "en" ? "Back" : "ย้อนกลับ"}
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "24px 0 20px" }}>
              <FaFileAlt style={{ color: "#a855f7" }} size={20} />
              <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "#fff" }}>
                {lang === "en" ? "Topic Summary" : "สรุปหัวข้อ"}
              </h2>
            </div>

            {summary.map((sec, idx) => (
              <div key={idx} style={{ marginBottom: "22px" }}>
                <h3 style={{ color: "#a855f7", fontSize: "15px", fontWeight: 700, margin: "0 0 6px" }}>
                  {idx + 1}) {sec.title}
                </h3>
                {sec.intro && (
                  <p style={{ margin: "0 0 6px", color: "#d4d4d8", lineHeight: 1.6 }}>{sec.intro}</p>
                )}
                {Array.isArray(sec.body) ? (
                  <ul style={{ margin: 0, paddingLeft: "20px", color: "#d4d4d8", lineHeight: 1.6 }}>
                    {sec.body.map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ margin: 0, color: "#d4d4d8", lineHeight: 1.6 }}>{sec.body}</p>
                )}
              </div>
            ))}

            <button
              data-html2canvas-ignore="true"
              onClick={() => handleDownload(viewingItem)}
              disabled={isDownloading}
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
                opacity: isDownloading ? 0.7 : 1,
                marginTop: "8px",
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

            <div className="coop-card-list">
              {coopItems.map((item) => (
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
                      className={`coop-fav-btn ${item.isFavorite ? "active" : ""}`}
                      onClick={() => toggleFavorite(item.id)}
                      title={lang === "en" ? "Save to favorites" : "บันทึกรายการโปรด"}
                    >
                      {item.isFavorite ? <FaHeart /> : <FaRegHeart />}
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
                    <button className="btn-download-pdf" onClick={() => handleOpenSummary(item)}>
                      <FaDownload /> PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
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
              {/* วงกลมไอคอนติ๊กถูกสีเขียวอ่อน */}
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

              {/* ข้อความแจ้งเตือน */}
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