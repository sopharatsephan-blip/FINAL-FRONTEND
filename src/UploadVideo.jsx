import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  FaAsterisk 
} from 'react-icons/fa';

export default function UploadVideo() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Drag & Drop Handlers
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
            <span>ICT Video Summary</span>
          </div>

          <div className="user-profile-purple">
            <div className="avatar-purple">S</div>
            <div className="user-info-purple">
              <h4>Somchai Jaidee</h4>
              <span className="role-tag">Admin</span>
            </div>
          </div>

          <nav className="menu-list-purple">
            <button 
              className="menu-item-purple" 
              onClick={() => navigate('/admin')}
            >
              <FaHome size={16} />
              <span>แดชบอร์ด</span>
            </button>

            <button className="menu-item-purple active" onClick={() => navigate('/upload-video')}>
              <FaVideo size={16} />
              <span>อัปโหลดวิดีโอ</span>
            </button>

            {/* เพิ่ม onClick สำหรับนำทางไปยังหน้าแก้ไขข้อมูลสรุป */}
            <button className="menu-item-purple" onClick={() => navigate('/edit-summary')}>
              <FaEdit size={16} />
              <span>แก้ไขข้อมูลสรุป</span>
            </button>

            <button className="menu-item-purple" onClick={() => navigate('/publish')}>
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

      {/* Main Content Area */}
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

        {/* Upload Body Area */}
        <div className="upload-body-area">
          <div className="upload-card-purple">
            <div className="upload-card-header">
              <span className="red-status-dot"></span>
              <h3>อัปโหลดวิดีโอใหม่</h3>
            </div>

            {/* Drag & Drop Area */}
            <div 
              className={`drop-zone-purple ${isDragging ? 'dragging' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="upload-icon-circle-purple">
                <FaCloudUploadAlt />
              </div>
              <p className="drop-title-text">ลากและวางไฟล์วิดีโอที่นี่</p>
              <span className="drop-sub-text">รองรับ MP4, MOV - สูงสุด 2GB</span>

              {selectedFile && (
                <div className="file-name-badge">
                  📁 เลือกไฟล์แล้ว: <strong>{selectedFile.name}</strong>
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
                เลือกไฟล์
              </label>
            </div>

            {/* Submit Action */}
            <div className="action-area-purple">
              <button 
                type="button"
                className={`btn-submit-purple ${selectedFile ? 'active' : 'disabled'}`}
                disabled={!selectedFile}
                onClick={() => navigate('/summary-result')}
              >
                <span>เริ่มสรุป</span>
                <span className="lets-go-tag">LET'S GO!</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}