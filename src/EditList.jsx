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
  FaPlay,
  FaAsterisk
} from 'react-icons/fa';

export default function EditList() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

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

  return (
    <div className="dark-purple-container" style={{ minHeight: '100vh', display: 'flex', background: '#0b0719', color: '#fff' }}>
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

        {/* 🟣 การ์ดสรุปเสร็จสิ้น แบบมีกรอบขอบและเงาเรืองแสง */}
        <div style={{ maxWidth: '650px', marginTop: '10px' }}>
          <div 
            onClick={() => navigate('/edit-summary-detail')}
            style={{ 
              background: 'linear-gradient(145deg, #160d2e 0%, #0f0821 100%)',
              border: '1.5px solid rgba(168, 85, 247, 0.4)', // 🟢 เพิ่มเส้นกรอบสีม่วง
              borderRadius: '20px',
              padding: '24px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 25px rgba(139, 92, 246, 0.15)' // 🟢 เงาเรืองแสงสีม่วง
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#c084fc';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(168, 85, 247, 0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.4)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(139, 92, 246, 0.15)';
            }}
          >
            {/* สถานะ สรุปเสร็จสิ้น */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
              <span style={{ width: '9px', height: '9px', background: '#22c55e', borderRadius: '50%', display: 'inline-block' }}></span>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 'bold', color: '#fff' }}>สรุปเสร็จสิ้น</h3>
            </div>

            {/* รายละเอียดการ์ด */}
            <div style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
              <div style={{ 
                width: '52px', 
                height: '52px', 
                background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)', 
                borderRadius: '14px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: '#fff', 
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)'
              }}>
                <FaPlay size={18} />
              </div>

              <div>
                <h4 style={{ color: '#f8fafc', margin: '0 0 8px 0', fontSize: '1.05rem', fontWeight: '600', lineHeight: '1.4' }}>
                  Internship ตำแหน่ง UX/UI Design | บริษัท อินเวิร์ส โซลูชันส์ จำกัด
                </h4>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 10px 0' }}>
                  30 ม.ค. 2569 · 112 ประโยคต้นฉบับ ➔ 5 ประโยคสรุป
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ background: 'rgba(168, 85, 247, 0.2)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.3)', padding: '3px 10px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '500' }}>
                    UX/UI
                  </span>
                  <span style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', border: '1px solid rgba(34, 197, 94, 0.3)', padding: '3px 10px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '500' }}>
                    สรุปเสร็จแล้ว
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}