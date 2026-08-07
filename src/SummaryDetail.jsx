import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from './LanguageContext';
import './SummaryDetail.css';

import { 
  FaHome, 
  FaVideo, 
  FaEdit, 
  FaGlobe, 
  FaUsers, 
  FaSignOutAlt, 
  FaSearch, 
  FaAsterisk,
  FaArrowLeft,
  FaFileAlt,
  FaGlobeAmericas
} from 'react-icons/fa';

export default function SummaryDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, lang, toggleLanguage } = useLanguage();
  const [currentUser, setCurrentUser] = useState(null);

  // 📌 อ่าน videoId ที่ส่งมาจากหน้าก่อนหน้า (SummaryResult)
  const videoData = location.state || {};
  const { videoId = null } = videoData;

  // 📌 State สำหรับข้อมูลสรุปจริงจากฐานข้อมูล
  const [summaryText, setSummaryText] = useState('');
  const [transcriptText, setTranscriptText] = useState('');
  const [summaryId, setSummaryId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  // 📌 ดึงข้อมูลสรุป (Typhoon) จริงจากฐานข้อมูล ตาม videoId
  useEffect(() => {
    if (!videoId) {
      setLoading(false);
      setError(lang === 'en' ? 'No video selected.' : 'ไม่พบข้อมูลวิดีโอที่เลือก');
      return;
    }

    const fetchSummary = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/api/videos/${videoId}/summary`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Fetch failed');
        }

        setSummaryText(data.SummaryText || '');
        setTranscriptText(data.Transcript || '');
        setSummaryId(data.SummaryID || '');
        setError('');
      } catch (err) {
        console.error('Fetch summary error:', err);
        setError(lang === 'en' ? 'Failed to load summary.' : 'ไม่สามารถโหลดข้อมูลสรุปได้');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [videoId, lang]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="admin-purple-container">
      {/* ===== Sidebar ===== */}
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

      {/* ===== Main Content ===== */}
      <main className="main-content-purple">
        {/* Top Header */}
        <header className="top-header-purple" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="header-title-box" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="header-icon-badge" style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#c084fc', padding: '10px', borderRadius: '10px', display: 'flex' }}>
              <FaFileAlt size={18} />
            </div>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>
              {lang === 'en' ? 'Summary Details' : 'รายละเอียดการสรุป'}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="search-box-purple">
              <FaSearch className="search-icon-purple" style={{ color: '#9ca3af', fontSize: '14px' }} />
              <input 
                type="text" 
                className="search-input-purple" 
                placeholder={t.searchPlaceholder || 'Search summary, position...'} 
              />
            </div>

            {/* 🌐 ปุ่มสลับภาษาขนาดเล็กมุมขวาบน */}
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

        {/* Content Body Area */}
        <div className="detail-body-area" style={{ marginTop: '20px' }}>
          <div className="purple-card">
            
            {/* Header: ปุ่มย้อนกลับ */}
            <div className="result-header-purple" style={{ marginBottom: '20px' }}>
              <button 
                className="reset-btn-purple" 
                onClick={() => navigate('/summary-result')} 
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <FaArrowLeft /> {lang === 'en' ? 'Back' : 'ย้อนกลับ'}
              </button>
            </div>

            {/* เนื้อหาสรุป: ดึงจาก Typhoon จริงจากฐานข้อมูล */}
            <div className="summary-text-box">
              <h3 className="card-title-purple" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontSize: '18px' }}>
                <FaFileAlt style={{ color: '#c084fc' }} />
                {lang === 'en' ? 'Topic Summary' : 'สรุปเนื้อหา'}
              </h3>

              {loading && (
                <p style={{ color: '#94a3b8' }}>
                  {lang === 'en' ? 'Loading summary...' : 'กำลังโหลดข้อมูลสรุป...'}
                </p>
              )}

              {!loading && error && (
                <p style={{ color: '#f87171' }}>{error}</p>
              )}

              {!loading && !error && (
                <>
                  {summaryId && (
                    <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '20px' }}>
                      SummaryID: {summaryId}
                    </p>
                  )}

                  <h4 style={{ color: '#c084fc', marginBottom: '10px', fontSize: '15px' }}>
                    {lang === 'en' ? 'SummaryText (from Typhoon):' : 'ข้อความสรุป (จาก Typhoon):'}
                  </h4>
                  <p style={{ color: '#e2e8f0', margin: '0 0 28px 0', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
                    {summaryText || (lang === 'en' ? 'No summary available.' : 'ยังไม่มีข้อความสรุป')}
                  </p>

                  <h4 style={{ color: '#c084fc', marginBottom: '10px', fontSize: '15px' }}>
                    {lang === 'en' ? 'Transcript (Full Text):' : 'ข้อความถอดเสียงเต็ม:'}
                  </h4>
                  <p style={{ color: '#e2e8f0', margin: 0, lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
                    {transcriptText || (lang === 'en' ? 'No transcript available.' : 'ยังไม่มีข้อความถอดเสียง')}
                  </p>
                </>
              )}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}