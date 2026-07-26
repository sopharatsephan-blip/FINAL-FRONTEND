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
  FaGlobeAmericas
} from 'react-icons/fa';

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
  const [businessType, setBusinessType] = useState('Software & IT Services');
  const [location, setLocation] = useState('กรุงเทพมหานคร');
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      navigate('/login');
    } else {
      setCurrentUser(JSON.parse(savedUser));
    }
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
    setBusinessType('Software & IT Services');
    setLocation('กรุงเทพมหานคร');
    setKeyword('');
    setHasSearched(false);
  };

  const handleSearch = () => {
    setHasSearched(true);
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
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
          <button className="logout-btn-purple" onClick={handleLogout}>
            <FaSignOutAlt />
            <span>{t.logout || 'Logout'}</span>
          </button>
        </div>
      </aside>

      {/* ===== Main Content ===== */}
      <main className="main-content-purple">
        <header className="top-header-purple" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="header-title" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="header-icon-box" style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#c084fc', padding: '8px', borderRadius: '8px', display: 'flex' }}>
              <FaHome size={18} />
            </div>
            <div>
              <h2 style={{ margin: 0 }}>{t.dashboard || 'Dashboard'}</h2>
              <p className="subtitle-purple" style={{ margin: 0 }}>
                {t.weeklySummarySub || 'Weekly summary data - March 2026'}
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="search-box-purple">
              <FaSearch style={{ color: '#9ca3af', fontSize: '14px' }} />
              <input type="text" placeholder={t.searchPlaceholder || 'Search summary, position...'} />
            </div>

            {/* 🌐 ปุ่มสลับภาษาขนาดเล็กที่มุมขวาบน */}
            <button 
              type="button" 
              onClick={toggleLanguage}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '20px',
                border: '1px solid rgba(192, 132, 252, 0.4)',
                background: 'rgba(139, 92, 246, 0.15)',
                color: '#c084fc',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
            >
              <FaGlobeAmericas size={12} />
              <span>{lang ? lang.toUpperCase() : 'EN'}</span>
            </button>
          </div>
        </header>

        {/* Card Content & Filters ... */}
        <div className="grid-row-2">
          <div className="purple-card">
            <h3 className="card-title-purple text-green">
              🟢 {t.popularVideoTitle || 'Popular Video Rank'}
            </h3>
            <div className="hero-banner-purple">
              <span className="top-badge">👑 {t.rankBadge || 'Rank 1 This Week'}</span>
              <div className="hero-details">
                <h4>
                  {lang === 'en' 
                    ? 'Position UX/UI Design | INVERSE SOLUTIONS CO., LTD.' 
                    : 'ตำแหน่ง UX/UI Design | บริษัท อินเวิร์ส โซลูชันส์ จำกัด'}
                </h4>
                <p>IO-HOPE ENTERPRISE · Developer</p>
                <div className="stats-purple">
                  <span>👁️ 312 {t.viewsCount || 'views'}</span>
                  <span>⏱️ 5:03 {t.durationMinutes || 'mins'}</span>
                </div>
              </div>
              <div className="chart-icon">📈</div>
            </div>
          </div>

          <div className="purple-card">
            <h3 className="card-title-purple text-purple">
              🔹 {t.weeklySummaryListTitle || 'Weekly Video Summaries'}
            </h3>
            <ul className="weekly-list-purple">
              <li>
                <div>
                  <strong>
                    {lang === 'en' 
                      ? 'Position UX/UI Design | INVERSE SOLUTIONS CO., LTD.' 
                      : 'ตำแหน่ง UX/UI Design | บริษัท อินเวิร์ส โซลูชันส์ จำกัด'}
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

        {/* ตัวกรองข้อมูล */}
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
                <label>{t.businessType || 'Business Type'}</label>
                <select className="dark-purple-input" value={businessType} onChange={(e) => setBusinessType(e.target.value)}>
                  <option>Software & IT Services</option>
                  <option>E-Commerce</option>
                  <option>Banking & Finance</option>
                </select>
              </div>

              <div className="form-group-purple">
                <label>{lang === 'en' ? 'Location' : 'สถานที่ปฏิบัติงาน'}</label>
                <select className="dark-purple-input" value={location} onChange={(e) => setLocation(e.target.value)}>
                  <option>{lang === 'en' ? 'Bangkok' : 'กรุงเทพมหานคร'}</option>
                  <option>{lang === 'en' ? 'Nonthaburi' : 'นนทบุรี'}</option>
                  <option>{lang === 'en' ? 'Pathum Thani' : 'ปทุมธานี'}</option>
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
                ⚙️ {lang === 'en' ? 'Filter found 3 positions' : 'ตัวกรองพบ 3 ตำแหน่งงาน'}
              </h3>
            </div>

            <div className="cards-grid-purple">
              <div className="job-card-purple">
                <div className="card-banner-purple">
                  <span>2026</span>
                  <h4>INTERNSHIP</h4>
                  <p>UX/UI DESIGN</p>
                </div>
                <div className="card-body-purple">
                  <h5>
                    {lang === 'en' 
                      ? 'Position UX/UI Design | INVERSE SOLUTIONS CO., LTD.' 
                      : 'ตำแหน่ง UX/UI Design | บริษัท อินเวิร์ส โซลูชันส์ จำกัด'}
                  </h5>
                  <p className="url-text-purple">
                    URL: <a href="#url">{lang === 'en' ? 'UX/UI Design Position Link' : 'ตำแหน่ง UX/UI Design | บริษัท อินเวิร์ส โซลูชันส์ จำกัด'}</a>
                  </p>
                  <button type="button" className="click-here-purple">CLICK HERE 👆</button>
                </div>
              </div>

              <div className="job-card-purple">
                <div className="card-banner-purple">
                  <span>2026</span>
                  <h4>INTERNSHIP</h4>
                  <p>UX/UI DESIGN</p>
                </div>
                <div className="card-body-purple">
                  <h5>
                    {lang === 'en' 
                      ? 'Position UX/UI Design | Office of the President' 
                      : 'ตำแหน่ง UX UI Design สำนักงานอธิการบดี กองพัฒนานักศึกษา และศิษย์เก่าสัมพันธ์'}
                  </h5>
                  <p className="url-text-purple">
                    URL: <a href="#url">{lang === 'en' ? 'UX/UI Design Position Link' : 'ตำแหน่ง UX UI Design สำนักงานอธิการบดี กองพัฒนานักศึกษา และศิษย์เก่าสัมพันธ์'}</a>
                  </p>
                  <button type="button" className="click-here-purple">CLICK HERE 👆</button>
                </div>
              </div>

              <div className="job-card-purple">
                <div className="card-banner-purple">
                  <span>2026</span>
                  <h4>INTERNSHIP</h4>
                  <p>UX/UI DESIGN</p>
                </div>
                <div className="card-body-purple">
                  <h5>
                    {lang === 'en' 
                      ? 'Position UX/UI Design | Islamic Systems Corporation' 
                      : 'ตำแหน่ง Ux ui Design บริษัท อิสลามิค ชิสเต็มส์ คอร์ปอเรชั่น จำกัด'}
                  </h5>
                  <p className="url-text-purple">
                    URL: <a href="#url">{lang === 'en' ? 'UX/UI Design Position Link' : 'ตำแหน่ง Ux ui Design บริษัท อิสลามิค ชิสเต็มส์ คอร์ปอเรชั่น จำกัด'}</a>
                  </p>
                  <button type="button" className="click-here-purple">CLICK HERE 👆</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;