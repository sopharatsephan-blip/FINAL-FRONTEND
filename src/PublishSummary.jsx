import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLanguage } from './LanguageContext';
import './PublishSummary.css';

import { 
  FaHome, 
  FaVideo, 
  FaEdit, 
  FaGlobe, 
  FaUsers, 
  FaSignOutAlt, 
  FaPlay,
  FaUserAlt,
  FaLock,
  FaChevronRight,
  FaAsterisk,
  FaCheck,
  FaArrowLeft
} from 'react-icons/fa';

const API_BASE = 'http://localhost:5000/api';
const SERVER_ORIGIN = API_BASE.replace(/\/api\/?$/, ''); // ตัด /api ออกให้เหลือ origin ของ backend เช่น http://localhost:5000

// ✅ สร้าง URL ของไฟล์วิดีโอจริงจากข้อมูลที่ backend ส่งมา รองรับหลายชื่อฟิลด์เผื่อ backend ใช้ชื่อไม่ตรงกัน
function resolveVideoSrc(video) {
  if (!video) return '';
  const path =
    video.VideoPath || video.videoPath ||
    video.FilePath || video.filePath ||
    video.VideoURL || video.videoUrl || video.VideoUrl || '';
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path; // เป็น URL เต็มอยู่แล้ว
  return `${SERVER_ORIGIN}${path.startsWith('/') ? '' : '/'}${path}`;
}

