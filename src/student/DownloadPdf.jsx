import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from "../LanguageContext";
import './StudentDashboard.css'; // ใช้ CSS เดียวกันกับหน้า Dashboard เพื่อให้สไตล์ตรงกัน 100%

import {
  FaHome,
  FaFileAlt,
  FaFilePdf,
  FaHeart,
  FaSignOutAlt,
  FaSearch,
  FaUserGraduate,
  FaLanguage,
  FaDownload,
  FaEye,
  FaCheckCircle,
  FaHistory
} from 'react-icons/fa';

function DownloadPdf() {
  const navigate = useNavigate();
  const { lang, toggleLanguage } = useLanguage();
  const [currentUser, setCurrentUser] = useState(null);

  // ข้อมูลรายการเอกสาร PDF
  const [pdfDocuments, setPdfDocuments] = useState([
    {
      id: 1,
      title: 'ตำแหน่ง UX/UI Design | บริษัท อินเวิร์ซ โซลูชันส์ จำกัด',
      titleEn: 'Position UX/UI Design | INVERSE SOLUTIONS CO., LTD.',
      date: '1 ม.ค.2568',
      dateEn: '1 Jan 2025',
      downloaded: true,
      fileSize: '1.2 MB'
    },
    {
      id: 2,
      title: 'ตำแหน่ง Graphic บริษัท PRINT UP',
      titleEn: 'Position Graphic | PRINT UP CO., LTD.',
      date: '1 ม.ค.2568',
      dateEn: '1 Jan 2025',
      downloaded: false,
      fileSize: '2.5 MB'
    },
    {
      id: 3,
      title: 'ตำแหน่ง web Developer บริษัท IO-HOPE ENTERPRISE',
      titleEn: 'Position Web Developer | IO-HOPE ENTERPRISE',
      date: '1 ม.ค.2568',
      dateEn: '1 Jan 2025',
      downloaded: false,
      fileSize: '1.8 MB'
    }
  ]);

  // ประวัติการดาวน์โหลดล่าสุด
  const [downloadHistory, setDownloadHistory] = useState([
    {
      id: 101,
      title: 'ตำแหน่ง UX/UI Design | บริษัท อินเวิร์ซ โซลูชันส์ จำกัด',
      titleEn: 'Position UX/UI Design | INVERSE SOLUTIONS CO., LTD.',
      size: '1.2 MB',
      date: '1 ม.ค.2568',
      dateEn: '1 Jan 2025',
      status: 'สำเร็จ',
      statusEn: 'Success'
    }
  ]);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      navigate('/login');
      return;
    }
    const user = JSON.parse(savedUser);
    if (user.roleId === 'R001') {
      navigate('/admin');
      return;
    }
    setCurrentUser(user);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleDownload = (id) => {
    setPdfDocuments(prev =>
      prev.map(item => item.id === id ? { ...item, downloaded: true } : item)
    );
  };

  return (
    <div className="admin-purple-container">
      {/* ===== Sidebar ===== */}
      <aside className="sidebar-purple">
        <div>
          <div className="brand-logo-purple" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
            <div className="avatar-purple" style={{ marginRight: '10px' }}>ICT</div>
            <span>ICT Cooperative</span>
          </div>

          <div className="user-profile-purple">
            <div className="avatar-purple">
              <FaUserGraduate />
            </div>
            <div className="user-info-purple">
              <h4>{lang === 'en' ? 'Student & Advisor' : 'นักศึกษาและอาจารย์'}</h4>
              <span className="role-tag">{currentUser?.username || 'User Panel'}</span>
            </div>
          </div>

          <p style={{ color: '#8b8ba0', fontSize: '12px', marginBottom: '8px', paddingLeft: '4px' }}>
            {lang === 'en' ? 'Main Menu' : 'เมนูหลัก'}
          </p>

          <nav className="menu-list-purple">
            <button className="menu-item-purple" onClick={() => navigate('/dashboard')}>
              <FaHome />
              <span>{lang === 'en' ? 'Dashboard' : 'แดชบอร์ด'}</span>
            </button>

            <button className="menu-item-purple" onClick={() => navigate('/coop-content')}>
              <FaFileAlt />
              <span>{lang === 'en' ? 'Co-op Content' : 'เนื้อหาสหกิจศึกษา'}</span>
            </button>

            <button className="menu-item-purple active" onClick={() => navigate('/download-pdf')}>
              <FaFilePdf style={{ color: '#ef4444' }} />
              <span>{lang === 'en' ? 'Download PDF' : 'ดาวน์โหลด PDF'}</span>
            </button>

            <button className="menu-item-purple" onClick={() => navigate('/favorites')}>
              <FaHeart style={{ color: '#ef4444' }} />
              <span>{lang === 'en' ? 'Favorites' : 'รายการโปรด'}</span>
            </button>
          </nav>
        </div>

        <div className="sidebar-footer-purple">
          <button className="logout-btn-purple" onClick={handleLogout}>
            <FaSignOutAlt />
            <span>{lang === 'en' ? 'Logout' : 'ออกจากระบบ'}</span>
          </button>
        </div>
      </aside>

      {/* ===== Main Content ===== */}
      <main className="main-content-purple">
        {/* Top Header */}
        <header className="top-header-purple" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="header-title" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="avatar-purple" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.4)' }}>
              <FaFilePdf size={20} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '18px', color: '#fff' }}>
                {lang === 'en' ? 'Download PDF' : 'ดาวน์โหลด PDF'}
              </h2>
              <p className="subtitle-purple">
                {lang === 'en' ? 'Related Documents and Files' : 'รวมเอกสาร และไฟล์ที่เกี่ยวข้อง'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="search-box-purple">
              <FaSearch style={{ color: '#8b8ba0' }} />
              <input type="text" placeholder={lang === 'en' ? 'Search summary, position...' : 'ค้นหาสรุป, ตำแหน่งงาน...'} />
            </div>

            {/* ปุ่มสลับภาษา */}
            <button
              type="button"
              onClick={toggleLanguage}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(139, 92, 246, 0.2)',
                border: '1px solid rgba(139, 92, 246, 0.4)',
                borderRadius: '999px',
                padding: '8px 16px',
                color: '#c4b5fd',
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              <FaLanguage size={16} />
              <span>{lang ? lang.toUpperCase() : 'EN'}</span>
            </button>
          </div>
        </header>

        {/* Section 1: เอกสารพร้อมดาวน์โหลด */}
        <div className="purple-card" style={{ marginBottom: '24px' }}>
          <h3 className="card-title-purple" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <FaFilePdf style={{ color: '#ef4444' }} />
            {lang === 'en' ? 'Documents Available for Download' : 'เอกสารพร้อมดาวน์โหลด'}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {pdfDocuments.map((doc) => (
              <div
                key={doc.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  transition: 'all 0.2s ease'
                }}
              >
                <div>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', color: '#f3f4f6', fontWeight: '600' }}>
                    {lang === 'en' ? doc.titleEn : doc.title}
                  </h4>
                  <p style={{ margin: 0, fontSize: '12px', color: '#8b8ba0' }}>
                    PDF · {lang === 'en' ? doc.dateEn : doc.date}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button
                    type="button"
                    title={lang === 'en' ? 'Preview' : 'ดูตัวอย่าง'}
                    style={{
                      background: 'rgba(139, 92, 246, 0.15)',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      color: '#c4b5fd',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <FaEye size={14} />
                  </button>

                  {doc.downloaded ? (
                    <button
                      type="button"
                      disabled
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'rgba(34, 197, 94, 0.2)',
                        border: '1px solid rgba(34, 197, 94, 0.4)',
                        color: '#4ade80',
                        borderRadius: '8px',
                        padding: '8px 18px',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'default'
                      }}
                    >
                      <FaCheckCircle />
                      <span>{lang === 'en' ? 'Downloaded' : 'ดาวน์โหลดแล้ว'}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleDownload(doc.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                        border: 'none',
                        color: '#fff',
                        borderRadius: '8px',
                        padding: '8px 18px',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                      }}
                    >
                      <FaDownload />
                      <span>{lang === 'en' ? 'Download' : 'ดาวน์โหลด'}</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: ประวัติการดาวน์โหลดล่าสุด */}
        <div className="purple-card">
          <h3 className="card-title-purple" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <FaHistory style={{ color: '#3b82f6' }} />
            {lang === 'en' ? 'Recent Download History' : 'ประวัติการดาวน์โหลดล่าสุด'}
          </h3>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#8b8ba0' }}>
                  <th style={{ padding: '12px 16px', fontWeight: '500' }}>{lang === 'en' ? 'File Name' : 'ชื่อไฟล์'}</th>
                  <th style={{ padding: '12px 16px', fontWeight: '500' }}>{lang === 'en' ? 'Size' : 'ขนาด'}</th>
                  <th style={{ padding: '12px 16px', fontWeight: '500' }}>{lang === 'en' ? 'Date' : 'วันที่'}</th>
                  <th style={{ padding: '12px 16px', fontWeight: '500' }}>{lang === 'en' ? 'Status' : 'สถานะ'}</th>
                  <th style={{ padding: '12px 16px', fontWeight: '500', textAlign: 'right' }}>{lang === 'en' ? 'Action' : 'จัดการ'}</th>
                </tr>
              </thead>
              <tbody>
                {downloadHistory.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', color: '#e2e8f0' }}>
                    <td style={{ padding: '16px', fontWeight: '500', maxWidth: '300px' }}>
                      {lang === 'en' ? item.titleEn : item.title}
                    </td>
                    <td style={{ padding: '16px', color: '#8b8ba0' }}>{item.size}</td>
                    <td style={{ padding: '16px', color: '#8b8ba0' }}>{lang === 'en' ? item.dateEn : item.date}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        background: 'rgba(34, 197, 94, 0.15)',
                        color: '#4ade80',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                        padding: '4px 10px',
                        borderRadius: '999px',
                        fontSize: '11px',
                        fontWeight: '600'
                      }}>
                        {lang === 'en' ? item.statusEn : item.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <button
                        type="button"
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          color: '#c4b5fd',
                          borderRadius: '6px',
                          padding: '6px 14px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        {lang === 'en' ? 'Download Again' : 'โหลดอีกครั้ง'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DownloadPdf;