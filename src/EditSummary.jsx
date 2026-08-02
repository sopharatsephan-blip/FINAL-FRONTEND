import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLanguage } from './LanguageContext';
import './EditSummary.css';

import { 
  FaHome, FaVideo, FaEdit, FaGlobe, FaUsers, FaSignOutAlt, 
  FaAsterisk, FaSave, FaArrowLeft, FaShareAlt
} from 'react-icons/fa';

const API_BASE = 'http://localhost:5000/api'; // เปลี่ยนเป็น base URL จริงของ backend คุณ

export default function EditSummary() {
  const navigate = useNavigate();
  const { videoId } = useParams(); // route: /edit-summary-detail/:videoId
  const { t, lang, toggleLanguage } = useLanguage();
  const [currentUser, setCurrentUser] = useState(null);

  const [summaryId, setSummaryId] = useState(null); // เก็บ SummaryID ไว้ใช้ตอนกด Save

  const [formData, setFormData] = useState({
    jobTitle: '',
    company: '',
    category: '',
    province: '',
    summaryContent: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  // ดึงข้อมูลสรุปจริงจากฐานข้อมูลตาม videoId
  useEffect(() => {
    if (!videoId) {
      setError('ไม่พบรหัสวิดีโอใน URL');
      setLoading(false);
      return;
    }

    const fetchSummary = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/summaries/video/${videoId}`);
        if (!res.ok) {
          throw new Error('ไม่สามารถดึงข้อมูลสรุปได้');
        }
        const data = await res.json();
        setSummaryId(data.summaryId); // เก็บไว้ใช้ตอน PUT
        setFormData({
          jobTitle: data.jobTitle,
          company: data.company,
          category: data.category,
          province: data.province,
          summaryContent: data.summaryContent,
        });
      } catch (err) {
        console.error(err);
        setError(lang === 'en' ? 'Failed to load summary data' : 'ไม่สามารถโหลดข้อมูลสรุปได้');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [videoId, lang]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!summaryId) {
      alert(lang === 'en' ? 'Missing summary ID, cannot save' : 'ไม่พบรหัสสรุป ไม่สามารถบันทึกได้');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/summaries/${summaryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: formData.jobTitle,
          summaryContent: formData.summaryContent,
          // ถ้า backend รองรับการแก้ company/category/province เพิ่ม field ตรงนี้ได้
        }),
      });
      if (!res.ok) throw new Error('บันทึกไม่สำเร็จ');
      alert(lang === 'en' ? 'Data saved successfully!' : 'บันทึกข้อมูลเรียบร้อยแล้ว!');
    } catch (err) {
      console.error(err);
      alert(lang === 'en' ? 'Failed to save data' : 'บันทึกข้อมูลไม่สำเร็จ');
    } finally {
      setSaving(false);
    }
  };

  // ✅ ปุ่ม Share -> ไปยังหน้า Public Summary พร้อม videoId
  const handleShare = () => {
    navigate(`/publish-summary/${videoId}`, {
      state: {
        videoId,
        ...formData
      }
    });
  };

  if (loading) {
    return (
      <div className="admin-purple-container">
        <p style={{ padding: 40 }}>{lang === 'en' ? 'Loading...' : 'กำลังโหลดข้อมูล...'}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-purple-container">
        <p style={{ padding: 40, color: 'red' }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="admin-purple-container">
      {/* ===== Sidebar ===== */}
      <aside className="sidebar-purple">
        <div>
          <div
            className="brand-logo-purple"
            onClick={() => navigate('/admin')}
            style={{ cursor: 'pointer' }}
          >
            <FaAsterisk className="logo-icon" style={{ color: '#c084fc', marginRight: '8px' }} />
            <span>{t.appName || 'ICT Video Summary'}</span>
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
              <FaHome />
              <span>{t.dashboard || 'Dashboard'}</span>
            </button>
            <button className="menu-item-purple" onClick={() => navigate('/upload-video')}>
              <FaVideo />
              <span>{t.uploadVideo || 'Upload Video'}</span>
            </button>
            <button className="menu-item-purple active" onClick={() => navigate('/edit-summary')}>
              <FaEdit />
              <span>{t.editSummary || 'Edit Summary'}</span>
            </button>
            <button className="menu-item-purple" onClick={() => navigate('/publish')}>
              <FaGlobe size={16} />
              <span>{t.publish || 'Publish'}</span>
            </button>
            <button className="menu-item-purple" onClick={() => navigate('/users')}>
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

      {/* ===== Main Content ===== */}
      <main className="main-content-purple">
        <header className="top-header-purple">
          <div className="header-title">
            <div
              className="header-icon-box"
              style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#c084fc', padding: '8px', borderRadius: '8px', display: 'flex' }}
            >
              <FaEdit size={18} />
            </div>
            <div>
              <h2 style={{ margin: 0 }}>{t.editSummary || 'Edit Summary'}</h2>
              <p className="subtitle-purple" style={{ margin: 0 }}>
                {lang === 'en' ? 'Edit and update video summary data' : 'แก้ไขและอัปเดตข้อมูลสรุปวิดีโอ'}
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

        <div className="detail-body-area" style={{ marginTop: '8px' }}>
          <div className="edit-card-purple">
            <div
              className="edit-card-header"
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="orange-dot">●</span>
                <h3>{lang === 'en' ? 'Edit Summary Data' : 'แก้ไขข้อมูลของสรุป'}</h3>
              </div>

              {/* ✅ ปุ่ม Share ใหม่ */}
              <button
                type="button"
                className="btn-action btn-share"
                onClick={handleShare}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#3b82f6',
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                <FaShareAlt size={14} />
                <span>{lang === 'en' ? 'Share' : 'แชร์'}</span>
              </button>
            </div>

            <form className="edit-form-purple" onSubmit={handleSave}>
              <div className="form-group-purple">
                <label>{lang === 'en' ? 'Job Title' : 'ชื่อตำแหน่งงาน'} <span className="req-star">*</span></label>
                <input type="text" name="jobTitle" value={formData.jobTitle} onChange={handleChange} className="input-purple" />
              </div>

              <div className="form-group-purple">
                <label>{lang === 'en' ? 'Company / Organization' : 'บริษัท/องค์กร'} <span className="req-star">*</span></label>
                <input type="text" name="company" value={formData.company} onChange={handleChange} className="input-purple" disabled />
              </div>

              <div className="form-row-purple">
                <div className="form-group-purple">
                  <label>{lang === 'en' ? 'Category' : 'หมวดหมู่'} <span className="req-star">*</span></label>
                  <input type="text" name="category" value={formData.category} onChange={handleChange} className="input-purple" disabled />
                </div>
                <div className="form-group-purple">
                  <label>{lang === 'en' ? 'Province' : 'จังหวัด'} <span className="req-star">*</span></label>
                  <input type="text" name="province" value={formData.province} onChange={handleChange} className="input-purple" disabled />
                </div>
              </div>

              <div className="form-group-purple">
                <label>{lang === 'en' ? 'Summary Content' : 'เนื้อหาที่สรุป'} <span className="req-star">*</span></label>
                <div className="summary-content-box">
                  <p className="summary-content-label">{lang === 'en' ? 'Summary Results:' : 'ผลสรุปเนื้อหา:'}</p>
                  <textarea
                    name="summaryContent"
                    value={formData.summaryContent}
                    onChange={handleChange}
                    rows={6}
                    className="textarea-purple"
                    style={{ border: 'none', background: 'transparent', padding: 0 }}
                  />
                </div>
              </div>

              <div className="form-actions-purple">
                <button type="button" className="btn-cancel-purple" onClick={() => navigate('/admin')}>
                  {lang === 'en' ? 'Cancel' : 'ยกเลิก'}
                </button>
                <button type="submit" className="btn-save-purple" disabled={saving}>
                  <FaSave size={14} />
                  <span>{saving ? (lang === 'en' ? 'Saving...' : 'กำลังบันทึก...') : (lang === 'en' ? 'Save Changes' : 'บันทึกการแก้ไข')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}