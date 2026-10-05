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
  FaSearch
} from 'react-icons/fa';

function AdminDashboard() {
  const navigate = useNavigate();
  const { t, lang, toggleLanguage } = useLanguage();
  const [currentUser, setCurrentUser] = useState(null);

  const [hasSearched, setHasSearched] = useState(false);
  const resultRef = useRef(null);

  const [workTypes, setWorkTypes] = useState({});
  const [businessType, setBusinessType] = useState('');
  const [location, setLocation] = useState('');
  const [position, setPosition] = useState('');
  const [keyword, setKeyword] = useState('');

  // ✅ State สำหรับข้อมูลจริงจาก API
  const [popularVideos, setPopularVideos] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState(false);
  const maxPopularVideoViews = Math.max(0, ...popularVideos.map((video) => Number(video.ViewCount) || 0));

  // ✅ State สำหรับตัวเลือกตัวกรอง (ดึงจาก DB จริง)
  const [filterOptions, setFilterOptions] = useState({
    businessTypes: [],
    locations: [],
    workTypes: [],
    positions: [],
  });

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
        const [statsRes, popularRes] = await Promise.all([
          fetch('http://localhost:5000/api/dashboard/stats'),
          fetch('http://localhost:5000/api/dashboard/popular-video'),
        ]);
        if (!statsRes.ok || !popularRes.ok) {
          throw new Error('Dashboard request failed');
        }
        const statsData = await statsRes.json();
        const popularData = await popularRes.json();
        setDashboardStats(statsData.data || null);
        setPopularVideos(Array.isArray(popularData.data) ? popularData.data : []);
        setDashboardError(false);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setDashboardStats(null);
        setPopularVideos([]);
        setDashboardError(true);
      } finally {
        setDashboardLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // ✅ ดึงตัวเลือกตัวกรอง (Category, Business Type, Location, Work Style) จาก DB จริง
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/videos/filters');
        const data = await res.json();
        setFilterOptions({
          businessTypes: data.businessTypes || [],
          locations: data.locations || [],
          workTypes: data.workTypes || [],
          positions: data.positions || [],
        });
        const allWorkTypesOn = {};
        (data.workTypes || []).forEach((wt) => { allWorkTypesOn[wt] = true; });
        setWorkTypes(allWorkTypesOn);
      } catch (err) {
        console.error('Filter options fetch error:', err);
      }
    };
    fetchFilterOptions();
  }, []);

  const [videoResults, setVideoResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const selectedWorkTypeCount = filterOptions.workTypes.filter((type) => workTypes[type]).length;
  const selectedFilterCount = [
    businessType,
    location,
    position,
    keyword.trim(),
  ].filter(Boolean).length + Number(selectedWorkTypeCount < filterOptions.workTypes.length);

  const handleSearch = async () => {
    if (filterOptions.workTypes.length > 0 && selectedWorkTypeCount === 0) {
      return;
    }

    setIsLoading(true);
    setSearchError(false);
    setHasSearched(true);
    setVideoResults([]);
    try {
      const workTypeList = Object.keys(workTypes).filter((wt) => workTypes[wt]);

      const params = new URLSearchParams({
        businessType,
        location,
        position,
        keyword,
      });
      const allWorkTypesSelected = filterOptions.workTypes.every((wt) => workTypes[wt]);
      if (!allWorkTypesSelected) {
        params.set('workType', workTypeList.join(','));
      }

      const res = await fetch(`http://localhost:5000/api/videos/search?${params}`);
      if (!res.ok) {
        throw new Error('Video search request failed');
      }
      const data = await res.json();
      if (!Array.isArray(data)) {
        throw new Error('Unexpected video search response');
      }
      setVideoResults(data);
      setHasSearched(true);

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error('Search error:', err);
      setSearchError(true);
      setHasSearched(true);
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
    const allWorkTypesOn = {};
    filterOptions.workTypes.forEach((wt) => { allWorkTypesOn[wt] = true; });
    setWorkTypes(allWorkTypesOn);
    setBusinessType('');
    setLocation('');
    setPosition('');
    setKeyword('');
    setHasSearched(false);
    setSearchError(false);
    setVideoResults([]);
  };

  return (
    <div className={`admin-purple-container admin-dashboard-page${hasSearched ? ' has-search-results' : ''}`}>
      {/* ===== Sidebar ===== */}
      <aside className="sidebar-purple">
        <div>
          <button type="button" className="brand-logo-purple" onClick={() => navigate('/admin')}>
            <img className="brand-logo-image" src="/video-summary-logo.png" alt="" />
            <span>{t.appName || 'ICT Video Summary'}</span>
          </button>

          <div className="user-profile-purple">
            <div className="avatar-purple">
              {currentUser ? currentUser.firstName.charAt(0) : 'S'}
            </div>
            <div className="user-info-purple">
              <h4>
                {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Somchai Jaidee'}
              </h4>
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
        <header className="top-header-purple dashboard-page-header">
          <div className="header-title">
            <div className="header-icon-box dashboard-title-icon" aria-hidden="true">
              <img className="dashboard-home-image" src="/dashboard-home.png" alt="" />
            </div>
            <div>
              <h2 className="main-title-text">{t.dashboard || 'Dashboard'}</h2>
              <p className="subtitle-purple">{t.dashboardOverview || 'Your video library at a glance'}</p>
            </div>
          </div>

          <div className="dashboard-header-actions">
            <span className="dashboard-date">
              {new Date().toLocaleDateString(lang === 'th' ? 'th-TH' : 'en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
            <button type="button" className="lang-toggle-purple" onClick={toggleLanguage}>
              <FaGlobe size={14} />
              <span>{lang ? lang.toUpperCase() : 'EN'}</span>
            </button>
          </div>
        </header>

        <section className="dashboard-metrics" aria-label={t.dashboardMetrics || 'Dashboard metrics'}>
          <article className="dashboard-metric-card">
            <span className="dashboard-metric-icon metric-icon-videos">
              <img src="/dashboard-metric-videos.png" alt="" />
            </span>
            <div>
              <p>{t.totalPublicVideos || 'Public videos'}</p>
              <strong>{dashboardLoading ? '—' : new Intl.NumberFormat(lang === 'th' ? 'th-TH' : 'en-US').format(Number(dashboardStats?.totalVideos) || 0)}</strong>
              <span>{t.availableInLibrary || 'Available in library'}</span>
            </div>
          </article>
          <article className="dashboard-metric-card">
            <span className="dashboard-metric-icon metric-icon-views">
              <img src="/dashboard-metric-views.png" alt="" />
            </span>
            <div>
              <p>{t.totalViews || 'Total views'}</p>
              <strong>{dashboardLoading ? '—' : new Intl.NumberFormat(lang === 'th' ? 'th-TH' : 'en-US').format(Number(dashboardStats?.totalViews) || 0)}</strong>
              <span>{t.acrossPublicVideos || 'Across public videos'}</span>
            </div>
          </article>
          <article className="dashboard-metric-card">
            <span className="dashboard-metric-icon metric-icon-week">
              <img src="/dashboard-metric-week.png" alt="" />
            </span>
            <div>
              <p>{t.uploadedThisWeek || 'Added this week'}</p>
              <strong>{dashboardLoading ? '—' : new Intl.NumberFormat(lang === 'th' ? 'th-TH' : 'en-US').format(Number(dashboardStats?.weeklyUploads) || 0)}</strong>
              <span>{t.inTheLastSevenDays || 'In the last 7 days'}</span>
            </div>
          </article>
          <article className="dashboard-metric-card dashboard-metric-featured">
            <span className="dashboard-metric-icon metric-icon-top">
              <img src="/dashboard-metric-leader.png" alt="" />
            </span>
            <div>
              <p>{t.leadingVideoViews || 'Leader views'}</p>
              <strong>
                {dashboardLoading
                  ? '—'
                  : new Intl.NumberFormat(lang === 'th' ? 'th-TH' : 'en-US').format(Number(popularVideos[0]?.ViewCount) || 0)}
              </strong>
              <span>{t.mostViewedVideo || 'Most-viewed video'}</span>
            </div>
          </article>
        </section>

        <div className="admin-dashboard-top-row">

          <div className="purple-card top-videos-card">
            <div className="top-videos-heading">
              <div className="top-videos-heading-copy">
                <h3 className="card-title-purple">
                  {t.topVideosByViews || 'Top 5 Videos by Views'}
                </h3>
              </div>
              <span className="top-videos-period">{t.topVideosPeriod || 'ALL-TIME VIEWS'}</span>
            </div>
            {dashboardLoading ? (
              <div className="dashboard-chart-message" role="status">
                {t.dashboardLoading || 'Loading dashboard data...'}
              </div>
            ) : dashboardError ? (
              <div className="dashboard-chart-message dashboard-chart-error" role="alert">
                {t.dashboardLoadError || 'Could not load dashboard data.'}
              </div>
            ) : popularVideos.length > 0 ? (
              <ol className="top-videos-chart" aria-label={t.topVideosByViews || 'Top 5 Videos by Views'}>
                {popularVideos.map((video, index) => {
                  const views = Number(video.ViewCount) || 0;
                  const barWidth = maxPopularVideoViews > 0 ? (views / maxPopularVideoViews) * 100 : 0;

                  return (
                    <li className={`top-video-chart-item${index === 0 ? ' is-leading' : ''}`} key={video.VideoID}>
                      <div className="top-video-chart-label">
                        <span className="top-video-rank" aria-hidden="true">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="top-video-title" title={video.VideoTitle}>
                          {video.VideoTitle || t.untitledVideo || 'Untitled video'}
                        </span>
                        <span className="top-video-views">
                          {index === 0 && <span className="top-video-crown" aria-hidden="true">👑</span>}
                          {new Intl.NumberFormat(lang === 'th' ? 'th-TH' : 'en-US').format(views)} {t.viewsCount || 'views'}
                        </span>
                      </div>
                      <div className="top-video-bar-track" aria-hidden="true">
                        <div className="top-video-bar" style={{ width: `${barWidth}%` }} />
                      </div>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <div className="dashboard-chart-message">
                {t.noPopularVideos || 'No public videos yet.'}
              </div>
            )}
          </div>

          <section className="purple-card filter-section-purple dashboard-search-panel">
            <div className="dashboard-search-heading">
              <div>
                <span className="section-eyebrow">{t.exploreLibrary || 'EXPLORE THE LIBRARY'}</span>
                <h3 className="card-title-purple">{t.filterTitle || 'Find a video summary'}</h3>
                <p>{t.searchPanelDescription || 'Narrow down opportunities by role, location, or work style.'}</p>
              </div>
              <button type="button" className="reset-btn-purple" onClick={handleResetFilter}>
                {t.resetFilter || 'Reset Filters'}
              </button>
            </div>

            <form
              className="dashboard-filter-form"
              aria-busy={isLoading}
              onSubmit={(event) => {
                event.preventDefault();
                handleSearch();
              }}
            >
              <div className="dashboard-filter-selects">
                <div className="form-group-purple">
                  <label htmlFor="filter-business-type">{t.businessType || 'Business Type'}</label>
                  <select id="filter-business-type" className="dark-purple-input" value={businessType} onChange={(e) => setBusinessType(e.target.value)}>
                    <option value="">{t.all || 'All'}</option>
                    {filterOptions.businessTypes.map((bt) => (
                      <option key={bt} value={bt}>{bt}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group-purple">
                  <label htmlFor="filter-location">{lang === 'en' ? 'Location' : 'สถานที่ปฏิบัติงาน'}</label>
                  <select id="filter-location" className="dark-purple-input" value={location} onChange={(e) => setLocation(e.target.value)}>
                    <option value="">{t.all || 'All'}</option>
                    {filterOptions.locations.map((loc) => (
                      <option key={loc.en} value={loc.en}>{lang === 'en' ? loc.en : loc.th}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group-purple">
                  <label htmlFor="filter-position">{lang === 'en' ? 'Position' : 'ตำแหน่งงาน'}</label>
                  <select id="filter-position" className="dark-purple-input" value={position} onChange={(e) => setPosition(e.target.value)}>
                    <option value="">{t.all || 'All'}</option>
                    {filterOptions.positions.map((pos) => (
                      <option key={pos} value={pos}>{pos}</option>
                    ))}
                  </select>
                </div>
              </div>

              <fieldset className="dashboard-workstyle-fieldset">
                <legend>{t.workStyle || 'Work Style'}</legend>
                <p className="dashboard-field-hint">{t.workStyleHint || 'Choose one or more, or keep all selected.'}</p>
                <div className="checkbox-group-purple">
                  {filterOptions.workTypes.map((wt) => (
                    <label className="workstyle-chip" key={wt}>
                      <input type="checkbox" name={wt} checked={!!workTypes[wt]} onChange={handleCheckboxChange} /> {wt}
                    </label>
                  ))}
                </div>
                {filterOptions.workTypes.length > 0 && selectedWorkTypeCount === 0 && (
                  <p className="dashboard-validation-hint" role="status">
                    {t.selectWorkStyleHint || 'Select at least one work style to search.'}
                  </p>
                )}
              </fieldset>

              <div className="dashboard-filter-submit">
                <div className="form-group-purple dashboard-keyword-field">
                  <label htmlFor="filter-keyword">{lang === 'en' ? 'Keyword' : 'คำค้นหา'}</label>
                  <input
                    id="filter-keyword"
                    type="text"
                    className="dark-purple-input"
                    placeholder={lang === 'en' ? 'Title, company, or position' : 'ชื่อวิดีโอ บริษัท หรือตำแหน่งงาน'}
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                </div>
                {selectedFilterCount > 0 && (
                  <span className="dashboard-filter-count" aria-live="polite">
                    {lang === 'en' ? `${selectedFilterCount} filters selected` : `เลือกตัวกรอง ${selectedFilterCount} รายการ`}
                  </span>
                )}
                <button
                  type="submit"
                  className="btn-search-purple"
                  disabled={isLoading || (filterOptions.workTypes.length > 0 && selectedWorkTypeCount === 0)}
                >
                  <FaSearch aria-hidden="true" />
                  {isLoading
                    ? (t.searching || 'Searching...')
                    : (t.searchButton || (lang === 'en' ? 'Search Data' : 'ค้นหาข้อมูล'))}
                </button>
              </div>
            </form>
          </section>
        </div>

        {hasSearched && (
          <div ref={resultRef} className="purple-card result-section-purple dashboard-results-card">
            <div className="result-header-purple">
              <h3 className="card-title-purple">
                {isLoading
                  ? (t.searching || 'Searching...')
                  : searchError
                  ? (t.searchResults || 'Search results')
                  : lang === 'en'
                    ? `Found ${videoResults.length} results`
                    : `พบ ${videoResults.length} รายการ`}
              </h3>
            </div>
            <div className="cards-grid-purple">
              {searchError && <p className="dashboard-search-error" role="alert">{t.searchError || 'Could not complete the search. Please try again.'}</p>}
              {isLoading && <p>{t.searching || 'Searching...'}</p>}
              {!searchError && !isLoading && videoResults.length === 0 && (
                <p>{lang === 'en' ? 'No results found.' : 'ไม่พบข้อมูลที่ตรงกับตัวกรอง'}</p>
              )}
              {!searchError && !isLoading && videoResults.map((item) => (
                <div className="job-card-purple" key={item.VideoID}>
                  <div className="card-banner-purple">
                    <span>{item.UploadDate ? new Date(item.UploadDate).getFullYear() : '2026'}</span>
                    <h4>INTERNSHIP</h4>
                    <p>{item.CategoryName || '-'}</p>
                  </div>
                  <div className="card-body-purple">
                    <h5>{`${item.Position || item.VideoTitle} | ${item.CompanyName || '-'}`}</h5>
                    <p className="url-text-purple">
                      {item.WorkType}
                    </p>
                    <button
                      type="button"
                      className="click-here-purple"
                      onClick={() => navigate(`/video/${item.VideoID}`)}
                    >
                      {t.viewSummary || 'View summary'}
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