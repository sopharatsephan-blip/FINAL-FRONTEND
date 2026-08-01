import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from './LanguageContext';
import './admindashboard.css';

import { 
  FaHome, FaVideo, FaEdit, FaGlobe, FaUsers,
  FaSignOutAlt, FaSearch, FaPlay, FaAsterisk,
  FaArrowRight, FaLanguage, FaTrash
} from 'react-icons/fa';

const API_BASE = 'http://localhost:5000/api';

export default function EditList() {
  const navigate = useNavigate();
  const { t, lang, toggleLanguage } = useLanguage();
  const [currentUser, setCurrentUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState(null); // เก็บ VideoID ที่กำลังลบอยู่ (กันกดซ้ำ)
  const [videoToDelete, setVideoToDelete] = useState(null); // วิดีโอที่รอยืนยันลบ (เปิด modal เมื่อไม่ใช่ null)

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try { setCurrentUser(JSON.parse(savedUser)); } catch (e) {}
    }
  }, []);

  // ✅ ดึงวิดีโอทั้งหมดจาก API
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/videos`);
        const data = await res.json();
        setVideos(data);
      } catch (err) {
        console.error('Fetch videos error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  // 🗑️ คลิกถังขยะ -> เปิด modal ยืนยันก่อน (ยังไม่ลบจริง)
  const handleDeleteClick = (e, video) => {
    e.stopPropagation(); // กันไม่ให้ trigger การคลิกที่การ์ด (ซึ่งจะ navigate ไปหน้า edit)
    setVideoToDelete(video);
  };

  // ✅ กดยืนยันใน modal -> ลบจริง
  const confirmDelete = async () => {
    if (!videoToDelete) return;
    const video = videoToDelete;

    setDeletingId(video.VideoID);
    try {
      const res = await fetch(`${API_BASE}/videos/${video.VideoID}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('ลบไม่สำเร็จ');
      }

      // ลบออกจาก state ทันที ไม่ต้อง reload ทั้งหน้า
      setVideos((prev) => prev.filter((v) => v.VideoID !== video.VideoID));
    } catch (err) {
      console.error('Delete video error:', err);
      alert(lang === 'en' ? 'Failed to delete video' : 'ลบวิดีโอไม่สำเร็จ');
    } finally {
      setDeletingId(null);
      setVideoToDelete(null); // ปิด modal
    }
  };

  // ❌ กดยกเลิกใน modal
  const cancelDelete = () => {
    setVideoToDelete(null);
  };

  // กรองตาม search
  const filtered = videos.filter((v) =>
    v.VideoTitle?.toLowerCase().includes(search.toLowerCase()) ||
    v.Position?.toLowerCase().includes(search.toLowerCase()) ||
    v.CompanyName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-purple-container">
      <aside className="sidebar-purple">
        <div>
          <div className="brand-logo-purple" onClick={() => navigate('/admin')} style={{ cursor: 'pointer' }}>
            <FaAsterisk style={{ color: '#c084fc', marginRight: '8px' }} size={18} />
            <span>{t.appName || 'ICT Video Summary'}</span>
          </div>

          <div className="user-profile-purple">
            <div className="avatar-purple">
              {currentUser?.firstName?.charAt(0) || 'S'}
            </div>
            <div className="user-info-purple">
              <h4>{currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Somchai Jaidee'}</h4>
              <span className="role-tag">Admin</span>
            </div>
          </div>

          <nav className="menu-list-purple">
            <button className="menu-item-purple" onClick={() => navigate('/admin')}><FaHome size={16} /><span>{t.dashboard || 'Dashboard'}</span></button>
            <button className="menu-item-purple" onClick={() => navigate('/upload-video')}><FaVideo size={16} /><span>{t.uploadVideo || 'Upload Video'}</span></button>
            <button className="menu-item-purple active" onClick={() => navigate('/edit-summary')}><FaEdit size={16} /><span>{t.editSummary || 'Edit Summary'}</span></button>
            <button className="menu-item-purple" onClick={() => navigate('/publish')}><FaGlobe size={16} /><span>{t.publish || 'Publish'}</span></button>
            <button className="menu-item-purple" onClick={() => navigate('/users')}><FaUsers size={16} /><span>{t.userManagement || 'User Management'}</span></button>
          </nav>
        </div>

        <div className="sidebar-footer-purple">
          <button type="button" className="menu-item-purple" onClick={toggleLanguage}
            style={{ marginBottom: '10px', background: 'rgba(139, 92, 246, 0.2)', color: '#c084fc' }}>
            <FaLanguage size={18} />
            <span>{lang ? lang.toUpperCase() : 'EN'}</span>
          </button>
          <button className="logout-btn-purple" onClick={handleLogout}>
            <FaSignOutAlt size={16} /><span>{t.logout || 'Logout'}</span>
          </button>
        </div>
      </aside>

      <main className="main-content-purple">
        <header className="top-header-purple">
          <div className="header-title">
            <div style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#c084fc', padding: '8px', borderRadius: '8px', display: 'flex' }}>
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
              placeholder={lang === 'en' ? 'Search summary, position...' : 'ค้นหาสรุป, ตำแหน่งงาน...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </header>

        {/* รายการวิดีโอจาก DB */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
          {loading && (
            <div className="purple-card" style={{ color: '#94a3b8', padding: '24px' }}>
              {lang === 'en' ? 'Loading...' : 'กำลังโหลด...'}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="purple-card" style={{ color: '#94a3b8', padding: '24px' }}>
              {lang === 'en' ? 'No video found.' : 'ไม่พบวิดีโอในระบบ'}
            </div>
          )}

          {!loading && filtered.map((video) => (
            <div
              key={video.VideoID}
              className="purple-card"
              style={{ padding: '0', cursor: 'pointer', position: 'relative' }}
              onClick={() => navigate(`/edit-summary-detail/${video.VideoID}`)}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(139, 92, 246, 0.08)'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#150c26'}
            >
              <div style={{ padding: '24px 28px' }}>
                {/* Header การ์ด */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '9px', height: '9px', background: '#22c55e', borderRadius: '50%', boxShadow: '0 0 8px #22c55e' }}></span>
                    <span style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: '600' }}>
                      {lang === 'en' ? 'Summary Completed' : 'สรุปเสร็จสิ้น'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#c4b5fd', fontSize: '0.82rem', fontWeight: '500', background: 'rgba(139, 92, 246, 0.2)', padding: '4px 12px', borderRadius: '20px', border: '1px solid rgba(139, 92, 246, 0.4)' }}>
                      <span>{lang === 'en' ? 'Click to edit summary' : 'คลิกเพื่อแก้ไขสรุป'}</span>
                      <FaArrowRight size={10} style={{ color: '#c084fc' }} />
                    </div>

                    {/* ปุ่มถังขยะ - ลบวิดีโอ */}
                    <button
                      onClick={(e) => handleDeleteClick(e, video)}
                      disabled={deletingId === video.VideoID}
                      title={lang === 'en' ? 'Delete video' : 'ลบวิดีโอ'}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '32px',
                        height: '32px',
                        background: 'rgba(239, 68, 68, 0.15)',
                        border: '1px solid rgba(239, 68, 68, 0.4)',
                        borderRadius: '8px',
                        color: '#f87171',
                        cursor: deletingId === video.VideoID ? 'not-allowed' : 'pointer',
                        opacity: deletingId === video.VideoID ? 0.5 : 1,
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={(e) => {
                        if (deletingId !== video.VideoID) {
                          e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
                      }}
                    >
                      <FaTrash size={13} />
                    </button>
                  </div>
                </div>

                {/* Body การ์ด */}
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <div style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', flexShrink: 0, boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)' }}>
                    <FaPlay size={18} />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <h3 style={{ color: '#ffffff', margin: 0, fontSize: '1.1rem', fontWeight: '600', lineHeight: '1.4' }}>
                      {video.VideoTitle}
                    </h3>
                    <p style={{ color: '#cbd5e1', fontSize: '0.88rem', margin: 0 }}>
                      {new Date(video.UploadDate).toLocaleDateString(lang === 'th' ? 'th-TH' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      {video.CompanyName ? ` · ${video.CompanyName}` : ''}
                      {` · 👁 ${video.ViewCount} views`}
                    </p>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                      {video.CategoryName && (
                        <span className="purple-badge">{video.CategoryName}</span>
                      )}
                      <span style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#86efac', border: '1px solid rgba(34, 197, 94, 0.4)', padding: '4px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: '600' }}>
                        {lang === 'en' ? 'Completed' : 'สรุปเสร็จแล้ว'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* ===== Modal ยืนยันการลบ ===== */}
      {videoToDelete && (
        <div
          onClick={cancelDelete}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()} // กันไม่ให้คลิกในกล่องแล้วปิด modal
            style={{
              background: '#150c26',
              border: '1px solid rgba(139, 92, 246, 0.25)',
              borderRadius: '14px',
              padding: '28px',
              width: '90%',
              maxWidth: '380px',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                color: '#f87171',
              }}
            >
              <FaTrash size={20} />
            </div>

            <h3 style={{ color: '#f1f5f9', margin: '0 0 8px 0', fontSize: '16px', fontWeight: 600 }}>
              {lang === 'en' ? 'Delete this video?' : 'ยืนยันการลบวิดีโอนี้?'}
            </h3>
            <p style={{ color: '#94a3b8', margin: '0 0 22px 0', fontSize: '13px', lineHeight: 1.6 }}>
              {lang === 'en'
                ? <>Are you sure you want to delete <strong style={{ color: '#e2e8f0' }}>"{videoToDelete.VideoTitle}"</strong>? This action cannot be undone and all related data will be removed.</>
                : <>ต้องการลบ <strong style={{ color: '#e2e8f0' }}>"{videoToDelete.VideoTitle}"</strong> ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้ และข้อมูลที่เกี่ยวข้องทั้งหมดจะถูกลบไปด้วย</>
              }
            </p>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={cancelDelete}
                disabled={deletingId === videoToDelete.VideoID}
                style={{
                  flex: 1,
                  background: 'transparent',
                  color: '#cbd5e1',
                  border: '1px solid rgba(139, 92, 246, 0.35)',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {lang === 'en' ? 'Cancel' : 'ยกเลิก'}
              </button>
              <button
                onClick={confirmDelete}
                disabled={deletingId === videoToDelete.VideoID}
                style={{
                  flex: 1,
                  background: deletingId === videoToDelete.VideoID
                    ? 'rgba(239, 68, 68, 0.5)'
                    : 'linear-gradient(135deg, #ef4444, #b91c1c)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: deletingId === videoToDelete.VideoID ? 'not-allowed' : 'pointer',
                }}
              >
                {deletingId === videoToDelete.VideoID
                  ? (lang === 'en' ? 'Deleting...' : 'กำลังลบ...')
                  : (lang === 'en' ? 'Delete' : 'ลบเลย')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}