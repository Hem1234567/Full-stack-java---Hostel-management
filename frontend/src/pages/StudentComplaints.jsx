import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';
import { Plus, Inbox, ClipboardList } from 'lucide-react';

export default function StudentComplaints() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(false);

  const fetch = () => api.get(`/complaints/student/${user.id}`).then(r => setComplaints(r.data)).catch(() => {});

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetch(); }, []);

  const submit = async (e) => {
    e.preventDefault(); setLoading(true);
    await api.post('/complaints', { studentId: String(user.id), ...form });
    setModal(false); setForm({ title: '', description: '' }); setLoading(false); fetch();
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <div className="topbar">
          <div>
            <div className="topbar-title">My Complaints</div>
            <div className="topbar-subtitle">Submit and track your complaints</div>
          </div>
          <button className="btn btn-primary" style={{ width: 'auto' }} onClick={() => setModal(true)}><Plus size={16} /> New Complaint</button>
        </div>
        <div className="page-content">
          <div className="section-card">
            <div className="section-body">
              {complaints.length === 0
                ? <div className="empty-state"><div className="empty-state-icon"><Inbox size={48} /></div><div className="empty-state-text">No complaints yet. Click "New Complaint" to raise one.</div></div>
                : <div className="table-wrap"><table>
                    <thead><tr><th>#</th><th>Title</th><th>Description</th><th>Status</th></tr></thead>
                    <tbody>
                      {complaints.map((c, i) => (
                        <tr key={c.id}>
                          <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                          <td><strong>{c.title}</strong></td>
                          <td style={{ color: 'var(--text-secondary)', maxWidth: 300 }}>{c.description}</td>
                          <td><span className={`badge badge-${c.status === 'RESOLVED' ? 'success' : 'warning'}`}>{c.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table></div>
              }
            </div>
          </div>
        </div>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><ClipboardList size={20} /> Submit Complaint</div>
            <form onSubmit={submit}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input className="form-input" placeholder="Brief title" value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" rows={4} placeholder="Describe the issue..."
                  style={{ resize: 'vertical' }} value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })} required />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ width: 'auto' }} disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
