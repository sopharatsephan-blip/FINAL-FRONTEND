import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from './LanguageContext';
import './UploadVideo.css';

import { 
  FaHome, 
  FaVideo, 
  FaEdit, 
  FaGlobe, 
  FaUsers, 
  FaSignOutAlt, 
  FaSearch, 
  FaCloudUploadAlt, 
  FaAsterisk,
  FaGlobeAmericas
} from 'react-icons/fa';

export default function UploadVideo() {
  const navigate = useNavigate();
  const { t, lang, toggleLanguage } = useLanguage();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // 🎬 ฟังก์ชันอัปโหลดวิดีโอเข้าระบบจริง
  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError(
        lang === 'en' ? 'Please select a video file.' : 'กรุณาเลือกไฟล์วิดีโอ'
      );
      return;
    }

    setIsUploading(true);
    setUploadError('');

    try {
      const savedUser = localStorage.getItem('user');
      const currentUser = savedUser ? JSON.parse(savedUser) : null;

      const formData = new FormData();
      formData.append('videoFile', selectedFile);
      formData.append('uid', currentUser?.uid || '');

      const res = await fetch('http://localhost:5000/api/videos/upload', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      navigate('/summary-result', { state: { videoId: data.videoId } });
    } catch (err) {
      console.error('Upload error:', err);
      setUploadError(`Upload failed: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="admin-purple-container">
      {/* Sidebar */}
      <aside className="sidebar-purple">
        <div>
          <div 
            className="brand-logo-purple" 
            onClick={() => navigate('/admin')} 
            style={{ cursor: 'pointer' }}
          >
            <FaAsterisk style={{ color: '#c084fc' }} />
            <span>{t.appName || 'ICT Video Summary'}</span>
          </div>

          <div className="user-profile-purple">
            <div className="avatar-purple">S</div>
            <div className="user-info-purple">
              <h4>Somchai Jaidee</h4>
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

      {/* Main Content Area */}
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

            {/* 🌐 ปุ่มสลับภาษาขนาดเล็กขวาบน */}
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

        {/* Upload Body Area */}
        <div className="upload-body-area">
          <div className="upload-card-purple">
            <div className="upload-card-header">
              <span className="red-status-dot"></span>
              <h3>{lang === 'en' ? 'Upload New Video' : 'อัปโหลดวิดีโอใหม่'}</h3>
            </div>

            <div 
              className={`drop-zone-purple ${isDragging ? 'dragging' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="upload-icon-circle-purple">
                <FaCloudUploadAlt />
              </div>
              <p className="drop-title-text">
                {lang === 'en' ? 'Drag and drop video files here' : 'ลากและวางไฟล์วิดีโอที่นี่'}
              </p>
              <span className="drop-sub-text">
                {lang === 'en' ? 'Supports MP4, MOV - Max size 2GB' : 'รองรับ MP4, MOV - สูงสุด 2GB'}
              </span>

              {selectedFile && (
                <div className="file-name-badge">
                  📁 {lang === 'en' ? 'Selected file:' : 'เลือกไฟล์แล้ว:'} <strong>{selectedFile.name}</strong>
                </div>
              )}

              <input 
                type="file" 
                id="video-file-input" 
                accept="video/mp4,video/quicktime" 
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              
              <label htmlFor="video-file-input" className="btn-select-file-purple">
                {lang === 'en' ? 'Select File' : 'เลือกไฟล์'}
              </label>
            </div>

            {uploadError && (
              <p style={{ color: '#f87171', marginTop: '12px', fontSize: '14px' }}>{uploadError}</p>
            )}

            <div className="action-area-purple">
              <button 
                type="button"
                className={`btn-submit-purple ${selectedFile ? 'active' : 'disabled'}`}
                disabled={!selectedFile || isUploading}
                onClick={handleUpload}
              >
                <span>
                  {isUploading
                    ? (lang === 'en' ? 'Uploading...' : 'กำลังอัปโหลด...')
                    : (lang === 'en' ? 'Start Summarizing' : 'เริ่มสรุป')}
                </span>
                <span className="lets-go-tag">LET'S GO!</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}