import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from './LanguageContext';

export default function Sidebar() {
  const { t, lang, toggleLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem('user')) || { firstName: 'Somchai', lastName: 'Jaidee' };

  const menuItems = [
    { path: '/admin', label: t.dashboard, icon: '🏠' },
    { path: '/upload-video', label: t.uploadVideo, icon: '📹' },
    { path: '/edit-summary', label: t.editSummary, icon: '✏️' },
    { path: '/publish', label: t.publish, icon: '🌐' },
    { path: '/users', label: t.userManagement, icon: '👥' },
  ];

  return (
    <aside className="sidebar" style={{ width: '260px', background: '#0e091f', minHeight: '100vh', padding: '20px', color: '#fff' }}>
      {/* Logo */}
      <div className="logo" style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ color: '#a855f7' }}>✻</span> {t.appName}
      </div>

      {/* Profile */}
      <div className="profile-card" style={{ background: '#18112e', padding: '15px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
          {user.firstName ? user.firstName[0] : 'S'}
        </div>
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{user.firstName} {user.lastName}</div>
          <span style={{ fontSize: '0.75rem', background: 'rgba(168, 85, 247, 0.2)', color: '#c084fc', padding: '2px 8px', borderRadius: '10px' }}>Admin</span>
        </div>
      </div>

      {/* Menu List */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '10px',
              border: 'none',
              background: location.pathname === item.path ? '#8b5cf6' : 'transparent',
              color: '#fff',
              cursor: 'pointer',
              textAlign: 'left',
              fontSize: '0.95rem',
              fontWeight: location.pathname === item.path ? 'bold' : 'normal'
            }}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* ปุ่ม Logout */}
      <button 
        onClick={() => { localStorage.clear(); navigate('/login'); }}
        style={{ marginTop: '40px', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px' }}
      >
        🚪 {t.logout}
      </button>

      {/* 🌐 ปุ่มสลับภาษาด้านล่าง Sidebar */}
      <button
        onClick={toggleLanguage}
        style={{
          marginTop: '20px',
          width: '100%',
          padding: '10px',
          background: 'rgba(139, 92, 246, 0.15)',
          border: '1px solid rgba(168, 85, 247, 0.4)',
          color: '#c084fc',
          borderRadius: '10px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        🌐 Language: {lang.toUpperCase()}
      </button>
    </aside>
  );
}