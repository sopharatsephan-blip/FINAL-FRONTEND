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
              <FaSearch style={{ color: '#8b8ba0' }} />
              <input type="text" placeholder={lang === 'en' ? 'Search summary, position...' : 'ค้นหาสรุป, ตำแหน่งงาน...'} />
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
            <div className="hero-banner-purple">
              <span className="top-badge">
                {lang === 'en' ? '👑 Rank 1 This Week' : '👑 อันดับ 1 สัปดาห์นี้'}
              </span>
              <div className="hero-details">
                <h4>
                  {lang === 'en' 
                    ? 'Position UX/UI Design | INVERSE SOLUTIONS CO., LTD.' 
                    : 'ตำแหน่ง UX/UI Design | บริษัท อินเวิร์ซ โซลูชันส์ จำกัด'}
                </h4>
                <p>IO-HOPE ENTERPRISE · Developer</p>
                <div className="stats-purple">
                  <span>👁️ 312 {lang === 'en' ? 'views' : 'คน'}</span>
                  <span>⏱️ 5:03 {lang === 'en' ? 'mins' : 'นาที'}</span>
                </div>
              </div>
              <div className="chart-icon">
                <FaArrowUp />
              </div>
            </div>
          </div>

          <div className="purple-card">
            <h3 className="card-title-purple" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '8px', height: '8px', background: '#3b82f6', borderRadius: '50%', display: 'inline-block' }}></span> 
              {lang === 'en' ? 'Weekly Video Summaries' : 'สรุปวิดีโอประจำสัปดาห์'}
            </h3>
            <ul className="weekly-list-purple">
              <li>
                <div>
                  <strong>
                    {lang === 'en' 
                      ? 'Position UX/UI Design | INVERSE SOLUTIONS CO., LTD.' 
                      : 'ตำแหน่ง UX/UI Design | บริษัท อินเวิร์ซ โซลูชันส์ จำกัด'}
                  </strong>
                  <p>
                    {lang === 'en' 
                      ? '30 January 2026 · 5:30 mins · 18 views' 
                      : 'วันที่ 30 เดือนมกราคม 2569 · 5:30 นาที · ผู้ชม 18 คน'}
                  </p>
                </div>
                <span className="purple-badge">UX/UI</span>
              </li>
              <li>
                <div>
                  <strong>
                    {lang === 'en' 
                      ? 'Position Graphic | PRINT UP CO., LTD.' 
                      : 'ตำแหน่ง Graphic บริษัท PRINT UP'}
                  </strong>
                  <p>
                    {lang === 'en' 
                      ? '30 January 2026 · 5:08 mins · 6 views' 
                      : 'วันที่ 30 เดือนมกราคม 2569 · 5:08 นาที · ผู้ชม 6 คน'}
                  </p>
                </div>
                <span className="purple-badge">Graphic</span>
              </li>
              <li>
                <div>
                  <strong>
                    {lang === 'en' 
                      ? 'Position Web Developer | IO-HOPE ENTERPRISE' 
                      : 'ตำแหน่ง web Developer บริษัท IO-HOPE ENTERPRISE'}
                  </strong>
                  <p>
                    {lang === 'en' 
                      ? '30 January 2026 · 5:03 mins · 10 views' 
                      : 'วันที่ 30 เดือนมกราคม 2569 · 5:03 นาที · ผู้ชม 10 คน'}
                  </p>
                </div>
                <span className="purple-badge">Developer</span>
              </li>
            </ul>
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