import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from './LanguageContext'; // 🌐 นำเข้า useLanguage
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
  FaGlobeAmericas // 🌐 ไอคอนโลกสำหรับปุ่มภาษา
} from 'react-icons/fa';

export default function PublishSummary() {
  const navigate = useNavigate();
  const { t, lang, toggleLanguage } = useLanguage(); // 🌐 ดึงข้อมูลภาษาและฟังก์ชันสลับภาษา
  const [currentUser, setCurrentUser] = useState(null);
  const [publishTarget, setPublishTarget] = useState('everyone'); 
  
  // เพิ่ม State สำหรับควบคุม Success Modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  // เมื่อกดปุ่มเผยแพร่ ให้เปิด Modal ขึ้นมา
  const handlePublish = () => {
    setShowSuccessModal(true);
  };

  // ปิด Modal แล้วพาไปหน้า Admin/Dashboard
  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate('/admin');
  };

  return (
    <div className="dark-purple-container">
      {/* Sidebar สีม่วงดำเข้ม */}
      <aside className="sidebar-dark-purple">
        <div className="sidebar-top">
          <div className="brand-logo-dark" onClick={() => navigate('/admin')} style={{ cursor: 'pointer' }}>
            <div className="ict-logo-box-dark">
              <FaAsterisk className="brand-icon" />
              <span>{t.appName || 'ICT Video Summary'}</span>
            </div>
          </div>

          <div className="user-profile-dark">
            <div className="avatar-dark">
              <FaUserAlt size={16} />
            </div>
            <div className="user-info-dark">
              <h4>{currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'อาจารย์ผู้ประสานงาน'}</h4>
              <span className="user-role">Admin</span>
            </div>
          </div>

          <nav className="menu-list-dark">
            <button className="menu-item-dark" onClick={() => navigate('/admin')}>
              <FaHome size={18} />
              <span>{t.dashboard || 'แดชบอร์ด'}</span>
            </button>

            <button className="menu-item-dark" onClick={() => navigate('/upload-video')}>
              <FaVideo size={18} />
              <span>{t.uploadVideo || 'อัปโหลดวิดีโอ'}</span>
            </button>

            <button className="menu-item-dark" onClick={() => navigate('/edit-summary')}>
              <FaEdit size={18} />
              <span>{t.editSummary || 'แก้ไขข้อมูลของสรุป'}</span>
            </button>

            <button className="menu-item-dark active" onClick={() => navigate('/publish')}>
              <FaGlobe size={18} />
              <span>{t.publish || 'เผยแพร่'}</span>
            </button>

            <button className="menu-item-dark" onClick={() => navigate('/users')}>
              <FaUsers size={18} />
              <span>{t.userManagement || 'จัดการผู้ใช้'}</span>
            </button>
          </nav>
        </div>

        <button className="logout-btn-dark" onClick={handleLogout}>
          <FaSignOutAlt size={16} />
          <span>{t.logout || 'ออกจากระบบ'}</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content-dark">
        {/* Header พร้อมช่องค้นหา และปุ่มสลับภาษาขวามือ */}
        <header className="top-header-dark" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="header-title-box">
            <div className="header-icon-glow">
              <FaGlobe size={20} />
            </div>
            <h2>{lang === 'en' ? 'Publish Summary' : 'เผยแพร่สรุปเนื้อหา'}</h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {/* ช่องค้นหา */}
            <div className="search-box-dark">
              <FaSearch className="search-icon-dark" />
              <input 
                type="text" 
                className="search-input-dark" 
                placeholder={t.searchPlaceholder || 'ค้นหาสรุป, ตำแหน่งงาน...'} 
              />
            </div>

            {/* 🌐 ปุ่มสลับภาษา UI (มุมขวาบน) */}
            <button 
              type="button" 
              onClick={toggleLanguage}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '20px',
                border: '1px solid rgba(192, 132, 252, 0.4)',
                background: 'rgba(139, 92, 246, 0.15)',
                color: '#c084fc',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
            >
              <FaGlobeAmericas size={14} />
              <span>{lang ? lang.toUpperCase() : 'EN'}</span>
            </button>
          </div>
        </header>

        <div className="publish-body-area">
          <div className="publish-top-grid">
            <div className="publish-card-dark">
              <div className="card-header-dark">
                <span className="green-status-dot"></span>
                <h3>{lang === 'en' ? 'Summary Completed' : 'สรุปเสร็จสิ้น'}</h3>
              </div>
              <div className="summary-video-info">
                <div className="video-thumbnail-box-purple">
                  <FaPlay size={18} />
                </div>
                <div className="video-details">
                  <h4>Internship ตำแหน่ง UX/UI Design | บริษัท อินเวิร์ส โซลูชันส์ จำกัด</h4>
                  <p className="summary-meta-text">
                    {lang === 'en' ? '30 Jan 2026 · 112 original sentences ➔ 5 summary sentences' : '30 ม.ค. 2569 · 112 ประโยคต้นฉบับ ➔ 5 ประโยคสรุป'}
                  </p>
                  <div className="tag-badges">
                    <span className="badge-purple-glow">UX/UI</span>
                    <span className="badge-green-glow">{lang === 'en' ? 'Completed' : 'สรุปเสร็จแล้ว'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="publish-card-dark">
              <div className="card-header-dark">
                <span className="green-status-dot"></span>
                <h3>{lang === 'en' ? 'Target Audience' : 'เผยแพร่ถึงใคร'}</h3>
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

          {/* แถบส่วนล่าง: บทสรุปที่จะเผยแพร่ */}
          <div className="publish-card-dark main-summary-card-dark">
            <div className="card-header-dark">
              <span className="green-status-dot"></span>
              <h3>{lang === 'en' ? 'Summary to Publish' : 'บทสรุปที่จะเผยแพร่'}</h3>
            </div>

            <div className="summary-text-box-dark">
              <div className="summary-item-header">
                <div className="item-number">1</div>
                <h4>ตำแหน่ง UX/UI Design | บริษัท อินเวิร์ส โซลูชันส์ จำกัด</h4>
              </div>

              <div className="summary-section-dark">
                <h5>{lang === 'en' ? 'Summary Results:' : 'ผลสรุป:'}</h5>
                <p>
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