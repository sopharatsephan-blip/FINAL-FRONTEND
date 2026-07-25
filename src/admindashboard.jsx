import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './admindashboard.css';

// 📌 นำเข้า React Icons
import { 
  FaHome, 
  FaVideo, 
  FaEdit, 
  FaGlobe, 
  FaUsers, 
  FaSignOutAlt, 
  FaSearch, 
  FaAsterisk 
} from 'react-icons/fa';

function AdminDashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  
  const [hasSearched, setHasSearched] = useState(false);
  const resultRef = useRef(null);

  // Default States สำหรับฟิลเตอร์
  const initialCategory = 'UX/UI';
  const initialWorkTypes = { onsite: true, hybrid: true, wfh: false };

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [workTypes, setWorkTypes] = useState(initialWorkTypes);
  const [businessType, setBusinessType] = useState('Software & IT Services');
  const [location, setLocation] = useState('กรุงเทพมหานคร');
  const [keyword, setKeyword] = useState('');

  // 🔒 เช็กล็อกอิน
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

  // 🧹 ฟังก์ชันล้างตัวกรอง
  const handleResetFilter = () => {
    setSelectedCategory(initialCategory);
    setWorkTypes(initialWorkTypes);
    setBusinessType('Software & IT Services');
    setLocation('กรุงเทพมหานคร');
    setKeyword('');
    setHasSearched(false);
  };

  // 🔍 ฟังก์ชันค้นหาข้อมูล
  const handleSearch = () => {
    setHasSearched(true);
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="admin-purple-container">
      {/* ===== Sidebar ม่วงเข้ม ===== */}
      <aside className="sidebar-purple">
        <div>
          <div className="brand-logo-purple" onClick={() => navigate('/admin')} style={{ cursor: 'pointer' }}>
            <FaAsterisk className="logo-icon" style={{ color: '#c084fc', marginRight: '8px' }} />
            <span>ICT Video Summary</span>
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
              <span>แดชบอร์ด</span>
            </button>
            
            <button className="menu-item-purple" onClick={() => navigate('/upload-video')}>
              <FaVideo />
              <span>อัปโหลดวิดีโอ</span>
            </button>
            
            {/* 👈 เพิ่ม onClick เพื่อเปิดหน้าแก้ไขข้อมูลสรุป */}
            <button className="menu-item-purple" onClick={() => navigate('/edit-summary')}>
              <FaEdit />
              <span>แก้ไขข้อมูลสรุป</span>
            </button>
            
            <button className="menu-item-purple" onClick={() => navigate('/publish')}>
              <FaGlobe size={16} />
              <span>เผยแพร่</span>
            </button>
            
            <button className="menu-item-purple">
              <FaUsers />
              <span>จัดการผู้ใช้</span>
            </button>
          </nav>
        </div>

        <div className="sidebar-footer-purple">
          <button className="logout-btn-purple" onClick={handleLogout}>
            <FaSignOutAlt />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </aside>

      {/* ===== Main Content ด้านขวา ===== */}
      <main className="main-content-purple">
        <header className="top-header-purple">
          <div className="header-title">
            <div className="header-icon-box" style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#c084fc', padding: '8px', borderRadius: '8px', display: 'flex' }}>
              <FaHome size={18} />
            </div>
            <div>
              <h2 style={{ margin: 0 }}>แดชบอร์ด</h2>
              <p className="subtitle-purple" style={{ margin: 0 }}>ข้อมูลสรุปประจำสัปดาห์ - มีนาคม 2568</p>
            </div>
          </div>
          
          <div className="search-box-purple">
            <FaSearch style={{ color: '#9ca3af', fontSize: '14px' }} />
            <input type="text" placeholder="ค้นหาสรุป, ตำแหน่งงาน" />
          </div>
        </header>

        {/* แถวที่ 1: ยอดฮิต + สรุปประจำสัปดาห์ */}
        <div className="grid-row-2">
          <div className="purple-card">
            <h3 className="card-title-purple text-green">🟢 อันดับวิดีโอยอดฮิต</h3>
            <div className="hero-banner-purple">
              <span className="top-badge">👑 อันดับ 1 สัปดาห์นี้</span>
              <div className="hero-details">
                <h4>ตำแหน่ง UX/UI Design | บริษัท อินเวิร์ส โซลูชันส์ จำกัด</h4>
                <p>IO-HOPE ENTERPRISE · Developer</p>
                <div className="stats-purple">
                  <span>👁️ 312 คน</span>
                  <span>⏱️ 5:03 นาที</span>
                </div>
              </div>
              <div className="chart-icon">📈</div>
            </div>
          </div>

          <div className="purple-card">
            <h3 className="card-title-purple text-purple">🔹 สรุปวิดีโอประจำสัปดาห์</h3>
            <ul className="weekly-list-purple">
              <li>
                <div>
                  <strong>ตำแหน่ง UX/UI Design | บริษัท อินเวิร์ส โซลูชันส์ จำกัด</strong>
                  <p>วันที่ 30 เดือนมกราคม 2569 · 5:30 นาที · ผู้ชม 18 คน</p>
                </div>
                <span className="purple-badge">UX/UI</span>
              </li>
              <li>
                <div>
                  <strong>ตำแหน่ง Graphic บริษัท PRINT UP</strong>
                  <p>วันที่ 30 เดือนมกราคม 2569 · 5:08 นาที · ผู้ชม 6 คน</p>
                </div>
                <span className="purple-badge">Graphic</span>
              </li>
              <li>
                <div>
                  <strong>ตำแหน่ง web Developer บริษัท IO-HOPE ENTERPRISE</strong>
                  <p>วันที่ 30 เดือนมกราคม 2569 · 5:03 นาที · ผู้ชม 10 คน</p>
                </div>
                <span className="purple-badge">Developer</span>
              </li>
            </ul>
          </div>
        </div>

        {/* แถวที่ 2: ตัวกรองข้อมูล */}
        <div className="purple-card filter-section-purple">
          <div className="result-header-purple" style={{ marginBottom: '15px' }}>
            <h3 className="card-title-purple" style={{ margin: 0 }}>⚙️ ตัวกรองข้อมูล</h3>
            <button type="button" className="reset-btn-purple" onClick={handleResetFilter}>
              🔄 ล้างตัวกรอง
            </button>
          </div>

          <div className="filter-grid-purple">
            <div className="filter-col">
              <label>ประเภทงาน</label>
              <div className="tag-group-purple">
                {['ทั้งหมด', 'Developer', 'UX/UI', 'Data/AI', 'Network', 'Graphic'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`tag-btn-purple ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="form-group-purple">
                <label>ประเภทธุรกิจ</label>
                <select className="dark-purple-input" value={businessType} onChange={(e) => setBusinessType(e.target.value)}>
                  <option>Software & IT Services</option>
                  <option>E-Commerce</option>
                  <option>Banking & Finance</option>
                </select>
              </div>

              <div className="form-group-purple">
                <label>สถานที่ปฏิบัติงาน</label>
                <select className="dark-purple-input" value={location} onChange={(e) => setLocation(e.target.value)}>
                  <option>กรุงเทพมหานคร</option>
                  <option>นนทบุรี</option>
                  <option>ปทุมธานี</option>
                </select>
              </div>
            </div>

            <div className="filter-col">
              <label>รูปแบบการทำงาน</label>
              <div className="checkbox-group-purple">
                <label><input type="checkbox" name="onsite" checked={workTypes.onsite} onChange={handleCheckboxChange} /> Onsite</label>
                <label><input type="checkbox" name="hybrid" checked={workTypes.hybrid} onChange={handleCheckboxChange} /> Hybrid Work</label>
                <label><input type="checkbox" name="wfh" checked={workTypes.wfh} onChange={handleCheckboxChange} /> Work from Home</label>
              </div>

              <div className="form-group-purple">
                <label>ค้นหาอย่างละเอียด</label>
                <input
                  type="text"
                  className="dark-purple-input"
                  placeholder="พิมพ์คีย์เวิร์ด หรือชื่อนักศึกษา..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>

              <button type="button" className="btn-search-purple" onClick={handleSearch}>
                ค้นหาข้อมูล
              </button>
            </div>
          </div>
        </div>

        {/* แถวที่ 3: ผลลัพธ์คลิปวิดีโอ 3 ใบ */}
        {hasSearched && (
          <div ref={resultRef} className="purple-card result-section-purple" style={{ marginTop: '25px' }}>
            <div className="result-header-purple">
              <h3 className="card-title-purple">⚙️ ตัวกรองพบ 3 ตำแหน่งงาน</h3>
            </div>

            <div className="cards-grid-purple">
              <div className="job-card-purple">
                <div className="card-banner-purple">
                  <span>2568</span>
                  <h4>INTERNSHIP</h4>
                  <p>UX/UI DESIGN</p>
                </div>
                <div className="card-body-purple">
                  <h5>ตำแหน่ง UX/UI Design | บริษัท อินเวิร์ส โซลูชันส์ จำกัด</h5>
                  <p className="url-text-purple">
                    URL: <a href="#url">ตำแหน่ง UX/UI Design | บริษัท อินเวิร์ส โซลูชันส์ จำกัด</a>
                  </p>
                  <button type="button" className="click-here-purple">CLICK HERE 👆</button>
                </div>
              </div>

              <div className="job-card-purple">
                <div className="card-banner-purple">
                  <span>2568</span>
                  <h4>INTERNSHIP</h4>
                  <p>UX/UI DESIGN</p>
                </div>
                <div className="card-body-purple">
                  <h5>ตำแหน่ง UX UI Design สำนักงานอธิการบดี กองพัฒนานักศึกษา แสงศิษย์เก่าสัมพันธ์</h5>
                  <p className="url-text-purple">
                    URL: <a href="#url">ตำแหน่ง UX UI Design สำนักงานอธิการบดี กองพัฒนานักศึกษา และศิษย์เก่าสัมพันธ์</a>
                  </p>
                  <button type="button" className="click-here-purple">CLICK HERE 👆</button>
                </div>
              </div>

              <div className="job-card-purple">
                <div className="card-banner-purple">
                  <span>2568</span>
                  <h4>INTERNSHIP</h4>
                  <p>UX/UI DESIGN</p>
                </div>
                <div className="card-body-purple">
                  <h5>ตำแหน่ง Ux ui Design บริษัท บริษัท อิสลามิค ชิสเต็มส์ คอร์ปอเรชั่น จำกัด</h5>
                  <p className="url-text-purple">
                    URL: <a href="#url">ตำแหน่ง Ux ui Design บริษัท บริษัท อิสลามิค ชิสเต็มส์ คอร์ปอเรชั่น จำกัด</a>
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