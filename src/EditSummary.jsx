import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PublishSummary.css';

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
  FaArrowLeft,
  FaCheck
} from 'react-icons/fa';

export default function EditSummary() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  // State สำหรับควบคุม Pop-up แจ้งเตือน
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // States สำหรับฟอร์มแก้ไขข้อมูลสรุป
  const [jobTitle, setJobTitle] = useState('UX/UI Design');
  const [company, setCompany] = useState('บริษัท อินเวิร์ส โซลูชันส์ จำกัด');
  const [category, setCategory] = useState('');
  const [province, setProvince] = useState('ภูเก็ต');
  const [summaryContent, setSummaryContent] = useState(
    'สวัสดีค่ะ ดิฉันได้เข้าฝึกงานในบริษัทพัฒนาเว็บไซต์และ Mobile Application ที่จังหวัดภูเก็ต โดยได้รับหน้าที่ออกแบบ UI/UX ตั้งแต่การวิเคราะห์ความต้องการผู้ใช้ ออกแบบ Wireframe ไปจนถึงการทดสอบและปรับปรุงดีไซน์ นอกจากนี้ยังได้ทำโปรเจกต์ออกแบบระบบหลังบ้านหลายระบบ เช่น ระบบ Booking และระบบจัดการคิว ซึ่งช่วยให้ได้รับประสบการณ์ทำงานจริงและพัฒนาทักษะการสื่อสารและการทำงานเป็นทีม... ดูเพิ่มเติม'
  );

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

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleSave = (e) => {
    e.preventDefault();
    // เปิด Pop-up แสดงสถานะสำเร็จ
    setShowSuccessModal(true);

    // ปิด Pop-up แล้วย้ายหน้าอัตโนมัติหลังผ่านไป 2 วินาที (หรือจะกดปิดเองก็ได้)
    setTimeout(() => {
      setShowSuccessModal(false);
      navigate('/edit-summary'); // หรือเปลี่ยนเป็นเส้นทางที่คุณต้องการ
    }, 2500);
  };

  return (
    <div className="dark-purple-container" style={{ minHeight: '100vh', display: 'flex', background: '#0b0719', color: '#fff', position: 'relative' }}>
      {/* Sidebar เมนูด้านข้าง */}
      <aside className="sidebar-dark-purple" style={{ width: '260px', background: '#120b24', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexShrink: 0 }}>
        <div>
          <div className="brand-logo-dark" onClick={() => navigate('/admin')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '30px' }}>
            <FaAsterisk style={{ color: '#c084fc' }} />
            <span>ICT Video Summary</span>
          </div>

          <div className="user-profile-dark" style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' }}>
            <div className="avatar-dark" style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>
              {currentUser && currentUser.firstName ? currentUser.firstName.charAt(0) : 'S'}
            </div>
            <div className="user-info-dark">
              <h4 style={{ margin: 0, color: '#fff', fontSize: '0.95rem' }}>{currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Somchai Jaidee'}</h4>
              <span style={{ fontSize: '0.75rem', color: '#a855f7', background: 'rgba(168,85,247,0.2)', padding: '2px 8px', borderRadius: '10px' }}>Admin</span>
            </div>
          </div>

          <nav className="menu-list-dark" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button className="menu-item-dark" onClick={() => navigate('/admin')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: 'transparent', border: 'none', color: '#94a3b8', borderRadius: '10px', cursor: 'pointer' }}>
              <FaHome size={18} />
              <span>แดชบอร์ด</span>
            </button>

            <button className="menu-item-dark" onClick={() => navigate('/upload-video')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: 'transparent', border: 'none', color: '#94a3b8', borderRadius: '10px', cursor: 'pointer' }}>
              <FaVideo size={18} />
              <span>อัปโหลดวิดีโอ</span>
            </button>

            <button className="menu-item-dark active" onClick={() => navigate('/edit-summary')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: '#8b5cf6', border: 'none', color: '#fff', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>
              <FaEdit size={18} />
              <span>แก้ไขข้อมูลสรุป</span>
            </button>

            <button className="menu-item-dark" onClick={() => navigate('/publish')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: 'transparent', border: 'none', color: '#94a3b8', borderRadius: '10px', cursor: 'pointer' }}>
              <FaGlobe size={18} />
              <span>เผยแพร่</span>
            </button>

            <button className="menu-item-dark" onClick={() => navigate('/users')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: 'transparent', border: 'none', color: '#94a3b8', borderRadius: '10px', cursor: 'pointer' }}>
              <FaUsers size={18} />
              <span>จัดการผู้ใช้</span>
            </button>
          </nav>
        </div>

        <button className="logout-btn-dark" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '10px' }}>
          <FaSignOutAlt size={16} />
          <span>ออกจากระบบ</span>
        </button>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => navigate('/edit-summary')} style={{ background: 'none', border: 'none', color: '#c084fc', cursor: 'pointer' }}>
              <FaArrowLeft size={18} />
            </button>
            <div style={{ background: 'rgba(168,85,247,0.2)', padding: '10px', borderRadius: '10px', color: '#c084fc' }}>
              <FaEdit size={20} />
            </div>
            <h2 style={{ color: '#fff', margin: 0, fontSize: '1.4rem' }}>แก้ไขข้อมูลสรุปเนื้อหา</h2>
          </div>

          <div style={{ position: 'relative', width: '300px' }}>
            <FaSearch style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input 
              type="text" 
              placeholder="ค้นหาสรุป..." 
              style={{ width: '100%', background: '#120b24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '10px 15px 10px 40px', color: '#fff', outline: 'none' }}
            />
          </div>
        </header>

        {/* ฟอร์มแก้ไขข้อมูลของสรุป */}
        <div style={{ 
          background: 'linear-gradient(145deg, #160d2e 0%, #0f0821 100%)', 
          border: '1px solid rgba(168, 85, 247, 0.25)', 
          borderRadius: '20px', 
          padding: '35px', 
          maxWidth: '850px', 
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
            <span style={{ width: '10px', height: '10px', backgroundColor: '#f59e0b', borderRadius: '50%', display: 'inline-block' }}></span>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold', color: '#fff' }}>แก้ไขข้อมูลของสรุป</h3>
          </div>

          <form onSubmit={handleSave}>
            {/* ชื่อตำแหน่งงาน */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#e2e8f0' }}>
                ชื่อตำแหน่งงาน <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input 
                type="text" 
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', background: '#1e1b38', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '12px', fontSize: '0.95rem', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            {/* บริษัท/องค์กร */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#e2e8f0' }}>
                บริษัท/องค์กร <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input 
                type="text" 
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', background: '#1e1b38', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '12px', fontSize: '0.95rem', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            {/* หมวดหมู่ & จังหวัด */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#e2e8f0' }}>
                  หมวดหมู่<span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input 
                  type="text" 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', background: '#1e1b38', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '12px', fontSize: '0.95rem', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#e2e8f0' }}>
                  จังหวัด<span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input 
                  type="text" 
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', background: '#1e1b38', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '12px', fontSize: '0.95rem', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            {/* เนื้อหาที่สรุป */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#e2e8f0' }}>
                เนื้อหาที่สรุป <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{ background: '#1e1b38', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '12px', padding: '16px' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#c084fc', fontWeight: 'bold' }}>ผลสรุป Text Rank:</h4>
                <textarea 
                  rows={6}
                  value={summaryContent}
                  onChange={(e) => setSummaryContent(e.target.value)}
                  style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', fontSize: '0.95rem', color: '#cbd5e1', lineHeight: '1.6', resize: 'vertical', fontFamily: 'inherit' }}
                />
              </div>
            </div>

            {/* ปุ่มบันทึกข้อมูล */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
              <button 
                type="submit" 
                style={{ 
                  background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', 
                  color: '#fff', 
                  border: 'none', 
                  padding: '12px 30px', 
                  borderRadius: '12px', 
                  cursor: 'pointer', 
                  fontWeight: 'bold',
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)'
                }}
              >
                <FaSave size={16} /> บันทึกข้อมูล
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* 🟢 Pop-up แจ้งเตือน แก้ไขเสร็จสิ้น (ตามสไตล์ในรูปภาพ) */}
      {showSuccessModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '24px',
            padding: '45px 50px',
            width: '420px',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            border: '2px solid #818cf8',
            position: 'relative'
          }}>
            {/* วงกลมไอคอนถูกสีเขียว */}
            <div style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              background: '#dc262600',
              backgroundColor: '#dcfce7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 25px auto'
            }}>
              <div style={{
                width: '65px',
                height: '65px',
                borderRadius: '50%',
                background: '#4ade80',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}>
                <FaCheck size={32} />
              </div>
            </div>

            {/* ข้อความหัวข้อ */}
            <h2 style={{
              color: '#0f172a',
              fontSize: '1.6rem',
              fontWeight: 'bold',
              margin: '0 0 12px 0'
            }}>
              แก้ไขเสร็จสิ้น ! !
            </h2>

            {/* ข้อความอธิบาย */}
            <p style={{
              color: '#475569',
              fontSize: '1rem',
              lineHeight: '1.6',
              margin: 0
            }}>
              การแก้ไขข้อมูลสรุปถูกบันทึกเรียบร้อยแล้ว<br />
              ระบบกำลังนำคุณกลับสู่หน้าหลัก
            </p>
          </div>
        </div>
      )}
    </div>
  );
}