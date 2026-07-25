import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PublishSummary.css';

import { 
  FaHome, 
  FaVideo, 
  FaEdit, 
  FaGlobe, 
  FaUsers, 
  FaSignOutAlt, 
  FaSearch, 
  FaPlay,
  FaAsterisk,
  FaArrowRight
} from 'react-icons/fa';

export default function PublishList() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("User parse error", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="dark-purple-container">
      {/* Sidebar */}
      <aside className="sidebar-dark-purple">
        <div className="sidebar-top">
          <div className="brand-logo-dark" onClick={() => navigate('/admin')} style={{ cursor: 'pointer' }}>
            <div className="ict-logo-box-dark">
              <FaAsterisk className="brand-icon" />
              <span>ICT Video Summary</span>
            </div>
          </div>

          <div className="user-profile-dark">
            <div className="avatar-dark">
              {currentUser && currentUser.firstName ? currentUser.firstName.charAt(0) : 'S'}
            </div>
            <div className="user-info-dark">
              <h4>{currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Somchai Jaidee'}</h4>
              <span className="user-role">Admin</span>
            </div>
          </div>

          <nav className="menu-list-dark">
            <button className="menu-item-dark" onClick={() => navigate('/admin')}>
              <FaHome size={18} />
              <span>แดชบอร์ด</span>
            </button>

            <button className="menu-item-dark" onClick={() => navigate('/upload-video')}>
              <FaVideo size={18} />
              <span>อัปโหลดวิดีโอ</span>
            </button>

            <button className="menu-item-dark" onClick={() => navigate('/edit-summary')}>
              <FaEdit size={18} />
              <span>แก้ไขข้อมูลสรุป</span>
            </button>

            <button className="menu-item-dark active" onClick={() => navigate('/publish')}>
              <FaGlobe size={18} />
              <span>เผยแพร่</span>
            </button>

            <button className="menu-item-dark" onClick={() => navigate('/users')}>
              <FaUsers size={18} />
              <span>จัดการผู้ใช้</span>
            </button>
          </nav>
        </div>

        <button className="logout-btn-dark" onClick={handleLogout}>
          <FaSignOutAlt size={16} />
          <span>ออกจากระบบ</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content-dark">
        <header className="top-header-dark">
          <div className="header-title-box">
            <div className="header-icon-glow">
              <FaGlobe size={20} />
            </div>
            <h2>เผยแพร่สรุปเนื้อหา</h2>
          </div>

          <div className="search-box-dark">
            <FaSearch className="search-icon-dark" />
            <input 
              type="text" 
              className="search-input-dark" 
              placeholder="ค้นหาสรุป, ตำแหน่งงาน..." 
            />
          </div>
        </header>

        {/* ส่วนการ์ดแสดงผลสไตล์โฉมใหม่ */}
        <div className="publish-card-wrapper">
          <div 
            className="publish-hero-card"
            onClick={() => navigate('/publish-summary')}
          >
            <div className="hero-card-header">
              <div className="status-badge-container">
                <span className="green-status-dot"></span>
                <span className="hero-card-title">สรุปเสร็จสิ้น</span>
              </div>
              <span className="click-hint-badge">
                คลิกเพื่อดูสรุป <FaArrowRight size={11} />
              </span>
            </div>

            <div className="hero-card-body">
              <div className="hero-video-thumb">
                <div className="play-icon-circle">
                  <FaPlay size={16} />
                </div>
              </div>

              <div className="hero-video-info">
                <h3 className="hero-video-title">
                  Internship ตำแหน่ง UX/UI Design | บริษัท อินเวิร์ส โซลูชันส์ จำกัด
                </h3>
                <p className="hero-video-meta">
                  30 ม.ค. 2569 · 112 ประโยคต้นฉบับ ➔ 5 ประโยคสรุป
                </p>
                <div className="tag-badges">
                  <span className="badge-purple-glow">UX/UI</span>
                  <span className="badge-green-glow">สรุปเสร็จแล้ว</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}