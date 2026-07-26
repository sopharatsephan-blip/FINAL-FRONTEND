import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from './LanguageContext';
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
  FaAsterisk,
  FaArrowRight,
  FaGlobeAmericas
} from 'react-icons/fa';

export default function PublishList() {
  const navigate = useNavigate();
  const { t, lang, toggleLanguage } = useLanguage();
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
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0b0719', color: '#fff', fontFamily: "'Kanit', sans-serif" }}>
      {/* Sidebar สไตล์ Dashboard */}
      <aside style={{ width: '260px', background: '#120b24', padding: '24px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRight: '1px solid rgba(255, 255, 255, 0.05)', flexShrink: 0 }}>
        <div>
          {/* Brand Logo */}
          <div onClick={() => navigate('/admin')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '32px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(192, 132, 252, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaAsterisk style={{ color: '#c084fc' }} size={16} />
            </div>
            <span>{t.appName || 'ICT Video Summary'}</span>
          </div>

          {/* User Profile Box */}
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '12px 16px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '0.95rem', boxShadow: '0 2px 8px rgba(168, 85, 247, 0.3)' }}>
              {currentUser && currentUser.firstName ? currentUser.firstName.charAt(0) : 'S'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <h4 style={{ margin: 0, color: '#f8fafc', fontSize: '0.9rem', fontWeight: '600' }}>
                {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Somchai Jaidee'}
              </h4>
              <span style={{ fontSize: '0.7rem', color: '#c084fc', background: 'rgba(168, 85, 247, 0.15)', padding: '2px 8px', borderRadius: '10px', width: 'fit-content', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
                Admin
              </span>
            </div>
          </div>

          {/* Nav Menu */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <button onClick={() => navigate('/admin')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: 'transparent', border: 'none', color: '#94a3b8', borderRadius: '12px', cursor: 'pointer', fontSize: '0.95rem', transition: 'all 0.2s' }}>
              <FaHome size={18} />
              <span>{t.dashboard || 'แดชบอร์ด'}</span>
            </button>

            <button onClick={() => navigate('/upload-video')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: 'transparent', border: 'none', color: '#94a3b8', borderRadius: '12px', cursor: 'pointer', fontSize: '0.95rem', transition: 'all 0.2s' }}>
              <FaVideo size={18} />
              <span>{t.uploadVideo || 'อัปโหลดวิดีโอ'}</span>
            </button>

            <button onClick={() => navigate('/edit-summary')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: 'transparent', border: 'none', color: '#94a3b8', borderRadius: '12px', cursor: 'pointer', fontSize: '0.95rem', transition: 'all 0.2s' }}>
              <FaEdit size={18} />
              <span>{t.editSummary || 'แก้ไขข้อมูลสรุป'}</span>
            </button>

            {/* Active Menu */}
            <button onClick={() => navigate('/publish')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', border: 'none', color: '#fff', borderRadius: '12px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: '600', boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)' }}>
              <FaGlobe size={18} />
              <span>{t.publish || 'เผยแพร่'}</span>
            </button>

            <button onClick={() => navigate('/users')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: 'transparent', border: 'none', color: '#94a3b8', borderRadius: '12px', cursor: 'pointer', fontSize: '0.95rem', transition: 'all 0.2s' }}>
              <FaUsers size={18} />
              <span>{t.userManagement || 'จัดการผู้ใช้'}</span>
            </button>
          </nav>
        </div>

        {/* Logout Button */}
        <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', cursor: 'pointer', padding: '12px 16px', borderRadius: '12px', fontWeight: '500', transition: 'all 0.2s' }}>
          <FaSignOutAlt size={16} />
          <span>{t.logout || 'ออกจากระบบ'}</span>
        </button>
      </aside>

      {/* Main Content Space */}
      <main style={{ flex: 1, padding: '32px 40px', overflowY: 'auto' }}>
        {/* Header Bar */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ background: 'rgba(168, 85, 247, 0.15)', border: '1px solid rgba(168, 85, 247, 0.3)', width: '42px', height: '42px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c084fc' }}>
              <FaGlobe size={20} />
            </div>
            <h2 style={{ color: '#fff', margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>
              {lang === 'en' ? 'Publish Summary' : 'เผยแพร่สรุปเนื้อหา'}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', width: '300px' }}>
              <FaSearch style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} size={14} />
              <input 
                type="text" 
                placeholder={t.searchPlaceholder || 'ค้นหาสรุป, ตำแหน่งงาน...'} 
                style={{ width: '100%', background: '#120b24', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '30px', padding: '10px 18px 10px 42px', color: '#fff', fontSize: '0.88rem', outline: 'none' }}
              />
            </div>

            {/* Language Switch Button */}
            <button 
              type="button" 
              onClick={toggleLanguage}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 18px',
                borderRadius: '30px',
                border: '1px solid rgba(192, 132, 252, 0.4)',
                background: 'rgba(139, 92, 246, 0.15)',
                color: '#c084fc',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 10px rgba(139, 92, 246, 0.1)'
              }}
            >
              <FaGlobeAmericas size={14} />
              <span>{lang ? lang.toUpperCase() : 'EN'}</span>
            </button>
          </div>
        </header>

        {/* Highlight Summary Card */}
        <div style={{ maxWidth: '720px' }}>
          <div 
            onClick={() => navigate('/publish-summary')}
            style={{ 
              background: 'linear-gradient(145deg, #160d2e 0%, #0f0821 100%)',
              border: '1px solid rgba(168, 85, 247, 0.35)',
              borderRadius: '20px',
              padding: '24px 28px',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#c084fc';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 35px rgba(168, 85, 247, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.35)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
            }}
          >
            {/* Header การ์ด */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '9px', height: '9px', background: '#22c55e', borderRadius: '50%', boxShadow: '0 0 10px #22c55e' }}></span>
                <span style={{ color: '#f8fafc', fontSize: '0.95rem', fontWeight: '600' }}>
                  {lang === 'en' ? 'Summary Completed' : 'สรุปเสร็จสิ้น'}
                </span>
              </div>

              {/* ปุ่ม/ข้อความคลิกเพื่อดูรายละเอียด */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#c084fc', fontSize: '0.82rem', fontWeight: '500', background: 'rgba(168, 85, 247, 0.1)', padding: '4px 12px', borderRadius: '20px', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
                <span>{lang === 'en' ? 'Click to view summary' : 'คลิกเพื่อดูสรุป'}</span>
                <FaArrowRight size={10} />
              </div>
            </div>

            {/* Body การ์ด */}
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div style={{ 
                width: '56px', 
                height: '56px', 
                background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)', 
                borderRadius: '16px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: '#fff', 
                flexShrink: 0,
                boxShadow: '0 6px 16px rgba(168, 85, 247, 0.3)'
              }}>
                <FaPlay size={18} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <h3 style={{ color: '#f8fafc', margin: 0, fontSize: '1.1rem', fontWeight: '600', lineHeight: '1.4' }}>
                  Internship ตำแหน่ง UX/UI Design | บริษัท อินเวิร์ส โซลูชันส์ จำกัด
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>
                  {lang === 'en' ? '30 Jan 2026 · 112 original sentences ➔ 5 summary sentences' : '30 ม.ค. 2569 · 112 ประโยคต้นฉบับ ➔ 5 ประโยคสรุป'}
                </p>
                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                  <span style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.3)', padding: '3px 10px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: '500' }}>
                    UX/UI
                  </span>
                  <span style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', border: '1px solid rgba(34, 197, 94, 0.3)', padding: '3px 10px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: '500' }}>
                    {lang === 'en' ? 'Completed' : 'สรุปเสร็จแล้ว'}
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