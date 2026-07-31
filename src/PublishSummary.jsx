import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from './LanguageContext';
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
  FaUserAlt,
  FaLock,
  FaChevronRight,
  FaAsterisk,
  FaCheck,
  FaLanguage
} from 'react-icons/fa';

export default function PublishSummary() {
  const navigate = useNavigate();
  const { t, lang, toggleLanguage } = useLanguage();
  const [currentUser, setCurrentUser] = useState(null);
  const [publishTarget, setPublishTarget] = useState('everyone'); 
  
  // State สำหรับควบคุม Success Modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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

  const handlePublish = () => {
    setShowSuccessModal(true);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate('/admin');
  };

  return (
    <div className="admin-purple-container">
      {/* ===== Sidebar ม่วงเข้ม (สไตล์ Admin Dashboard) ===== */}
      <aside className="sidebar-purple">
        <div>
          {/* Brand Logo */}
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

            <button className="menu-item-purple" onClick={() => navigate('/edit-summary')}>
              <FaEdit size={16} />
              <span>{t.editSummary || 'แก้ไขข้อมูลสรุป'}</span>
            </button>

            {/* Active Menu */}
            <button className="menu-item-purple active" onClick={() => navigate('/publish')}>
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
              <FaGlobe size={18} />
            </div>
            <div>
              <h2 style={{ margin: 0, color: '#ffffff' }}>
                {lang === 'en' ? 'Publish Summary' : 'เผยแพร่สรุปเนื้อหา'}
              </h2>
              <p className="subtitle-purple" style={{ margin: '4px 0 0 0' }}>
                {lang === 'en' ? 'Review details and set audience target' : 'ตรวจสอบรายละเอียดและกำหนดกลุ่มผู้รับชม'}
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

        {/* Area เนื้อหา Publish - ใช้สไตล์และการจัดวางเดียวกับ Admin Dashboard */}
        <div className="publish-body-area">
          <div className="publish-top-grid">
            {/* การ์ดสรุปวิดีโอ */}
            <div className="purple-card">
              <div className="card-header-purple">
                <span className="green-status-dot"></span>
                <h3 style={{ margin: 0, color: '#ffffff', fontSize: '1.05rem', fontWeight: '600' }}>
                  {lang === 'en' ? 'Summary Completed' : 'สรุปเสร็จสิ้น'}
                </h3>
              </div>
              
              <div className="summary-video-info">
                <div className="video-thumbnail-box-purple">
                  <FaPlay size={18} />
                </div>
                <div className="video-details">
                  <h4 style={{ color: '#ffffff', margin: '0 0 6px 0', fontSize: '1rem', fontWeight: '600' }}>
                    Internship ตำแหน่ง UX/UI Design | บริษัท อินเวิร์ส โซลูชันส์ จำกัด
                  </h4>
                  <p style={{ color: '#cbd5e1', fontSize: '0.85rem', margin: '0 0 10px 0' }}>
                    {lang === 'en' ? '30 Jan 2026 · 112 original sentences ➔ 5 summary sentences' : '30 ม.ค. 2569 · 112 ประโยคต้นฉบับ ➔ 5 ประโยคสรุป'}
                  </p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span className="purple-badge">UX/UI</span>
                    <span style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#86efac', border: '1px solid rgba(34, 197, 94, 0.4)', padding: '4px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: '600' }}>
                      {lang === 'en' ? 'Completed' : 'สรุปเสร็จแล้ว'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* การ์ดเลือกกลุ่มเป้าหมาย */}
            <div className="purple-card">
              <div className="card-header-purple">
                <span className="green-status-dot"></span>
                <h3 style={{ margin: 0, color: '#ffffff', fontSize: '1.05rem', fontWeight: '600' }}>
                  {lang === 'en' ? 'Target Audience' : 'เผยแพร่ถึงใคร'}
                </h3>
              </div>
              
              <div className="target-selection">
                <div 
                  className={`target-box-dark ${publishTarget === 'everyone' ? 'active' : ''}`}
                  onClick={() => setPublishTarget('everyone')}
                >
                  <div className="icon-wrapper">
                    <FaUserAlt size={18} />
                  </div>
                  <span className="target-title">{lang === 'en' ? 'Everyone' : 'ทุกคน'}</span>
                  <small className="target-count">{lang === 'en' ? '100 users' : '100 คน'}</small>
                </div>

                <div 
                  className={`target-box-dark ${publishTarget === 'private' ? 'active' : ''}`}
                  onClick={() => setPublishTarget('private')}
                >
                  <div className="icon-wrapper">
                    <FaLock size={18} />
                  </div>
                  <span className="target-title">{lang === 'en' ? 'Private' : 'ส่วนตัว'}</span>
                  <small className="target-count">{lang === 'en' ? 'Custom' : 'กำหนดได้'}</small>
                </div>
              </div>
            </div>
          </div>

          {/* การ์ดบทสรุปที่จะเผยแพร่ (กล่องใหญ่ด้านล่าง) */}
          <div className="purple-card main-summary-card-dark">
            <div className="card-header-purple">
              <span className="green-status-dot"></span>
              <h3 style={{ margin: 0, color: '#ffffff', fontSize: '1.05rem', fontWeight: '600' }}>
                {lang === 'en' ? 'Summary to Publish' : 'บทสรุปที่จะเผยแพร่'}
              </h3>
            </div>

            <div className="summary-text-box-dark">
              <div className="summary-item-header">
                <div className="item-number">1</div>
                <h4 style={{ margin: 0, color: '#ffffff', fontSize: '1rem', fontWeight: '600' }}>
                  ตำแหน่ง UX/UI Design | บริษัท อินเวิร์ส โซลูชันส์ จำกัด
                </h4>
              </div>

              <div className="summary-section-dark">
                <h5 style={{ margin: '0 0 8px 0', color: '#c084fc', fontSize: '0.95rem', fontWeight: '600' }}>
                  {lang === 'en' ? 'Summary Results:' : 'ผลสรุป:'}
                </h5>
                <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.6' }}>
                  สวัสดีค่ะ ดิฉันได้ฝึกงานในบริษัทเอกชนที่จังหวัดภูเก็ต ซึ่งให้บริการด้านการออกแบบและพัฒนาซอฟต์แวร์เว็บไซต์และ Mobile Application โดยหน้าที่หลักคือการออกแบบ UI/UX วิเคราะห์ความต้องการผู้ใช้งาน และออกแบบหน้าตาเว็บไซต์ด้วยโปรแกรม Figma รวมถึงมีส่วนร่วมในการออกแบบระบบหลังบ้าน เช่น ระบบจัดการข้อมูลและระบบจองต่าง ๆ จากการฝึกงานครั้งนี้ทำให้ได้เรียนรู้การทำงานจริงและพัฒนาทักษะหลายด้าน... <span className="read-more-purple">{lang === 'en' ? 'Read more' : 'ดูเพิ่มเติม'}</span>
                </p>
              </div>
            </div>

            <div className="publish-action-bar">
              <button className="btn-publish-submit-dark" onClick={handlePublish}>
                <span className="btn-text">{lang === 'en' ? 'Ready to Publish' : 'พร้อมเผยแพร่แล้ว'}</span>
                <span className="go-pill-purple">GO <FaChevronRight size={10} /></span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* ================= SUCCESS MODAL (ป๊อปอัป) ================= */}
      {showSuccessModal && (
        <div className="modal-overlay-backdrop" onClick={handleCloseModal}>
          <div className="modal-success-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon-circle-outer">
              <div className="modal-icon-circle-inner">
                <FaCheck className="modal-check-icon" />
              </div>
            </div>

            <h3 className="modal-success-title">
              {lang === 'en' ? 'Published Successfully ! !' : 'เผยแพร่เสร็จสิ้น ! !'}
            </h3>
            <p className="modal-success-desc">
              {lang === 'en' 
                ? 'The summary has been successfully sent to students.\nIt is accessible immediately.' 
                : 'บทสรุปถูกส่งถึงนักศึกษาเรียบร้อยแล้ว\nสามารถเข้าถึงได้ทันที'}
            </p>

            <button className="modal-btn-confirm" onClick={handleCloseModal}>
              {lang === 'en' ? 'OK' : 'ตกลง'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}