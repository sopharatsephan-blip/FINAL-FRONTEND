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
  FaUserAlt,
  FaLock,
  FaChevronRight,
  FaAsterisk,
  FaCheck
} from 'react-icons/fa';

export default function PublishSummary() {
  const navigate = useNavigate();
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
              <span>ICT</span>
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
              <span>แดชบอร์ด</span>
            </button>

            <button className="menu-item-dark" onClick={() => navigate('/upload-video')}>
              <FaVideo size={18} />
              <span>อัปโหลดวิดีโอ</span>
            </button>

            <button className="menu-item-dark" onClick={() => navigate('/edit-summary')}>
              <FaEdit size={18} />
              <span>แก้ไขข้อมูลของสรุป</span>
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

        <div className="publish-body-area">
          <div className="publish-top-grid">
            <div className="publish-card-dark">
              <div className="card-header-dark">
                <span className="green-status-dot"></span>
                <h3>สรุปเสร็จสิ้น</h3>
              </div>
              <div className="summary-video-info">
                <div className="video-thumbnail-box-purple">
                  <FaPlay size={18} />
                </div>
                <div className="video-details">
                  <h4>Internship ตำแหน่ง UX/UI Design | บริษัท อินเวิร์ส โซลูชันส์ จำกัด</h4>
                  <p className="summary-meta-text">30 ม.ค. 2569 · 112 ประโยคต้นฉบับ ➔ 5 ประโยคสรุป</p>
                  <div className="tag-badges">
                    <span className="badge-purple-glow">UX/UI</span>
                    <span className="badge-green-glow">สรุปเสร็จแล้ว</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="publish-card-dark">
              <div className="card-header-dark">
                <span className="green-status-dot"></span>
                <h3>เผยแพร่ถึงใคร</h3>
              </div>
              <div className="target-selection">
                <div 
                  className={`target-box-dark ${publishTarget === 'everyone' ? 'active' : ''}`}
                  onClick={() => setPublishTarget('everyone')}
                >
                  <div className="icon-wrapper">
                    <FaUserAlt size={18} />
                  </div>
                  <span className="target-title">ทุกคน</span>
                  <small className="target-count">100 คน</small>
                </div>

                <div 
                  className={`target-box-dark ${publishTarget === 'private' ? 'active' : ''}`}
                  onClick={() => setPublishTarget('private')}
                >
                  <div className="icon-wrapper">
                    <FaLock size={18} />
                  </div>
                  <span className="target-title">ส่วนตัว</span>
                  <small className="target-count">กำหนดได้</small>
                </div>
              </div>
            </div>
          </div>

          {/* แถบส่วนล่าง: บทสรุปที่จะเผยแพร่ */}
          <div className="publish-card-dark main-summary-card-dark">
            <div className="card-header-dark">
              <span className="green-status-dot"></span>
              <h3>บทสรุปที่จะเผยแพร่</h3>
            </div>

            <div className="summary-text-box-dark">
              <div className="summary-item-header">
                <div className="item-number">1</div>
                <h4>ตำแหน่ง UX/UI Design | บริษัท อินเวิร์ส โซลูชันส์ จำกัด</h4>
              </div>

              <div className="summary-section-dark">
                <h5>ผลสรุป Lex Rank:</h5>
                <p>
                  สวัสดีค่ะ ดิฉันได้ฝึกงานในบริษัทเอกชนที่จังหวัดภูเก็ต ซึ่งให้บริการด้านการออกแบบและพัฒนาซอฟต์แวร์เว็บไซต์และ Mobile Application โดยหน้าที่หลักคือการออกแบบ UI/UX วิเคราะห์ความต้องการผู้ใช้งาน และออกแบบหน้าตาเว็บไซต์ด้วยโปรแกรม Figma รวมถึงมีส่วนร่วมในการออกแบบระบบหลังบ้าน เช่น ระบบจัดการข้อมูลและระบบจองต่าง ๆ จากการฝึกงานครั้งนี้ทำให้ได้เรียนรู้การทำงานจริงและพัฒนาทักษะหลายด้าน... <span className="read-more-purple">ดูเพิ่มเติม</span>
                </p>
              </div>
            </div>

            <div className="publish-action-bar">
              <button className="btn-publish-submit-dark" onClick={handlePublish}>
                <span className="btn-text">พร้อมเผยแพร่แล้ว</span>
                <span className="go-pill-purple">GO <FaChevronRight size={10} /></span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* ================= SUCCESS MODAL (ป๊อปอัปตรงตามภาพ) ================= */}
      {showSuccessModal && (
        <div className="modal-overlay-backdrop" onClick={handleCloseModal}>
          <div className="modal-success-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon-circle-outer">
              <div className="modal-icon-circle-inner">
                <FaCheck className="modal-check-icon" />
              </div>
            </div>

            <h3 className="modal-success-title">เผยแพร่เสร็จสิ้น ! !</h3>
            <p className="modal-success-desc">
              บทสรุปถูกส่งถึงนักศึกษาเรียบร้อยแล้ว<br />
              สามารถเข้าถึงได้ทันที
            </p>

            <button className="modal-btn-confirm" onClick={handleCloseModal}>
              ตกลง
            </button>
          </div>
        </div>
      )}
    </div>
  );
}