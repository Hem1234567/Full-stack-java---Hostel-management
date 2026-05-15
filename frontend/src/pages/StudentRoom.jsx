import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';
import { BedDouble, CheckCircle, Users, CalendarDays, KeySquare, DoorOpen } from 'lucide-react';

export default function StudentRoom() {
  const { user } = useAuth();
  const [allocation, setAllocation] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      api.get(`/rooms/allocation/${user.id}`),
      api.get('/rooms'),
    ]).then(([a, r]) => {
      if (a.status === 'fulfilled' && a.value.data) setAllocation(a.value.data);
      if (r.status === 'fulfilled') setRooms(r.value.data);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <div className="app-layout"><Sidebar /><div className="main-content"><div className="spinner" /></div></div>;

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <div className="topbar">
          <div><div className="topbar-title">My Room</div><div className="topbar-subtitle">View your room allocation details</div></div>
          <span style={{ color: 'var(--text-secondary)' }}><BedDouble size={28} /></span>
        </div>
        <div className="page-content">
          {allocation ? (
            <div className="section-card" style={{ border: '1px solid var(--border-glow)' }}>
              <div className="section-header" style={{ background: 'var(--accent-glow)' }}>
                <span className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><CheckCircle size={18} color="var(--success)" /> Room Allocated</span>
                <span className="badge badge-success">Active</span>
              </div>
              <div className="section-body">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
                  {[
                    { label: 'Room Number', value: allocation.room?.roomNumber, icon: <KeySquare size={28} /> },
                    { label: 'Capacity',    value: `${allocation.room?.capacity} beds`, icon: <BedDouble size={28} /> },
                    { label: 'Occupancy',   value: `${allocation.room?.currentOccupancy}/${allocation.room?.capacity}`, icon: <Users size={28} /> },
                    { label: 'Allocated On',value: allocation.allocationDate, icon: <CalendarDays size={28} /> },
                  ].map(item => (
                    <div key={item.label} style={{ background: 'var(--bg-base)', borderRadius: 'var(--radius-sm)', padding: '20px', border: '1px solid var(--border)' }}>
                      <div style={{ marginBottom: 8, color: 'var(--accent-light)' }}>{item.icon}</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: 12, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</div>
                      <div style={{ fontSize: 22, fontWeight: 700 }}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="section-card">
              <div className="section-body">
                <div className="empty-state">
                  <div className="empty-state-icon"><BedDouble size={48} /></div>
                  <div className="empty-state-text">No room allocated yet. Please contact the admin.</div>
                </div>
              </div>
            </div>
          )}

          <div className="section-card">
            <div className="section-header"><span className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><DoorOpen size={18} /> All Available Rooms</span></div>
            <div className="section-body">
              <div className="table-wrap"><table>
                <thead><tr><th>Room No.</th><th>Capacity</th><th>Occupancy</th><th>Availability</th></tr></thead>
                <tbody>
                  {rooms.map(r => {
                    const avail = r.capacity - r.currentOccupancy;
                    return (
                      <tr key={r.id}>
                        <td><strong>{r.roomNumber}</strong></td>
                        <td>{r.capacity} beds</td>
                        <td>{r.currentOccupancy}/{r.capacity}</td>
                        <td><span className={`badge badge-${avail > 0 ? 'success' : 'danger'}`}>{avail > 0 ? `${avail} beds free` : 'Full'}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
