import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PublishSummary.css';
import './UserManagement.css';

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
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaCheck,
  FaUserCheck
} from 'react-icons/fa';

export default function UserManagement() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  
  // State รายชื่อผู้ใช้
  const [users, setUsers] = useState([
    { id: '660110791', name: 'น้ำทิพย์', username: 's(uname)', role: 'Admin' },
    { id: '660110792', name: 'โสภารัตน์ ศรีปาน', username: 'a(uname)', role: 'นักศึกษา' },
    { id: '660110793', name: 'โสภารัตน์ ศรีปาน', username: 'g(uname)', role: 'นักศึกษา' },
    { id: '660110794', name: 'โสภารัตน์ ศรีปาน', username: 'h(uname)', role: 'นักศึกษา' },
    { id: '660110795', name: 'โสภารัตน์ ศรีปาน', username: 's(uname)', role: 'นักศึกษา' },
    { id: '660110796', name: 'โสภารัตน์ ศรีปาน', username: 'l(uname)', role: 'นักศึกษา' },
    { id: '660110797', name: 'โสภารัตน์ ศรีปาน', username: 'm(uname)', role: 'นักศึกษา' },
    { id: '660110798', name: 'โสภารัตน์ ศรีปาน', username: 'n(uname)', role: 'นักศึกษา' },
  ]);

  // State สำหรับตารางหลัก
  const [selectedUserTable, setSelectedUserTable] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('ทั้งหมด');

  // State สำหรับ Popups/Modals
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [modalType, setModalType] = useState('make'); // 'make' หรือ 'remove'
  const [selectedInModal, setSelectedInModal] = useState(null);
  const [modalSearch, setModalSearch] = useState('');

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

  // เปิด Popup ตามประเภท (Make / Remove)
  const openModal = (type) => {
    setModalType(type);
    setSelectedInModal(null);
    setModalSearch('');
    setShowAdminModal(true);
  };

  // ยืนยันเปลี่ยนสิทธิ์ใน Modal
  const handleConfirmRoleChange = () => {
    if (!selectedInModal) return;

    const newRole = modalType === 'make' ? 'Admin' : 'นักศึกษา';
    setUsers(users.map(u => u.id === selectedInModal ? { ...u, role: newRole } : u));
    setShowAdminModal(false);
  };

  // กรองรายชื่อแสดงใน Popup
  const filteredModalUsers = users.filter(u => {
    const matchSearch = u.name.includes(modalSearch) || u.id.includes(modalSearch) || u.username.includes(modalSearch);
    if (modalType === 'make') {
      return matchSearch && u.role !== 'Admin'; // เลือกได้เฉพาะคนที่ไม่ใช่ Admin
    } else {
      return matchSearch && u.role === 'Admin'; // เลือกได้เฉพาะคนที่เป็น Admin
    }
  });

  return (
    <div className="user-mgmt-container">
      {/* Sidebar เมนูด้านข้าง */}
      <aside className="sidebar-dark-purple">
        <div>
          <div className="brand-logo-dark" onClick={() => navigate('/admin')}>
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

          <nav className="menu-list-dark">
            <button className="menu-item-dark" onClick={() => navigate('/admin')}>
              <FaHome size={18} />
              <span>แดชบอร์ด</span>
            </button>

            <button className="menu-item-dark" onClick={() => navigate('/upload-video')}>
              <FaVideo size={18} />
              <span>อัปโหลดวิดีโอ</span>
            </button>

            <button className="menu-item-dark" onClick={() => navigate('/edit-summary')}>
              <FaEdit size={18} />
              <span>แก้ไขข้อมูลสรุป</span>
            </button>

            <button className="menu-item-dark" onClick={() => navigate('/publish')}>
              <FaGlobe size={18} />
              <span>เผยแพร่</span>
            </button>

            <button className="menu-item-dark active" onClick={() => navigate('/users')}>
              <FaUsers size={18} />
              <span>จัดการผู้ใช้</span>
            </button>
          </nav>
        </div>

        <button className="logout-btn-dark" onClick={handleLogout}>
          <FaSignOutAlt size={16} />
          <span>ออกจากระบบ</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="user-mgmt-main">
        {/* Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'rgba(168,85,247,0.2)', padding: '10px', borderRadius: '10px', color: '#c084fc' }}>
              <FaUsers size={22} />
            </div>
            <h2 style={{ color: '#fff', margin: 0, fontSize: '1.4rem' }}>จัดการผู้ใช้</h2>
          </div>

          <div style={{ position: 'relative', width: '300px' }}>
            <FaSearch style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input 
              type="text" 
              placeholder="ค้นหาสรุป, ตำแหน่งงาน..." 
              style={{ width: '100%', background: '#120b24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '10px 15px 10px 40px', color: '#fff', outline: 'none' }}
            />
          </div>
        </header>

        {/* ปุ่มเปิด Modal */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginBottom: '20px' }}>
          <button className="btn-action-admin" onClick={() => openModal('make')}>
            <FaUserShield size={16} /> Make Admin
          </button>

          <button className="btn-action-admin" onClick={() => openModal('remove')}>
            <FaUserMinus size={16} /> Remove Admin
          </button>
        </div>

        {/* การ์ดตารางรายชื่อผู้ใช้ */}
        <div className="user-table-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '8px', height: '8px', backgroundColor: '#a855f7', borderRadius: '50%', display: 'inline-block' }}></span>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold', color: '#fff' }}>รายชื่อผู้ใช้</h3>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  placeholder="ค้นหาชื่อ, รหัสนิสิต..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ background: '#1e1b38', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '12px', padding: '8px 12px 8px 32px', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
                />
                <FaSearch style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.85rem' }} />
              </div>

              <select 
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                style={{ background: '#1e1b38', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '12px', padding: '8px 12px', color: '#fff', fontSize: '0.85rem', outline: 'none', cursor: 'pointer' }}
              >
                <option value="ทั้งหมด">บทบาท</option>
                <option value="Admin">Admin</option>
                <option value="นักศึกษา">นักศึกษา</option>
              </select>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', fontSize: '0.9rem' }}>
                  <th style={{ padding: '12px 16px', fontWeight: '600' }}>ชื่อ-นามสกุล</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600' }}>USERNAME</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600' }}>บทบาท</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const isSelected = selectedUserTable === user.id;
                  return (
                    <tr 
                      key={user.id}
                      onClick={() => setSelectedUserTable(user.id)}
                      className={`user-table-row ${isSelected ? 'selected' : ''}`}
                    >
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: '500', color: '#f8fafc' }}>{user.name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#a855f7' }}>{user.id}</div>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#cbd5e1', fontSize: '0.9rem' }}>
                        {user.username}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ 
                          padding: '4px 12px', 
                          borderRadius: '8px', 
                          fontSize: '0.82rem', 
                          fontWeight: '500',
                          background: user.role === 'Admin' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                          color: user.role === 'Admin' ? '#c084fc' : '#94a3b8',
                          border: user.role === 'Admin' ? '1px solid rgba(168, 85, 247, 0.4)' : '1px solid rgba(255,255,255,0.1)'
                        }}>
                          {user.role}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '25px', color: '#94a3b8', fontSize: '0.85rem' }}>
          <span>แสดง 1-{users.length} จาก {users.length} รายการ</span>

          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <button className="page-btn"><FaChevronLeft size={12} /></button>
            <button className="page-btn active">1</button>
            <button className="page-btn"><FaChevronRight size={12} /></button>
          </div>
        </div>
      </main>

      {/* 🟣 CUSTOM MODAL / POPUP เลือกสิทธิ์ผู้ใช้ */}
      {showAdminModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ background: modalType === 'make' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(239, 68, 68, 0.2)', padding: '8px', borderRadius: '8px', color: modalType === 'make' ? '#c084fc' : '#ef4444' }}>
                  {modalType === 'make' ? <FaUserShield size={20} /> : <FaUserMinus size={20} />}
                </div>
                <h3 style={{ margin: 0, color: '#fff', fontSize: '1.15rem' }}>
                  {modalType === 'make' ? 'แต่งตั้งสิทธิ์ Admin' : 'ถอนสิทธิ์ Admin'}
                </h3>
              </div>
              <button className="btn-close-modal" onClick={() => setShowAdminModal(false)}>
                <FaTimes />
              </button>
            </div>

            <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '0 0 15px 0' }}>
              {modalType === 'make' ? 'เลือกนิสิต/ผู้ใช้ที่ต้องการเพิ่มเป็น Admin' : 'เลือก Admin ที่ต้องการปรับเปลี่ยนเป็นสิทธิ์นักศึกษา'}
            </p>

            {/* ช่องค้นหาใน Modal */}
            <div className="modal-search-box">
              <FaSearch style={{ color: '#94a3b8', fontSize: '0.85rem' }} />
              <input 
                type="text" 
                placeholder="ค้นหาชื่อ หรือ รหัสนิสิต..." 
                value={modalSearch}
                onChange={(e) => setModalSearch(e.target.value)}
              />
            </div>

            {/* รายชื่อผู้ใช้ให้เลือกใน Modal */}
            <div className="modal-user-list">
              {filteredModalUsers.length > 0 ? (
                filteredModalUsers.map((u) => {
                  const isSelected = selectedInModal === u.id;
                  return (
                    <div 
                      key={u.id}
                      onClick={() => setSelectedInModal(u.id)}
                      className={`modal-user-item ${isSelected ? 'selected' : ''}`}
                    >
                      <div>
                        <div style={{ color: '#fff', fontWeight: '500', fontSize: '0.92rem' }}>{u.name}</div>
                        <div style={{ color: '#a855f7', fontSize: '0.8rem' }}>{u.id} · ({u.username})</div>
                      </div>
                      {isSelected && (
                        <div className="modal-check-badge">
                          <FaCheck size={12} />
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div style={{ textAlign: 'center', padding: '30px 10px', color: '#64748b', fontSize: '0.88rem' }}>
                  ไม่พบข้อมูลผู้ใช้
                </div>
              )}
            </div>

            {/* ปุ่มกดยืนยัน Modal */}
            <div className="modal-footer">
              <button className="btn-modal-cancel" onClick={() => setShowAdminModal(false)}>
                ยกเลิก
              </button>
              <button 
                className="btn-modal-confirm"
                disabled={!selectedInModal}
                onClick={handleConfirmRoleChange}
                style={{
                  background: modalType === 'make' 
                    ? 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)' 
                    : 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)'
                }}
              >
                <FaUserCheck /> ยืนยันการเปลี่ยนแปลง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}