import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from './LanguageContext';
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
  FaExclamationTriangle,
  FaGlobeAmericas
} from 'react-icons/fa';

export default function SummaryResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, lang, toggleLanguage } = useLanguage();
  const [currentUser, setCurrentUser] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  // 📌 อ่านค่าที่ส่งมาจาก location.state (พร้อมตั้งค่าเริ่มต้น fallback ถ้าไม่มี state)
  const videoData = location.state || {};
  const {
    videoId = null,
    videoTitle = '',
    position = '',
    company = '',
    transcript = '',
    summary = ''
  } = videoData;

  // 🧪 State สำหรับทดสอบดึงข้อมูล Summary จริงจากฐานข้อมูล
  const [dbSummary, setDbSummary] = useState(null);
  const [dbLoading, setDbLoading] = useState(true);
  const [dbError, setDbError] = useState('');

  // 🔒 โหลดข้อมูลผู้ใช้จาก localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  // 🧪 ทดสอบดึงข้อมูล Summary จริงจากฐานข้อมูล ตาม videoId
  useEffect(() => {
    if (!videoId) {
      setDbLoading(false);
      setDbError('ไม่มี videoId ส่งมา ไม่สามารถดึงข้อมูลจาก DB ได้');
      return;
    }

    const fetchDbSummary = async () => {
      try {
        setDbLoading(true);
        const res = await fetch(`http://localhost:5000/api/videos/${videoId}/summary`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'ดึงข้อมูลไม่สำเร็จ');
        }

        setDbSummary(data);
        setDbError('');
      } catch (err) {
        console.error('Fetch DB summary error:', err);
        setDbError(err.message);
      } finally {
        setDbLoading(false);
      }
    };

    fetchDbSummary();
  }, [videoId]);

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

  // 📌 ส่ง state ต่อไปยังหน้าดูสรุปรายละเอียด
  const handleViewSummary = () => {
    navigate('/summary-detail?algo=LexRank', {
      state: {
        videoId,
        videoTitle,
        position,
        company,
        transcript,
        summary
      }
    });
  };

 const handleEditSummary = () => {
    navigate(`/edit-summary-detail/${videoId}`, {   // ✅ ไปหน้ารายละเอียดของวิดีโอนี้โดยตรง
      state: {
        videoId,
        videoTitle,
        position,
        company,
        transcript,
        summary
      }
    });
  };

  // 📌 ส่ง state ไปยังหน้า Publish (เผยแพร่)
  const handleShare = () => {
    navigate('/publish-summary', {   // ✅ path ถูกต้อง ไปหน้ารายละเอียดโดยตรง
      state: {
        videoId,
        videoTitle,
        position,
        company,
        transcript,
        summary
      }
    });
  };

  return (
    <div className="admin-purple-container">
      {/* Sidebar */}
      <aside className="sidebar-purple">
        <div>
          <div className="brand-logo-purple" onClick={() => navigate('/admin')} style={{ cursor: 'pointer' }}>
            <FaAsterisk style={{ color: '#c084fc' }} />
            <span>{t.appName || 'ICT Video Summary'}</span>
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
              <span>{t.dashboard || 'Dashboard'}</span>
            </button>

            <button className="menu-item-purple active" onClick={() => navigate('/upload-video')}>
              <FaVideo size={16} />
              <span>{t.uploadVideo || 'Upload Video'}</span>
            </button>

            <button className="menu-item-purple" onClick={() => navigate('/edit-summary')}>
              <FaEdit size={16} />
              <span>{t.editSummary || 'Edit Summary'}</span>
            </button>

            <button className="menu-item-purple" onClick={() => navigate('/publish')}>
              <FaGlobe size={16} />
              <span>{t.publish || 'Publish'}</span>
            </button>

            <button className="menu-item-purple" onClick={() => navigate('/users')}>
              <FaUsers size={16} />
              <span>{t.userManagement || 'User Management'}</span>
            </button>
          </nav>
        </div>

        <div className="sidebar-footer-purple">
          <button className="logout-btn-purple" onClick={handleLogout}>
            <FaSignOutAlt size={16} />
            <span>{t.logout || 'Logout'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content-purple">
        <header className="top-header-purple" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="header-title-box">
            <div className="header-icon-badge">
              <FaVideo size={18} />
            </div>
            <h2>{t.uploadVideo || 'Upload Video'}</h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="search-box-purple">
              <FaSearch className="search-icon-purple" />
              <input 
                type="text" 
                className="search-input-purple" 
                placeholder={t.searchPlaceholder || 'Search summary, position...'} 
              />
            </div>

            {/* 🌐 ปุ่มสลับภาษา */}
            <button 
              type="button" 
              onClick={toggleLanguage}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '20px',
                border: '1px solid rgba(192, 132, 252, 0.4)',
                background: 'rgba(139, 92, 246, 0.15)',
                color: '#c084fc',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
            >
              <FaGlobeAmericas size={12} />
              <span>{lang ? lang.toUpperCase() : 'EN'}</span>
            </button>
          </div>
        </header>

        <div className="summary-body-area">
          <div className="summary-card-purple">
            
            <div className="summary-card-header">
              <div className="header-status-title">
                <span className="green-status-dot"></span>
                <h3>{lang === 'en' ? 'Summarization Complete' : 'สรุปเสร็จสิ้น'}</h3>
              </div>
              <button className="btn-back-purple" onClick={() => navigate('/upload-video')}>
                <FaArrowLeft /> {lang === 'en' ? 'Back / Upload More' : 'ย้อนกลับ / อัปโหลดเพิ่ม'}
              </button>
            </div>

            <div className="result-box-purple">
              <button 
                className="btn-delete-purple" 
                title={lang === 'en' ? 'Delete this summary' : 'ลบสรุปนี้'}
                onClick={() => setShowDeleteModal(true)}
              >
                <FaTrashAlt />
              </button>

              <div className="result-content-wrapper">
                <div className="check-icon-circle-purple">
                  <FaCheck />
                </div>

                <div className="result-info-text">
                  <h4 className="success-title-text">
                    {lang === 'en' ? 'Content Summarization Completed!' : 'สรุปเนื้อหาเสร็จสิ้นแล้ว!'}
                  </h4>

                  {/* 📌 แสดงผลข้อมูลแบบ Dynamic จาก location.state */}
                  <p className="job-title-text">
                    {position 
                      ? (lang === 'en' ? `Internship Position: ${position}` : `Internship ตำแหน่ง ${position}`)
                      : (videoTitle || (lang === 'en' ? 'Video Summarized' : 'วิดีโอได้รับการสรุปแล้ว'))}
                  </p>
                  
                  {company && (
                    <p className="company-title-text">
                      {`| ${company}`}
                    </p>
                  )}
                </div>
              </div>

              <div className="result-actions-group">
                <button className="btn-action btn-edit" onClick={handleEditSummary}>
                  <FaEdit /> {lang === 'en' ? 'Edit' : 'แก้ไข'}
                </button>

                <button className="btn-action btn-share" onClick={handleShare}>
                  <FaShareAlt /> {lang === 'en' ? 'Share' : 'แชร์'}
                </button>
                
                <button className="btn-action btn-view" onClick={handleViewSummary}>
                  <FaEye /> {lang === 'en' ? 'View Summary (LexRank)' : 'ดูสรุป (LexRank)'}
                </button>

                <button className="btn-action btn-download">
                  <FaDownload /> {lang === 'en' ? 'Download' : 'ดาวน์โหลด'}
                </button>
              </div>
            </div>

            {/* 🧪 ส่วนทดสอบ: แสดงข้อมูลดิบจาก DB แบบยาวๆ */}
            <div style={{ marginTop: '24px', padding: '20px', background: 'rgba(139, 92, 246, 0.08)', borderRadius: '12px' }}>
              <h4 style={{ color: '#c084fc', marginBottom: '12px' }}>
                🧪 ทดสอบข้อมูลจาก Database (VideoID: {videoId || '-'})
              </h4>

              {dbLoading && (
                <p style={{ color: '#94a3b8' }}>กำลังดึงข้อมูลจากฐานข้อมูล...</p>
              )}

              {!dbLoading && dbError && (
                <p style={{ color: '#f87171' }}>❌ {dbError}</p>
              )}

              {!dbLoading && dbSummary && (
                <div>
                  <p style={{ color: '#e9d5ff', fontSize: '13px', marginBottom: '8px' }}>
                    ✅ ดึงข้อมูลสำเร็จ (SummaryID: {dbSummary.SummaryID})
                  </p>

                  <h5 style={{ color: '#c084fc', marginTop: '16px' }}>SummaryText (จาก LexRank):</h5>
                  <p style={{ whiteSpace: 'pre-wrap', color: '#e5e7eb', lineHeight: '1.6' }}>
                    {dbSummary.SummaryText || '(ไม่มีข้อมูล)'}
                  </p>

                  <h5 style={{ color: '#c084fc', marginTop: '16px' }}>Transcript (ข้อความถอดเสียงเต็ม):</h5>
                  <p style={{ 
                    whiteSpace: 'pre-wrap', 
                    color: '#9ca3af', 
                    fontSize: '13px', 
                    lineHeight: '1.6', 
                    maxHeight: '300px', 
                    overflowY: 'auto' 
                  }}>
                    {dbSummary.Transcript || '(ไม่มีข้อมูล)'}
                  </p>
                </div>
              )}
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
                <h3>{lang === 'en' ? 'Confirm Deletion?' : 'ยืนยันการลบข้อมูล?'}</h3>
                <p>
                  {lang === 'en' 
                    ? 'Are you sure you want to delete this summary? This action cannot be undone.' 
                    : 'คุณแน่ใจหรือไม่ว่าต้องการลบสรุปเนื้อหานี้ ข้อมูลจะไม่สามารถกู้คืนได้'}
                </p>
                <div className="modal-actions">
                  <button className="btn-modal-cancel" onClick={() => setShowDeleteModal(false)}>
                    {lang === 'en' ? 'Cancel' : 'ยกเลิก'}
                  </button>
                  <button className="btn-modal-confirm" onClick={confirmDelete}>
                    {lang === 'en' ? 'Confirm Delete' : 'ยืนยันลบ'}
                  </button>
                </div>
              </>
            ) : (
              <div className="delete-success-box">
                <div className="modal-icon success">
                  <FaCheck />
                </div>
                <h3>{lang === 'en' ? 'Deletion Completed!' : 'ลบเสร็จสิ้น!'}</h3>
                <p>{lang === 'en' ? 'Redirecting to upload page...' : 'กำลังพากลับไปยังหน้าอัปโหลด...'}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}