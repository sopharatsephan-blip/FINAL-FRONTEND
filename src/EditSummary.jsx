import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from './LanguageContext';
import './EditSummary.css';

import { 
  FaHome, 
  FaVideo, 
  FaEdit, 
  FaGlobe, 
  FaUsers, 
  FaSignOutAlt, 
  FaSearch, 
  FaAsterisk,
  FaSave,
  FaLanguage
} from 'react-icons/fa';

export default function EditSummary() {
  const navigate = useNavigate();
  const { t, lang, toggleLanguage } = useLanguage();
  const [currentUser, setCurrentUser] = useState(null);

  const [formData, setFormData] = useState({
    jobTitle: 'UX/UI Design',
    company: 'บริษัท อินเวิร์ส โซลูชันส์ จำกัด',
    category: 'UX/UI',
    province: 'ภูเก็ต',
    summaryContent: 'สวัสดีค่ะ ดิฉันได้เข้าฝึกงานในบริษัทพัฒนาเว็บไซต์และ Mobile Application ที่จังหวัดภูเก็ต โดยได้รับหน้าที่ออกแบบ UI/UX ตั้งแต่การวิเคราะห์ความต้องการผู้ใช้ ออกแบบ Wireframe ไปจนถึงการทดสอบและปรับปรุงดีไซน์ นอกจากนี้ยังได้ทำโปรเจกต์ออกแบบระบบหลังบ้านหลายระบบ เช่น ระบบ Booking และระบบจัดการคิว ซึ่งช่วยให้ได้รับประสบการณ์ทำงานจริงและพัฒนาทักษะการสื่อสารและการทำงานเป็นทีม... ดูเพิ่มเติม'
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    alert(lang === 'en' ? 'Data saved successfully!' : 'บันทึกข้อมูลเรียบร้อยแล้ว!');
  };

  return (
    <div className="admin-purple-container">
      {/* ===== Sidebar ===== */}
      <aside className="sidebar-purple">
        <div>
          <div
            className="brand-logo-purple"
            onClick={() => navigate('/admin')}
            style={{ cursor: 'pointer' }}
          >
            <FaAsterisk className="logo-icon" style={{ color: '#c084fc', marginRight: '8px' }} />
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
              <FaHome />
              <span>{t.dashboard || 'Dashboard'}</span>
            </button>

            <button className="menu-item-purple" onClick={() => navigate('/upload-video')}>
              <FaVideo />
              <span>{t.uploadVideo || 'Upload Video'}</span>
            </button>

            <button className="menu-item-purple active" onClick={() => navigate('/edit-summary')}>
              <FaEdit />
              <span>{t.editSummary || 'Edit Summary'}</span>
            </button>

            <button className="menu-item-purple" onClick={() => navigate('/publish')}>
              <FaGlobe size={16} />
              <span>{t.publish || 'Publish'}</span>
            </button>

            <button className="menu-item-purple" onClick={() => navigate('/users')}>
              <FaUsers />
              <span>{t.userManagement || 'User Management'}</span>
            </button>
          </nav>
        </div>

        <div className="sidebar-footer-purple">
          {/* ปุ่มสลับภาษา */}
          <button
            type="button"
            className="menu-item-purple"
            onClick={toggleLanguage}
            style={{ marginBottom: '10px', background: 'rgba(139, 92, 246, 0.2)', color: '#c084fc' }}
          >
            <FaLanguage size={18} />
            <span>{lang ? lang.toUpperCase() : 'EN'}</span>
          </button>

          <button className="logout-btn-purple" onClick={handleLogout}>
            <FaSignOutAlt />
            <span>{t.logout || 'Logout'}</span>
          </button>
        </div>
      </aside>

      {/* ===== Main Content ===== */}
      <main className="main-content-purple">
        {/* Top Header — ยึดโครงสร้างเดียวกับ AdminDashboard */}
        <header className="top-header-purple">
          <div className="header-title">
            <div
              className="header-icon-box"
              style={{
                background: 'rgba(139, 92, 246, 0.2)',
                color: '#c084fc',
                padding: '8px',
                borderRadius: '8px',
                display: 'flex'
              }}
            >
              <FaEdit size={18} />
            </div>
            <div>
              <h2 style={{ margin: 0 }}>
                {t.editSummary || 'Edit Summary'}
              </h2>
              <p className="subtitle-purple" style={{ margin: 0 }}>
                {lang === 'en' ? 'Edit and update video summary data' : 'แก้ไขและอัปเดตข้อมูลสรุปวิดีโอ'}
              </p>
            </div>
          </div>

          <div className="search-box-purple">
            <FaSearch style={{ color: '#9ca3af', fontSize: '14px' }} />
            <input
              type="text"
              placeholder={t.searchPlaceholder || 'Search summary, position...'}
            />
          </div>
        </header>

        {/* Form Card */}
        <div className="detail-body-area" style={{ marginTop: '20px' }}>
          <div className="edit-card-purple">

            {/* Card Header */}
            <div className="edit-card-header">
              <span className="orange-dot">●</span>
              <h3>{lang === 'en' ? 'Edit Summary Data' : 'แก้ไขข้อมูลของสรุป'}</h3>
            </div>

            <form className="edit-form-purple" onSubmit={handleSave}>

              {/* ชื่อตำแหน่งงาน */}
              <div className="form-group-purple">
                <label>
                  {lang === 'en' ? 'Job Title' : 'ชื่อตำแหน่งงาน'} <span className="req-star">*</span>
                </label>
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  className="input-purple"
                />
              </div>

              {/* บริษัท/องค์กร */}
              <div className="form-group-purple">
                <label>
                  {lang === 'en' ? 'Company / Organization' : 'บริษัท/องค์กร'} <span className="req-star">*</span>
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="input-purple"
                />
              </div>

              {/* หมวดหมู่ & จังหวัด (2 คอลัมน์) */}
              <div className="form-row-purple">
                <div className="form-group-purple">
                  <label>
                    {lang === 'en' ? 'Category' : 'หมวดหมู่'} <span className="req-star">*</span>
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="input-purple"
                  />
                </div>

                <div className="form-group-purple">
                  <label>
                    {lang === 'en' ? 'Province' : 'จังหวัด'} <span className="req-star">*</span>
                  </label>
                  <input
                    type="text"
                    name="province"
                    value={formData.province}
                    onChange={handleChange}
                    className="input-purple"
                  />
                </div>
              </div>

              {/* เนื้อหาที่สรุป */}
              <div className="form-group-purple">
                <label>
                  {lang === 'en' ? 'Summary Content' : 'เนื้อหาที่สรุป'} <span className="req-star">*</span>
                </label>
                <div className="summary-content-box">
                  <p className="summary-content-label">
                    {lang === 'en' ? 'Summary Results:' : 'ผลสรุปเนื้อหา:'}
                  </p>
                  <textarea
                    name="summaryContent"
                    value={formData.summaryContent}
                    onChange={handleChange}
                    rows={6}
                    className="textarea-purple"
                    style={{ border: 'none', background: 'transparent', padding: 0 }}
                  />
                </div>
              </div>

              {/* ปุ่มบันทึก */}
              <div className="form-actions-purple">
                <button
                  type="button"
                  className="btn-cancel-purple"
                  onClick={() => navigate('/admin')}
                >
                  {lang === 'en' ? 'Cancel' : 'ยกเลิก'}
                </button>
                <button type="submit" className="btn-save-purple">
                  <FaSave size={14} />
                  <span>{lang === 'en' ? 'Save Changes' : 'บันทึกการแก้ไข'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      </main>
    </div>
  );
}