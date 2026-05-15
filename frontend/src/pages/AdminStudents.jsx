import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';
import { Users, UserX } from 'lucide-react';

export default function AdminStudents() {
  const [students, setStudents] = useState([]);

  const fetch = () => api.get('/admin/students').then(r => setStudents(r.data));
  useEffect(() => { fetch(); }, []);

  const remove = async (id) => { await api.delete(`/admin/users/${id}`); fetch(); };
  const promote = async (id) => { await api.put(`/admin/users/${id}/promote`); fetch(); };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <div className="topbar">
          <div><div className="topbar-title">Students</div><div className="topbar-subtitle">Manage registered students</div></div>
          <div className="badge badge-info" style={{ padding: '8px 16px', fontSize: 14 }}>
            {students.length} Students
          </div>
        </div>
        <div className="page-content">
          <div className="section-card">
            <div className="section-header"><span className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Users size={18} /> All Students</span></div>
            <div className="section-body">
              {students.length === 0
                ? <div className="empty-state"><div className="empty-state-icon"><UserX size={48} /></div><div className="empty-state-text">No students registered yet</div></div>
                : <div className="table-wrap"><table>
                    <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Role</th><th>Action</th></tr></thead>
                    <tbody>
                      {students.map((s, i) => (
                        <tr key={s.id}>
                          <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div style={{
                                width: 32, height: 32, borderRadius: '50%',
                                background: 'linear-gradient(135deg,var(--accent),#8b5cf6)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 12, fontWeight: 700, color: 'white', flexShrink: 0
                              }}>
                                {s.name?.slice(0, 2).toUpperCase()}
                              </div>
                              <strong>{s.name}</strong>
                            </div>
                          </td>
                          <td style={{ color: 'var(--text-secondary)' }}>{s.email}</td>
                          <td><span className="badge badge-info">{s.role}</span></td>
                          <td>
                            <div style={{ display: 'flex', gap: 8 }}>
                              <button className="btn btn-warning btn-sm" onClick={() => promote(s.id)}>Make Admin</button>
                              <button className="btn btn-danger btn-sm" onClick={() => remove(s.id)}>Remove</button>
                            </div>
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
