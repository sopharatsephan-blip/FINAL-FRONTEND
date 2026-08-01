import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from './LanguageContext';
import './admindashboard.css';

import {
  FaHome,
  FaVideo,
  FaEdit,
  FaGlobe,
  FaUsers,
  FaSignOutAlt,
  FaSearch,
  FaAsterisk,
  FaLanguage
} from 'react-icons/fa';

// ✅ helper: แปลง Duration "15:30" → "15:30 mins"
function formatDuration(duration) {
  if (!duration) return '-';
  return `${duration} mins`;
}

// ✅ helper: แปลงวันที่เป็น "30 January 2026" หรือ "30 มกราคม 2026"
function formatDate(dateStr, lang) {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString(lang === 'th' ? 'th-TH' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// ✅ helper: map Position → badge label
function getCategoryBadge(position) {
  if (!position) return 'Developer';
  const p = position.toLowerCase();
  if (p.includes('ux') || p.includes('ui')) return 'UX/UI';
  if (p.includes('data') || p.includes('ai')) return 'Data/AI';
  if (p.includes('network')) return 'Network';
  if (p.includes('graphic')) return 'Graphic';
  return 'Developer';
}

function AdminDashboard() {
  const navigate = useNavigate();
  const { t, lang, toggleLanguage } = useLanguage();
  const [currentUser, setCurrentUser] = useState(null);

  const [hasSearched, setHasSearched] = useState(false);
  const resultRef = useRef(null);

  const initialCategory = 'UX/UI';
  const initialWorkTypes = { onsite: true, hybrid: true, wfh: false };

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [workTypes, setWorkTypes] = useState(initialWorkTypes);
  const [businessType, setBusinessType] = useState('Software House');
  const [location, setLocation] = useState('');
  const [keyword, setKeyword] = useState('');

  // ✅ State สำหรับข้อมูลจริงจาก API
  const [popularVideo, setPopularVideo] = useState(null);
  const [weeklySummaries, setWeeklySummaries] = useState([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  // 🔒 เช็กล็อกอิน
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      navigate('/login');
    } else {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, [navigate]);

  // ✅ ดึงข้อมูล Dashboard จาก API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setDashboardLoading(true);
        const [popularRes, weeklyRes] = await Promise.all([
          fetch('http://localhost:5000/api/dashboard/popular-video'),
          fetch('http://localhost:5000/api/dashboard/weekly-summaries'),
        ]);
        const popularData = await popularRes.json();
        const weeklyData = await weeklyRes.json();
        setPopularVideo(popularData.data || null);
        setWeeklySummaries(weeklyData.data || []);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setDashboardLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const [videoResults, setVideoResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const workTypeList = [];
      if (workTypes.onsite) workTypeList.push('Onsite');
      if (workTypes.hybrid) workTypeList.push('Hybrid');
      if (workTypes.wfh) workTypeList.push('Work from Home');

      const params = new URLSearchParams({
        category: selectedCategory,
        businessType,
        location,
        workType: workTypeList.join(','),
        keyword,
      });

      const res = await fetch(`http://localhost:5000/api/videos/search?${params}`);
      const data = await res.json();
      setVideoResults(data);
      setHasSearched(true);

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleCheckboxChange = (e) => {
    setWorkTypes({ ...workTypes, [e.target.name]: e.target.checked });
  };

  const handleResetFilter = () => {
    setSelectedCategory(initialCategory);
    setWorkTypes(initialWorkTypes);
    setBusinessType('');
    setLocation('');
    setKeyword('');
    setHasSearched(false);
  };

  return (
    <div className="admin-purple-container">
      {/* ===== Sidebar ===== */}
      <aside className="sidebar-purple">
        <div>
          <div className="brand-logo-purple" onClick={() => navigate('/admin')} style={{ cursor: 'pointer' }}>
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
            <button className="menu-item-purple active" onClick={() => navigate('/admin')}>
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
            <button className="menu-item-purple" onClick={() => navigate('/users')}>
              <FaUsers />
              <span>{t.userManagement || 'User Management'}</span>
            </button>
          </nav>
        </div>

        <div className="sidebar-footer-purple">
          <button
            type="button"
            className="menu-item-purple"
            onClick={toggleLanguage}
            style={{ marginBottom: '10px', background: 'rgba(139, 92, 246, 0.2)', color: '#c084fc' }}
          >
            <FaLanguage size={18} />
            <span>{lang ? lang.toUpperCase() : 'EN'}</span>
          </button>
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
            <div className="header-icon-box" style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#c084fc', padding: '8px', borderRadius: '8px', display: 'flex' }}>
              <FaHome size={18} />
            </div>
            <div>
              <h2 className="main-title-text" style={{ margin: 0 }}>{t.dashboard || 'Dashboard'}</h2>
              <p className="subtitle-purple" style={{ margin: 0 }}>
                {t.weeklySummarySub || 'Weekly summary data - March 2026'}
              </p>
            </div>
          </div>
          <div className="search-box-purple">
            <FaSearch style={{ color: '#9ca3af', fontSize: '14px' }} />
            <input type="text" placeholder={t.searchPlaceholder || 'Search summary, position...'} />
          </div>
        </header>

        {/* ✅ แถวที่ 1: Popular Video + Weekly Summaries (ข้อมูลจริง) */}
        <div className="grid-row-2">

          {/* Popular Video Rank */}
          <div className="purple-card">
            <h3 className="card-title-purple text-green">
              🟢 {t.popularVideoTitle || 'Popular Video Rank'}
            </h3>
            {dashboardLoading ? (
              <div style={{ color: '#94a3b8', fontSize: '14px' }}>กำลังโหลด...</div>
            ) : popularVideo ? (
              <div className="hero-banner-purple">
                <span className="top-badge">👑 {t.rankBadge || 'Rank 1 This Week'}</span>
                <div className="hero-details">
                  <h4>{popularVideo.VideoTitle}</h4>
                  <p>{popularVideo.CompanyName} · {popularVideo.Position}</p>
                  <div className="stats-purple">
                    <span>👁️ {popularVideo.ViewCount} {t.viewsCount || 'views'}</span>
                    <span>⏱️ {formatDuration(popularVideo.Duration)}</span>
                  </div>
                </div>
                <div className="chart-icon">📈</div>
              </div>
            ) : null}
          </div>

          {/* Weekly Video Summaries */}
          <div className="purple-card">
            <h3 className="card-title-purple text-purple">
              🔹 {t.weeklySummaryListTitle || 'Weekly Video Summaries'}
            </h3>
            {dashboardLoading ? (
              <div style={{ color: '#94a3b8', fontSize: '14px' }}>กำลังโหลด...</div>
            ) : (
              <ul className="weekly-list-purple">
                {weeklySummaries.map((video) => (
                  <li key={video.VideoID}>
                    <div>
                      <strong>{video.VideoTitle}</strong>
                      <p>
                        {formatDate(video.UploadDate, lang)} · {formatDuration(video.Duration)} · {video.ViewCount} views
                      </p>
                    </div>
                    <span className="purple-badge">{getCategoryBadge(video.Position)}</span>
                  </li>
                ))}

              </ul>
            )}
          </div>
        </div>

        {/* ===== ตัวกรองข้อมูล (ไม่เปลี่ยนแปลง) ===== */}
        <div className="purple-card filter-section-purple">
          <div className="result-header-purple" style={{ marginBottom: '15px' }}>
            <h3 className="card-title-purple" style={{ margin: 0 }}>
              ⚙️ {t.filterTitle || 'Data Filters'}
            </h3>
            <button type="button" className="reset-btn-purple" onClick={handleResetFilter}>
              🔄 {t.resetFilter || 'Reset Filters'}
            </button>
          </div>

          <div className="filter-grid-purple">
            <div className="filter-col">
              <label>{t.jobCategory || 'Category'}</label>
              <div className="tag-group-purple">
                {[
                  { id: 'ทั้งหมด', label: t.all || 'All' },
                  { id: 'Developer', label: 'Developer' },
                  { id: 'UX/UI', label: 'UX/UI' },
                  { id: 'Data/AI', label: 'Data/AI' },
                  { id: 'Network', label: 'Network' },
                  { id: 'Graphic', label: 'Graphic' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`tag-btn-purple ${selectedCategory === cat.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="form-group-purple">
                <label>{t.businessType || 'Business Type'}</label>
                <select className="dark-purple-input" value={businessType} onChange={(e) => setBusinessType(e.target.value)}>
                  <option value="">{lang === 'en' ? 'All' : 'ทั้งหมด'}</option>
                  <option value="Software House">Software House</option>
                  <option value="E-Commerce">E-Commerce</option>
                  <option value="Banking & Finance">Banking & Finance</option>
                </select>
              </div>

              <div className="form-group-purple">
                <label>{lang === 'en' ? 'Location' : 'สถานที่ปฏิบัติงาน'}</label>
                <select className="dark-purple-input" value={location} onChange={(e) => setLocation(e.target.value)}>
                  <option value="">{lang === 'en' ? 'All' : 'ทั้งหมด'}</option>
                  <option value="กรุงเทพมหานคร">{lang === 'en' ? 'Bangkok' : 'กรุงเทพมหานคร'}</option>
                  <option value="นนทบุรี">{lang === 'en' ? 'Nonthaburi' : 'นนทบุรี'}</option>
                  <option value="ปทุมธานี">{lang === 'en' ? 'Pathum Thani' : 'ปทุมธานี'}</option>
                </select>
              </div>
            </div>

            <div className="filter-col">
              <label>{t.workStyle || 'Work Style'}</label>
              <div className="checkbox-group-purple">
                <label><input type="checkbox" name="onsite" checked={workTypes.onsite} onChange={handleCheckboxChange} /> Onsite</label>
                <label><input type="checkbox" name="hybrid" checked={workTypes.hybrid} onChange={handleCheckboxChange} /> Hybrid Work</label>
                <label><input type="checkbox" name="wfh" checked={workTypes.wfh} onChange={handleCheckboxChange} /> Work from Home</label>
              </div>

              <div className="form-group-purple">
                <label>{lang === 'en' ? 'Detailed Search' : 'ค้นหาอย่างรายละเอียด'}</label>
                <input
                  type="text"
                  className="dark-purple-input"
                  placeholder={lang === 'en' ? 'Type keyword or student name...' : 'พิมพ์คีย์เวิร์ด หรือชื่อนักศึกษา...'}
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>

              <button type="button" className="btn-search-purple" onClick={handleSearch}>
                {lang === 'en' ? 'Search Data' : 'ค้นหาข้อมูล'}
              </button>
            </div>
          </div>
        </div>

        {hasSearched && (
          <div ref={resultRef} className="purple-card result-section-purple" style={{ marginTop: '25px' }}>
            <div className="result-header-purple">
              <h3 className="card-title-purple">
                ⚙️ {lang === 'en'
                  ? `Filter found ${videoResults.length} positions`
                  : `ตัวกรองพบ ${videoResults.length} ตำแหน่งงาน`}
              </h3>
            </div>
            <div className="cards-grid-purple">
              {isLoading && <p>{lang === 'en' ? 'Loading...' : 'กำลังโหลด...'}</p>}
              {!isLoading && videoResults.length === 0 && (
                <p>{lang === 'en' ? 'No results found.' : 'ไม่พบข้อมูลที่ตรงกับตัวกรอง'}</p>
              )}
              {videoResults.map((item) => (
                <div className="job-card-purple" key={item.VideoID}>
                  <div className="card-banner-purple">
                    <span>{item.UploadDate ? new Date(item.UploadDate).getFullYear() : '2026'}</span>
                    <h4>INTERNSHIP</h4>
                    <p>{item.CategoryName || '-'}</p>
                  </div>
                  <div className="card-body-purple">
                    <h5>{`${item.Position || item.VideoTitle} | ${item.CompanyName || '-'}`}</h5>
                    <p className="url-text-purple">
                      👁️ {item.ViewCount} views · {item.WorkType}
                    </p>
                    <button
                      type="button"
                      className="click-here-purple"
                      onClick={() => navigate(`/video/${item.VideoID}`)}
                    >
                      CLICK HERE 👆
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;