import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from "../LanguageContext";
import './StudentDashboard.css';

import {
  FaHome,
  FaFileAlt,
  FaHeart,
  FaSignOutAlt,
  FaSearch,
  FaUserGraduate,
  FaSlidersH,
  FaArrowUp,
  FaLanguage
} from 'react-icons/fa';

function StudentDashboard() {
  const navigate = useNavigate();
  const { t, lang, toggleLanguage } = useLanguage();
  const [currentUser, setCurrentUser] = useState(null);

  const [hasSearched, setHasSearched] = useState(false);
  const resultRef = useRef(null);

  const initialCategory = 'UX/UI';
  const initialWorkTypes = { onsite: true, hybrid: true, wfh: false };

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [workTypes, setWorkTypes] = useState(initialWorkTypes);
  const [businessType, setBusinessType] = useState('');
  const [location, setLocation] = useState('');
  const [keyword, setKeyword] = useState('');

  const [videoResults, setVideoResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // ===== ช่องค้นหาด้านบน (Header Search) — ค้นหาแบบรวดเร็วโดยไม่ผูกกับ Data Filters =====
  const [headerSearchQuery, setHeaderSearchQuery] = useState('');

  // ===== ข้อมูลจริงสำหรับ "Popular Video Rank" และ "Weekly Video Summaries" =====
  const [popularVideo, setPopularVideo] = useState(null);
  const [weeklyVideos, setWeeklyVideos] = useState([]);
  const [isDashboardLoading, setIsDashboardLoading] = useState(true);

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

  // ดึงข้อมูลจริงจากฐานข้อมูลมาแสดงในการ์ด "ยอดฮิต" และ "สรุปประจำสัปดาห์"
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsDashboardLoading(true);
      try {
        const [topRes, weeklyRes] = await Promise.all([
          fetch('http://localhost:5000/api/videos/top'),
          fetch('http://localhost:5000/api/videos/weekly?limit=3')
        ]);
        const topData = await topRes.json();
        const weeklyData = await weeklyRes.json();

        setPopularVideo(topData || null);
        setWeeklyVideos(Array.isArray(weeklyData) ? weeklyData : []);
      } catch (err) {
        console.error('Dashboard data fetch error:', err);
      } finally {
        setIsDashboardLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // แปลง Duration รูปแบบ "mm:ss" จาก DB ให้อยู่ในรูปแบบข้อความอ่านง่าย
  const formatDuration = (duration) => {
    if (!duration) return '-';
    return duration;
  };

  // แปลงวันที่ให้ตรงกับภาษาที่เลือก (EN / TH)
  const formatUploadDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '-';

    if (lang === 'en') {
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    }
    const thaiMonths = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    return `วันที่ ${d.getDate()} เดือน${thaiMonths[d.getMonth()]} ${d.getFullYear() + 543}`;
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
        keyword
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

  // ค้นหาแบบรวดเร็วจากช่องค้นหาด้านบน (ไม่ผูกกับตัวกรองด้านล่าง ใช้ keyword อย่างเดียว)
  const handleHeaderSearch = async () => {
    if (!headerSearchQuery.trim()) return;
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ keyword: headerSearchQuery.trim() });
      const res = await fetch(`http://localhost:5000/api/videos/search?${params}`);
      const data = await res.json();
      setVideoResults(data);
      setHasSearched(true);

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error('Header search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHeaderSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleHeaderSearch();
    }
  };

  return (
    <div className="admin-purple-container">
      {/* ===== Sidebar ===== */}
      <aside className="sidebar-purple">
        <div>
          <div className="brand-logo-purple" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
            <div className="avatar-student" style={{ marginRight: '10px' }}>ICT</div>
            <span>ICT Cooperative</span>
          </div>

          <div className="user-profile-student">
            <div className="avatar-student">
              <FaUserGraduate />
            </div>
            <div className="user-info-student">
              <h4>{lang === 'en' ? 'Student & Advisor' : 'นักศึกษาและอาจารย์'}</h4>
              <span className="role-tag-student">{currentUser?.username || 'User Panel'}</span>
            </div>
          </div>

          <p style={{ color: '#8b8ba0', fontSize: '12px', marginBottom: '8px', paddingLeft: '4px' }}>
            {lang === 'en' ? 'Main Menu' : 'เมนูหลัก'}
          </p>

          <nav className="menu-list-purple">
            <button className="menu-item-purple active" onClick={() => navigate('/dashboard')}>
              <FaHome />
              <span>{lang === 'en' ? 'Dashboard' : 'แดชบอร์ด'}</span>
            </button>

            <button className="menu-item-purple" onClick={() => navigate('/coop-content')}>
              <FaFileAlt />
              <span>{lang === 'en' ? 'Co-op Content' : 'เนื้อหาสหกิจศึกษา'}</span>
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
        <header className="top-header-purple" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="header-title" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="avatar-purple" style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#c4b5fd', border: '1px solid rgba(139, 92, 246, 0.4)' }}>
              <FaHome />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '18px', color: '#fff' }}>
                {lang === 'en' ? 'Dashboard' : 'แดชบอร์ด'}
              </h2>
              <p className="subtitle-purple">
                {lang === 'en' ? 'Weekly Summary Data - March 2026' : 'ข้อมูลสรุปประจำสัปดาห์ - มีนาคม 2569'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="search-box-purple">
              <FaSearch
                style={{ color: '#8b8ba0', cursor: 'pointer' }}
                onClick={handleHeaderSearch}
              />
              <input
                type="text"
                placeholder={lang === 'en' ? 'Search summary, position...' : 'ค้นหาสรุป, ตำแหน่งงาน...'}
                value={headerSearchQuery}
                onChange={(e) => setHeaderSearchQuery(e.target.value)}
                onKeyDown={handleHeaderSearchKeyDown}
              />
            </div>

            {/* ปุ่มสลับภาษาด้านขวาบน */}
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

        {/* แถวที่ 1: ยอดฮิต + สรุปประจำสัปดาห์ */}
        <div className="grid-row-2">
          <div className="purple-card">
            <h3 className="card-title-purple" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%', display: 'inline-block' }}></span> 
              {lang === 'en' ? 'Popular Video Rank' : 'อันดับวิดีโอยอดฮิต'}
            </h3>
            {isDashboardLoading && (
              <p style={{ color: '#c4b5fd' }}>{lang === 'en' ? 'Loading...' : 'กำลังโหลด...'}</p>
            )}

            {!isDashboardLoading && !popularVideo && (
              <p style={{ color: '#8b8ba0' }}>
                {lang === 'en' ? 'No video data yet.' : 'ยังไม่มีข้อมูลวิดีโอ'}
              </p>
            )}

            {!isDashboardLoading && popularVideo && (
              <div className="hero-banner-purple">
                <span className="top-badge">
                  {lang === 'en' ? '👑 Rank 1 This Week' : '👑 อันดับ 1 สัปดาห์นี้'}
                </span>
                <div className="hero-details">
                  <h4>
                    {`${lang === 'en' ? 'Position' : 'ตำแหน่ง'} ${popularVideo.Position || popularVideo.VideoTitle} | ${popularVideo.CompanyName || '-'}`}
                  </h4>
                  <p>{[popularVideo.CategoryName, popularVideo.WorkType].filter(Boolean).join(' · ')}</p>
                  <div className="stats-purple">
                    <span>👁️ {popularVideo.ViewCount ?? 0} {lang === 'en' ? 'views' : 'คน'}</span>
                    <span>⏱️ {formatDuration(popularVideo.Duration)} {lang === 'en' ? 'mins' : 'นาที'}</span>
                  </div>
                </div>
                <div className="chart-icon">
                  <FaArrowUp />
                </div>
              </div>
            )}
          </div>

          <div className="purple-card">
            <h3 className="card-title-purple" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '8px', height: '8px', background: '#3b82f6', borderRadius: '50%', display: 'inline-block' }}></span> 
              {lang === 'en' ? 'Weekly Video Summaries' : 'สรุปวิดีโอประจำสัปดาห์'}
            </h3>
            {isDashboardLoading && (
              <p style={{ color: '#c4b5fd' }}>{lang === 'en' ? 'Loading...' : 'กำลังโหลด...'}</p>
            )}

            {!isDashboardLoading && weeklyVideos.length === 0 && (
              <p style={{ color: '#8b8ba0' }}>
                {lang === 'en' ? 'No videos this week.' : 'ยังไม่มีวิดีโอในสัปดาห์นี้'}
              </p>
            )}

            {!isDashboardLoading && weeklyVideos.length > 0 && (
              <ul className="weekly-list-purple">
                {weeklyVideos.map((item) => (
                  <li key={item.VideoID}>
                    <div>
                      <strong>
                        {`${lang === 'en' ? 'Position' : 'ตำแหน่ง'} ${item.Position || item.VideoTitle} | ${item.CompanyName || '-'}`}
                      </strong>
                      <p>
                        {lang === 'en'
                          ? `${formatUploadDate(item.UploadDate)} · ${formatDuration(item.Duration)} mins · ${item.ViewCount ?? 0} views`
                          : `${formatUploadDate(item.UploadDate)} · ${formatDuration(item.Duration)} นาที · ผู้ชม ${item.ViewCount ?? 0} คน`}
                      </p>
                    </div>
                    <span className="purple-badge">{item.CategoryName || '-'}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* แถวที่ 2: ตัวกรอง */}
        <div className="purple-card filter-section-purple">
          <div className="result-header-purple">
            <h3 className="card-title-purple" style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <FaSlidersH style={{ color: '#3b82f6' }} /> {lang === 'en' ? 'Data Filters' : 'ตัวกรอง'}
            </h3>
            <button type="button" className="reset-btn-purple" onClick={handleResetFilter}>
              🔄 {lang === 'en' ? 'Reset Filters' : 'ล้างตัวกรอง'}
            </button>
          </div>

          <div className="filter-grid-purple">
            <div className="filter-col">
              <label>{lang === 'en' ? 'Category' : 'ประเภทงาน'}</label>
              <div className="tag-group-purple">
                {[
                  { id: 'ทั้งหมด', label: lang === 'en' ? 'All' : 'ทั้งหมด' },
                  { id: 'Developer', label: 'Developer' },
                  { id: 'UX/UI', label: 'UX/UI' },
                  { id: 'Data/AI', label: 'Data/AI' },
                  { id: 'Network', label: 'Network' },
                  { id: 'Graphic', label: 'Graphic' }
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
                <label>{lang === 'en' ? 'Business Type' : 'ประเภทธุรกิจ'}</label>
                <select
                  className="dark-purple-input"
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                >
                  <option value="">{lang === 'en' ? 'All' : 'ทั้งหมด'}</option>
                  <option value="Software & IT Services">Software & IT Services</option>
                  <option value="E-Commerce">E-Commerce</option>
                  <option value="Banking & Finance">Banking & Finance</option>
                </select>
              </div>

              <div className="form-group-purple">
                <label>{lang === 'en' ? 'Location' : 'สถานที่ปฏิบัติงาน'}</label>
                <select
                  className="dark-purple-input"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <option value="">{lang === 'en' ? 'All' : 'ทั้งหมด'}</option>
                  <option value="Bangkok">Bangkok</option>
                  <option value="Nonthaburi">Nonthaburi</option>
                  <option value="Chiang Mai">Chiang Mai</option>
                </select>
              </div>
            </div>

            <div className="filter-col">
              <label>{lang === 'en' ? 'Work Style' : 'รูปแบบการทำงาน'}</label>
              <div className="checkbox-group-purple">
                <label>
                  <input type="checkbox" name="onsite" checked={workTypes.onsite} onChange={handleCheckboxChange} />
                  Onsite
                </label>
                <label>
                  <input type="checkbox" name="hybrid" checked={workTypes.hybrid} onChange={handleCheckboxChange} />
                  Hybrid Work
                </label>
                <label>
                  <input type="checkbox" name="wfh" checked={workTypes.wfh} onChange={handleCheckboxChange} />
                  Work from Home
                </label>
              </div>

              <div className="form-group-purple">
                <label>{lang === 'en' ? 'Detailed Search' : 'ค้นหาอย่างละเอียด'}</label>
                <textarea
                  className="dark-purple-input"
                  style={{ minHeight: '80px', resize: 'vertical' }}
                  placeholder={lang === 'en' ? 'Type keyword or student name...' : 'พิมพ์คีย์เวิร์ด หรือชื่อนักศึกษา...'}
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>

              <button type="button" className="btn-search-purple" onClick={handleSearch}>
                {lang === 'en' ? 'Search Data' : 'ค้นหา'}
              </button>
            </div>
          </div>
        </div>

        {/* แถวที่ 3: ผลลัพธ์การค้นหา */}
        {hasSearched && (
          <div ref={resultRef} className="purple-card" style={{ marginBottom: '20px' }}>
            <div className="result-header-purple" style={{ marginBottom: '16px' }}>
              <h3 className="card-title-purple" style={{ margin: 0 }}>
                ⚙️ {lang === 'en' ? `Filter found ${videoResults.length} positions` : `ตัวกรองพบ ${videoResults.length} ตำแหน่งงาน`}
              </h3>
            </div>

            <div className="cards-grid-purple">
              {isLoading && <p style={{ color: '#c4b5fd' }}>{lang === 'en' ? 'Loading...' : 'กำลังโหลด...'}</p>}
              {!isLoading && videoResults.length === 0 && (
                <p style={{ color: '#8b8ba0' }}>{lang === 'en' ? 'No results found.' : 'ไม่พบข้อมูลที่ตรงกับตัวกรอง'}</p>
              )}
              {videoResults.map((item) => (
                <div className="job-card-purple" key={item.VideoID}>
                  <div className="card-banner-purple">
                    <span>{item.UploadDate ? new Date(item.UploadDate).getFullYear() : '2026'}</span>
                    <h4>{lang === 'en' ? 'INTERNSHIP' : 'สหกิจศึกษา'}</h4>
                    <p>{item.CategoryName || '-'}</p>
                  </div>
                  <div className="card-body-purple">
                    <h5>{`${item.Position || item.VideoTitle} | ${item.CompanyName || '-'}`}</h5>
                    <p className="url-text-purple">
                      👁️ {item.ViewCount} {lang === 'en' ? 'views' : 'คน'} · {item.WorkType}
                    </p>
                    <button
                      type="button"
                      className="click-here-purple"
                      onClick={() => navigate(`/video/${item.VideoID}`)}
                    >
                      {lang === 'en' ? 'CLICK HERE 👆' : 'ดูรายละเอียด 👆'}
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

export default StudentDashboard;