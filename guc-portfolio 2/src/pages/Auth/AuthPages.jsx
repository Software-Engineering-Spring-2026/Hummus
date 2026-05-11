import { useState } from 'react'
import { User, Building2, BookOpen, ChevronRight, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'

export function LoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const { login, findUser, addToast } = useApp()
  const navigate = useNavigate()

  const roleRoutes = { student: '/student', employer: '/employer', instructor: '/instructor', admin: '/admin' }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please fill in all fields'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 700))
    const user = findUser(email)
    if (!user)         { setError('No account found with this email'); setLoading(false); return }
    if (!user.active)  { setError('This account has been deactivated'); setLoading(false); return }
    login(user)
    addToast(`Welcome back, ${user.firstName}!`, 'success')
    navigate(roleRoutes[user.role] || '/')
    setLoading(false)
  }

  const quickLogin = (role) => {
    const roleIds = { student: 1, instructor: 6, employer: 8, admin: 10 }
    const user = findUser(
      role === 'student'    ? 'ahmed.hassan@student.guc.edu.eg' :
      role === 'instructor' ? 'mona.salem@guc.edu.eg' :
      role === 'employer'   ? 'layla@techcorp.io' :
                              'admin@guc.edu.eg'
    )
    if (!user) return
    login(user)
    addToast(`Logged in as ${user.firstName} (${role})`, 'success')
    navigate(roleRoutes[role])
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', padding: 20 }}>
      <div style={{ position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 400, background: 'radial-gradient(ellipse, rgba(124,111,255,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 420 }} className="animate-fadeInUp">
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, marginBottom: 8, letterSpacing: -0.5 }}>
            port<span style={{ color: 'var(--accent)' }}>folio</span>.guc
          </div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: 10 }}>Welcome back</h1>
          <p className="text-secondary" style={{ fontSize: 14 }}>Sign in to your account to continue</p>
        </div>

        <div className="card card-p" style={{ marginBottom: 16 }}>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="input-group">
              <label className="input-label">Email address</label>
              <input className="input" type="email" placeholder="your.name@student.guc.edu.eg"
                value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="input-group">
              <div className="flex-between">
                <label className="input-label">Password</label>
                <Link to="/forgot-password" style={{ fontSize: 12, color: 'var(--accent-text)' }}>Forgot password?</Link>
              </div>
              <input className="input" type="password" placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            {error && (
              <div style={{ background: 'var(--red-dim)', border: '1px solid rgba(226,75,74,0.25)', borderRadius: 'var(--radius-md)', padding: '10px 14px', fontSize: 13, color: '#F09595' }}>
                {error}
              </div>
            )}
            <button type="submit" className="btn btn-primary w-full" style={{ justifyContent: 'center', padding: 13 }} disabled={loading}>
              {loading
                ? <span style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                : 'Sign in'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--accent-text)' }}>Sign up</Link>
        </p>

        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 16 }}>
          <div className="text-xs text-muted" style={{ textAlign: 'center', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.6px' }}>Quick demo login</div>
          <div className="grid-2" style={{ gap: 8 }}>
            {[
              { role: 'student',    label: 'Student',    color: 'var(--accent)' },
              { role: 'instructor', label: 'Instructor', color: 'var(--teal)'   },
              { role: 'employer',   label: 'Employer',   color: 'var(--coral)'  },
              { role: 'admin',      label: 'Admin',      color: 'var(--amber)'  },
            ].map(({ role, label, color }) => (
              <button key={role} onClick={() => quickLogin(role)}
                className="btn btn-ghost btn-sm" style={{ justifyContent: 'center', borderColor: `${color}33` }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function RegisterPage() {
  const [step, setStep]     = useState(1)
  const [role, setRole]     = useState('')
  const [form, setForm]     = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '', companyName: '', companyEmail: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { register, addToast } = useApp()

  const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Passwords do not match'); return }
    if (form.password.length < 6)       { setError('Password must be at least 6 characters'); return }
    if (role !== 'employer' && !form.email.includes('@')) { setError('Please enter a valid email'); return }

    setLoading(true)
    await new Promise(r => setTimeout(r, 800))

    
    const newUser = register({
      role,
      firstName:    form.firstName,
      lastName:     form.lastName,
      email:        form.email,
      password:     form.password,
      companyName:  form.companyName,
      companyEmail: form.companyEmail,
    })

    addToast(`Welcome to portfolio.guc, ${newUser.firstName}!`, 'success')

    const roleRoutes = { student: '/student', employer: '/employer', instructor: '/instructor' }
    navigate(roleRoutes[role] || '/')
    setLoading(false)
  }

  const roles = [
    { id: 'student',    icon: '◎', label: 'Student',          desc: 'Showcase your projects & find internships', color: 'var(--accent)' },
    { id: 'instructor', icon: '◈', label: 'Course Instructor', desc: 'Manage courses and review student work',    color: 'var(--teal)'   },
    { id: 'employer',   icon: '◉', label: 'Employer',          desc: 'Discover talent and post internships',      color: 'var(--coral)'  },
  ]

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', padding: 20 }}>
      <div style={{ position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 400, background: 'radial-gradient(ellipse, rgba(124,111,255,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: step === 1 ? 580 : 440 }} className="animate-fadeInUp">
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, marginBottom: 8, letterSpacing: -0.5 }}>
            port<span style={{ color: 'var(--accent)' }}>folio</span>.guc
          </div>
          <h1 style={{ fontSize: '1.7rem', marginBottom: 8 }}>
            {step === 1 ? 'Create your account' : `Join as ${role}`}
          </h1>
          <p className="text-secondary" style={{ fontSize: 14 }}>
            {step === 1 ? 'Choose your account type to get started' : 'Fill in your details below'}
          </p>
        </div>

        {}
        <div className="flex-center gap-2" style={{ marginBottom: 28, justifyContent: 'center' }}>
          {[1, 2].map(s => (
            <div key={s} style={{
              height: 4, borderRadius: 99,
              background: s <= step ? 'var(--accent)' : 'var(--border)',
              width: s <= step ? 40 : 24,
              transition: 'all 0.3s ease',
            }} />
          ))}
        </div>

        {}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {roles.map(r => (
              <div key={r.id}
                onClick={() => { setRole(r.id); setStep(2) }}
                className="card card-p animate-fadeIn"
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${r.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: r.color }}>
                  {r.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 3 }}>{r.label}</div>
                  <div className="text-sm text-muted">{r.desc}</div>
                </div>
                <span style={{ color: 'var(--text-muted)', fontSize: 18 }}>→</span>
              </div>
            ))}
          </div>
        )}

        {}
        {step === 2 && (
          <div className="card card-p animate-scaleIn">
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {role === 'employer' ? (
                <>
                  <div className="input-group">
                    <label className="input-label">Company name *</label>
                    <input className="input" placeholder="e.g. TechCorp Egypt" value={form.companyName} onChange={e => update('companyName', e.target.value)} required />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Company email *</label>
                    <input className="input" type="email" placeholder="contact@company.com" value={form.companyEmail} onChange={e => update('companyEmail', e.target.value)} required />
                  </div>
                </>
              ) : (
                <>
                  <div className="grid-2">
                    <div className="input-group">
                      <label className="input-label">First name *</label>
                      <input className="input" placeholder="Ahmed" value={form.firstName} onChange={e => update('firstName', e.target.value)} required />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Last name *</label>
                      <input className="input" placeholder="Hassan" value={form.lastName} onChange={e => update('lastName', e.target.value)} required />
                    </div>
                  </div>
                  <div className="input-group">
                    <label className="input-label">
                      {role === 'instructor' ? 'GUC email *' : 'GUC student email *'}
                    </label>
                    <input className="input" type="email"
                      placeholder={role === 'instructor' ? 'name@guc.edu.eg' : 'name@student.guc.edu.eg'}
                      value={form.email} onChange={e => update('email', e.target.value)} required />
                  </div>
                </>
              )}

              <div className="input-group">
                <label className="input-label">Password *</label>
                <input className="input" type="password" placeholder="Min. 6 characters" value={form.password} onChange={e => update('password', e.target.value)} required />
              </div>
              <div className="input-group">
                <label className="input-label">Confirm password *</label>
                <input className="input" type="password" placeholder="Repeat password" value={form.confirm} onChange={e => update('confirm', e.target.value)} required />
              </div>

              {role === 'employer' && (
                <div className="input-group">
                  <label className="input-label">Tax certificate (PDF)</label>
                  <input className="input" type="file" accept=".pdf" style={{ paddingTop: 8 }} />
                  <span className="text-xs text-muted">Required for admin verification</span>
                </div>
              )}

              {error && (
                <div style={{ background: 'var(--red-dim)', border: '1px solid rgba(226,75,74,0.25)', borderRadius: 'var(--radius-md)', padding: '10px 14px', fontSize: 13, color: '#F09595' }}>
                  {error}
                </div>
              )}

              {role === 'employer' && (
                <div style={{ background: 'rgba(239,159,39,0.08)', border: '1px solid rgba(239,159,39,0.2)', borderRadius: 'var(--radius-md)', padding: '10px 14px', fontSize: 13, color: 'var(--amber)' }}>
                  ◷ Your account will be pending admin approval after registration.
                </div>
              )}

              <div className="flex-center gap-2" style={{ marginTop: 4 }}>
                <button type="button" className="btn btn-ghost" onClick={() => { setStep(1); setError('') }}>← Back</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} disabled={loading}>
                  {loading
                    ? <span style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    : 'Create account & sign in'}
                </button>
              </div>
            </form>
          </div>
        )}

        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', marginTop: 20 }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent-text)' }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export function ForgotPasswordPage() {
  const [step, setStep]       = useState(1)
  const [email, setEmail]     = useState('')
  const [otp, setOtp]         = useState('')
  const [newPass, setNewPass] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const navigate = useNavigate()
  const { addToast, findUser } = useApp()

  const handleSendOtp = async (e) => {
    e.preventDefault()
    setError('')
    const user = findUser(email)
    if (!user) { setError('No account found with this email'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 700))
    setLoading(false)
    setStep(2)
    addToast('OTP sent! Use 123456 for demo', 'info')
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    if (otp !== '123456') { addToast('Invalid OTP. Use 123456 for demo.', 'error'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 700))
    setLoading(false)
    setStep(3)
  }

  const handleReset = async (e) => {
    e.preventDefault()
    if (newPass.length < 6) { addToast('Password must be at least 6 characters', 'error'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 700))
    setLoading(false)
    addToast('Password reset successfully! Please sign in.', 'success')
    navigate('/login')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 400 }} className="animate-fadeInUp">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, marginBottom: 8 }}>
            port<span style={{ color: 'var(--accent)' }}>folio</span>.guc
          </div>
          <h1 style={{ fontSize: '1.7rem', marginBottom: 8 }}>Reset your password</h1>
          <p className="text-secondary" style={{ fontSize: 14 }}>
            {step === 1 ? "We'll send a one-time password to your email." :
             step === 2 ? `Enter the OTP sent to ${email}` :
             'Choose a new password.'}
          </p>
        </div>

        <div className="card card-p">
          {step === 1 && (
            <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="input-group">
                <label className="input-label">Email address</label>
                <input className="input" type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              {error && <div style={{ background: 'var(--red-dim)', border: '1px solid rgba(226,75,74,0.25)', borderRadius: 'var(--radius-md)', padding: '10px 14px', fontSize: 13, color: '#F09595' }}>{error}</div>}
              <button className="btn btn-primary w-full" style={{ justifyContent: 'center' }} disabled={loading}>{loading ? '...' : 'Send OTP'}</button>
              <Link to="/login" style={{ textAlign: 'center', fontSize: 13 }}>← Back to login</Link>
            </form>
          )}
          {step === 2 && (
            <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="input-group">
                <label className="input-label">OTP code</label>
                <input className="input" placeholder="123456" value={otp} onChange={e => setOtp(e.target.value)}
                  maxLength={6} required style={{ fontSize: 24, letterSpacing: 8, textAlign: 'center' }} />
                <span className="text-xs text-muted">Use <code style={{ color: 'var(--accent-text)' }}>123456</code> for demo</span>
              </div>
              <button className="btn btn-primary w-full" style={{ justifyContent: 'center' }} disabled={loading}>{loading ? '...' : 'Verify OTP'}</button>
            </form>
          )}
          {step === 3 && (
            <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="input-group">
                <label className="input-label">New password</label>
                <input className="input" type="password" placeholder="Min. 6 characters" value={newPass} onChange={e => setNewPass(e.target.value)} required />
              </div>
              <button className="btn btn-primary w-full" style={{ justifyContent: 'center' }} disabled={loading}>{loading ? '...' : 'Reset password'}</button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
