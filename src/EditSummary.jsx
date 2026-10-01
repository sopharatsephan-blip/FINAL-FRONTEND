import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLanguage } from './LanguageContext';
import './admindashboard.css';
import './EditSummary.css';

import { 
  FaHome, FaVideo, FaEdit, FaGlobe, FaUsers, FaSignOutAlt, 
  FaAsterisk, FaSave, FaArrowLeft, FaShareAlt, FaCheck
} from 'react-icons/fa';

const API_BASE = 'http://localhost:5000/api'; // เปลี่ยนเป็น base URL จริงของ backend คุณ

const getSummaryName = (summaryContent = '') => {
  const lines = summaryContent.split(/\r?\n/).map(line => line.trim());
  const topicHeadings = ['ชื่อหน่วยงานและสถานประกอบการ', 'ตำแหน่งและลักษณะงานที่ทำ'];
  const answers = [1, 2].map(number => {
    const lineIndex = lines.findIndex(line => new RegExp(`^${number}\\.\\s*`).test(line));
    if (lineIndex === -1) return '';

    const answer = lines[lineIndex].replace(new RegExp(`^${number}\\.\\s*`), '').trim();
    const normalizedAnswer = answer.replace(/[:：]$/, '').trim();
    if (answer && !topicHeadings.includes(normalizedAnswer)) return answer;

    for (let index = lineIndex + 1; index < lines.length; index += 1) {
      if (!lines[index]) continue;
      if (/^\d+\.\s*/.test(lines[index])) break;
      return lines[index];
    }
    return '';
  });

  return answers.filter(Boolean).join(' - ');
};

const requestFieldSuggestions = async (id, lang, setSuggestionStatus, setFormData) => {
  setSuggestionStatus(lang === 'en' ? 'Typhoon is suggesting dropdown values...' : 'Typhoon กำลังแนะนำค่าใน Dropdown...');
  try {
    const res = await fetch(`${API_BASE}/summaries/${id}/suggestions`, { method: 'POST' });
    if (!res.ok) throw new Error('ไม่สามารถขอคำแนะนำได้');
    const data = await res.json();
    const suggestions = data.suggestions || {};
    const hasSuggestions = Object.values(suggestions).some(Boolean);

    setFormData((prev) => ({
      ...prev,
      province: prev.province || suggestions.province || '',
      workStyle: prev.workStyle || suggestions.workStyle || '',
      position: prev.position || suggestions.position || '',
      businessType: prev.businessType || suggestions.businessType || '',
    }));
    setSuggestionStatus(
      hasSuggestions
        ? (lang === 'en' ? 'Typhoon suggested defaults. Review or change them before saving.' : 'Typhoon เติมคำแนะนำแล้ว ตรวจสอบหรือเปลี่ยนค่าได้ก่อนบันทึก')
        : (lang === 'en' ? 'No confident suggestions. Please select the dropdown values.' : 'Typhoon ยังแนะนำค่าไม่ได้ โปรดเลือกข้อมูลใน Dropdown เอง')
    );
  } catch (err) {
    console.error('Field suggestions error:', err);
    setSuggestionStatus(lang === 'en' ? 'Suggestions are unavailable. You can select the values manually.' : 'ขอคำแนะนำไม่สำเร็จ สามารถเลือกข้อมูลเองได้');
  }
};

