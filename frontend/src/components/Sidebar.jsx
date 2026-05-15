import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { LayoutDashboard, BedDouble, ClipboardList, CreditCard, CalendarDays, Users, LogOut, Hotel, Sun, Moon, Camera, Loader2 } from 'lucide-react';

const studentNav = [
  { icon: <LayoutDashboard size={18} />, label: 'Dashboard',   path: '/student' },
  { icon: <BedDouble size={18} />,       label: 'My Room',     path: '/student/room' },
  { icon: <ClipboardList size={18} />,   label: 'Complaints',  path: '/student/complaints' },
  { icon: <CreditCard size={18} />,      label: 'Fees',        path: '/student/fees' },
  { icon: <CalendarDays size={18} />,    label: 'Attendance',  path: '/student/attendance' },
];

const adminNav = [
  { icon: <LayoutDashboard size={18} />, label: 'Dashboard',   path: '/admin' },
  { icon: <Users size={18} />,           label: 'Students',    path: '/admin/students' },
  { icon: <BedDouble size={18} />,       label: 'Rooms',       path: '/admin/rooms' },
  { icon: <ClipboardList size={18} />,   label: 'Complaints',  path: '/admin/complaints' },
  { icon: <CreditCard size={18} />,      label: 'Fees',        path: '/admin/fees' },
  { icon: <CalendarDays size={18} />,    label: 'Attendance',  path: '/admin/attendance' },
];

export default function Sidebar() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (theme === 'light') document.body.classList.add('light-theme');
    else document.body.classList.remove('light-theme');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  const handleProfileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64String = event.target.result;
      setUploading(true);
      try {
        await api.put(`/users/${user.id}/profile-pic`, { profilePic: base64String });
        login({ ...user, profilePic: base64String });
        setIsProfileOpen(false);
      } catch (err) {
        alert('Failed to upload image. File might be too large.');
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const navItems = user?.role === 'ADMIN' ? adminNav : studentNav;
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'HH';

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon"><Hotel size={20} color="white" /></div>
        <span className="sidebar-logo-text">HostelHub</span>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-title">
          {user?.role === 'ADMIN' ? 'Admin Panel' : 'Student Panel'}
        </div>
        {navItems.map((item) => (
          <button
            key={item.path}
            className={`nav-link${location.pathname === item.path ? ' active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span className="nav-link-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-link" onClick={toggleTheme} style={{ marginBottom: 16 }}>
          <span className="nav-link-icon">{theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}</span>
          {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </button>
        <div className="sidebar-user" onClick={() => setIsProfileOpen(true)} style={{ cursor: 'pointer' }} title="Update Profile">
          <div className="sidebar-user-avatar" style={{ overflow: 'hidden' }}>
            {user?.profilePic ? <img src={user.profilePic} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.name}</div>
            <div className="sidebar-user-role">{user?.role?.toLowerCase()}</div>
          </div>
        </div>
        <button className="nav-link" onClick={logout} style={{ color: '#ef4444' }}>
          <span className="nav-link-icon"><LogOut size={18} /></span>
          Logout
        </button>
      </div>

      {isProfileOpen && (
        <div className="modal-overlay" onClick={() => !uploading && setIsProfileOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">Update Profile Picture</h2>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
              <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), #8b5cf6)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 'bold', color: 'white' }}>
                {user?.profilePic ? <img src={user.profilePic} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
              </div>
              <label className="btn btn-primary" style={{ cursor: 'pointer', width: 'auto' }}>
                {uploading ? <Loader2 className="spinner" size={16} style={{ width: 16, height: 16, margin: 0, borderWidth: 2 }} /> : <Camera size={16} />} 
                {uploading ? 'Uploading...' : 'Choose Image'}
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleProfileUpload} disabled={uploading} />
              </label>
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setIsProfileOpen(false)} disabled={uploading}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
