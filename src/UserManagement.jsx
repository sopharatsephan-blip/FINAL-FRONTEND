import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from './LanguageContext';
import { 
  FaHome, 
  FaVideo, 
  FaEdit, 
  FaGlobe, 
  FaUsers, 
  FaSignOutAlt, 
  FaSearch, 
  FaAsterisk,
  FaUserShield,
  FaUserMinus,
  FaGlobeAmericas
} from 'react-icons/fa';

export default function UserManagement() {
  const navigate = useNavigate();
  const { t, lang, toggleLanguage } = useLanguage();
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  // ตัวอย่างข้อมูลผู้ใช้งาน
  const [users, setUsers] = useState([
    { id: '660110791', name: 'น้ำทิพย์', username: 's(uname)', role: 'Admin' },
    { id: '660110792', name: 'โสภารัตน์ ศรีปาน', username: 'a(uname)', role: 'Student' },
    { id: '660110793', name: 'โสภารัตน์ ศรีปาน', username: 'g(uname)', role: 'Student' },
    { id: '660110794', name: 'โสภารัตน์ ศรีปาน', username: 'h(uname)', role: 'Student' },
    { id: '660110795', name: 'โสภารัตน์ ศรีปาน', username: 's(uname)', role: 'Student' },
  ]);

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

  // กรองผู้ใช้งานตามคำค้นหา และ Role
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.id.includes(searchTerm) || 
                          user.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' ? true : user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0b0719', color: '#fff', fontFamily: "'Kanit', sans-serif" }}>
      
      {/* ================= SIDEBAR ================= */}
      <aside style={{ width: '260px', background: '#120b24', padding: '24px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRight: '1px solid rgba(255, 255, 255, 0.05)', flexShrink: 0 }}>
        <div>
          {/* Brand Logo */}
          <div onClick={() => navigate('/admin')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '32px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(192, 132, 252, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaAsterisk style={{ color: '#c084fc' }} size={16} />
            </div>
            <span>{t.appName || 'ICT Video Summary'}</span>
          </div>

          {/* User Profile Box (ตัดส่วนภาษาที่ทับออก) */}
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

            <button onClick={() => navigate('/publish')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: 'transparent', border: 'none', color: '#94a3b8', borderRadius: '12px', cursor: 'pointer', fontSize: '0.95rem', transition: 'all 0.2s' }}>
              <FaGlobe size={18} />
              <span>{t.publish || 'เผยแพร่'}</span>
            </button>

            {/* Active Menu */}
            <button onClick={() => navigate('/users')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', border: 'none', color: '#fff', borderRadius: '12px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: '600', boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)' }}>
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

      {/* ================= MAIN CONTENT ================= */}
      <main style={{ flex: 1, padding: '32px 40px', overflowY: 'auto' }}>
        
        {/* Header Bar */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ background: 'rgba(168, 85, 247, 0.15)', border: '1px solid rgba(168, 85, 247, 0.3)', width: '42px', height: '42px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c084fc' }}>
              <FaUsers size={20} />
            </div>
            <h2 style={{ color: '#fff', margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>
              {lang === 'en' ? 'User Management' : 'จัดการผู้ใช้งาน'}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Search Top Input */}
            <div style={{ position: 'relative', width: '280px' }}>
              <FaSearch style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} size={14} />
              <input 
                type="text" 
                placeholder={lang === 'en' ? 'Search summary, roles...' : 'ค้นหาสรุป, ตำแหน่ง...'} 
                style={{ width: '100%', background: '#120b24', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '30px', padding: '10px 18px 10px 42px', color: '#fff', fontSize: '0.88rem', outline: 'none' }}
              />
            </div>

            {/* 🌐 ปุ่มสลับภาษา ย้ายมามุมขวาบนให้เหมือน Dashboard */}
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

        {/* Action Buttons Header (ปรับเป็นสีโทนม่วง/แดงสไตล์ Dashboard) */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginBottom: '24px' }}>
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '25px',
            fontWeight: '600',
            fontSize: '0.9rem',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(168, 85, 247, 0.3)',
            transition: 'all 0.2s ease'
          }}>
            <FaUserShield size={16} />
            <span>{lang === 'en' ? 'Make Admin' : 'แต่งตั้ง Admin'}</span>
          </button>

          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            padding: '10px 20px',
            borderRadius: '25px',
            fontWeight: '600',
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}>
            <FaUserMinus size={16} />
            <span>{lang === 'en' ? 'Remove Admin' : 'ยกเลิก Admin'}</span>
          </button>
        </div>

        {/* User List Table Card */}
        <div style={{
          background: 'linear-gradient(145deg, #160d2e 0%, #0f0821 100%)',
          border: '1px solid rgba(168, 85, 247, 0.25)',
          borderRadius: '20px',
          padding: '24px 28px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
        }}>
          {/* Card Filter Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '8px', height: '8px', background: '#c084fc', borderRadius: '50%', boxShadow: '0 0 8px #c084fc' }}></span>
              <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.1rem', fontWeight: '600' }}>
                {lang === 'en' ? 'User List' : 'รายชื่อผู้ใช้งาน'}
              </h3>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              {/* Filter Search Input */}
              <div style={{ position: 'relative', width: '240px' }}>
                <FaSearch style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} size={13} />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={lang === 'en' ? 'Search name, student ID...' : 'ค้นหาชื่อ, รหัสนิสิต...'} 
                  style={{ width: '100%', background: '#120b24', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '18px', padding: '8px 14px 8px 36px', color: '#fff', fontSize: '0.82rem', outline: 'none' }}
                />
              </div>

              {/* Role Dropdown Filter */}
              <select 
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                style={{ background: '#120b24', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '18px', padding: '8px 16px', color: '#cbd5e1', fontSize: '0.82rem', outline: 'none', cursor: 'pointer' }}
              >
                <option value="All">{lang === 'en' ? 'All Roles' : 'ทุกบทบาท'}</option>
                <option value="Admin">Admin</option>
                <option value="Student">Student</option>
              </select>
            </div>
          </div>

          {/* Table Area */}
          <table style={{ width: '100%', borderCollapse: 'collapse', color: '#f8fafc' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', textTransform: 'uppercase', fontSize: '0.78rem', color: '#94a3b8', letterSpacing: '0.5px' }}>
                <th style={{ textAlign: 'left', padding: '12px 16px' }}>Full Name</th>
                <th style={{ textAlign: 'left', padding: '12px 16px' }}>Username</th>
                <th style={{ textAlign: 'center', padding: '12px 16px' }}>Role</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={index} style={{ borderBottom: index !== filteredUsers.length - 1 ? '1px solid rgba(255, 255, 255, 0.04)' : 'none' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: '500', color: '#f8fafc', fontSize: '0.95rem' }}>{user.name}</span>
                      <span style={{ fontSize: '0.78rem', color: '#a855f7', marginTop: '2px' }}>{user.id}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px', color: '#cbd5e1', fontSize: '0.9rem' }}>
                    {user.username}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 16px',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      background: user.role === 'Admin' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      color: user.role === 'Admin' ? '#c084fc' : '#94a3b8',
                      border: user.role === 'Admin' ? '1px solid rgba(168, 85, 247, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      {user.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}