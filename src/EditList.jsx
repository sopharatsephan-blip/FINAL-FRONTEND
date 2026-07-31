import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from './LanguageContext';
import './admindashboard.css'; // ใช้ CSS เดียวกันกับ Admin Dashboard

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
  FaArrowRight,
  FaLanguage
} from 'react-icons/fa';

export default function EditList() {
  const navigate = useNavigate();
  const { t, lang, toggleLanguage } = useLanguage();
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
    <div className="admin-purple-container">
      {/* ===== Sidebar ม่วงเข้ม (สไตล์ Admin Dashboard) ===== */}
      <aside className="sidebar-purple">
        <div>
          {/* Brand Logo - ดอกไม้สีม่วงสว่าง */}
          <div className="brand-logo-purple" onClick={() => navigate('/admin')} style={{ cursor: 'pointer' }}>
            <FaAsterisk className="logo-icon" style={{ color: '#c084fc', marginRight: '8px' }} size={18} />
            <span>{t.appName || 'ICT Video Summary'}</span>
          </div>

          {/* User Profile Box */}
          <div className="user-profile-purple">
            <div className="avatar-purple">
              {currentUser && currentUser.firstName ? currentUser.firstName.charAt(0) : 'S'}
            </div>
            <div className="user-info-purple">
              <h4>{currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Somchai Jaidee'}</h4>
              <span className="role-tag">Admin</span>
            </div>
          </div>

          {/* Nav Menu */}
          <nav className="menu-list-purple">
            <button className="menu-item-purple" onClick={() => navigate('/admin')}>
              <FaHome size={16} />
              <span>{t.dashboard || 'แดชบอร์ด'}</span>
            </button>

            <button className="menu-item-purple" onClick={() => navigate('/upload-video')}>
              <FaVideo size={16} />
              <span>{t.uploadVideo || 'อัปโหลดวิดีโอ'}</span>
            </button>

            {/* Active Menu */}
            <button className="menu-item-purple active" onClick={() => navigate('/edit-summary')}>
              <FaEdit size={16} />
              <span>{t.editSummary || 'แก้ไขข้อมูลสรุป'}</span>
            </button>

            <button className="menu-item-purple" onClick={() => navigate('/publish')}>
              <FaGlobe size={16} />
              <span>{t.publish || 'เผยแพร่'}</span>
            </button>

            <button className="menu-item-purple" onClick={() => navigate('/users')}>
              <FaUsers size={16} />
              <span>{t.userManagement || 'จัดการผู้ใช้'}</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="sidebar-footer-purple">
          {/* ปุ่มสลับภาษาตรง Sidebar */}
          <button
            type="button"
            className="menu-item-purple"
            onClick={toggleLanguage}
            style={{ marginBottom: '10px', background: 'rgba(139, 92, 246, 0.2)', color: '#c084fc' }}
          >
            <FaLanguage size={18} />
            <span>{lang ? lang.toUpperCase() : 'EN'}</span>
          </button>

          <button className="logout-btn-purple" onClick={handleLogout}>
            <FaSignOutAlt size={16} />
            <span>{t.logout || 'ออกจากระบบ'}</span>
          </button>
        </div>
      </aside>

      {/* ===== Main Content Space ===== */}
      <main className="main-content-purple">
        {/* Header Bar */}
        <header className="top-header-purple">
          <div className="header-title">
            <div className="header-icon-box" style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#c084fc', padding: '8px', borderRadius: '8px', display: 'flex' }}>
              <FaEdit size={18} />
            </div>
            <div>
              <h2 style={{ margin: 0, color: '#ffffff' }}>
                {lang === 'en' ? 'Edit Summary Data' : 'แก้ไขข้อมูลสรุปเนื้อหา'}
              </h2>
              <p className="subtitle-purple" style={{ margin: '4px 0 0 0' }}>
                {lang === 'en' ? 'Edit and manage video summary details' : 'จัดการและแก้ไขข้อมูลสรุปเนื้อหาวิดีโอ'}
              </p>
            </div>
          </div>

          <div className="search-box-purple">
            <FaSearch style={{ color: '#9ca3af', fontSize: '14px' }} />
            <input 
              type="text" 
              placeholder={t.searchPlaceholder || 'ค้นหาสรุป, ตำแหน่งงาน...'} 
            />
          </div>
        </header>

        {/* การ์ดรายการสรุปเนื้อหา - ใช้คลาส .purple-card ปรับความกว้างเต็ม 100% เท่าหน้าแอดมิน */}
        <div className="purple-card" style={{ width: '100%', marginTop: '10px', padding: '0' }}>
          <div 
            onClick={() => navigate('/edit-summary-detail')}
            style={{ 
              padding: '24px 28px',
              cursor: 'pointer',
              borderRadius: '14px',
              transition: 'all 0.3s ease',
              background: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(139, 92, 246, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            {/* Header การ์ด */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '9px', height: '9px', background: '#22c55e', borderRadius: '50%', boxShadow: '0 0 8px #22c55e' }}></span>
                <span style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: '600' }}>
                  {lang === 'en' ? 'Summary Completed' : 'สรุปเสร็จสิ้น'}
                </span>
              </div>

              {/* ปุ่ม/ข้อความคลิกเพื่อแก้ไข */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#c4b5fd', fontSize: '0.82rem', fontWeight: '500', background: 'rgba(139, 92, 246, 0.2)', padding: '4px 12px', borderRadius: '20px', border: '1px solid rgba(139, 92, 246, 0.4)' }}>
                <span>{lang === 'en' ? 'Click to edit summary' : 'คลิกเพื่อแก้ไขสรุป'}</span>
                <FaArrowRight size={10} style={{ color: '#c084fc' }} />
              </div>
            </div>

            {/* Body การ์ด */}
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div style={{ 
                width: '56px', 
                height: '56px', 
                background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)', 
                borderRadius: '16px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: '#ffffff', 
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
              }}>
                <FaPlay size={18} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <h3 style={{ color: '#ffffff', margin: 0, fontSize: '1.1rem', fontWeight: '600', lineHeight: '1.4' }}>
                  Internship ตำแหน่ง UX/UI Design | บริษัท อินเวิร์ส โซลูชันส์ จำกัด
                </h3>
                <p style={{ color: '#cbd5e1', fontSize: '0.88rem', margin: 0 }}>
                  {lang === 'en' ? '30 Jan 2026 · 112 original sentences ➔ 5 summary sentences' : '30 ม.ค. 2569 · 112 ประโยคต้นฉบับ ➔ 5 ประโยคสรุป'}
                </p>
                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                  <span className="purple-badge">
                    UX/UI
                  </span>
                  <span style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#86efac', border: '1px solid rgba(34, 197, 94, 0.4)', padding: '4px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: '600' }}>
                    {lang === 'en' ? 'Completed' : 'สรุปเสร็จแล้ว'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}