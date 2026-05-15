import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';
import { CalendarDays, CheckCircle, XCircle } from 'lucide-react';

export default function AdminAttendance() {
  const [records, setRecords] = useState([]);

  useEffect(() => { api.get('/admin/attendance').then(r => setRecords(r.data)); }, []);

  const present = records.filter(r => r.status === 'PRESENT').length;
  const absent  = records.filter(r => r.status === 'ABSENT').length;

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <div className="topbar">
          <div><div className="topbar-title">Attendance Records</div><div className="topbar-subtitle">View all student attendance</div></div>
        </div>
        <div className="page-content">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(99,102,241,0.15)', color: 'var(--accent)' }}><CalendarDays size={24} /></div>
              <div><div className="stat-value">{records.length}</div><div className="stat-label">Total Entries</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.15)', color: 'var(--success)' }}><CheckCircle size={24} /></div>
              <div><div className="stat-value">{present}</div><div className="stat-label">Present</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(239,68,68,0.15)', color: 'var(--danger)' }}><XCircle size={24} /></div>
              <div><div className="stat-value">{absent}</div><div className="stat-label">Absent</div></div>
            </div>
          </div>
          <div className="section-card">
            <div className="section-header"><span className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><CalendarDays size={18} /> All Attendance Logs</span></div>
            <div className="section-body">
              {records.length === 0
                ? <div className="empty-state"><div className="empty-state-icon"><CalendarDays size={48} /></div><div className="empty-state-text">No attendance records</div></div>
                : <div className="table-wrap"><table>
                    <thead><tr><th>Student</th><th>Date</th><th>Status</th></tr></thead>
                    <tbody>
                      {records.map(r => (
                        <tr key={r.id}>
                          <td>{r.student?.name}</td>
                          <td style={{ color: 'var(--text-secondary)' }}>{r.date}</td>
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
