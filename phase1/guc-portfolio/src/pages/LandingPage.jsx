import { useState } from 'react'
import { FolderKanban, GraduationCap, Star, ChevronRight, Users, Briefcase, Globe } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { projects, users, courses } from '../data/data'
import { getInitials, getAvatarColors } from '../data/data'

export function LandingPage() {
  const navigate = useNavigate()
  const publicProjects = projects.filter(p => p.visibility === 'public').slice(0, 3)
  const students = users.filter(u => u.role === 'student').slice(0, 4)
  const courseMap = Object.fromEntries(courses.map(c => [c.id, c]))
  const [hoveredProject, setHoveredProject] = useState(null)

  return (
    <div style={{ minHeight: '100vh', background: '#080C0A', fontFamily: 'var(--font-body)', overflowX: 'hidden' }}>

      {}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(rgba(0,198,118,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,198,118,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        animation: 'gridMove 8s linear infinite',
      }} />

      {}
      <div style={{ position: 'fixed', top: '-20%', left: '60%', width: 700, height: 700, background: 'radial-gradient(ellipse, rgba(0,198,118,0.07) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', top: '40%', left: '-10%', width: 500, height: 500, background: 'radial-gradient(ellipse, rgba(212,168,67,0.05) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 0 }} />

      {}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 48px',
        background: 'rgba(8,12,10,0.8)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,198,118,0.1)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, letterSpacing: -0.3 }}>
          port<span style={{ color: 'var(--accent)' }}>folio</span>.<span style={{ color: 'var(--gold)' }}>guc</span>
        </div>
        <div style={{ display: 'flex', gap: 28 }}>
          {['Explore', 'Portfolios', 'Internships'].map(l => (
            <span key={l} onClick={() => navigate('/explore')}
              style={{ fontSize: 13, color: 'rgba(232,245,238,0.45)', cursor: 'pointer', transition: 'color 0.2s', fontWeight: 500 }}
              onMouseEnter={e => e.target.style.color = 'var(--accent-text)'}
              onMouseLeave={e => e.target.style.color = 'rgba(232,245,238,0.45)'}>{l}</span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/login" className="btn btn-ghost btn-sm">Sign in</Link>
          <Link to="/register" className="btn btn-primary btn-sm">Get started</Link>
        </div>
      </nav>

      {}
      <div style={{ padding: '100px 48px 80px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 720 }} className="animate-fadeInUp">
          {}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(0,198,118,0.08)', border: '1px solid rgba(0,198,118,0.2)',
            borderRadius: 99, padding: '6px 16px', fontSize: 12,
            color: 'var(--accent-text)', marginBottom: 32, fontWeight: 500,
            letterSpacing: '0.5px',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', animation: 'pulse 2s infinite', display: 'inline-block' }} />
            GUC STUDENT PLATFORM · SPRING 2026
          </div>

          <h1 style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4rem)', marginBottom: 24, lineHeight: 1.05, letterSpacing: '-0.04em' }}>
            Your work deserves{' '}
            <span style={{
              background: 'linear-gradient(135deg, var(--accent) 0%, var(--gold) 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              to be seen.
            </span>
          </h1>

          <p style={{ fontSize: 17, color: 'rgba(232,245,238,0.5)', maxWidth: 500, lineHeight: 1.8, marginBottom: 44, fontWeight: 300 }}>
            Showcase your projects. Connect with top employers. Discover what GUC students are building — all in one platform.
          </p>

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg" style={{ gap: 10 }}>
              Build your portfolio
              <span style={{ fontSize: 18 }}>→</span>
            </Link>
            <Link to="/explore" className="btn btn-ghost btn-lg">
              Browse projects
            </Link>
          </div>
        </div>

        {}
        <div style={{ position: 'absolute', right: 48, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: 14 }} className="animate-slideInRight delay-3">
          {[
            { num: '1,240+', label: 'Student portfolios', color: 'var(--accent)', icon: '◎' },
            { num: '3,800+', label: 'Projects published',  color: 'var(--gold)',   icon: '◈' },
            { num: '86+',    label: 'Hiring companies',    color: 'var(--teal-light)', icon: '◉' },
          ].map((s, i) => (
            <div key={i} className={`animate-fadeIn delay-${i + 3}`} style={{
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${s.color}25`,
              borderRadius: 'var(--radius-lg)', padding: '14px 20px',
              backdropFilter: 'blur(8px)', minWidth: 200,
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = `${s.color}60`}
              onMouseLeave={e => e.currentTarget.style.borderColor = `${s.color}25`}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 20, color: s.color }}>{s.icon}</span>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.num}</div>
                  <div style={{ fontSize: 11, color: 'rgba(232,245,238,0.35)', marginTop: 3, letterSpacing: '0.3px' }}>{s.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {}
      <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(0,198,118,0.2), rgba(212,168,67,0.2), transparent)', margin: '0 48px', position: 'relative', zIndex: 1 }} />

      {}
      <div style={{ padding: '64px 48px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 8 }}>Featured</div>
            <h2 style={{ fontSize: '1.8rem' }}>Top Projects</h2>
          </div>
          <Link to="/explore" style={{ fontSize: 13, color: 'var(--accent-text)', display: 'flex', alignItems: 'center', gap: 6 }}>
            View all <span>→</span>
          </Link>
        </div>

        <div className="grid-3">
          {publicProjects.map((p, i) => {
            const course = courseMap[p.course]
            const creator = users.find(u => u.id === p.creatorId)
            const isBachelor = course?.name === 'Bachelor Project'
            return (
              <div key={p.id}
                className={`animate-fadeIn delay-${i + 1}`}
                onMouseEnter={() => setHoveredProject(p.id)}
                onMouseLeave={() => setHoveredProject(null)}
                onClick={() => navigate('/explore')}
                style={{
                  background: hoveredProject === p.id ? 'rgba(0,198,118,0.05)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${hoveredProject === p.id ? 'rgba(0,198,118,0.25)' : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: 'var(--radius-lg)', padding: '20px 22px',
                  cursor: 'pointer', transition: 'all 0.25s',
                  transform: hoveredProject === p.id ? 'translateY(-3px)' : 'none',
                  boxShadow: hoveredProject === p.id ? '0 8px 30px rgba(0,198,118,0.1)' : 'none',
                  display: 'flex', flexDirection: 'column', gap: 12,
                }}>
                <div className="flex-between">
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: isBachelor ? 'rgba(212,168,67,0.1)' : 'rgba(0,198,118,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: isBachelor ? 'var(--gold)' : 'var(--accent)' }}>
                    {isBachelor ? '' : '◈'}
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 99, background: isBachelor ? 'var(--gold-dim)' : 'var(--accent-dim)', color: isBachelor ? 'var(--gold-text)' : 'var(--accent-text)', fontWeight: 500 }}>
                      {isBachelor ? 'Bachelor' : course?.code}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--gold)', fontWeight: 600 }}> {p.rating}</span>
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, marginBottom: 6, lineHeight: 1.3 }}>{p.title}</div>
                  <div style={{ fontSize: 13, color: 'rgba(232,245,238,0.4)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.description}</div>
                </div>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  {p.languages.slice(0,3).map(l => (
                    <span key={l} style={{ fontSize: 11, padding: '3px 8px', borderRadius: 99, background: 'rgba(255,255,255,0.06)', color: 'rgba(232,245,238,0.5)', fontWeight: 500 }}>{l}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div className={`avatar avatar-sm ${getAvatarColors(creator?.avatar)}`}>{getInitials(creator?.firstName, creator?.lastName)}</div>
                    <span style={{ fontSize: 12, color: 'rgba(232,245,238,0.4)' }}>{creator?.firstName} {creator?.lastName}</span>
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--accent)', opacity: hoveredProject === p.id ? 1 : 0, transition: 'opacity 0.2s' }}>View →</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {}
      <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(212,168,67,0.15), rgba(0,198,118,0.15), transparent)', margin: '0 48px', position: 'relative', zIndex: 1 }} />

      {}
      <div style={{ padding: '64px 48px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--gold)', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 8 }}>Talent</div>
            <h2 style={{ fontSize: '1.8rem' }}>Student Portfolios</h2>
          </div>
          <Link to="/explore" style={{ fontSize: 13, color: 'var(--accent-text)', display: 'flex', alignItems: 'center', gap: 6 }}>Browse all <span>→</span></Link>
        </div>
        <div className="grid-4">
          {students.map((s, i) => (
            <div key={s.id} className={`animate-fadeIn delay-${i + 1}`}
              onClick={() => navigate('/explore')}
              style={{
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 'var(--radius-lg)', padding: '24px 20px',
                textAlign: 'center', cursor: 'pointer', transition: 'all 0.25s',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(212,168,67,0.25)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(212,168,67,0.08)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <div className={`avatar avatar-lg ${getAvatarColors(s.avatar)}`}>{getInitials(s.firstName, s.lastName)}</div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14 }}>{s.firstName} {s.lastName}</div>
                <div style={{ fontSize: 11, color: 'rgba(232,245,238,0.35)', marginTop: 3 }}>{s.major}</div>
              </div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
                {s.skills.slice(0,2).map(sk => (
                  <span key={sk} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 99, background: 'rgba(0,198,118,0.08)', color: 'var(--accent-text)', fontWeight: 500 }}>{sk}</span>
                ))}
              </div>
              <div style={{ fontSize: 12, color: 'var(--gold-text)', fontWeight: 600 }}>
                {projects.filter(p => p.creatorId === s.id).length} projects
              </div>
            </div>
          ))}
        </div>
      </div>

      {}
      <div style={{ padding: '80px 48px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 300, background: 'radial-gradient(ellipse, rgba(0,198,118,0.08) 0%, rgba(212,168,67,0.04) 50%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 560, margin: '0 auto', position: 'relative' }}>
          <div style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 16 }}>Get started</div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', marginBottom: 16, lineHeight: 1.15 }}>
            Ready to showcase your work?
          </h2>
          <p style={{ color: 'rgba(232,245,238,0.45)', marginBottom: 36, fontSize: 16, lineHeight: 1.7 }}>
            Join thousands of GUC students already building their digital presence and connecting with top employers.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg">Create free portfolio →</Link>
            <Link to="/login" className="btn btn-ghost btn-lg">Sign in</Link>
          </div>
        </div>
      </div>

      {}
      <footer style={{ borderTop: '1px solid rgba(0,198,118,0.08)', padding: '24px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14, letterSpacing: -0.3 }}>
          port<span style={{ color: 'var(--accent)' }}>folio</span>.<span style={{ color: 'var(--gold)' }}>guc</span>
        </div>
        <div style={{ fontSize: 12, color: 'rgba(232,245,238,0.25)' }}>© 2026 GUC · Media Engineering & Technology</div>
        <div style={{ display: 'flex', gap: 24 }}>
          {[['Login', '/login'], ['Register', '/register'], ['Explore', '/explore']].map(([label, to]) => (
            <Link key={to} to={to} style={{ fontSize: 12, color: 'rgba(232,245,238,0.3)', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = 'var(--accent-text)'}
              onMouseLeave={e => e.target.style.color = 'rgba(232,245,238,0.3)'}>{label}</Link>
          ))}
        </div>
      </footer>
    </div>
  )
}
