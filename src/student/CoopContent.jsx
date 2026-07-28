import React, { useState } from "react";
import { 
  FaHome, 
  FaBookOpen, 
  FaFilePdf, 
  FaHeart, 
  FaSignOutAlt, 
  FaSearch, 
  FaUserGraduate, 
  FaCalendarAlt, 
  FaFileAlt, 
  FaEye, 
  FaDownload,
  FaRegHeart
} from "react-icons/fa";
import { useLanguage } from "../LanguageContext";
import "./CoopContent.css";

function CoopContent() {
  const langContext = typeof useLanguage === 'function' ? useLanguage() : null;
  const language = langContext?.language || 'th';

  const [coopItems, setCoopItems] = useState([
    {
      id: 1,
      title: "ตำแหน่ง UX/UI Design | บริษัท อินเวิร์ซ โซลูชันส์ จำกัด",
      date: "30 ม.ค.2569",
      pages: "5 หน้า",
      keyword: "UX/UI Design",
      isFavorite: false
    },
    {
      id: 2,
      title: "ตำแหน่ง Graphic บริษัท PRINT UP",
      date: "30 ม.ค.2569",
      pages: "5 หน้า",
      keyword: "Graphic",
      isFavorite: false
    },
    {
      id: 3,
      title: "ตำแหน่ง web Developer บริษัท IO-HOPE ENTERPRISE",
      date: "30 ม.ค.2569",
      pages: "5 หน้า",
      keyword: "web Developer",
      isFavorite: false
    }
  ]);

  const toggleFavorite = (id) => {
    setCoopItems(prev => prev.map(item => 
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    ));
  };

  return (
    <div className="coop-page-container">
      {/* Sidebar */}
      <aside className="coop-sidebar">
        <div>
          <div className="coop-logo">
            <span style={{ fontSize: '1.4rem' }}>💻</span> ICT Co-Op
          </div>
          
          <div className="coop-user-badge">
            <FaUserGraduate size={18} />
            <span>นักศึกษาและอาจารย์</span>
          </div>

          <div className="coop-menu-label">เมนูหลัก</div>
          <ul className="coop-menu-list">
            <li className="coop-menu-item">
              <FaHome />
              <span>แดชบอร์ด</span>
            </li>
            <li className="coop-menu-item active">
              <FaBookOpen />
              <span>เนื้อหาสหกิจศึกษา</span>
            </li>
            <li className="coop-menu-item">
              <FaFilePdf />
              <span>ดาวน์โหลด PDF</span>
            </li>
            <li className="coop-menu-item">
              <FaHeart />
              <span>รายการโปรด</span>
            </li>
          </ul>
        </div>

        <div className="coop-logout-btn">
          <FaSignOutAlt />
          <span>ออกจากระบบ</span>
        </div>
      </aside>

      {/* Main Area */}
      <main className="coop-main">
        <div className="coop-header">
          <div className="coop-title">
            <FaBookOpen style={{ color: '#a855f7' }} />
            <span>เนื้อหาสหกิจศึกษา</span>
          </div>
          
          <div className="coop-search">
            <FaSearch className="coop-search-icon" />
            <input type="text" placeholder="ค้นหาสรุป, ตำแหน่งงาน..." />
          </div>
        </div>

        <div className="coop-card-wrapper">
          <div className="coop-section-head">
            <span className="coop-status-dot"></span>
            <span>สรุปเนื้อหาทั้งหมด</span>
          </div>

          <div className="coop-card-list">
            {coopItems.map((item) => (
              <div key={item.id} className="coop-card">
                <div className="coop-card-top">
                  <div>
                    <h3 className="coop-card-title">{item.title}</h3>
                    <div className="coop-card-meta">
                      <span className="coop-meta-item">
                        <FaCalendarAlt style={{ color: '#a855f7' }} /> {item.date}
                      </span>
                      <span className="coop-meta-item">
                        <FaFileAlt style={{ color: '#a855f7' }} /> {item.pages}
                      </span>
                    </div>
                  </div>
                  
                  <button 
                    className={`coop-fav-btn ${item.isFavorite ? 'active' : ''}`}
                    onClick={() => toggleFavorite(item.id)}
                    title="บันทึกรายการโปรด"
                  >
                    {item.isFavorite ? <FaHeart /> : <FaRegHeart />}
                  </button>
                </div>

                <div className="coop-keyword-box">
                  คีย์เวิร์ด : <span style={{ color: '#c084fc', fontWeight: 500 }}>{item.keyword}</span>
                </div>

                <div className="coop-actions">
                  <button className="btn-view-video">
                    <FaEye /> ดูวิดีโอ
                  </button>
                  <button className="btn-download-pdf">
                    <FaDownload /> PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default CoopContent;