import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';
import { LayoutDashboard, Users, BedDouble, AlertTriangle, CheckCircle, CreditCard, Inbox, UserX } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ students: 0, rooms: 0, complaints: 0, fees: 0, unpaidFees: 0 });
  const [complaints, setComplaints] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      api.get('/admin/students'),
      api.get('/rooms'),
      api.get('/admin/complaints'),
      api.get('/admin/fees'),
    ]).then(([s, r, c, f]) => {
      const studs = s.status === 'fulfilled' ? s.value.data : [];
      const rooms = r.status === 'fulfilled' ? r.value.data : [];
      const comp  = c.status === 'fulfilled' ? c.value.data : [];
      const fees  = f.status === 'fulfilled' ? f.value.data : [];
      setStats({
        students: studs.length,
        rooms: rooms.length,
        complaints: comp.filter(x => x.status === 'PENDING').length,
        fees: fees.filter(x => x.paid).length,
        unpaidFees: fees.filter(x => !x.paid).length,
      });
      setComplaints(comp.slice(0, 5));
      setStudents(studs.slice(0, 5));
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="app-layout"><Sidebar /><div className="main-content"><div className="spinner" /></div></div>
  );

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <div className="topbar">
          <div>
            <div className="topbar-title">Admin Dashboard</div>
            <div className="topbar-subtitle">Hostel management overview</div>
          </div>
          <span style={{ color: 'var(--text-secondary)' }}><LayoutDashboard size={28} /></span>
        </div>
        <div className="page-content">
          <div className="welcome-banner">
            <div className="welcome-banner-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              Welcome, {user?.name}! <BedDouble size={24} />
            </div>
            <div className="welcome-banner-sub">Manage your hostel operations from one place.</div>
          </div>

          <div className="stats-grid">
            {[
              { icon: <Users size={24} />, label: 'Total Students', val: stats.students, color: 'rgba(99,102,241,0.15)', fg: 'var(--accent)' },
              { icon: <BedDouble size={24} />, label: 'Total Rooms',    val: stats.rooms,    color: 'rgba(16,185,129,0.15)', fg: 'var(--success)' },
              { icon: <AlertTriangle size={24} />, label: 'Open Complaints',val: stats.complaints,color: 'rgba(239,68,68,0.15)', fg: 'var(--danger)' },
              { icon: <CheckCircle size={24} />, label: 'Fees Paid',       val: stats.fees,     color: 'rgba(16,185,129,0.15)', fg: 'var(--success)' },
              { icon: <CreditCard size={24} />, label: 'Fees Pending',    val: stats.unpaidFees,color:'rgba(245,158,11,0.15)', fg: 'var(--warning)' },
            ].map(s => (
              <div className="stat-card" key={s.label}>
                <div className="stat-icon" style={{ background: s.color, color: s.fg }}>{s.icon}</div>
                <div>
                  <div className="stat-value">{s.val}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Complaints */}
          <div className="section-card">
            <div className="section-header">
              <span className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><AlertTriangle size={18} /> Recent Complaints</span>
            </div>
            <div className="section-body">
              {complaints.length === 0
                ? <div className="empty-state"><div className="empty-state-icon"><Inbox size={48} /></div><div className="empty-state-text">No complaints</div></div>
                : <div className="table-wrap"><table>
                    <thead><tr><th>Title</th><th>Student</th><th>Status</th></tr></thead>
                    <tbody>
                      {complaints.map(c => (
                        <tr key={c.id}>
                          <td>{c.title}</td>
                          <td style={{ color: 'var(--text-secondary)' }}>{c.student?.name}</td>
                          <td><span className={`badge badge-${c.status === 'RESOLVED' ? 'success' : 'warning'}`}>{c.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table></div>
              }
            </div>
          </div>

          {/* Recent Students */}
          <div className="section-card">
            <div className="section-header">
              <span className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Users size={18} /> Recent Students</span>
            </div>
            <div className="section-body">
              {students.length === 0
                ? <div className="empty-state"><div className="empty-state-icon"><UserX size={48} /></div><div className="empty-state-text">No students registered</div></div>
                : <div className="table-wrap"><table>
                    <thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead>
                    <tbody>
                      {students.map(s => (
                        <tr key={s.id}>
                          <td>{s.name}</td>
                          <td style={{ color: 'var(--text-secondary)' }}>{s.email}</td>
                          <td><span className="badge badge-info">{s.role}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table></div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
