import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SummaryResult.css';

import { 
  FaHome, 
  FaVideo, 
  FaEdit, 
  FaGlobe, 
  FaUsers, 
  FaSignOutAlt, 
  FaSearch, 
  FaCheck, 
  FaTrashAlt, 
  FaShareAlt, 
  FaEye, 
  FaDownload,
  FaAsterisk,
  FaArrowLeft,
  FaExclamationTriangle
} from 'react-icons/fa';

export default function SummaryResult() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  // State สำหรับ Pop-up ลบข้อมูล
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

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

  const confirmDelete = () => {
    setIsDeleted(true);
    setTimeout(() => {
      setShowDeleteModal(false);
      navigate('/upload-video');
    }, 1500);
  };

  // กดเปิดหน้าดูสรุป (ส่ง LexRank เป็นค่าหลัก)
  const handleViewSummary = () => {
    navigate('/summary-detail?algo=LexRank');
  };

  return (
    <div className="admin-purple-container">
      {/* Sidebar */}
      <aside className="sidebar-purple">
        <div>
          <div className="brand-logo-purple" onClick={() => navigate('/admin')} style={{ cursor: 'pointer' }}>
            <FaAsterisk style={{ color: '#c084fc' }} />
            <span>ICT Video Summary</span>
          </div>

          <div className="user-profile-purple">
            <div className="avatar-purple">
              {currentUser ? currentUser.firstName.charAt(0) : 'S'}
            </div>
            <div className="user-info-purple">
              <h4>{currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Somchai Jaidee'}</h4>
              <span className="role-tag">Admin</span>
            </div>
          </div>

          <nav className="menu-list-purple">
            <button className="menu-item-purple" onClick={() => navigate('/admin')}>
              <FaHome size={16} />
              <span>แดชบอร์ด</span>
            </button>

            <button className="menu-item-purple active" onClick={() => navigate('/upload-video')}>
              <FaVideo size={16} />
              <span>อัปโหลดวิดีโอ</span>
            </button>

            <button className="menu-item-purple" onClick={() => navigate('/edit-summary')}>
              <FaEdit size={16} />
              <span>แก้ไขข้อมูลสรุป</span>
            </button>

            <button className="menu-item-purple">
              <FaGlobe size={16} />
              <span>เผยแพร่</span>
            </button>

            <button className="menu-item-purple">
              <FaUsers size={16} />
              <span>จัดการผู้ใช้</span>
            </button>
          </nav>
        </div>

        <button className="logout-btn-purple" onClick={handleLogout}>
          <FaSignOutAlt size={16} />
          <span>ออกจากระบบ</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content-purple">
        <header className="top-header-purple">
          <div className="header-title-box">
            <div className="header-icon-badge">
              <FaVideo size={18} />
            </div>
            <h2>อัปโหลดวิดีโอ</h2>
          </div>

          <div className="search-box-purple">
            <FaSearch className="search-icon-purple" />
            <input 
              type="text" 
              className="search-input-purple" 
              placeholder="ค้นหาสรุป, ตำแหน่งงาน" 
            />
          </div>
        </header>

        <div className="summary-body-area">
          <div className="summary-card-purple">
            
            <div className="summary-card-header">
              <div className="header-status-title">
                <span className="green-status-dot"></span>
                <h3>สรุปเสร็จสิ้น</h3>
              </div>
              <button className="btn-back-purple" onClick={() => navigate('/upload-video')}>
                <FaArrowLeft /> ย้อนกลับ / อัปโหลดเพิ่ม
              </button>
            </div>

            <div className="result-box-purple">
              {/* ปุ่มลบ */}
              <button 
                className="btn-delete-purple" 
                title="ลบสรุปนี้"
                onClick={() => setShowDeleteModal(true)}
              >
                <FaTrashAlt />
              </button>

              <div className="result-content-wrapper">
                <div className="check-icon-circle-purple">
                  <FaCheck />
                </div>

                <div className="result-info-text">
                  <h4 className="success-title-text">สรุปเนื้อหาเสร็จสิ้นแล้ว!</h4>
                  <p className="job-title-text">Internship ตำแหน่ง UX/UI Design</p>
                  <p className="company-title-text">| บริษัท อินเวิร์ส โซลูชันส์ จำกัด</p>
                </div>
              </div>

              {/* กลุ่มปุ่ม Action */}
              <div className="result-actions-group">
                <button className="btn-action btn-edit" onClick={() => navigate('/edit-summary')}>
                  <FaEdit /> แก้ไข
                </button>

                <button className="btn-action btn-share">
                  <FaShareAlt /> แชร์
                </button>
                
                {/* ปุ่มดูสรุป LexRank */}
                <button className="btn-action btn-view" onClick={handleViewSummary}>
                  <FaEye /> ดูสรุป (LexRank)
                </button>

                <button className="btn-action btn-download">
                  <FaDownload /> ดาวน์โหลด
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Pop-up ยืนยันการลบ */}
      {showDeleteModal && (
        <div className="modal-overlay-purple">
          <div className="modal-content-purple">
            {!isDeleted ? (
              <>
                <div className="modal-icon warning">
                  <FaExclamationTriangle />
                </div>
                <h3>ยืนยันการลบข้อมูล?</h3>
                <p>คุณแน่ใจหรือไม่ว่าต้องการลบสรุปเนื้อหานี้ ข้อมูลจะไม่สามารถกู้คืนได้</p>
                <div className="modal-actions">
                  <button className="btn-modal-cancel" onClick={() => setShowDeleteModal(false)}>
                    ยกเลิก
                  </button>
                  <button className="btn-modal-confirm" onClick={confirmDelete}>
                    ยืนยันลบ
                  </button>
                </div>
              </>
            ) : (
              <div className="delete-success-box">
                <div className="modal-icon success">
                  <FaCheck />
                </div>
                <h3>ลบเสร็จสิ้น!</h3>
                <p>กำลังพากลับไปยังหน้าอัปโหลด...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}