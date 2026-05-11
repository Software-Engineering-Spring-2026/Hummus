import { useState } from 'react'
import { UserCheck, FolderKanban, Star, Briefcase, Flag, Edit2, Bell, CheckCheck, Circle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { projects, users, courses, internships, defaultFavorites, getInitials, getAvatarColors } from '../../data/data'
import { Sidebar, Topbar, Modal, ConfirmModal, SearchBar, EmptyState } from '../../components/Components'

function StudentLayout({ children, title }) {
  return (
    <div className="layout">
      <Sidebar role="student" />
      <div className="main-content">
        <Topbar title={title} />
        <div className="page">{children}</div>
      </div>
    </div>
  )
}

export function StudentDashboard() {
  const { currentUser } = useApp()
  const navigate = useNavigate()
  const myProjects = projects.filter(p => p.creatorId === currentUser?.id || p.collaborators.some(c => c.userId === currentUser?.id && c.status === 'accepted'))
  const myInternships = internships.filter(i => i.applicants.some(a => a.userId === currentUser?.id))
  const pendingTasks = myProjects.flatMap(p => p.tasks.filter(t => t.status === 'pending' && t.assignee === currentUser?.id))

  const stats = [
    { num: myProjects.length, label: 'Projects', icon: <FolderKanban size={16} />, color: 'var(--accent)', delta: '+2 this month', up: true },
    { num: pendingTasks.length, label: 'Pending tasks', icon: <Briefcase size={16} />, color: 'var(--amber)', delta: `${pendingTasks.length} need attention`, up: false },
    { num: myInternships.length, label: 'Applications', icon: <UserCheck size={16} />, color: 'var(--teal)', delta: '1 accepted', up: true },
    { num: myProjects.filter(p => p.visibility === 'public').length, label: 'Public projects', icon: '⊙', color: 'var(--green)', delta: 'Visible to employers', up: true },
  ]

  const langCount = {}
  myProjects.forEach(p => p.languages.forEach(l => { langCount[l] = (langCount[l] || 0) + 1 }))
  const totalLang = Object.values(langCount).reduce((a, b) => a + b, 0)

  return (
    <StudentLayout title="Dashboard">
      {}
      <div style={{ marginBottom: 32 }} className="animate-fadeInDown">
        <h1 style={{ fontSize: '1.8rem', marginBottom: 6 }}>
          Good morning, <span style={{ color: 'var(--accent-text)' }}>{currentUser?.firstName}</span> 
        </h1>
        <p className="text-secondary">Here's what's happening with your portfolio today.</p>
      </div>

      {}
      <div className="grid-4" style={{ marginBottom: 32 }}>
        {stats.map((s, i) => (
          <div key={i} className={`stat-card animate-fadeIn delay-${i+1}`}>
            <div className="flex-between">
              <div style={{ width: 36, height: 36, borderRadius: 9, background: `${s.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, color: s.color }}>{s.icon}</div>
              <div className="text-xs text-muted">{s.label}</div>
            </div>
            <div className="stat-num" style={{ marginTop: 12 }}>{s.num}</div>
            <div className={`stat-delta ${s.up ? 'up' : ''}`}>{s.delta}</div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ gap: 20 }}>
        {}
        <div className="card card-p animate-fadeIn delay-2">
          <div className="flex-between" style={{ marginBottom: 18 }}>
            <h3 style={{ fontSize: 15 }}>Recent Projects</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/student/projects')}>View all</button>
          </div>
          {myProjects.length === 0 ? (
            <EmptyState icon="◈" title="No projects yet" text="Create your first project to get started." action={<button className="btn btn-primary btn-sm" onClick={() => navigate('/student/projects')}>+ New Project</button>} />
          ) : myProjects.slice(0,3).map((p, i) => {
            const course = courses.find(c => c.id === p.course)
            return (
              <div key={p.id} className={`animate-fadeIn delay-${i+1}`}
                onClick={() => navigate('/student/projects')}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>◈</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                  <div className="text-xs text-muted">{course?.name} · {p.createdAt}</div>
                </div>
                <span className={`badge ${p.visibility === 'public' ? 'badge-green' : 'badge-gray'}`}>{p.visibility}</span>
              </div>
            )
          })}
        </div>

        {}
        <div className="card card-p animate-fadeIn delay-3">
          <h3 style={{ fontSize: 15, marginBottom: 18 }}>Languages Used</h3>
          {Object.keys(langCount).length === 0 ? (
            <EmptyState icon="◉" title="No data yet" text="Add projects to see your language stats." />
          ) : Object.entries(langCount).map(([lang, count]) => (
            <div key={lang} style={{ marginBottom: 14 }}>
              <div className="flex-between" style={{ marginBottom: 6 }}>
                <span style={{ fontSize: 13 }}>{lang}</span>
                <span className="text-xs text-muted">{Math.round((count / totalLang) * 100)}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${(count / totalLang) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>

        {}
        <div className="card card-p animate-fadeIn delay-4">
          <div className="flex-between" style={{ marginBottom: 18 }}>
            <h3 style={{ fontSize: 15 }}>Pending Tasks</h3>
            <span className="badge badge-amber">{pendingTasks.length}</span>
          </div>
          {pendingTasks.length === 0 ? (
            <EmptyState icon="" title="All caught up!" text="No pending tasks right now." />
          ) : pendingTasks.map(t => (
            <div key={t.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--amber)', marginTop: 5, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{t.title}</div>
                <div className="text-xs text-muted">Due: {t.deadline}</div>
              </div>
            </div>
          ))}
        </div>

        {}
        <div className="card card-p animate-fadeIn delay-5">
          <h3 style={{ fontSize: 15, marginBottom: 18 }}>Top Collaborators</h3>
          {myProjects.flatMap(p => p.collaborators.filter(c => c.status === 'accepted')).length === 0 ? (
            <EmptyState icon="◎" title="No collaborators yet" text="Invite teammates to your projects." />
          ) : [...new Set(myProjects.flatMap(p => p.collaborators.filter(c => c.status === 'accepted').map(c => c.userId)))].slice(0,4).map(uid => {
            const u = users.find(x => x.id === uid)
            if (!u) return null
            const count = myProjects.filter(p => p.collaborators.some(c => c.userId === uid && c.status === 'accepted')).length
            return (
              <div key={uid} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <div className={`avatar avatar-sm ${getAvatarColors(u.avatar)}`}>{getInitials(u.firstName, u.lastName)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{u.firstName} {u.lastName}</div>
                  <div className="text-xs text-muted">{count} shared project{count > 1 ? 's' : ''}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </StudentLayout>
  )
}

export function StudentPortfolio() {
  const { currentUser, addToast } = useApp()
  const [editing, setEditing] = useState(false)
  const [profile, setProfile] = useState({
    major: currentUser?.major || '',
    skills: currentUser?.skills?.join(', ') || '',
    linkedin: currentUser?.linkedin || '',
  })
  const [picModal, setPicModal] = useState(false)
  const myProjects = projects.filter(p => p.creatorId === currentUser?.id)
  const publicProjects = myProjects.filter(p => p.visibility === 'public')
  const [visibleIds, setVisibleIds] = useState(publicProjects.map(p => p.id))
  const navigate = useNavigate()

  const handleSave = () => {
    setEditing(false)
    addToast('Portfolio updated successfully!', 'success')
  }

  const toggleVisibility = (id) => {
    setVisibleIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const completedInternships = internships.filter(i =>
    i.applicants.some(a => a.userId === currentUser?.id && a.status === 'accepted')
  )

  return (
    <StudentLayout title="My Portfolio">
      <div style={{ maxWidth: 780, margin: '0 auto' }}>
        {}
        <div className="card card-p animate-fadeInDown" style={{ marginBottom: 20, display: 'flex', gap: 24, alignItems: 'flex-start' }}>
          <div style={{ position: 'relative' }}>
            <div className={`avatar avatar-xl ${getAvatarColors(currentUser?.avatar)}`}>
              {getInitials(currentUser?.firstName, currentUser?.lastName)}
            </div>
            <button onClick={() => setPicModal(true)}
              style={{ position: 'absolute', bottom: 0, right: 0, width: 26, height: 26, borderRadius: '50%', background: 'var(--accent)', border: '2px solid var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 12 }}>
              
            </button>
          </div>
          <div style={{ flex: 1 }}>
            {!editing ? (<>
              <h2 style={{ fontSize: '1.5rem', marginBottom: 4 }}>{currentUser?.firstName} {currentUser?.lastName}</h2>
              <p className="text-secondary" style={{ fontSize: 14, marginBottom: 10 }}>{profile.major || 'Major not set'}</p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                {(profile.skills || '').split(',').filter(Boolean).map(s => (
                  <span key={s} className="badge badge-purple">{s.trim()}</span>
                ))}
              </div>
              {profile.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer"
                  className="text-sm" style={{ color: 'var(--accent-text)' }}> LinkedIn Profile</a>
              )}
            </>) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
                <div className="input-group">
                  <label className="input-label">Major</label>
                  <input className="input" value={profile.major} onChange={e => setProfile(p => ({ ...p, major: e.target.value }))} placeholder="e.g. Computer Science" />
                </div>
                <div className="input-group">
                  <label className="input-label">Skills (comma separated)</label>
                  <input className="input" value={profile.skills} onChange={e => setProfile(p => ({ ...p, skills: e.target.value }))} placeholder="React, Python, ML" />
                </div>
                <div className="input-group">
                  <label className="input-label">LinkedIn URL</label>
                  <input className="input" value={profile.linkedin} onChange={e => setProfile(p => ({ ...p, linkedin: e.target.value }))} placeholder="https://linkedin.com/in/..." />
                </div>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {editing ? (
              <>
                <button className="btn btn-ghost btn-sm" onClick={() => setEditing(false)}>Cancel</button>
                <button className="btn btn-primary btn-sm" onClick={handleSave}>Save</button>
              </>
            ) : (
              <button className="btn btn-ghost btn-sm" onClick={() => setEditing(true)}>Edit profile</button>
            )}
          </div>
        </div>

        {}
        <div className="grid-3" style={{ marginBottom: 20 }}>
          {[
            { num: myProjects.length, label: 'Total projects' },
            { num: publicProjects.length, label: 'Public projects' },
            { num: completedInternships.length, label: 'Internships done' },
          ].map((s, i) => (
            <div key={i} className={`stat-card animate-fadeIn delay-${i+1}`} style={{ textAlign: 'center' }}>
              <div className="stat-num">{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {}
        <div className="card animate-fadeIn delay-3">
          <div className="card-p" style={{ borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: 15 }}>Portfolio Visibility</h3>
            <p className="text-sm text-muted" style={{ marginTop: 4 }}>Choose which projects appear on your public portfolio.</p>
          </div>
          {myProjects.length === 0 ? (
            <div className="card-p"><EmptyState icon="◈" title="No projects yet" /></div>
          ) : myProjects.map((p, i) => {
            const course = courses.find(c => c.id === p.course)
            const isVisible = visibleIds.includes(p.id)
            return (
              <div key={p.id} className={`animate-fadeIn delay-${i+1}`}
                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 24px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{p.title}</div>
                  <div className="text-xs text-muted">{course?.name}</div>
                </div>
                <div
                  onClick={() => { toggleVisibility(p.id); addToast(`Project ${isVisible ? 'hidden from' : 'shown on'} portfolio`, 'info') }}
                  style={{
                    width: 44, height: 24, borderRadius: 99,
                    background: isVisible ? 'var(--accent)' : 'var(--border)',
                    cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
                  }}>
                  <div style={{
                    position: 'absolute', top: 3, left: isVisible ? 22 : 3,
                    width: 18, height: 18, borderRadius: '50%', background: '#fff',
                    transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                  }} />
                </div>
              </div>
            )
          })}
        </div>

        {}
        {completedInternships.length > 0 && (
          <div className="card animate-fadeIn delay-4" style={{ marginTop: 20 }}>
            <div className="card-p" style={{ borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: 15 }}>Completed Internships</h3>
            </div>
            {completedInternships.map(i => (
              <div key={i.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 24px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: 'var(--teal-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>◉</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{i.title}</div>
                  <div className="text-xs text-muted">{i.company} · {i.duration}</div>
                </div>
                <span className="badge badge-teal">Completed</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {}
      <Modal open={picModal} onClose={() => setPicModal(false)} title="Upload profile picture"
        footer={<>
          <button className="btn btn-ghost" onClick={() => setPicModal(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={() => { setPicModal(false); addToast('Profile picture updated!', 'success') }}>Upload</button>
        </>}>
        <div style={{ border: '2px dashed var(--border)', borderRadius: 'var(--radius-lg)', padding: 40, textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.4 }}>↑</div>
          <p className="text-secondary" style={{ fontSize: 14 }}>Drag & drop or click to select</p>
          <input type="file" accept="image}
              <div onClick={toggleNotifOff}
                style={{ width: 44, height: 24, borderRadius: 99, background: !notifOff ? 'var(--accent)' : 'var(--border)', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}>
                <div style={{ position: 'absolute', top: 3, left: !notifOff ? 22 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
              </div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={markAllRead}>Mark all read</button>
          </div>
        </div>

        <div className="tabs">
          <div className={`tab-item ${tab === 'all' ? 'active' : ''}`} onClick={() => setTab('all')}>
            All ({notifications.filter(n => !n.read).length} unread)
          </div>
          <div className={`tab-item ${tab === 'invitations' ? 'active' : ''}`} onClick={() => setTab('invitations')}>
            Project Invitations ({invitations.filter(i => i.status === 'pending').length})
          </div>
        </div>

        {tab === 'all' && (
          <div className="card animate-scaleIn">
            {notifOff ? (
              <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
                Notifications are turned off. Toggle above to re-enable.
              </div>
            ) : displayed.map((n, i) => (
              <div key={n.id}
                className={`animate-fadeIn delay-${Math.min(i+1,6)}`}
                style={{ display: 'flex', gap: 14, padding: '16px 20px', borderBottom: '1px solid var(--border)', background: n.read ? 'transparent' : 'rgba(124,111,255,0.04)', transition: 'background 0.2s' }}>
                <div onClick={() => markNotifRead(n.id)} style={{ width: 36, height: 36, borderRadius: 9, background: `${colors[n.type] || 'var(--accent)'}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors[n.type] || 'var(--accent)', fontSize: 16, flexShrink: 0, cursor: 'pointer' }}>
                  {icons[n.type] || '◎'}
                </div>
                <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => markNotifRead(n.id)}>
                  <div style={{ fontSize: 14, lineHeight: 1.5, color: n.read ? 'var(--text-secondary)' : 'var(--text-primary)' }}>{n.text}</div>
                  <div className="text-xs text-muted" style={{ marginTop: 4 }}>{n.time}</div>
                </div>
                {}
                <button
                  onClick={() => n.read ? markNotifUnread(n.id) : markNotifRead(n.id)}
                  title={n.read ? 'Mark as unread' : 'Mark as read'}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 12, padding: '4px 6px', borderRadius: 6, alignSelf: 'center', flexShrink: 0, transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-text)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  {n.read ? '○' : '●'}
                </button>
              </div>
            ))}
          </div>
        )}

        {}
        {tab === 'invitations' && (
          <div className="card animate-scaleIn">
            {invitations.length === 0
              ? <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>No invitations</div>
              : invitations.map((inv, i) => (
                <div key={inv.id} className={`animate-fadeIn delay-${i+1}`}
                  style={{ display: 'flex', gap: 14, padding: '16px 20px', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-text)', fontSize: 16, flexShrink: 0 }}>◈</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 3 }}>{inv.projectTitle}</div>
                    <div className="text-xs text-muted">Invited by {inv.fromName} as {inv.type} · {inv.time}</div>
                  </div>
                  {inv.status === 'pending' ? (
                    <div className="flex-center gap-2">
                      <button className="btn btn-danger btn-sm" onClick={() => handleInvitation(inv.id, 'rejected')}>Decline</button>
                      <button className="btn btn-primary btn-sm" onClick={() => handleInvitation(inv.id, 'accepted')}>Accept</button>
                    </div>
                  ) : (
                    <span className={`badge ${inv.status === 'accepted' ? 'badge-teal' : 'badge-red'}`}>{inv.status}</span>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </StudentLayout>
  )
}

export function StudentFavorites() {
  const [favProjects, setFavProjects] = useState(defaultFavorites.projects)
  const [favPortfolios, setFavPortfolios] = useState(defaultFavorites.portfolios)
  const [tab, setTab] = useState('projects')
  const { addToast } = useApp()
  const navigate = useNavigate()

  const favProjectData = projects.filter(p => favProjects.includes(p.id))
  const favStudents = users.filter(u => u.role === 'student' && favPortfolios.includes(u.id))

  const removeProject = (id) => {
    setFavProjects(prev => prev.filter(x => x !== id))
    addToast('Removed from favorites', 'info')
  }
  const removePortfolio = (id) => {
    setFavPortfolios(prev => prev.filter(x => x !== id))
    addToast('Removed from favorites', 'info')
  }

  return (
    <StudentLayout title="Favorites">
      <div className="page-header">
        <h1 className="page-title">Favorites</h1>
        <p className="page-subtitle">Your saved projects and portfolios</p>
      </div>
      <div className="tabs">
        <div className={`tab-item ${tab === 'projects' ? 'active' : ''}`} onClick={() => setTab('projects')}>
          Projects ({favProjectData.length})
        </div>
        <div className={`tab-item ${tab === 'portfolios' ? 'active' : ''}`} onClick={() => setTab('portfolios')}>
          Portfolios ({favStudents.length})
        </div>
      </div>

      {tab === 'projects' && (
        favProjectData.length === 0 ? <EmptyState icon="" title="No favorite projects" text="Browse projects and save the ones you like." /> :
        <div className="grid-3">
          {favProjectData.map((p, i) => {
            const course = courses.find(c => c.id === p.course)
            const creator = users.find(u => u.id === p.creatorId)
            return (
              <div key={p.id} className={`card card-p animate-fadeIn delay-${i+1}`} style={{ position: 'relative' }}>
                <button onClick={() => removeProject(p.id)}
                  style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 16 }}></button>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, marginBottom: 8, paddingRight: 24 }}>{p.title}</div>
                <div className="text-sm text-muted" style={{ marginBottom: 10 }}>{course?.name}</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                  {p.languages.map(l => <span key={l} className="badge badge-gray">{l}</span>)}
                </div>
                <div className="flex-between">
                  <div className="flex-center gap-2">
                    <div className={`avatar avatar-sm ${getAvatarColors(creator?.avatar)}`}>{getInitials(creator?.firstName, creator?.lastName)}</div>
                    <span className="text-sm text-muted">{creator?.firstName}</span>
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--amber)' }}> {p.rating}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {tab === 'portfolios' && (
        favStudents.length === 0 ? <EmptyState icon="" title="No favorite portfolios" text="Browse student portfolios and save the ones you like." /> :
        <div className="grid-4">
          {favStudents.map((s, i) => (
            <div key={s.id} className={`card card-p animate-fadeIn delay-${i+1}`} style={{ textAlign: 'center', position: 'relative' }}>
              <button onClick={() => removePortfolio(s.id)}
                style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 16 }}></button>
              <div className={`avatar avatar-lg ${getAvatarColors(s.avatar)}`} style={{ margin: '0 auto 10px' }}>{getInitials(s.firstName, s.lastName)}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14 }}>{s.firstName} {s.lastName}</div>
              <div className="text-xs text-muted" style={{ margin: '4px 0 10px' }}>{s.major}</div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
                {s.skills.slice(0,3).map(sk => <span key={sk} className="badge badge-gray">{sk}</span>)}
              </div>
            </div>
          ))}
        </div>
      )}
    </StudentLayout>
  )
}

export function StudentSettings() {
  const { currentUser, addToast } = useApp()
  const [tab, setTab] = useState('profile')
  const [form, setForm] = useState({ firstName: currentUser?.firstName || '', lastName: currentUser?.lastName || '', email: currentUser?.email || '' })
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' })

  return (
    <StudentLayout title="Settings">
      <div style={{ maxWidth: 640 }}>
        <div className="page-header">
          <h1 className="page-title">Settings</h1>
        </div>
        <div className="tabs">
          {['profile', 'password'].map(t => (
            <div key={t} className={`tab-item ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)} style={{ textTransform: 'capitalize' }}>{t}</div>
          ))}
        </div>

        {tab === 'profile' && (
          <div className="card card-p animate-scaleIn" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="grid-2">
              <div className="input-group">
                <label className="input-label">First name</label>
                <input className="input" value={form.firstName} onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))} />
              </div>
              <div className="input-group">
                <label className="input-label">Last name</label>
                <input className="input" value={form.lastName} onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))} />
              </div>
            </div>
            <div className="input-group">
              <label className="input-label">Email</label>
              <input className="input" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
            </div>
            <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }} onClick={() => addToast('Profile updated!', 'success')}>Save changes</button>
          </div>
        )}

        {tab === 'password' && (
          <div className="card card-p animate-scaleIn" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="input-group">
              <label className="input-label">Current password</label>
              <input className="input" type="password" placeholder="••••••••" value={passwords.current} onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))} />
            </div>
            <div className="input-group">
              <label className="input-label">New password</label>
              <input className="input" type="password" placeholder="Min. 6 characters" value={passwords.new} onChange={e => setPasswords(p => ({ ...p, new: e.target.value }))} />
            </div>
            <div className="input-group">
              <label className="input-label">Confirm new password</label>
              <input className="input" type="password" placeholder="Repeat password" value={passwords.confirm} onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))} />
            </div>
            <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }}
              onClick={() => {
                if (passwords.new !== passwords.confirm) { addToast('Passwords do not match', 'error'); return }
                addToast('Password changed successfully!', 'success')
                setPasswords({ current: '', new: '', confirm: '' })
              }}>
              Update password
            </button>
          </div>
        )}
      </div>
    </StudentLayout>
  )
}
