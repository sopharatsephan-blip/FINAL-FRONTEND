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
  FaGlobeAmericas
} from 'react-icons/fa';

export default function EditSummary() {
  const navigate = useNavigate();
  const { t, lang, toggleLanguage } = useLanguage();
  const [currentUser, setCurrentUser] = useState(null);

  // สเตตข้อมูลตามฟอร์มรูปภาพ
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
              <span>{t.dashboard || 'แดชบอร์ด'}</span>
            </button>

            <button className="menu-item-purple" onClick={() => navigate('/upload-video')}>
              <FaVideo size={16} />
              <span>{t.uploadVideo || 'อัปโหลดวิดีโอ'}</span>
            </button>

            <button className="menu-item-purple active" onClick={() => navigate('/edit-summary')}>
              <FaEdit size={16} />
              <span>{t.editSummary || 'แก้ไขข้อมูลของสรุป'}</span>
            </button>

            <button className="menu-item-purple" onClick={() => navigate('/publish')}>
              <FaGlobe size={16} />
              <span>{t.publish || 'เผยแพร่'}</span>
            </button>

            <button className="menu-item-purple" onClick={() => navigate('/users')}>
              <FaUsers size={16} />
              <span>{t.userManagement || 'จัดการผู้ใช้'}</span>
            </button>
          </nav>
        </div>

        <div className="sidebar-footer-purple">
          <button className="logout-btn-purple" onClick={handleLogout}>
            <FaSignOutAlt size={16} />
            <span>{t.logout || 'ออกจากระบบ'}</span>
          </button>
        </div>
      </aside>

      {/* ===== Main Content ===== */}
      <main className="main-content-purple">
        {/* Top Header */}
        <header className="top-header-purple" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="header-title-box" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="header-icon-badge" style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#c084fc', padding: '10px', borderRadius: '10px', display: 'flex' }}>
              <FaEdit size={18} />
            </div>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>
              {lang === 'en' ? 'Edit Summary Data' : 'แก้ไขข้อมูลของสรุป'}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="search-box-purple">
              <FaSearch className="search-icon-purple" style={{ color: '#9ca3af', fontSize: '14px' }} />
              <input 
                type="text" 
                className="search-input-purple" 
                placeholder={t.searchPlaceholder || 'ค้นหาสรุป, ตำแหน่งงาน'} 
              />
            </div>

            {/* 🌐 ปุ่มสลับภาษา UI */}
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
          <div className="purple-card" style={{ padding: '32px' }}>
            
            {/* Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
              <span style={{ width: '10px', height: '10px', backgroundColor: '#f59e0b', borderRadius: '50%', display: 'inline-block' }}></span>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#ffffff' }}>
                {lang === 'en' ? 'Edit Summary Data' : 'แก้ไขข้อมูลของสรุป'}
              </h3>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* ชื่อตำแหน่งงาน */}
              <div className="form-group-purple">
                <label style={{ display: 'block', color: '#e2e8f0', fontWeight: '600', marginBottom: '8px', fontSize: '15px' }}>
                  {lang === 'en' ? 'Job Title *' : 'ชื่อตำแหน่งงาน *'}
                </label>
                <input 
                  type="text" 
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(192, 132, 252, 0.3)',
                    background: 'rgba(17, 24, 39, 0.6)',
                    color: '#ffffff',
                    fontSize: '15px',
                    outline: 'none'
                  }}
                />
              </div>

              {/* บริษัท/องค์กร */}
              <div className="form-group-purple">
                <label style={{ display: 'block', color: '#e2e8f0', fontWeight: '600', marginBottom: '8px', fontSize: '15px' }}>
                  {lang === 'en' ? 'Company / Organization *' : 'บริษัท/องค์กร *'}
                </label>
                <input 
                  type="text" 
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(192, 132, 252, 0.3)',
                    background: 'rgba(17, 24, 39, 0.6)',
                    color: '#ffffff',
                    fontSize: '15px',
                    outline: 'none'
                  }}
                />
              </div>

              {/* หมวดหมู่ & จังหวัด (2 Columns) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group-purple">
                  <label style={{ display: 'block', color: '#e2e8f0', fontWeight: '600', marginBottom: '8px', fontSize: '15px' }}>
                    {lang === 'en' ? 'Category *' : 'หมวดหมู่*'}
                  </label>
                  <input 
                    type="text" 
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: '1px solid rgba(192, 132, 252, 0.3)',
                      background: 'rgba(17, 24, 39, 0.6)',
                      color: '#ffffff',
                      fontSize: '15px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div className="form-group-purple">
                  <label style={{ display: 'block', color: '#e2e8f0', fontWeight: '600', marginBottom: '8px', fontSize: '15px' }}>
                    {lang === 'en' ? 'Province *' : 'จังหวัด*'}
                  </label>
                  <input 
                    type="text" 
                    name="province"
                    value={formData.province}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: '1px solid rgba(192, 132, 252, 0.3)',
                      background: 'rgba(17, 24, 39, 0.6)',
                      color: '#ffffff',
                      fontSize: '15px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* เนื้อหาที่สรุป */}
              <div className="form-group-purple">
                <label style={{ display: 'block', color: '#e2e8f0', fontWeight: '600', marginBottom: '8px', fontSize: '15px' }}>
                  {lang === 'en' ? 'Summary Content *' : 'เนื้อหาที่สรุป *'}
                </label>
                <div style={{
                  padding: '16px',
                  borderRadius: '16px',
                  border: '1px solid rgba(192, 132, 252, 0.3)',
                  background: 'rgba(17, 24, 39, 0.6)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                  <h4 style={{ margin: 0, color: '#c084fc', fontSize: '15px', fontWeight: 'bold' }}>
                    {lang === 'en' ? 'Summary Results:' : 'ผลสรุปเนื้อหา:'}
                  </h4>
                  <textarea 
                    name="summaryContent"
                    value={formData.summaryContent}
                    onChange={handleChange}
                    rows={6}
                    style={{
                      width: '100%',
                      background: 'transparent',
                      border: 'none',
                      color: '#e2e8f0',
                      fontSize: '14px',
                      lineHeight: '1.6',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  />
                </div>
              </div>

              {/* ปุ่มบันทึก */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button 
                  type="submit"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 28px',
                    borderRadius: '12px',
                    border: 'none',
                    background: '#8b5cf6',
                    color: '#ffffff',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <FaSave size={16} />
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