export default function EditSummary() {
  const navigate = useNavigate();
  const { videoId } = useParams(); // route: /edit-summary-detail/:videoId
  const { t, lang, toggleLanguage } = useLanguage();
  const [currentUser, setCurrentUser] = useState(null);

  const [summaryId, setSummaryId] = useState(null); // เก็บ SummaryID ไว้ใช้ตอนกด Save

  const [formData, setFormData] = useState({
    company: '',
    province: '',
    workStyle: '',
    position: '',
    businessType: '',
    summaryContent: ''
  });

  // ✅ ตัวเลือก Category / Province / Work Style / Position / Business Type ดึงจาก DB จริง เหมือนหน้า Dashboard
  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    locations: [],
    workTypes: [],
    positions: [],
    businessTypes: [],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [suggestionStatus, setSuggestionStatus] = useState('');
  const [error, setError] = useState(null);
  const [shareError, setShareError] = useState(''); // ✅ ข้อความแจ้งเตือนตอนยังกรอก dropdown ไม่ครบก่อนกด Share
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
          positions: data.positions || [],
          businessTypes: data.businessTypes || [],
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
          company: getSummaryName(data.summaryContent),
          province: data.province,
          workStyle: data.workStyle,
          position: data.position,
          businessType: data.businessType,
          summaryContent: data.summaryContent,
        });
        if ([data.province, data.workStyle, data.position, data.businessType].some((value) => !value)) {
          void requestFieldSuggestions(data.summaryId, lang, setSuggestionStatus, setFormData);
        }
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
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (shareError) setShareError(''); // เคลียร์ข้อความเตือนทันทีที่ผู้ใช้เริ่มแก้ไข
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
          company: formData.company,
          province: formData.province,
          workStyle: formData.workStyle,
          businessType: formData.businessType,
          position: formData.position,
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

  // ✅ ปุ่ม Share -> ต้องกรอก dropdown ให้ครบก่อน แล้วค่อยบันทึก Position ลงฐานข้อมูล แล้วไปยังหน้า Public Summary
  const handleShare = async () => {
    if (!formData.province || !formData.workStyle || !formData.position || !formData.businessType) {
      setShareError(
        lang === 'en'
          ? 'Please select all dropdown fields (Province, Work Style, Position, Business Type) before continuing.'
          : 'กรุณาเลือกข้อมูลให้ครบทุกช่อง Dropdown (จังหวัด, รูปแบบการทำงาน, ตำแหน่งงาน, ประเภทธุรกิจ) ก่อนไปต่อ'
      );
      return;
    }
    setShareError('');

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
            <FaAsterisk className="logo-icon" style={{ color: '#7c3aed', marginRight: '8px' }} />
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
              style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#7c3aed', padding: '8px', borderRadius: '8px', display: 'flex' }}
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

        {loading && (
          <div className="purple-card" style={{ color: '#6b7280', padding: '24px', marginTop: '8px' }}>
            {lang === 'en' ? 'Loading...' : 'กำลังโหลดข้อมูล...'}
          </div>
        )}

        {!loading && error && (
          <div className="purple-card" style={{ color: '#f87171', padding: '24px', marginTop: '8px' }}>
            {error}
          </div>
        )}

        {!loading && !error && (
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

              {shareError && (
                <div className="share-error-banner">{shareError}</div>
              )}

              <form className="edit-form-purple" onSubmit={handleSave}>
                {suggestionStatus && (
                  <p className="ai-suggestion-status" role="status" aria-live="polite">
                    {suggestionStatus}
                  </p>
                )}
                <div className="form-group-purple">
                  <label>{lang === 'en' ? 'Name Summary' : 'ชื่อสรุป'} <span className="req-star">*</span></label>
                  <input type="text" name="company" value={formData.company} onChange={handleChange} maxLength={100} className="input-purple" />
                </div>

                <div className="form-row-purple">
                  <div className="form-group-purple">
                    <label>{lang === 'en' ? 'Province' : 'จังหวัด'} <span className="req-star">*</span></label>
                    <select
                      name="province"
                      value={formData.province}
                      onChange={handleChange}
                      className={`select-purple${shareError && !formData.province ? ' field-error' : ''}`}
                    >
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
                    <select
                      name="workStyle"
                      value={formData.workStyle}
                      onChange={handleChange}
                      className={`select-purple${shareError && !formData.workStyle ? ' field-error' : ''}`}
                    >
                      <option value="">{lang === 'en' ? 'Select work style' : 'เลือกรูปแบบการทำงาน'}</option>
                      {filterOptions.workTypes.map((wt) => (
                        <option key={wt} value={wt}>{wt}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group-purple">
                    <label>{lang === 'en' ? 'Position' : 'ตำแหน่งงาน'} <span className="req-star">*</span></label>
                    <select
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      className={`select-purple${shareError && !formData.position ? ' field-error' : ''}`}
                    >
                      <option value="">{lang === 'en' ? 'Select position' : 'เลือกตำแหน่งงาน'}</option>
                      {filterOptions.positions.map((pos) => (
                        <option key={pos} value={pos}>{pos}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row-purple">
                  <div className="form-group-purple">
                    <label>{lang === 'en' ? 'Business Type' : 'ประเภทธุรกิจ'} <span className="req-star">*</span></label>
                    <select
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleChange}
                      className={`select-purple${shareError && !formData.businessType ? ' field-error' : ''}`}
                    >
                      <option value="">{lang === 'en' ? 'Select business type' : 'เลือกประเภทธุรกิจ'}</option>
                      {filterOptions.businessTypes.map((bt) => (
                        <option key={bt} value={bt}>{bt}</option>
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
        )}
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