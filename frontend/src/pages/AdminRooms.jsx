import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';
import { BedDouble, Plus, KeySquare, PlusCircle } from 'lucide-react';

export default function AdminRooms() {
  const [rooms, setRooms] = useState([]);
  const [students, setStudents] = useState([]);
  const [modal, setModal] = useState(false);
  const [allocModal, setAllocModal] = useState(false);
  const [form, setForm] = useState({ roomNumber: '', capacity: '', currentOccupancy: '0' });
  const [allocForm, setAllocForm] = useState({ studentId: '', roomId: '' });

  const fetchRooms = () => api.get('/rooms').then(r => setRooms(r.data));
  const fetchStudents = () => api.get('/admin/students').then(r => setStudents(r.data));

  useEffect(() => { fetchRooms(); fetchStudents(); }, []);

  const createRoom = async (e) => {
    e.preventDefault();
    await api.post('/admin/rooms', {
      roomNumber: form.roomNumber,
      capacity: parseInt(form.capacity),
      currentOccupancy: parseInt(form.currentOccupancy),
    });
    setModal(false); setForm({ roomNumber: '', capacity: '', currentOccupancy: '0' }); fetchRooms();
  };

  const deleteRoom = async (id) => { await api.delete(`/admin/rooms/${id}`); fetchRooms(); };

  const allocate = async (e) => {
    e.preventDefault();
    await api.post('/admin/rooms/allocate', { studentId: parseInt(allocForm.studentId), roomId: parseInt(allocForm.roomId) });
    setAllocModal(false); setAllocForm({ studentId: '', roomId: '' }); fetchRooms();
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <div className="topbar">
          <div><div className="topbar-title">Room Management</div><div className="topbar-subtitle">Manage hostel rooms and allocations</div></div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-ghost" onClick={() => setAllocModal(true)}><KeySquare size={16} /> Allocate Room</button>
            <button className="btn btn-primary" style={{ width: 'auto' }} onClick={() => setModal(true)}><Plus size={16} /> Add Room</button>
          </div>
        </div>
        <div className="page-content">
          <div className="section-card">
            <div className="section-header"><span className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><BedDouble size={18} /> All Rooms</span></div>
            <div className="section-body">
              {rooms.length === 0
                ? <div className="empty-state"><div className="empty-state-icon"><BedDouble size={48} /></div><div className="empty-state-text">No rooms added yet</div></div>
                : <div className="table-wrap"><table>
                    <thead><tr><th>Room No.</th><th>Capacity</th><th>Occupancy</th><th>Status</th><th>Action</th></tr></thead>
                    <tbody>
                      {rooms.map(r => {
                        const avail = r.capacity - r.currentOccupancy;
                        return (
                          <tr key={r.id}>
                            <td><strong>{r.roomNumber}</strong></td>
                            <td>{r.capacity}</td>
                            <td>{r.currentOccupancy}/{r.capacity}</td>
                            <td><span className={`badge badge-${avail > 0 ? 'success' : 'danger'}`}>{avail > 0 ? 'Available' : 'Full'}</span></td>
                            <td><button className="btn btn-danger btn-sm" onClick={() => deleteRoom(r.id)}>Delete</button></td>
                          </tr>
                        );
                      })}
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
            <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><PlusCircle size={20} /> Add New Room</div>
            <form onSubmit={createRoom}>
              <div className="form-group"><label className="form-label">Room Number</label>
                <input className="form-input" placeholder="e.g. A101" value={form.roomNumber} onChange={e => setForm({ ...form, roomNumber: e.target.value })} required /></div>
              <div className="form-group"><label className="form-label">Capacity</label>
                <input className="form-input" type="number" min="1" placeholder="e.g. 3" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} required /></div>
              <div className="form-group"><label className="form-label">Current Occupancy</label>
                <input className="form-input" type="number" min="0" value={form.currentOccupancy} onChange={e => setForm({ ...form, currentOccupancy: e.target.value })} required /></div>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ width: 'auto' }}>Add Room</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {allocModal && (
        <div className="modal-overlay" onClick={() => setAllocModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><KeySquare size={20} /> Allocate Room</div>
            <form onSubmit={allocate}>
              <div className="form-group"><label className="form-label">Select Student</label>
                <select className="form-select" value={allocForm.studentId} onChange={e => setAllocForm({ ...allocForm, studentId: e.target.value })} required>
                  <option value="">-- Choose Student --</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.email})</option>)}
                </select></div>
              <div className="form-group"><label className="form-label">Select Room</label>
                <select className="form-select" value={allocForm.roomId} onChange={e => setAllocForm({ ...allocForm, roomId: e.target.value })} required>
                  <option value="">-- Choose Room --</option>
                  {rooms.filter(r => r.currentOccupancy < r.capacity).map(r => <option key={r.id} value={r.id}>Room {r.roomNumber} ({r.capacity - r.currentOccupancy} beds free)</option>)}
                </select></div>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setAllocModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ width: 'auto' }}>Allocate</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
