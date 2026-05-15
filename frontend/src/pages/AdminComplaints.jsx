import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';
import { ClipboardList, Hourglass, CheckCircle, Inbox } from 'lucide-react';

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);

  const fetch = () => api.get('/admin/complaints').then(r => setComplaints(r.data));
  useEffect(() => { fetch(); }, []);

  const resolve = async (id) => { await api.put(`/admin/complaints/${id}/resolve`); fetch(); };
  const remove  = async (id) => { await api.delete(`/admin/complaints/${id}`); fetch(); };

  const pending  = complaints.filter(c => c.status === 'PENDING').length;
  const resolved = complaints.filter(c => c.status === 'RESOLVED').length;

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <div className="topbar">
          <div><div className="topbar-title">Complaints Management</div><div className="topbar-subtitle">Review and resolve student complaints</div></div>
        </div>
        <div className="page-content">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(99,102,241,0.15)', color: 'var(--accent)' }}><ClipboardList size={24} /></div>
              <div><div className="stat-value">{complaints.length}</div><div className="stat-label">Total</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.15)', color: 'var(--warning)' }}><Hourglass size={24} /></div>
              <div><div className="stat-value">{pending}</div><div className="stat-label">Pending</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.15)', color: 'var(--success)' }}><CheckCircle size={24} /></div>
              <div><div className="stat-value">{resolved}</div><div className="stat-label">Resolved</div></div>
            </div>
          </div>

          <div className="section-card">
            <div className="section-header"><span className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><ClipboardList size={18} /> All Complaints</span></div>
            <div className="section-body">
              {complaints.length === 0
                ? <div className="empty-state"><div className="empty-state-icon"><Inbox size={48} /></div><div className="empty-state-text">No complaints found</div></div>
                : <div className="table-wrap"><table>
                    <thead><tr><th>Title</th><th>Student</th><th>Description</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                      {complaints.map(c => (
                        <tr key={c.id}>
                          <td><strong>{c.title}</strong></td>
                          <td style={{ color: 'var(--text-secondary)' }}>{c.student?.name}</td>
                          <td style={{ color: 'var(--text-secondary)', maxWidth: 250 }}>{c.description}</td>
                          <td><span className={`badge badge-${c.status === 'RESOLVED' ? 'success' : 'warning'}`}>{c.status}</span></td>
                          <td style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {c.status === 'PENDING' && <button className="btn btn-success btn-sm" onClick={() => resolve(c.id)}>Resolve</button>}
                            <button className="btn btn-danger btn-sm" onClick={() => remove(c.id)}>Delete</button>
                          </td>
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
