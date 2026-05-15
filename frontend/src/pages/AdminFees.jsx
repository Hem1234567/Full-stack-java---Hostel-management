import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';
import { CreditCard, CheckCircle, AlertTriangle, Plus, Receipt, PlusCircle } from 'lucide-react';

export default function AdminFees() {
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ studentId: '', month: '', amount: '' });

  const fetchFees = () => api.get('/admin/fees').then(r => setFees(r.data));
  const fetchStudents = () => api.get('/admin/students').then(r => setStudents(r.data));
  useEffect(() => { fetchFees(); fetchStudents(); }, []);

  const create = async (e) => {
    e.preventDefault();
    await api.post('/admin/fees', form);
    setModal(false); setForm({ studentId: '', month: '', amount: '' }); fetchFees();
  };

  const totalCollected = fees.filter(f => f.paid).reduce((s, f) => s + f.amount, 0);
  const totalDue = fees.filter(f => !f.paid).reduce((s, f) => s + f.amount, 0);

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <div className="topbar">
          <div><div className="topbar-title">Fee Management</div><div className="topbar-subtitle">Create and track hostel fees</div></div>
          <button className="btn btn-primary" style={{ width: 'auto' }} onClick={() => setModal(true)}><Plus size={16} /> Add Fee</button>
        </div>
        <div className="page-content">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(99,102,241,0.15)', color: 'var(--accent)' }}><CreditCard size={24} /></div>
              <div><div className="stat-value">{fees.length}</div><div className="stat-label">Total Records</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.15)', color: 'var(--success)' }}><CheckCircle size={24} /></div>
              <div><div className="stat-value">₹{totalCollected.toLocaleString()}</div><div className="stat-label">Collected</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(239,68,68,0.15)', color: 'var(--danger)' }}><AlertTriangle size={24} /></div>
              <div><div className="stat-value">₹{totalDue.toLocaleString()}</div><div className="stat-label">Pending</div></div>
            </div>
          </div>

          <div className="section-card">
            <div className="section-header"><span className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Receipt size={18} /> All Fee Records</span></div>
            <div className="section-body">
              {fees.length === 0
                ? <div className="empty-state"><div className="empty-state-icon"><Receipt size={48} /></div><div className="empty-state-text">No fee records yet</div></div>
                : <div className="table-wrap"><table>
                    <thead><tr><th>Student</th><th>Month</th><th>Amount</th><th>Status</th><th>Paid On</th></tr></thead>
                    <tbody>
                      {fees.map(f => (
                        <tr key={f.id}>
                          <td>{f.student?.name}</td>
                          <td>{f.month}</td>
                          <td>₹{f.amount?.toLocaleString()}</td>
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

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><PlusCircle size={20} /> Create Fee Record</div>
            <form onSubmit={create}>
              <div className="form-group"><label className="form-label">Student</label>
                <select className="form-select" value={form.studentId} onChange={e => setForm({ ...form, studentId: e.target.value })} required>
                  <option value="">-- Select Student --</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select></div>
              <div className="form-group"><label className="form-label">Month</label>
                <input className="form-input" placeholder="e.g. January 2025" value={form.month} onChange={e => setForm({ ...form, month: e.target.value })} required /></div>
              <div className="form-group"><label className="form-label">Amount (₹)</label>
                <input className="form-input" type="number" min="0" placeholder="e.g. 5000" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required /></div>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ width: 'auto' }}>Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
