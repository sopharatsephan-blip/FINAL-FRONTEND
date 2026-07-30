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
  FaGlobeAmericas,
  FaLock,
  FaTimes
} from 'react-icons/fa';

export default function UserManagement() {
  const navigate = useNavigate();
  const { t, lang, toggleLanguage } = useLanguage();
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  // ข้อมูลผู้ใช้งานที่ดึงมาจากฐานข้อมูลจริง
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ผู้ใช้ที่ถูกเลือกในตาราง (สำหรับแต่งตั้ง/ถอด Admin)
  const [selectedUserId, setSelectedUserId] = useState(null);

  // สถานะของ modal ยืนยันรหัสผ่าน
  // action: 'makeAdmin' | 'removeAdmin' | null
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [confirmLoading, setConfirmLoading] = useState(false);

  // แปลง RoleID จากฐานข้อมูล -> ชื่อ Role ที่แสดงผล
  const roleIdToName = {
    R001: 'Admin',
    R002: 'Student',
  };
  const roleNameToId = {
    Admin: 'R001',
    Student: 'R002',
  };

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

  // ดึงรายชื่อผู้ใช้งานจากฐานข้อมูลผ่าน API
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      // ใช้ URL เต็มของ backend (Express รันที่ port 5000)
      // เพราะ React dev server (port 3000) กับ backend คนละพอร์ตกัน
      const res = await fetch('http://localhost:5000/api/users', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) {
        throw new Error(`โหลดข้อมูลผู้ใช้งานไม่สำเร็จ (status ${res.status})`);
      }

      const data = await res.json();

      // แปลงข้อมูลจากตาราง customer ให้ตรงกับรูปแบบที่ตารางใช้แสดงผล
      const mapped = data.map((row) => ({
        id: row.UID,
        name: `${row.FirstName} ${row.LastName}`,
        username: row.Username,
        role: roleIdToName[row.RoleID] || row.RoleID,
      }));

      setUsers(mapped);
    } catch (err) {
      console.error('Fetch users error:', err);
      setError(err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
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

  const selectedUser = users.find(u => u.id === selectedUserId) || null;

  const handleRowClick = (userId) => {
    setSelectedUserId(prev => (prev === userId ? null : userId));
  };

  // เปิด modal สำหรับยืนยันรหัสผ่านก่อนแต่งตั้ง/ถอด Admin
  const openConfirm = (action) => {
    if (!selectedUser) return;

    if (action === 'makeAdmin' && selectedUser.role === 'Admin') return;
    if (action === 'removeAdmin' && selectedUser.role !== 'Admin') return;

    setConfirmAction(action);
    setConfirmPassword('');
    setConfirmError('');
  };

  const closeConfirm = () => {
    if (confirmLoading) return; // กันปิด modal ระหว่างกำลังส่งคำขอ
    setConfirmAction(null);
    setConfirmPassword('');
    setConfirmError('');
  };

  // ยืนยันการเปลี่ยนสิทธิ์ผู้ใช้ (เรียก backend พร้อมรหัสผ่านของผู้ทำรายการ)
  const handleConfirmSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser || !confirmAction) return;

    if (!currentUser || !currentUser.uid) {
      setConfirmError('ไม่พบข้อมูลผู้ใช้งานที่ล็อกอินอยู่ กรุณาเข้าสู่ระบบใหม่');
      return;
    }

    if (!confirmPassword) {
      setConfirmError('กรุณากรอกรหัสผ่านของคุณ');
      return;
    }

    const newRole = confirmAction === 'makeAdmin' ? roleNameToId.Admin : roleNameToId.Student;

    setConfirmLoading(true);
    setConfirmError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/users/${selectedUser.id}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          requesterUid: currentUser.uid,
          password: confirmPassword,
          newRole,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || 'เกิดข้อผิดพลาดในการเปลี่ยนสิทธิ์ผู้ใช้');
      }

      // ดึงรายชื่อผู้ใช้ใหม่จาก DB เพื่อยืนยันว่า UI ตรงกับข้อมูลจริงเสมอ
      await fetchUsers();

      setConfirmAction(null);
      setConfirmPassword('');
      setSelectedUserId(null);
    } catch (err) {
      console.error('Change role error:', err);
      setConfirmError(err.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    } finally {
      setConfirmLoading(false);
    }
  };

  const canMakeAdmin = !!selectedUser && selectedUser.role !== 'Admin';
  const canRemoveAdmin = !!selectedUser && selectedUser.role === 'Admin';

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

            {/* ปุ่มสลับภาษา */}
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

        {/* แถบสถานะการเลือกผู้ใช้ */}
        <div style={{
          marginBottom: '16px',
          minHeight: '20px',
          fontSize: '0.85rem',
          color: '#94a3b8'
        }}>
          {selectedUser
            ? (lang === 'en'
                ? <>Selected: <strong style={{ color: '#c084fc' }}>{selectedUser.name}</strong> ({selectedUser.role})</>
                : <>เลือกอยู่: <strong style={{ color: '#c084fc' }}>{selectedUser.name}</strong> ({selectedUser.role})</>)
            : (lang === 'en' ? 'Click a row below to select a user' : 'คลิกที่แถวในตารางเพื่อเลือกผู้ใช้')}
        </div>

        {/* Action Buttons Header */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginBottom: '24px' }}>
          <button
            onClick={() => openConfirm('makeAdmin')}
            disabled={!canMakeAdmin}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: canMakeAdmin ? 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)' : 'rgba(168, 85, 247, 0.15)',
              color: canMakeAdmin ? '#fff' : '#7c6a94',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '25px',
              fontWeight: '600',
              fontSize: '0.9rem',
              cursor: canMakeAdmin ? 'pointer' : 'not-allowed',
              boxShadow: canMakeAdmin ? '0 4px 15px rgba(168, 85, 247, 0.3)' : 'none',
              transition: 'all 0.2s ease',
              opacity: canMakeAdmin ? 1 : 0.6
            }}
          >
            <FaUserShield size={16} />
            <span>{lang === 'en' ? 'Make Admin' : 'แต่งตั้ง Admin'}</span>
          </button>

          <button
            onClick={() => openConfirm('removeAdmin')}
            disabled={!canRemoveAdmin}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: canRemoveAdmin ? '#f87171' : '#8a5a5a',
              padding: '10px 20px',
              borderRadius: '25px',
              fontWeight: '600',
              fontSize: '0.9rem',
              cursor: canRemoveAdmin ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease',
              opacity: canRemoveAdmin ? 1 : 0.6
            }}
          >
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
          {loading ? (
            <div style={{ padding: '40px 0', textAlign: 'center', color: '#94a3b8' }}>
              {lang === 'en' ? 'Loading users...' : 'กำลังโหลดข้อมูล...'}
            </div>
          ) : error ? (
            <div style={{ padding: '40px 0', textAlign: 'center', color: '#f87171' }}>
              {error}
            </div>
          ) : filteredUsers.length === 0 ? (
            <div style={{ padding: '40px 0', textAlign: 'center', color: '#94a3b8' }}>
              {lang === 'en' ? 'No users found' : 'ไม่พบข้อมูลผู้ใช้งาน'}
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', color: '#f8fafc' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', textTransform: 'uppercase', fontSize: '0.78rem', color: '#94a3b8', letterSpacing: '0.5px' }}>
                  <th style={{ textAlign: 'left', padding: '12px 16px' }}>Full Name</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px' }}>Username</th>
                  <th style={{ textAlign: 'center', padding: '12px 16px' }}>Role</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => {
                  const isSelected = user.id === selectedUserId;
                  return (
                    <tr
                      key={user.id || index}
                      onClick={() => handleRowClick(user.id)}
                      style={{
                        borderBottom: index !== filteredUsers.length - 1 ? '1px solid rgba(255, 255, 255, 0.04)' : 'none',
                        cursor: 'pointer',
                        background: isSelected ? 'rgba(168, 85, 247, 0.12)' : 'transparent',
                        outline: isSelected ? '1px solid rgba(168, 85, 247, 0.5)' : 'none',
                        transition: 'background 0.15s ease'
                      }}
                    >
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
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* ================= MODAL ยืนยันรหัสผ่าน ================= */}
      {confirmAction && selectedUser && (
        <div
          onClick={closeConfirm}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '380px',
              maxWidth: '90vw',
              background: 'linear-gradient(145deg, #160d2e 0%, #0f0821 100%)',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              borderRadius: '18px',
              padding: '24px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: confirmAction === 'makeAdmin' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(239, 68, 68, 0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: confirmAction === 'makeAdmin' ? '#c084fc' : '#f87171'
                }}>
                  {confirmAction === 'makeAdmin' ? <FaUserShield size={16} /> : <FaUserMinus size={16} />}
                </div>
                <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.05rem', fontWeight: '600' }}>
                  {confirmAction === 'makeAdmin'
                    ? (lang === 'en' ? 'Make Admin' : 'แต่งตั้ง Admin')
                    : (lang === 'en' ? 'Remove Admin' : 'ยกเลิก Admin')}
                </h3>
              </div>
              <button
                onClick={closeConfirm}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
              >
                <FaTimes size={16} />
              </button>
            </div>

            <p style={{ color: '#cbd5e1', fontSize: '0.88rem', margin: '0 0 16px 0', lineHeight: 1.5 }}>
              {confirmAction === 'makeAdmin'
                ? (lang === 'en'
                    ? <>You are about to make <strong style={{ color: '#c084fc' }}>{selectedUser.name}</strong> an Admin. Enter your password to confirm.</>
                    : <>คุณกำลังจะแต่งตั้ง <strong style={{ color: '#c084fc' }}>{selectedUser.name}</strong> เป็น Admin กรุณาใส่รหัสผ่านของคุณเพื่อยืนยัน</>)
                : (lang === 'en'
                    ? <>You are about to remove Admin rights from <strong style={{ color: '#f87171' }}>{selectedUser.name}</strong>. Enter your password to confirm.</>
                    : <>คุณกำลังจะถอดสิทธิ์ Admin ของ <strong style={{ color: '#f87171' }}>{selectedUser.name}</strong> กรุณาใส่รหัสผ่านของคุณเพื่อยืนยัน</>)}
            </p>

            <form onSubmit={handleConfirmSubmit}>
              <div style={{ position: 'relative', marginBottom: '10px' }}>
                <FaLock style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} size={13} />
                <input
                  type="password"
                  autoFocus
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={lang === 'en' ? 'Your password' : 'รหัสผ่านของคุณ'}
                  style={{
                    width: '100%',
                    background: '#120b24',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '10px 14px 10px 36px',
                    color: '#fff',
                    fontSize: '0.88rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {confirmError && (
                <div style={{ color: '#f87171', fontSize: '0.8rem', marginBottom: '10px' }}>
                  {confirmError}
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={closeConfirm}
                  disabled={confirmLoading}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: 'transparent',
                    color: '#94a3b8',
                    fontWeight: '600',
                    fontSize: '0.88rem',
                    cursor: confirmLoading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {lang === 'en' ? 'Cancel' : 'ยกเลิก'}
                </button>
                <button
                  type="submit"
                  disabled={confirmLoading}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '12px',
                    border: 'none',
                    background: confirmAction === 'makeAdmin'
                      ? 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)'
                      : 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
                    color: '#fff',
                    fontWeight: '600',
                    fontSize: '0.88rem',
                    cursor: confirmLoading ? 'not-allowed' : 'pointer',
                    opacity: confirmLoading ? 0.7 : 1
                  }}
                >
                  {confirmLoading
                    ? (lang === 'en' ? 'Confirming...' : 'กำลังยืนยัน...')
                    : (lang === 'en' ? 'Confirm' : 'ยืนยัน')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}