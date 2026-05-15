import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';
import { CreditCard, Banknote, CheckCircle, AlertTriangle, Receipt } from 'lucide-react';

export default function StudentFees() {
  const { user } = useAuth();
  const [fees, setFees] = useState([]);

  const fetch = () => api.get(`/fees/student/${user.id}`).then(r => setFees(r.data)).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetch(); }, []);

  const pay = async (id) => {
    await api.put(`/fees/${id}/pay`);
    fetch();
  };

  const total = fees.reduce((s, f) => s + f.amount, 0);
  const paid = fees.filter(f => f.paid).reduce((s, f) => s + f.amount, 0);
  const due = total - paid;

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <div className="topbar">
          <div><div className="topbar-title">Fee Management</div><div className="topbar-subtitle">Track and pay your hostel fees</div></div>
          <span style={{ color: 'var(--text-secondary)' }}><CreditCard size={28} /></span>
        </div>
        <div className="page-content">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(99,102,241,0.15)', color: 'var(--accent)' }}><Banknote size={24} /></div>
              <div><div className="stat-value">₹{total.toLocaleString()}</div><div className="stat-label">Total Fees</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.15)', color: 'var(--success)' }}><CheckCircle size={24} /></div>
              <div><div className="stat-value">₹{paid.toLocaleString()}</div><div className="stat-label">Paid Amount</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(239,68,68,0.15)', color: 'var(--danger)' }}><AlertTriangle size={24} /></div>
              <div><div className="stat-value">₹{due.toLocaleString()}</div><div className="stat-label">Due Amount</div></div>
            </div>
          </div>

          <div className="section-card">
            <div className="section-header"><span className="section-title">Fee Records</span></div>
            <div className="section-body">
              {fees.length === 0
                ? <div className="empty-state"><div className="empty-state-icon"><Receipt size={48} /></div><div className="empty-state-text">No fee records found</div></div>
                : <div className="table-wrap"><table>
                    <thead><tr><th>Month</th><th>Amount</th><th>Status</th><th>Paid On</th><th>Action</th></tr></thead>
                    <tbody>
                      {fees.map(f => (
                        <tr key={f.id}>
                          <td><strong>{f.month}</strong></td>
                          <td>₹{f.amount.toLocaleString()}</td>
                          <td><span className={`badge badge-${f.paid ? 'success' : 'danger'}`}>{f.paid ? 'Paid' : 'Unpaid'}</span></td>
                          <td style={{ color: 'var(--text-secondary)' }}>{f.paymentDate || '—'}</td>
                          <td>
                            {!f.paid && (
                              <button className="btn btn-success btn-sm" onClick={() => pay(f.id)}>Pay Now</button>
                            )}
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
