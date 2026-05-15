import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Hotel, AlertTriangle, Loader2, LogIn, UserPlus, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'STUDENT' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const getPasswordStrength = (pass) => {
    if (!pass) return { label: '', color: 'transparent', width: '0%' };
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    if (score < 2) return { label: 'Weak', color: 'var(--danger)', width: '33%' };
    if (score < 4) return { label: 'Medium', color: 'var(--warning)', width: '66%' };
    return { label: 'Strong', color: 'var(--success)', width: '100%' };
  };
  const strength = getPasswordStrength(form.password);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const endpoint = tab === 'login' ? '/auth/login' : '/auth/register';
      const { data } = await api.post(endpoint, form);
      login(data);
      navigate(data.role === 'ADMIN' ? '/admin' : '/student');
    } catch (err) {
      if (err.response?.status === 403 || err.response?.status === 500) {
         if (tab === 'register') {
             setError('User already exists. Please login instead.');
         } else {
             setError('User not registered or invalid credentials.');
         }
      } else {
         setError(err.response?.data?.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon"><Hotel size={24} color="white" /></div>
          <span className="auth-logo-text">HostelHub</span>
        </div>

        <h1 className="auth-title">{tab === 'login' ? 'Welcome back' : 'Create account'}</h1>
        <p className="auth-subtitle">
          {tab === 'login' ? 'Sign in to your hostel portal' : 'Register to access the hostel system'}
        </p>

        <div className="auth-tabs">
          <button className={`auth-tab${tab === 'login' ? ' active' : ''}`} onClick={() => { setTab('login'); setError(''); }}>Login</button>
          <button className={`auth-tab${tab === 'register' ? ' active' : ''}`} onClick={() => { setTab('register'); setError(''); }}>Register</button>
        </div>

        {error && <div className="error-msg" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><AlertTriangle size={16} /> {error}</div>}

        <form onSubmit={submit}>
          {tab === 'register' && (
            <>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" name="name" placeholder="John Doe" value={form.name} onChange={handle} required />
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select className="form-input" name="role" value={form.role} onChange={handle} required>
                  <option value="STUDENT">Student</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            </>
          )}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-input" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handle} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input className="form-input" name="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={form.password} onChange={handle} required style={{ paddingRight: 40 }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {tab === 'register' && form.password && (
              <div style={{ marginTop: 8, fontSize: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Password Strength:</span>
                  <span style={{ color: strength.color, fontWeight: 'bold' }}>{strength.label}</span>
                </div>
                <div style={{ width: '100%', height: 4, background: 'var(--border)', borderRadius: 2 }}>
                  <div style={{ width: strength.width, height: '100%', background: strength.color, borderRadius: 2, transition: '0.3s' }}></div>
                </div>
              </div>
            )}
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? <><Loader2 size={16} className="spinner" style={{ width: 16, height: 16, margin: 0, borderWidth: 2 }} /> Please wait...</> : tab === 'login' ? <><LogIn size={16} /> Sign In</> : <><UserPlus size={16} /> Create Account</>}
          </button>
        </form>
      </div>
    </div>
  );
}
