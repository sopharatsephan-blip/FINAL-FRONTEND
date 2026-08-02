import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from './LanguageContext';
import './usermanagement.css';

// 📌 นำเข้า React Icons
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
  FaLock,
  FaTimes,
  FaArrowLeft
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
      const res = await fetch('http://localhost:5000/api/users', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) {
        throw new Error(`โหลดข้อมูลผู้ใช้งานไม่สำเร็จ (status ${res.status})`);
      }

      const data = await res.json();

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
    if (confirmLoading) return;
    setConfirmAction(null);
    setConfirmPassword('');
    setConfirmError('');
  };

  // ยืนยันการเปลี่ยนสิทธิ์ผู้ใช้
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
    <div className="admin-purple-container">
      
      {/* ===== Sidebar ม่วงเข้ม ===== */}
      <aside className="sidebar-purple">
        <div>
          <div className="brand-logo-purple" onClick={() => navigate('/admin')} style={{ cursor: 'pointer' }}>
            <FaAsterisk className="logo-icon" style={{ color: '#c084fc', marginRight: '8px' }} />
            <span>{t.appName || 'ICT Video Summary'}</span>
          </div>

          <div className="user-profile-purple">
            <div className="avatar-purple">
              {currentUser && currentUser.firstName ? currentUser.firstName.charAt(0) : 'S'}
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

            <button className="menu-item-purple" onClick={() => navigate('/edit-summary')}>
              <FaEdit />
              <span>{t.editSummary || 'Edit Summary'}</span>
            </button>

            <button className="menu-item-purple" onClick={() => navigate('/publish')}>
              <FaGlobe size={16} />
              <span>{t.publish || 'Publish'}</span>
            </button>

            <button className="menu-item-purple active" onClick={() => navigate('/users')}>
              <FaUsers />
              <span>{t.userManagement || 'User Management'}</span>
            </button>
          </nav>
        </div>

        <div className="sidebar-footer-purple">
          <button className="logout-btn-purple" onClick={handleLogout}>
            <FaSignOutAlt />
            <span>{t.logout || 'Logout'}</span>
          </button>
        </div>
      </aside>

      {/* ===== Main Content ด้านขวา ===== */}
      <main className="main-content-purple">
        <header className="top-header-purple">
          <div className="header-title">
            <div className="header-icon-box" style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#c084fc', padding: '8px', borderRadius: '8px', display: 'flex' }}>
              <FaUsers size={18} />
            </div>
            <div>
              <h2 style={{ margin: 0, color: '#ffffff' }}>{lang === 'en' ? 'User Management' : 'จัดการผู้ใช้งาน'}</h2>
              <p className="subtitle-purple" style={{ margin: 0 }}>
                {lang === 'en' ? 'Manage user roles and system privileges' : 'จัดการบทบาทและสิทธิ์ผู้ใช้งานระบบ'}
              </p>
            </div>
          </div>

          {/* ✅ ปุ่มสลับภาษา ย้ายมาไว้ฝั่งขวาบน (ไอคอนโลก) */}
          <button type="button" className="lang-toggle-purple" onClick={toggleLanguage}>
            <FaGlobe size={14} />
            <span>{lang ? lang.toUpperCase() : 'EN'}</span>
          </button>
        </header>

        {/* ✅ ปุ่มย้อนกลับ - อยู่ใต้ header ฝั่งซ้าย */}
        <div className="back-btn-row">
          <button type="button" className="back-btn-purple" onClick={() => navigate(-1)} title={lang === 'en' ? 'Back' : 'ย้อนกลับ'}>
            <FaArrowLeft size={14} />
          </button>
        </div>

        {/* แถบสถานะผู้ใช้ที่เลือก & ปุ่มจัดการสิทธิ์ */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: '14px', color: '#ffffff' }}>
            {selectedUser
              ? (lang === 'en'
                  ? <>Selected: <strong style={{ color: '#e9d5ff', textDecoration: 'underline' }}>{selectedUser.name}</strong> ({selectedUser.role})</>
                  : <>เลือกอยู่: <strong style={{ color: '#e9d5ff', textDecoration: 'underline' }}>{selectedUser.name}</strong> ({selectedUser.role})</>)
              : (lang === 'en' ? 'Click a row below to select a user' : 'คลิกที่แถวในตารางเพื่อเลือกผู้ใช้')}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => openConfirm('makeAdmin')}
              disabled={!canMakeAdmin}
              className={`btn-action-purple ${canMakeAdmin ? 'active' : ''}`}
            >
              <FaUserShield size={14} />
              <span>{lang === 'en' ? 'Make Admin' : 'แต่งตั้ง Admin'}</span>
            </button>

            <button
              onClick={() => openConfirm('removeAdmin')}
              disabled={!canRemoveAdmin}
              className={`btn-action-danger-purple ${canRemoveAdmin ? 'active' : ''}`}
            >
              <FaUserMinus size={14} />
              <span>{lang === 'en' ? 'Remove Admin' : 'ยกเลิก Admin'}</span>
            </button>
          </div>
        </div>

        {/* ตารางรายชื่อผู้ใช้งาน */}
        <div className="purple-card">
          <div className="result-header-purple" style={{ marginBottom: '18px' }}>
            <h3 className="card-title-purple" style={{ margin: 0 }}>
              👥 {lang === 'en' ? 'User List' : 'รายชื่อผู้ใช้งาน'}
            </h3>

            <div style={{ display: 'flex', gap: '10px' }}>
              <div className="search-box-purple" style={{ minWidth: '220px', padding: '6px 14px' }}>
                <FaSearch style={{ color: '#ffffff', fontSize: '12px' }} />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={lang === 'en' ? 'Search name, student ID...' : 'ค้นหาชื่อ, รหัสนิสิต...'} 
                />
              </div>

              <select 
                className="dark-purple-input"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                style={{ width: 'auto', padding: '6px 12px' }}
              >
                <option value="All">{lang === 'en' ? 'All Roles' : 'ทุกบทบาท'}</option>
                <option value="Admin">Admin</option>
                <option value="Student">Student</option>
              </select>
            </div>
          </div>

          {loading ? (
            <p style={{ textAlign: 'center', padding: '30px 0', color: '#ffffff' }}>
              {lang === 'en' ? 'Loading users...' : 'กำลังโหลดข้อมูล...'}
            </p>
          ) : error ? (
            <p style={{ textAlign: 'center', padding: '30px 0', color: '#ef4444' }}>
              {error}
            </p>
          ) : filteredUsers.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '30px 0', color: '#ffffff' }}>
              {lang === 'en' ? 'No users found' : 'ไม่พบข้อมูลผู้ใช้งาน'}
            </p>
          ) : (
            <table className="purple-table">
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>FULL NAME</th>
                  <th style={{ textAlign: 'left' }}>USERNAME</th>
                  <th style={{ textAlign: 'center' }}>ROLE</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => {
                  const isSelected = user.id === selectedUserId;
                  return (
                    <tr
                      key={user.id || index}
                      onClick={() => handleRowClick(user.id)}
                      className={isSelected ? 'selected' : ''}
                    >
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: '600', color: '#ffffff' }}>{user.name}</span>
                          <span style={{ fontSize: '12px', color: '#e9d5ff', fontWeight: '500' }}>{user.id}</span>
                        </div>
                      </td>
                      <td style={{ color: '#ffffff', fontWeight: '400' }}>{user.username}</td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={`role-badge-purple ${user.role === 'Admin' ? 'admin' : ''}`}>
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

      {/* ===== MODAL ยืนยันรหัสผ่าน ===== */}
      {confirmAction && selectedUser && (
        <div className="modal-overlay" onClick={closeConfirm}>
          <div className="modal-content-purple" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-purple">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {confirmAction === 'makeAdmin' ? <FaUserShield style={{ color: '#c084fc' }} /> : <FaUserMinus style={{ color: '#ef4444' }} />}
                <h3>
                  {confirmAction === 'makeAdmin'
                    ? (lang === 'en' ? 'Make Admin' : 'แต่งตั้ง Admin')
                    : (lang === 'en' ? 'Remove Admin' : 'ยกเลิก Admin')}
                </h3>
              </div>
              <button className="btn-close-modal" onClick={closeConfirm}>
                <FaTimes />
              </button>
            </div>

            <p style={{ color: '#ffffff', fontSize: '13.5px', margin: '0 0 16px', lineHeight: 1.5 }}>
              {confirmAction === 'makeAdmin'
                ? (lang === 'en'
                    ? <>You are about to make <strong style={{ color: '#e9d5ff' }}>{selectedUser.name}</strong> an Admin. Enter your password to confirm.</>
                    : <>คุณกำลังจะแต่งตั้ง <strong style={{ color: '#e9d5ff' }}>{selectedUser.name}</strong> เป็น Admin กรุณาใส่รหัสผ่านของคุณเพื่อยืนยัน</>)
                : (lang === 'en'
                    ? <>You are about to remove Admin rights from <strong style={{ color: '#ef4444' }}>{selectedUser.name}</strong>. Enter your password to confirm.</>
                    : <>คุณกำลังจะถอดสิทธิ์ Admin ของ <strong style={{ color: '#ef4444' }}>{selectedUser.name}</strong> กรุณาใส่รหัสผ่านของคุณเพื่อยืนยัน</>)}
            </p>

            <form onSubmit={handleConfirmSubmit}>
              <div className="form-group-purple">
                <div style={{ position: 'relative' }}>
                  <FaLock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#ffffff', fontSize: '13px' }} />
                  <input
                    type="password"
                    autoFocus
                    className="dark-purple-input"
                    style={{ paddingLeft: '34px' }}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={lang === 'en' ? 'Your password' : 'รหัสผ่านของคุณ'}
                  />
                </div>
              </div>

              {confirmError && (
                <div style={{ color: '#ef4444', fontSize: '12px', marginBottom: '12px', fontWeight: 'bold' }}>
                  {confirmError}
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button
                  type="button"
                  className="reset-btn-purple"
                  style={{ flex: 1, color: '#ffffff', borderColor: 'rgba(255,255,255,0.4)' }}
                  onClick={closeConfirm}
                  disabled={confirmLoading}
                >
                  {lang === 'en' ? 'Cancel' : 'ยกเลิก'}
                </button>
                <button
                  type="submit"
                  className="btn-search-purple"
                  style={{ 
                    flex: 1, 
                    background: confirmAction === 'makeAdmin' 
                      ? 'linear-gradient(135deg, #8b5cf6, #6d28d9)' 
                      : 'linear-gradient(135deg, #ef4444, #b91c1c)' 
                  }}
                  disabled={confirmLoading}
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