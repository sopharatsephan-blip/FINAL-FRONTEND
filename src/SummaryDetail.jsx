import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const { t, lang, toggleLanguage } = useLanguage();
  const [currentUser, setCurrentUser] = useState(null);

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
        {/* Top Header: แก้ชื่อตรงนี้ไม่ให้ซ้ำกับ Upload Video */}
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
            
            {/* Header: เหลือเฉพาะปุ่มย้อนกลับ (ลบปุ่มเลือก TextRank/LexRank ออก) */}
            <div className="result-header-purple" style={{ marginBottom: '20px' }}>
              <button 
                className="reset-btn-purple" 
                onClick={() => navigate('/summary-result')} 
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <FaArrowLeft /> {lang === 'en' ? 'Back' : 'ย้อนกลับ'}
              </button>
            </div>

            {/* เนื้อหาสรุป (ใช้ข้อมูลเฉพาะ LexRank ตัด TextRank ออกสมบูรณ์) */}
            <div className="summary-text-box">
              <h3 className="card-title-purple" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '18px' }}>
                <FaFileAlt style={{ color: '#c084fc' }} />
                {lang === 'en' ? 'Topic Summary' : 'สรุปตามหัวข้อ'}
              </h3>

              <div className="summary-content-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <section className="summary-item">
                  <h4 style={{ color: '#c084fc', marginBottom: '6px', fontSize: '15px' }}>
                    {lang === 'en' ? '1) Company / Organization Name' : '1) ชื่อหน่วยงานและสถานประกอบการ'}
                  </h4>
                  <p style={{ color: '#e2e8f0', margin: 0, lineHeight: '1.6' }}>
                    {lang === 'en'
                      ? 'A private company specializing in software design, website, and mobile application development located in Phuket.'
                      : 'บริษัทเอกชนด้านการออกแบบและพัฒนาซอฟต์แวร์เว็บไซต์และ Mobile Application ตั้งอยู่ที่จังหวัดภูเก็ต'
                    }
                  </p>
                </section>

                <section className="summary-item">
                  <h4 style={{ color: '#c084fc', marginBottom: '6px', fontSize: '15px' }}>
                    {lang === 'en' ? '2) Position and Job Responsibilities' : '2) ตำแหน่งและลักษณะงานที่ทำ'}
                  </h4>
                  <p style={{ color: '#e2e8f0', margin: 0, lineHeight: '1.6' }}>
                    {lang === 'en'
                      ? 'Internship position in UI/UX design, responsible for analyzing user requirements, creating wireframes and web interfaces, as well as testing and making design improvements based on feedback.'
                      : 'ตำแหน่งที่ฝึกงานเกี่ยวกับการออกแบบ UI/UX โดยมีหน้าที่วิเคราะห์ความต้องการของผู้ใช้งาน ออกแบบ Wireframe และหน้าตาเว็บไซต์ รวมถึงทดสอบและปรับปรุงดีไซน์ตามข้อเสนอแนะ'
                    }
                  </p>
                </section>

                <section className="summary-item">
                  <h4 style={{ color: '#c084fc', marginBottom: '6px', fontSize: '15px' }}>
                    {lang === 'en' ? '3) Projects or Tasks During Internship' : '3) Project หรือ งานที่ทำระหว่างฝึกงาน'}
                  </h4>
                  <p style={{ color: '#e2e8f0', margin: '0 0 8px 0', lineHeight: '1.6' }}>
                    {lang === 'en'
                      ? 'Designed 3 back-end web systems using Figma, including:'
                      : 'ออกแบบเว็บไซต์ระบบหลังบ้านจำนวน 3 ระบบ โดยใช้ Figma เช่น'
                    }
                  </p>
                  <ul style={{ color: '#e2e8f0', paddingLeft: '20px', margin: 0, lineHeight: '1.6' }}>
                    <li>{lang === 'en' ? 'Company Data Management System' : 'ระบบจัดการข้อมูลบริษัท'}</li>
                    <li>{lang === 'en' ? 'Driver & Vehicle Management System' : 'ระบบจัดการข้อมูลคนขับและรถ'}</li>
                    <li>{lang === 'en' ? 'Car Booking System & Spa System for masseuse management, queue booking, and products' : 'ระบบ Booking การจองรถ รวมถึงระบบ Spa สำหรับจัดการหมอนวด การจองคิว และสินค้า'}</li>
                  </ul>
                </section>

                <section className="summary-item">
                  <h4 style={{ color: '#c084fc', marginBottom: '6px', fontSize: '15px' }}>
                    {lang === 'en' ? '4) Problems Encountered and Solutions' : '4) ปัญหาที่พบและวิธีการแก้ไข (ถ้ามี)'}
                  </h4>
                  <p style={{ color: '#e2e8f0', margin: 0, lineHeight: '1.6' }}>
                    {lang === 'en'
                      ? 'Encountered issues in aligning designs with user expectations; solved by continuously receiving team feedback and iteratively improving designs.'
                      : 'พบปัญหาในการออกแบบให้ตรงกับความต้องการผู้ใช้ จึงแก้ไขโดยการรับ Feedback จากทีมและปรับปรุงดีไซน์อย่างต่อเนื่อง'
                    }
                  </p>
                </section>

                <section className="summary-item">
                  <h4 style={{ color: '#c084fc', marginBottom: '6px', fontSize: '15px' }}>
                    {lang === 'en' ? '5) Key Takeaways & Experience Gained' : '5) สิ่งที่ได้รับจากการไปฝึกงานในครั้งนี้'}
                  </h4>
                  <p style={{ color: '#e2e8f0', margin: 0, lineHeight: '1.6' }}>
                    {lang === 'en'
                      ? 'Learned practical teamwork, effective communication, and enhanced skills in design and analytical thinking.'
                      : 'ได้เรียนรู้การทำงานจริง การทำงานเป็นทีม และการสื่อสารกับผู้อื่น รวมถึงพัฒนาทักษะด้านการออกแบบและการคิดวิเคราะห์'
                    }
                  </p>
                </section>

                <section className="summary-item">
                  <h4 style={{ color: '#c084fc', marginBottom: '6px', fontSize: '15px' }}>
                    {lang === 'en' ? '6) Future Career Outlook' : '6) แนวคิดต่ออาชีพในอนาคต'}
                  </h4>
                  <p style={{ color: '#e2e8f0', margin: 0, lineHeight: '1.6' }}>
                    {lang === 'en'
                      ? 'Inclined toward pursuing a career path in UI/UX and system design based on internship experiences.'
                      : 'มีแนวโน้มที่จะสนใจสายงานด้าน UI/UX และการออกแบบระบบมากขึ้น จากประสบการณ์ฝึกงานที่ได้รับ'
                    }
                  </p>
                </section>

                <section className="summary-item">
                  <h4 style={{ color: '#c084fc', marginBottom: '6px', fontSize: '15px' }}>
                    {lang === 'en' ? '7) Recommendation for This Internship Site' : '7) ควรแนะนำที่ฝึกงานนี้หรือไม่ เพราะอะไร'}
                  </h4>
                  <p style={{ color: '#e2e8f0', margin: 0, lineHeight: '1.6' }}>
                    {lang === 'en'
                      ? 'Highly recommended due to hands-on projects, helpful team mentorship, and a welcoming atmosphere.'
                      : 'แนะนำให้ไปฝึกงาน เพราะได้ทำงานจริง ได้รับคำแนะนำจากพี่ในทีม และบรรยากาศการทำงานเป็นกันเอง ไม่กดดัน'
                    }
                  </p>
                </section>

                <section className="summary-item">
                  <h4 style={{ color: '#c084fc', marginBottom: '6px', fontSize: '15px' }}>
                    {lang === 'en' ? '8) Suggestions for Juniors' : '8) ข้อเสนอแนะสำหรับรุ่นน้อง'}
                  </h4>
                  <p style={{ color: '#e2e8f0', margin: 0, lineHeight: '1.6' }}>
                    {lang === 'en'
                      ? 'Stay open to continuous learning, build diverse skill sets, and actively express ideas to grow professionally.'
                      : 'ควรเปิดใจเรียนรู้ ฝึกทักษะให้หลากหลาย กล้าถาม กล้าคิด กล้าแสดงออก เพื่อพัฒนาตัวเองให้มากขึ้น'
                    }
                  </p>
                </section>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}