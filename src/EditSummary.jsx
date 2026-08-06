import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLanguage } from './LanguageContext';
import './EditSummary.css';

import { 
  FaHome, FaVideo, FaEdit, FaGlobe, FaUsers, FaSignOutAlt, 
  FaAsterisk, FaSave, FaArrowLeft, FaShareAlt, FaCheck
} from 'react-icons/fa';

const API_BASE = 'http://localhost:5000/api'; // เปลี่ยนเป็น base URL จริงของ backend คุณ

// ✅ ตัวเลือกตำแหน่งงานยอดฮิตสำหรับนักศึกษาจบใหม่ (fix ไว้ที่ frontend ไม่ได้ดึงจาก DB)
const POSITION_OPTIONS = [
  'Software Developer',
  'Web Developer',
  'Mobile Developer',
  'UX/UI Designer',
  'Data Analyst',
  'QA / Software Tester',
  'System Analyst',
];

export default function EditSummary() {
  const navigate = useNavigate();
  const { videoId } = useParams(); // route: /edit-summary-detail/:videoId
  const { t, lang, toggleLanguage } = useLanguage();
  const [currentUser, setCurrentUser] = useState(null);

  const [summaryId, setSummaryId] = useState(null); // เก็บ SummaryID ไว้ใช้ตอนกด Save

  const [formData, setFormData] = useState({
    company: '',
    category: '',
    province: '',
    workStyle: '',
    position: '',
    summaryContent: ''
  });

  // ✅ ตัวเลือก Category / Province / Work Style ดึงจาก DB จริง เหมือนหน้า Dashboard (Position ใช้ POSITION_OPTIONS คงที่)
  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    locations: [],
    workTypes: [],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // ✅ ป๊อปอัปแจ้งบันทึกสำเร็จ

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  // ✅ ดึงตัวเลือก Category / Work Style จาก DB จริง (ตัวเลือกชุดเดียวกับหน้า Dashboard)
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const res = await fetch(`${API_BASE}/videos/filters`);
        const data = await res.json();
        setFilterOptions({
          categories: data.categories || [],
          locations: data.locations || [],
          workTypes: data.workTypes || [],
        });
      } catch (err) {
        console.error('Filter options fetch error:', err);
      }
    };
    fetchFilterOptions();
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
          company: data.company,
          category: data.category,
          province: data.province,
          workStyle: data.workStyle,
          position: data.position,
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
          category: formData.category,
          province: formData.province,
          workStyle: formData.workStyle,
          summaryContent: formData.summaryContent,
        }),
      });
      if (!res.ok) throw new Error('บันทึกไม่สำเร็จ');
      setShowSuccessModal(true); // ✅ แสดงป๊อปอัปแจ้งบันทึกสำเร็จ แทน alert()
    } catch (err) {
      console.error(err);
      alert(lang === 'en' ? 'Failed to save data' : 'บันทึกข้อมูลไม่สำเร็จ');
    } finally {
      setSaving(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  // ✅ ปุ่ม Share -> บันทึก Position ลงฐานข้อมูลก่อน แล้วค่อยไปยังหน้า Public Summary
  const handleShare = async () => {
    if (!summaryId) {
      navigate(`/publish-summary/${videoId}`, { state: { videoId, ...formData } });
      return;
    }
    setSharing(true);
    try {
      await fetch(`${API_BASE}/summaries/${summaryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ position: formData.position }),
      });
    } catch (err) {
      console.error('Failed to save position before share:', err);
    } finally {
      setSharing(false);
    }
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
                disabled={sharing}
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
                <span>{sharing ? (lang === 'en' ? 'Sharing...' : 'กำลังแชร์...') : (lang === 'en' ? 'Share' : 'แชร์')}</span>
              </button>
            </div>

            <form className="edit-form-purple" onSubmit={handleSave}>
              <div className="form-group-purple">
                <label>{lang === 'en' ? 'Company / Organization' : 'บริษัท/องค์กร'} <span className="req-star">*</span></label>
                <input type="text" name="company" value={formData.company} onChange={handleChange} className="input-purple" disabled />
              </div>

              <div className="form-row-purple">
                <div className="form-group-purple">
                  <label>{lang === 'en' ? 'Category' : 'หมวดหมู่'} <span className="req-star">*</span></label>
                  <select name="category" value={formData.category} onChange={handleChange} className="select-purple">
                    <option value="">{lang === 'en' ? 'Select category' : 'เลือกหมวดหมู่'}</option>
                    {filterOptions.categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group-purple">
                  <label>{lang === 'en' ? 'Province' : 'จังหวัด'} <span className="req-star">*</span></label>
                  <select name="province" value={formData.province} onChange={handleChange} className="select-purple">
                    <option value="">{lang === 'en' ? 'Select province' : 'เลือกจังหวัด'}</option>
                    {filterOptions.locations.map((loc) => (
                      <option key={loc.en} value={loc.en}>{lang === 'en' ? loc.en : loc.th}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row-purple">
                <div className="form-group-purple">
                  <label>{lang === 'en' ? 'Work Style' : 'รูปแบบการทำงาน'} <span className="req-star">*</span></label>
                  <select name="workStyle" value={formData.workStyle} onChange={handleChange} className="select-purple">
                    <option value="">{lang === 'en' ? 'Select work style' : 'เลือกรูปแบบการทำงาน'}</option>
                    {filterOptions.workTypes.map((wt) => (
                      <option key={wt} value={wt}>{wt}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group-purple">
                  <label>{lang === 'en' ? 'Position' : 'ตำแหน่งงาน'}</label>
                  <select name="position" value={formData.position} onChange={handleChange} className="select-purple">
                    <option value="">{lang === 'en' ? 'Select position' : 'เลือกตำแหน่งงาน'}</option>
                    {POSITION_OPTIONS.map((pos) => (
                      <option key={pos} value={pos}>{pos}</option>
                    ))}
                  </select>
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

      {/* ===== ป๊อปอัปแจ้งบันทึกสำเร็จ ===== */}
      {showSuccessModal && (
        <div className="save-success-overlay" onClick={handleCloseSuccessModal}>
          <div className="save-success-card" onClick={(e) => e.stopPropagation()}>
            <div className="save-success-icon-circle">
              <FaCheck size={22} />
            </div>
            <h3 className="save-success-title">
              {lang === 'en' ? 'Saved Successfully!' : 'บันทึกข้อมูลสำเร็จ!'}
            </h3>
            <p className="save-success-desc">
              {lang === 'en' ? 'Your summary data has been updated.' : 'ข้อมูลสรุปของคุณถูกอัปเดตเรียบร้อยแล้ว'}
            </p>
            <button className="save-success-btn" onClick={handleCloseSuccessModal}>
              {lang === 'en' ? 'OK' : 'ตกลง'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
//