export default function PublishSummary() {
  const navigate = useNavigate();
  const { videoId } = useParams(); // route: /publish-summary/:videoId
  const { t, lang, toggleLanguage } = useLanguage();
  const [currentUser, setCurrentUser] = useState(null);
  const [publishTarget, setPublishTarget] = useState('everyone');

  // State สำหรับควบคุม Success Modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // State สำหรับข้อมูลวิดีโอ/สรุปจริงจากฐานข้อมูล
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState('');

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

  // ✅ ดึงรายละเอียดวิดีโอ + สรุปจริงจากฐานข้อมูลตาม videoId
  useEffect(() => {
    if (!videoId) {
      setError(lang === 'en' ? 'No video selected.' : 'ไม่พบรหัสวิดีโอใน URL');
      setLoading(false);
      return;
    }

    const fetchVideo = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/videos/${videoId}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'ดึงข้อมูลไม่สำเร็จ');
        }

        setVideo(data);
        // ตั้งค่าเริ่มต้นของ target ตามสถานะปัจจุบันในฐานข้อมูล
        setPublishTarget(data.VisibilityType === 'Private' ? 'private' : 'everyone');
        setError('');
      } catch (err) {
        console.error('Fetch video detail error:', err);
        setError(lang === 'en' ? 'Failed to load video details' : 'ไม่สามารถโหลดข้อมูลวิดีโอได้');
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [videoId, lang]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  // ✅ เผยแพร่จริง - อัปเดต VisibilityType ในฐานข้อมูล
  const handlePublish = async () => {
    setPublishError('');
    setPublishing(true);
    try {
      const visibilityType = publishTarget === 'private' ? 'Private' : 'Public';
      const res = await fetch(`${API_BASE}/videos/${videoId}/publish`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visibilityType }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || (lang === 'en' ? 'Failed to publish' : 'เผยแพร่ไม่สำเร็จ'));
      }

      setShowSuccessModal(true);
    } catch (err) {
      console.error('Publish error:', err);
      setPublishError(err.message || (lang === 'en' ? 'Failed to publish' : 'เผยแพร่ไม่สำเร็จ'));
    } finally {
      setPublishing(false);
    }
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

          {/* ✅ ปุ่มสลับภาษา ย้ายมาไว้ฝั่งขวาบน (ไอคอนโลก) */}
          <button type="button" className="lang-toggle-purple" onClick={toggleLanguage}>
            <FaGlobe size={14} />
            <span>{lang ? lang.toUpperCase() : 'EN'}</span>
          </button>
        </header>

        {/* ✅ ปุ่มย้อนกลับ - อยู่ใต้ header ฝั่งซ้าย */}
        <div className="back-btn-row">
          <button type="button" className="back-btn-purple" onClick={() => navigate(-1)} title={lang === 'en' ? 'Back' : 'ย้อนกลับ'}>
            <FaArrowLeft size={14} />
          </button>
        </div>

        {loading && (
          <div className="purple-card" style={{ color: '#94a3b8', padding: '24px', marginTop: '20px' }}>
            {lang === 'en' ? 'Loading...' : 'กำลังโหลด...'}
          </div>
        )}

        {!loading && error && (
          <div className="purple-card" style={{ color: '#f87171', padding: '24px', marginTop: '20px' }}>
            {error}
          </div>
        )}

        {!loading && !error && video && (
          <div className="publish-body-area">
            <div className="publish-top-grid">
              {/* การ์ดสรุปวิดีโอ - ข้อมูลจริงจาก DB */}
              <div className="purple-card">
                <div className="card-header-purple">
                  <span className="green-status-dot"></span>
                  <h3 style={{ margin: 0, color: '#ffffff', fontSize: '1.05rem', fontWeight: '600' }}>
                    {lang === 'en' ? 'Summary Completed' : 'สรุปเสร็จสิ้น'}
                  </h3>
                </div>
                
                <div className="summary-video-info">
                  {resolveVideoSrc(video) ? (
                    <video
                      className="video-thumbnail-player-purple"
                      src={resolveVideoSrc(video)}
                      controls
                      preload="metadata"
                    />
                  ) : (
                    <div className="video-thumbnail-box-purple">
                      <FaPlay size={18} />
                    </div>
                  )}
                  <div className="video-details">
                    <h4 style={{ color: '#ffffff', margin: '0 0 6px 0', fontSize: '1rem', fontWeight: '600' }}>
                      {video.Position 
                        ? `Internship ตำแหน่ง ${video.Position}${video.CompanyName ? ` | ${video.CompanyName}` : ''}`
                        : video.VideoTitle}
                    </h4>
                    <p style={{ color: '#cbd5e1', fontSize: '0.85rem', margin: '0 0 10px 0' }}>
                      {video.UploadDate
                        ? new Date(video.UploadDate).toLocaleDateString(lang === 'th' ? 'th-TH' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                        : ''}
                      {` · 👁 ${video.ViewCount ?? 0} views`}
                    </p>
                    <div style={{ display: 'flex', gap: '8px' }}>
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
                    <small className="target-count">{lang === 'en' ? 'Public' : 'สาธารณะ'}</small>
                  </div>

                  <div 
                    className={`target-box-dark ${publishTarget === 'private' ? 'active' : ''}`}
                    onClick={() => setPublishTarget('private')}
                  >
                    <div className="icon-wrapper">
                      <FaLock size={18} />
                    </div>
                    <span className="target-title">{lang === 'en' ? 'Private' : 'ส่วนตัว'}</span>
                    <small className="target-count">{lang === 'en' ? 'Hidden' : 'ไม่เผยแพร่'}</small>
                  </div>
                </div>
              </div>
            </div>

            {/* การ์ดบทสรุปที่จะเผยแพร่ (กล่องใหญ่ด้านล่าง) - เนื้อหาสรุปจริงจาก LexRank */}
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
                    {video.Position 
                      ? `ตำแหน่ง ${video.Position}${video.CompanyName ? ` | ${video.CompanyName}` : ''}`
                      : video.VideoTitle}
                  </h4>
                </div>

                <div className="summary-section-dark">
                  <h5 style={{ margin: '0 0 8px 0', color: '#c084fc', fontSize: '0.95rem', fontWeight: '600' }}>
                    {lang === 'en' ? 'Summary Results:' : 'ผลสรุป:'}
                  </h5>
                  <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                    {video.SummaryText || (lang === 'en' ? 'No summary available.' : 'ยังไม่มีข้อความสรุป')}
                  </p>
                </div>

                {/* ✅ ซับไตเติ้ล / บทถอดเสียงเต็ม แสดงคู่กับผลสรุป */}
                <div className="summary-section-dark subtitle-section-dark">
                  <h5 style={{ margin: '0 0 8px 0', color: '#c084fc', fontSize: '0.95rem', fontWeight: '600' }}>
                    {lang === 'en' ? 'Subtitle / Transcript:' : 'ซับไตเติ้ล / บทถอดเสียง:'}
                  </h5>
                  <div className="subtitle-scroll-box">
                    <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
                      {video.Transcript || video.TranscriptText || video.SubtitleText || video.Subtitle ||
                        (lang === 'en' ? 'No subtitle/transcript available.' : 'ยังไม่มีข้อมูลซับไตเติ้ล')}
                    </p>
                  </div>
                </div>
              </div>

              {publishError && (
                <p style={{ color: '#f87171', fontSize: '0.85rem', margin: '12px 0 0 0' }}>
                  {publishError}
                </p>
              )}

              <div className="publish-action-bar">
                <button className="btn-publish-submit-dark" onClick={handlePublish} disabled={publishing}>
                  <span className="btn-text">
                    {publishing
                      ? (lang === 'en' ? 'Publishing...' : 'กำลังเผยแพร่...')
                      : (lang === 'en' ? 'Ready to Publish' : 'พร้อมเผยแพร่แล้ว')}
                  </span>
                  <span className="go-pill-purple">GO <FaChevronRight size={10} /></span>
                </button>
              </div>
            </div>
          </div>
        )}
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