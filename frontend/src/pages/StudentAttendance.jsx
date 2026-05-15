import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';
import { CalendarDays, CheckCircle, XCircle, BarChart3, Check, X } from 'lucide-react';

export default function StudentAttendance() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [marking, setMarking] = useState(false);

  const fetch = () => api.get(`/attendance/student/${user.id}`).then(r => setRecords(r.data)).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetch(); }, []);

  const mark = async (status) => {
    setMarking(true);
    await api.post('/attendance', { studentId: String(user.id), status });
    setMarking(false); fetch();
  };

  const present = records.filter(r => r.status === 'PRESENT').length;
  const absent  = records.filter(r => r.status === 'ABSENT').length;
  const pct = records.length ? Math.round((present / records.length) * 100) : 0;
  
  const today = new Date().toISOString().split('T')[0];
  const hasMarkedToday = records.some(r => r.date === today);

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <div className="topbar">
          <div><div className="topbar-title">Attendance</div><div className="topbar-subtitle">Track your hostel attendance</div></div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {!hasMarkedToday ? (
              <>
                <button className="btn btn-success" onClick={() => mark('PRESENT')} disabled={marking}><Check size={16} /> Present</button>
                <button className="btn btn-danger"  onClick={() => mark('ABSENT')}  disabled={marking}><X size={16} /> Absent</button>
              </>
            ) : (
              <span className="badge badge-info" style={{ padding: '8px 16px', fontSize: 13 }}>✓ Marked for Today</span>
            )}
          </div>
        </div>
        <div className="page-content">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(99,102,241,0.15)', color: 'var(--accent)' }}><CalendarDays size={24} /></div>
              <div><div className="stat-value">{records.length}</div><div className="stat-label">Total Days</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.15)', color: 'var(--success)' }}><CheckCircle size={24} /></div>
              <div><div className="stat-value">{present}</div><div className="stat-label">Present</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(239,68,68,0.15)', color: 'var(--danger)' }}><XCircle size={24} /></div>
              <div><div className="stat-value">{absent}</div><div className="stat-label">Absent</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(59,130,246,0.15)', color: 'var(--info)' }}><BarChart3 size={24} /></div>
              <div><div className="stat-value">{pct}%</div><div className="stat-label">Attendance %</div></div>
            </div>
          </div>

          <div className="section-card">
            <div className="section-header"><span className="section-title">Attendance Log</span></div>
            <div className="section-body">
              {records.length === 0
                ? <div className="empty-state"><div className="empty-state-icon"><CalendarDays size={48} /></div><div className="empty-state-text">No attendance records yet</div></div>
                : <div className="table-wrap"><table>
                    <thead><tr><th>#</th><th>Date</th><th>Status</th></tr></thead>
                    <tbody>
                      {[...records].reverse().map((r, i) => (
                        <tr key={r.id}>
                          <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                          <td>{r.date}</td>
                          <td><span className={`badge badge-${r.status === 'PRESENT' ? 'success' : 'danger'}`}>{r.status}</span></td>
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
