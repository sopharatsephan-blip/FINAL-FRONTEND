import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  FaFileAlt
} from 'react-icons/fa';

export default function SummaryDetail() {
  const navigate = useNavigate();
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
      {/* Sidebar */}
      <aside className="sidebar-purple">
        <div>
          <div className="brand-logo-purple" onClick={() => navigate('/admin')} style={{ cursor: 'pointer' }}>
            <FaAsterisk style={{ color: '#c084fc' }} />
            <span>ICT Video Summary</span>
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
              <span>แดชบอร์ด</span>
            </button>

            <button className="menu-item-purple active" onClick={() => navigate('/upload-video')}>
              <FaVideo size={16} />
              <span>อัปโหลดวิดีโอ</span>
            </button>

            <button className="menu-item-purple" onClick={() => navigate('/edit-summary')}>
              <FaEdit size={16} />
              <span>แก้ไขข้อมูลสรุป</span>
            </button>

            <button className="menu-item-purple">
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

      {/* Main Content */}
      <main className="main-content-purple">
        <header className="top-header-purple">
          <div className="header-title-box">
            <div className="header-icon-badge">
              <FaVideo size={18} />
            </div>
            <h2>รายละเอียดสรุปวิดีโอ</h2>
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

        <div className="detail-body-area">
          <div className="detail-card-purple">
            
            {/* Header & ปุ่มย้อนกลับ (เอาปุ่ม TextRank ออกเรียบร้อย) */}
            <div className="detail-card-header">
              <button className="btn-back-purple" onClick={() => navigate('/summary-result')}>
                <FaArrowLeft /> ย้อนกลับ
              </button>

              <div className="algorithm-badge-single">
                LexRank
              </div>
            </div>

            {/* เนื้อหาสรุป LexRank เท่านั้น */}
            <div className="summary-text-box">
              <h3 className="summary-title-head">
                <FaFileAlt style={{ color: '#c084fc', marginRight: '8px' }} />
                สรุปตามหัวข้อ (LexRank)
              </h3>

              <div className="summary-content-list">
                <section className="summary-item">
                  <h4>1) ชื่อหน่วยงานและสถานประกอบการ</h4>
                  <p>บริษัทเอกชนด้านการออกแบบและพัฒนาซอฟต์แวร์เว็บไซต์ และ Mobile Application ตั้งอยู่ที่จังหวัดภูเก็ต</p>
                </section>

                <section className="summary-item">
                  <h4>2) ตำแหน่งและลักษณะงานที่ทำ</h4>
                  <p>ตำแหน่งที่ฝึกงานเกี่ยวกับการออกแบบ UI/UX โดยมีหน้าที่วิเคราะห์ความต้องการของผู้ใช้งาน ออกแบบ Wireframe และหน้าตาเว็บไซต์ รวมถึงทดสอบและปรับปรุงดีไซน์ตามข้อเสนอแนะ</p>
                </section>

                <section className="summary-item">
                  <h4>3) Project หรือ งานที่ทำระหว่างฝึกงาน</h4>
                  <p>ออกแบบเว็บไซต์ระบบหลังบ้านจำนวน 3 ระบบ โดยใช้ Figma เช่น</p>
                  <ul>
                    <li>ระบบจัดการข้อมูลบริษัท</li>
                    <li>ระบบจัดการข้อมูลคนขับและรถ</li>
                    <li>ระบบ Booking การจองรถ รวมถึงระบบ Spa สำหรับจัดการหมอนวด การจองคิว และสินค้า</li>
                  </ul>
                </section>

                <section className="summary-item">
                  <h4>4) ปัญหาที่พบและวิธีการแก้ไข (ถ้ามี)</h4>
                  <p>พบปัญหาในการออกแบบให้ตรงกับความต้องการผู้ใช้ จึงแก้ไขโดยการรับ Feedback จากทีมและปรับปรุงดีไซน์อย่างต่อเนื่อง</p>
                </section>

                <section className="summary-item">
                  <h4>5) สิ่งที่ได้รับจากการไปฝึกงานในครั้งนี้</h4>
                  <p>ได้เรียนรู้การทำงานจริง การทำงานเป็นทีม และการสื่อสารกับผู้อื่น รวมถึงพัฒนาทักษะด้านการออกแบบและการคิดวิเคราะห์</p>
                </section>

                <section className="summary-item">
                  <h4>6) แนวคิดต่ออาชีพในอนาคต</h4>
                  <p>มีแนวโน้มที่จะสนใจสายงานด้าน UI/UX และการออกแบบระบบมากขึ้น จากประสบการณ์ฝึกงานที่ได้รับ</p>
                </section>

                <section className="summary-item">
                  <h4>7) ควรแนะนำที่ฝึกงานนี้หรือไม่ เพราะอะไร</h4>
                  <p>แนะนำให้ไปฝึกงาน เพราะได้ทำงานจริง ได้รับคำแนะนำจากพี่ในทีม และบรรยากาศการทำงานเป็นกันเอง ไม่กดดัน</p>
                </section>

                <section className="summary-item">
                  <h4>8) ข้อเสนอแนะสำหรับรุ่นน้อง</h4>
                  <p>ควรเปิดใจเรียนรู้ ฝึกทักษะให้หลากหลาย กล้าถาม กล้าคิด กล้าแสดงออก เพื่อพัฒนาตัวเองให้มากขึ้น</p>
                </section>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}