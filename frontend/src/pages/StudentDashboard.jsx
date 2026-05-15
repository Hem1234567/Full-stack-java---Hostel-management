import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';
import { Hand, GraduationCap, BedDouble, CreditCard, Hourglass, CalendarDays, ClipboardList, Inbox, Receipt } from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [room, setRoom] = useState(null);
  const [fees, setFees] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = user?.id;
    if (!id) return;
    Promise.allSettled([
      api.get(`/rooms/allocation/${id}`),
      api.get(`/fees/student/${id}`),
      api.get(`/complaints/student/${id}`),
      api.get(`/attendance/student/${id}`),
    ]).then(([r, f, c, a]) => {
      if (r.status === 'fulfilled') setRoom(r.value.data);
      if (f.status === 'fulfilled') setFees(f.value.data);
      if (c.status === 'fulfilled') setComplaints(c.value.data);
      if (a.status === 'fulfilled') setAttendance(a.value.data);
      setLoading(false);
    });
  }, [user]);

  const paidFees = fees.filter(f => f.paid).length;
  const pendingFees = fees.filter(f => !f.paid).length;
  const presentDays = attendance.filter(a => a.status === 'PRESENT').length;
  const attendancePct = attendance.length ? Math.round((presentDays / attendance.length) * 100) : 0;
  const pendingComplaints = complaints.filter(c => c.status === 'PENDING').length;

  if (loading) return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content"><div className="spinner" /></div>
    </div>
  );

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <div className="topbar">
          <div>
            <div className="topbar-title">Student Dashboard</div>
            <div className="topbar-subtitle">Welcome back, {user?.name}</div>
          </div>
          <span style={{ color: 'var(--text-secondary)' }}><Hand size={28} /></span>
        </div>
        <div className="page-content">
          <div className="welcome-banner">
            <div className="welcome-banner-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              Hello, {user?.name}! <GraduationCap size={24} />
            </div>
            <div className="welcome-banner-sub">
              {room ? `Room ${room.room?.roomNumber} · Allocated ${room.allocationDate}` : 'No room allocated yet — contact the admin.'}
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(99,102,241,0.15)', color: 'var(--accent)' }}><BedDouble size={24} /></div>
              <div>
                <div className="stat-value">{room ? room.room?.roomNumber : '—'}</div>
                <div className="stat-label">Assigned Room</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.15)', color: 'var(--success)' }}><CreditCard size={24} /></div>
              <div>
                <div className="stat-value">{paidFees}</div>
                <div className="stat-label">Fees Paid</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.15)', color: 'var(--warning)' }}><Hourglass size={24} /></div>
              <div>
                <div className="stat-value">{pendingFees}</div>
                <div className="stat-label">Pending Fees</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(59,130,246,0.15)', color: 'var(--info)' }}><CalendarDays size={24} /></div>
              <div>
                <div className="stat-value">{attendancePct}%</div>
                <div className="stat-label">Attendance</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(239,68,68,0.15)', color: 'var(--danger)' }}><ClipboardList size={24} /></div>
              <div>
                <div className="stat-value">{pendingComplaints}</div>
                <div className="stat-label">Open Complaints</div>
              </div>
            </div>
          </div>

          {/* Recent Complaints */}
          <div className="section-card">
            <div className="section-header">
              <span className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><ClipboardList size={18} /> Recent Complaints</span>
            </div>
            <div className="section-body">
              {complaints.length === 0
                ? <div className="empty-state"><div className="empty-state-icon"><Inbox size={48} /></div><div className="empty-state-text">No complaints submitted</div></div>
                : <div className="table-wrap"><table>
                    <thead><tr><th>Title</th><th>Description</th><th>Status</th></tr></thead>
                    <tbody>
                      {complaints.slice(0,5).map(c => (
                        <tr key={c.id}>
                          <td>{c.title}</td>
                          <td style={{ color: 'var(--text-secondary)' }}>{c.description}</td>
                          <td><span className={`badge badge-${c.status === 'RESOLVED' ? 'success' : 'warning'}`}>{c.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table></div>
              }
            </div>
          </div>

          {/* Recent Fees */}
          <div className="section-card">
            <div className="section-header">
              <span className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><CreditCard size={18} /> Fee Summary</span>
            </div>
            <div className="section-body">
              {fees.length === 0
                ? <div className="empty-state"><div className="empty-state-icon"><Receipt size={48} /></div><div className="empty-state-text">No fee records</div></div>
                : <div className="table-wrap"><table>
                    <thead><tr><th>Month</th><th>Amount</th><th>Status</th><th>Paid On</th></tr></thead>
                    <tbody>
                      {fees.slice(0,5).map(f => (
                        <tr key={f.id}>
                          <td>{f.month}</td>
                          <td>₹{f.amount.toLocaleString()}</td>
                          <td><span className={`badge badge-${f.paid ? 'success' : 'danger'}`}>{f.paid ? 'Paid' : 'Unpaid'}</span></td>
                          <td style={{ color: 'var(--text-secondary)' }}>{f.paymentDate || '—'}</td>
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
