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
  FaCloudUploadAlt, 
  FaAsterisk,
  FaArrowLeft
} from 'react-icons/fa';

export default function UploadVideo() {
  const navigate = useNavigate();
  const { t, lang, toggleLanguage } = useLanguage();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
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

  // 🎬 ฟังก์ชันอัปโหลดวิดีโอเข้าระบบจริง + เรียกสรุปด้วย Whisper + Typhoon
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

      // 1️⃣ อัปโหลดไฟล์วิดีโอ + บันทึกข้อมูลลง DB
      const uploadRes = await fetch('http://localhost:5000/api/videos/upload', {
        method: 'POST',
        body: formData
      });

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        throw new Error(uploadData.message || 'Upload failed');
      }

      setIsUploading(false);
      setIsSummarizing(true);

      // 2️⃣ เรียกสรุปวิดีโอจริง (Whisper ถอดเสียง + Typhoon สรุป)
      const summarizeRes = await fetch(
        `http://localhost:5000/api/videos/${uploadData.videoId}/summarize`,
        { method: 'POST' }
      );

      const summarizeData = await summarizeRes.json();

      if (!summarizeRes.ok) {
        throw new Error(summarizeData.message || 'Summarize failed');
      }

      // 3️⃣ ไปหน้าแสดงผลพร้อมข้อมูลจริงทั้งหมด
      navigate('/summary-result', {
        state: {
          videoId: uploadData.videoId,
          videoPath: uploadData.videoPath,
          transcript: summarizeData.transcript,
          summary: summarizeData.summary
        }
      });
    } catch (err) {
      console.error('Upload/Summarize error:', err);
      setUploadError(`${lang === 'en' ? 'Error:' : 'เกิดข้อผิดพลาด:'} ${err.message}`);
    } finally {
      setIsUploading(false);
      setIsSummarizing(false);
    }
  };

  const isBusy = isUploading || isSummarizing;

  const getButtonLabel = () => {
    if (isUploading) return lang === 'en' ? 'Uploading...' : 'กำลังอัปโหลด...';
    if (isSummarizing) return lang === 'en' ? 'Summarizing...' : 'กำลังสรุปเนื้อหา...';
    return lang === 'en' ? 'Start Summarizing' : 'เริ่มสรุป';
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

          {/* ✅ ปุ่มสลับภาษา ย้ายมาไว้ฝั่งขวาบน (ไอคอนโลก) - เหมือนหน้าอื่นๆ */}
          <button type="button" className="lang-toggle-purple" onClick={toggleLanguage}>
            <FaGlobe size={14} />
            <span>{lang ? lang.toUpperCase() : 'EN'}</span>
          </button>
        </header>

        {/* ✅ ปุ่มย้อนกลับ - อยู่ใต้ header ฝั่งซ้าย */}
        <div className="back-btn-row" style={{ padding: '0 32px' }}>
          <button type="button" className="back-btn-purple" onClick={() => navigate(-1)} title={lang === 'en' ? 'Back' : 'ย้อนกลับ'}>
            <FaArrowLeft size={14} />
          </button>
        </div>

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

            {isSummarizing && (
              <p style={{ color: '#c084fc', marginTop: '12px', fontSize: '14px' }}>
                {lang === 'en'
                  ? '⏳ Transcribing and summarizing video, this may take a while...'
                  : '⏳ กำลังถอดเสียงและสรุปวิดีโอ อาจใช้เวลาสักครู่...'}
              </p>
            )}

            <div className="action-area-purple">
              <button 
                type="button"
                className={`btn-submit-purple ${selectedFile ? 'active' : 'disabled'}`}
                disabled={!selectedFile || isBusy}
                onClick={handleUpload}
              >
                <span>{getButtonLabel()}</span>
                <span className="lets-go-tag">LET'S GO!</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}