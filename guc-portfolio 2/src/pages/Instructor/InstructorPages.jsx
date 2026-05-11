import { useState } from 'react'
import { BookOpen, FolderKanban, Star, Flag, Edit2, MessageSquare, CheckCircle, Clock, Bell, CheckCheck, Users, FileText } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { projects, users, courses, getInitials, getAvatarColors } from '../../data/data'
import { Sidebar, Topbar, Modal, ConfirmModal, SearchBar, EmptyState } from '../../components/Components'

function InstructorLayout({ children, title }) {
  return (
    <div className="layout">
      <Sidebar role="instructor" />
      <div className="main-content">
        <Topbar title={title} />
        <div className="page">{children}</div>
      </div>
    </div>
  )
}

function DraftFeedbackRow({ draft, index, addToast }) {
  const [comment, setComment] = useState('')
  const [saved, setSaved] = useState('')
  const handleSave = () => {
    if (!comment.trim()) return
    setSaved(comment)
    setComment('')
    addToast('Draft feedback saved!', 'success')
  }
  return (
    <div className={`animate-fadeIn delay-${Math.min(index+1,6)}`}
      style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
      <div className="flex-center gap-2" style={{ marginBottom: 10 }}>
        <span style={{ fontSize: 18 }}></span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 500 }}>{draft.name}</div>
          <div className="text-xs text-muted">{draft.date} {draft.isFinal && '· Final draft'}</div>
        </div>
      </div>
      {saved && (
        <div style={{ background: 'var(--accent-dim)', borderRadius: 'var(--radius-md)', padding: '8px 12px', fontSize: 13, color: 'var(--accent-text)', marginBottom: 8 }}>
          ▸ {saved}
        </div>
      )}
      <div className="flex-center gap-2">
        <input className="input" style={{ flex: 1 }} placeholder="Add comment on this draft..."
          value={comment} onChange={e => setComment(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSave()} />
        <button className="btn btn-primary btn-sm" onClick={handleSave}>Post</button>
      </div>
    </div>
  )
}

export function InstructorDashboard() {
  const { currentUser } = useApp()
  const myCourses = courses.filter(c => c.instructors.includes(currentUser?.id))
  const myProjects = projects.filter(p => p.instructors.some(i => i.userId === currentUser?.id && i.status === 'accepted'))
  const pendingInvites = projects.filter(p => p.instructors.some(i => i.userId === currentUser?.id && i.status === 'pending'))
  const unratedProjects = myProjects.filter(p => !p.rating || p.rating === 0)

  const stats = [
    { num: myCourses.length,       label: 'My courses',        icon: '◈', color: 'var(--accent)' },
    { num: myProjects.length,      label: 'Linked projects',   icon: '◎', color: 'var(--teal)' },
    { num: pendingInvites.length,  label: 'Pending invitations', icon: '◉', color: 'var(--amber)' },
    { num: unratedProjects.length, label: 'Need rating',       icon: '', color: 'var(--coral)' },
  ]

  return (
    <InstructorLayout title="Dashboard">
      <div className="animate-fadeInDown" style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: 6 }}>
          Welcome, <span style={{ color: 'var(--accent-text)' }}>{currentUser?.firstName}</span>
        </h1>
        <p className="text-secondary">Here's an overview of your courses and projects.</p>
      </div>

      <div className="grid-4" style={{ marginBottom: 32 }}>
        {stats.map((s, i) => (
          <div key={i} className={`stat-card animate-fadeIn delay-${i + 1}`}>
            <div className="flex-between">
              <div style={{ width: 36, height: 36, borderRadius: 9, background: `${s.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, color: s.color }}>{s.icon}</div>
              <div className="text-xs text-muted">{s.label}</div>
            </div>
            <div className="stat-num" style={{ marginTop: 12 }}>{s.num}</div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ gap: 20 }}>
        {}
        <div className="card card-p animate-fadeIn delay-2">
          <h3 style={{ fontSize: 15, marginBottom: 16 }}>Pending Project Invitations</h3>
          {pendingInvites.length === 0
            ? <EmptyState icon="◎" title="No pending invitations" />
            : pendingInvites.map((p, i) => {
              const creator = users.find(u => u.id === p.creatorId)
              return (
                <div key={p.id} className={`animate-fadeIn delay-${i + 1}`}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{p.title}</div>
                    <div className="text-xs text-muted">by {creator?.firstName} {creator?.lastName}</div>
                  </div>
                  <span className="badge badge-amber">Pending</span>
                </div>
              )
            })}
        </div>

        {}
        <div className="card card-p animate-fadeIn delay-3">
          <h3 style={{ fontSize: 15, marginBottom: 16 }}>Linked Projects</h3>
          {myProjects.length === 0
            ? <EmptyState icon="◈" title="No projects linked yet" />
            : myProjects.slice(0, 4).map((p, i) => {
              const course = courses.find(c => c.id === p.course)
              return (
                <div key={p.id} className={`animate-fadeIn delay-${i + 1}`}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>◈</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{p.title}</div>
                    <div className="text-xs text-muted">{course?.name}</div>
                  </div>
                  {p.rating > 0
                    ? <span style={{ fontSize: 12, color: 'var(--amber)' }}> {p.rating}</span>
                    : <span className="badge badge-amber">Needs rating</span>}
                </div>
              )
            })}
        </div>
      </div>
    </InstructorLayout>
  )
}

export function InstructorCourses() {
  const { currentUser, addToast } = useApp()
  const [allCourses, setAllCourses] = useState(courses)
  const [linkedIds, setLinkedIds] = useState(allCourses.filter(c => c.instructors.includes(currentUser?.id)).map(c => c.id))
  const [search, setSearch] = useState('')
  const [requestModal, setRequestModal] = useState(null)

  const filtered = allCourses.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase()))
  const myLinked = allCourses.filter(c => linkedIds.includes(c.id))

  const sendRequest = (courseId) => {
    setRequestModal(null)
    addToast('Link request sent to admin!', 'success')
  }

  const unlink = (courseId) => {
    setLinkedIds(prev => prev.filter(id => id !== courseId))
    addToast('Course unlinked', 'info')
  }

  return (
    <InstructorLayout title="My Courses">
      <div className="page-header flex-between">
        <div>
          <h1 className="page-title">Courses</h1>
          <p className="page-subtitle">{myLinked.length} linked courses</p>
        </div>
      </div>

      {}
      {myLinked.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <h3 style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.5px' }}>My Linked Courses</h3>
          <div className="grid-3">
            {myLinked.map((c, i) => {
              const courseProjects = projects.filter(p => p.course === c.id && p.instructors.some(inv => inv.userId === currentUser?.id))
              return (
                <div key={c.id} className={`card card-p animate-fadeIn delay-${i + 1}`}>
                  <div className="flex-between" style={{ marginBottom: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 9, background: 'var(--teal-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>◈</div>
                    <span className="badge badge-teal">Linked</span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{c.name}</div>
                  <div className="text-xs text-muted" style={{ marginBottom: 12 }}>{c.code}</div>
                  <div className="flex-between" style={{ paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                    <span className="text-xs text-muted">{courseProjects.length} projects</span>
                    <button className="btn btn-ghost btn-sm" onClick={() => unlink(c.id)}>Unlink</button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {}
      <h3 style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.5px' }}>All Courses</h3>
      <div style={{ marginBottom: 16 }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search courses..." />
      </div>
      <div className="table-wrap animate-scaleIn">
        <table>
          <thead>
            <tr><th>Course</th><th>Code</th><th>Instructors</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            {filtered.map(c => {
              const isLinked = linkedIds.includes(c.id)
              const instructorNames = c.instructors.map(id => { const u = users.find(x => x.id === id); return u ? `${u.firstName} ${u.lastName}` : '' }).filter(Boolean)
              return (
                <tr key={c.id}>
                  <td style={{ fontWeight: 500 }}>{c.name}</td>
                  <td><span className="badge badge-gray">{c.code}</span></td>
                  <td className="text-sm text-muted">{instructorNames.join(', ') || '—'}</td>
                  <td>{isLinked ? <span className="badge badge-teal">Linked</span> : <span className="badge badge-gray">Not linked</span>}</td>
                  <td>
                    {isLinked
                      ? <button className="btn btn-ghost btn-sm" onClick={() => unlink(c.id)}>Unlink</button>
                      : <button className="btn btn-primary btn-sm" onClick={() => setRequestModal(c)}>Request link</button>}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <Modal open={!!requestModal} onClose={() => setRequestModal(null)} title="Request Course Link"
        footer={<>
          <button className="btn btn-ghost" onClick={() => setRequestModal(null)}>Cancel</button>
          <button className="btn btn-primary" onClick={() => sendRequest(requestModal?.id)}>Send request</button>
        </>}>
        <p className="text-secondary" style={{ fontSize: 14 }}>
          You're requesting to be linked to <strong style={{ color: 'var(--text-primary)' }}>{requestModal?.name}</strong> ({requestModal?.code}).
          An admin will review and approve your request.
        </p>
      </Modal>
    </InstructorLayout>
  )
}

export function InstructorProjects() {
  const { currentUser, addToast } = useApp()
  const [allProjects, setAllProjects] = useState(projects)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selected, setSelected] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [feedbackText, setFeedbackText] = useState('')
  const [taskComment, setTaskComment] = useState('')
  const [selectedTask, setSelectedTask] = useState(null)
  const [ratingModal, setRatingModal] = useState(false)
  const [ratingValue, setRatingValue] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [flagModal, setFlagModal] = useState(false)
  const [flagReason, setFlagReason] = useState('')

  const invitations = allProjects.filter(p => p.instructors.some(i => i.userId === currentUser?.id))
  const accepted = invitations.filter(p => p.instructors.some(i => i.userId === currentUser?.id && i.status === 'accepted'))
  const pending = invitations.filter(p => p.instructors.some(i => i.userId === currentUser?.id && i.status === 'pending'))

  let displayed = filterStatus === 'all' ? accepted : filterStatus === 'pending' ? pending : accepted
  if (search) displayed = displayed.filter(p => p.title.toLowerCase().includes(search.toLowerCase()))

  const acceptInvite = (projectId) => {
    setAllProjects(prev => prev.map(p => p.id === projectId
      ? { ...p, instructors: p.instructors.map(i => i.userId === currentUser.id ? { ...i, status: 'accepted' } : i) }
      : p))
    addToast('Invitation accepted!', 'success')
  }

  const rejectInvite = (projectId) => {
    setAllProjects(prev => prev.map(p => p.id === projectId
      ? { ...p, instructors: p.instructors.filter(i => i.userId !== currentUser.id) }
      : p))
    addToast('Invitation rejected', 'info')
  }

  const saveFeedback = () => {
    if (!feedbackText.trim()) { addToast('Please write feedback first', 'error'); return }
    setAllProjects(prev => prev.map(p => p.id === selected.id ? { ...p, instructorFeedback: feedbackText } : p))
    setSelected(prev => ({ ...prev, instructorFeedback: feedbackText }))
    addToast('Feedback saved!', 'success')
  }

  const addTaskComment = () => {
    if (!taskComment.trim() || !selectedTask) return
    const comment = `${taskComment} - ${currentUser.firstName}`
    setAllProjects(prev => prev.map(p => p.id === selected.id
      ? { ...p, tasks: p.tasks.map(t => t.id === selectedTask ? { ...t, comments: [...(t.comments || []), comment] } : t) }
      : p))
    setSelected(prev => ({ ...prev, tasks: prev.tasks.map(t => t.id === selectedTask ? { ...t, comments: [...(t.comments || []), comment] } : t) }))
    setTaskComment('')
    setSelectedTask(null)
    addToast('Comment added!', 'success')
  }

  const submitRating = () => {
    if (ratingValue === 0) { addToast('Please select a rating', 'error'); return }
    setAllProjects(prev => prev.map(p => p.id === selected.id ? { ...p, rating: ratingValue } : p))
    setSelected(prev => ({ ...prev, rating: ratingValue }))
    setRatingModal(false)
    addToast(`Rated ${ratingValue}/5 `, 'success')
  }

  const submitFlag = () => {
    if (!flagReason.trim()) { addToast('Please provide a reason', 'error'); return }
    setAllProjects(prev => prev.map(p => p.id === selected.id ? { ...p, flagged: true } : p))
    setSelected(prev => ({ ...prev, flagged: true }))
    setFlagModal(false)
    addToast('Project flagged and reported to admin', 'info')
  }

  return (
    <InstructorLayout title="Projects">
      {!selected ? (
        <>
          <div className="page-header">
            <h1 className="page-title">Projects</h1>
            <p className="page-subtitle">{accepted.length} accepted · {pending.length} pending</p>
          </div>

          {}
          {pending.length > 0 && (
            <div className="animate-fadeInDown" style={{ background: 'rgba(239,159,39,0.08)', border: '1px solid rgba(239,159,39,0.25)', borderRadius: 'var(--radius-lg)', padding: 16, marginBottom: 24 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--amber)', marginBottom: 12 }}>◷ {pending.length} pending invitation{pending.length > 1 ? 's' : ''}</div>
              {pending.map(p => {
                const creator = users.find(u => u.id === p.creatorId)
                return (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 13, fontWeight: 500 }}>{p.title}</span>
                      <span className="text-muted" style={{ fontSize: 12 }}> — by {creator?.firstName} {creator?.lastName}</span>
                    </div>
                    <button className="btn btn-ghost btn-sm" onClick={() => rejectInvite(p.id)}>Decline</button>
                    <button className="btn btn-primary btn-sm" onClick={() => acceptInvite(p.id)}>Accept</button>
                  </div>
                )
              })}
            </div>
          )}

          <div className="flex-center gap-2" style={{ marginBottom: 20 }}>
            <div style={{ flex: 1 }}><SearchBar value={search} onChange={setSearch} placeholder="Search projects..." /></div>
            <select className="select" style={{ width: 160 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="all">All accepted</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {displayed.length === 0
            ? <EmptyState icon="◈" title="No projects found" text="Projects linked by students will appear here." />
            : (
              <div className="grid-3">
                {displayed.map((p, i) => {
                  const course = courses.find(c => c.id === p.course)
                  const creator = users.find(u => u.id === p.creatorId)
                  return (
                    <div key={p.id} className={`card card-p animate-fadeIn delay-${Math.min(i + 1, 6)}`}
                      onClick={() => { setSelected(p); setFeedbackText(p.instructorFeedback || ''); setActiveTab('overview') }}
                      style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div className="flex-between">
                        <div style={{ width: 36, height: 36, borderRadius: 9, background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>◈</div>
                        <div className="flex-center gap-1">
                          {p.flagged && <span className="badge badge-red">Flagged</span>}
                          {p.rating > 0 ? <span style={{ fontSize: 12, color: 'var(--amber)' }}> {p.rating}</span> : <span className="badge badge-amber">Unrated</span>}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{p.title}</div>
                        <div className="text-xs text-muted">{course?.name}</div>
                      </div>
                      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                        {p.languages.slice(0, 3).map(l => <span key={l} className="badge badge-gray">{l}</span>)}
                      </div>
                      <div className="flex-between" style={{ paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                        <div className="flex-center gap-2">
                          <div className={`avatar avatar-sm ${getAvatarColors(creator?.avatar)}`}>{getInitials(creator?.firstName, creator?.lastName)}</div>
                          <span className="text-sm text-muted">{creator?.firstName}</span>
                        </div>
                        <span className="text-xs text-muted">{p.tasks.filter(t => t.status === 'completed').length}/{p.tasks.length} tasks</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
        </>
      ) : (
        <>
          <div className="flex-between" style={{ marginBottom: 24 }}>
            <div className="flex-center gap-2">
              <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}>← Back</button>
              <h1 style={{ fontSize: '1.4rem' }}>{selected.title}</h1>
              {selected.flagged && <span className="badge badge-red">Flagged</span>}
            </div>
            <div className="flex-center gap-2">
              <button className="btn btn-ghost btn-sm" onClick={() => setRatingModal(true)}>
                {selected.rating > 0 ? ` ${selected.rating} — Re-rate` : 'Rate Project'}
              </button>
              {!selected.flagged && <button className="btn btn-danger btn-sm" onClick={() => setFlagModal(true)}>Flag Project</button>}
            </div>
          </div>

          <div className="tabs">
            {['overview', 'tasks', 'feedback'].map(t => (
              <div key={t} className={`tab-item ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)} style={{ textTransform: 'capitalize' }}>{t}</div>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div className="animate-fadeIn">
              <div className="card card-p" style={{ maxWidth: 640 }}>
                <div className="grid-2" style={{ marginBottom: 16 }}>
                  <div><div className="text-xs text-muted" style={{ marginBottom: 4 }}>Course</div><div style={{ fontSize: 14 }}>{courses.find(c => c.id === selected.course)?.name}</div></div>
                  <div><div className="text-xs text-muted" style={{ marginBottom: 4 }}>Created</div><div style={{ fontSize: 14 }}>{selected.createdAt}</div></div>
                  <div><div className="text-xs text-muted" style={{ marginBottom: 4 }}>Visibility</div><span className={`badge ${selected.visibility === 'public' ? 'badge-green' : 'badge-gray'}`}>{selected.visibility}</span></div>
                  <div><div className="text-xs text-muted" style={{ marginBottom: 4 }}>Rating</div><span style={{ fontSize: 14, color: 'var(--amber)' }}>{selected.rating > 0 ? ` ${selected.rating}` : 'Not rated'}</span></div>
                </div>
                <div style={{ marginBottom: 14 }}>
                  <div className="text-xs text-muted" style={{ marginBottom: 6 }}>Description</div>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-secondary)' }}>{selected.description}</p>
                </div>
                <div style={{ marginBottom: 14 }}>
                  <div className="text-xs text-muted" style={{ marginBottom: 6 }}>Languages</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{selected.languages.map(l => <span key={l} className="badge badge-purple">{l}</span>)}</div>
                </div>
                {selected.github && <div style={{ marginBottom: 10 }}><div className="text-xs text-muted" style={{ marginBottom: 4 }}>GitHub</div><a href={selected.github} target="_blank" rel="noopener noreferrer" className="text-sm" style={{ color: 'var(--accent-text)' }}>{selected.github}</a></div>}
                {selected.demo && <div><div className="text-xs text-muted" style={{ marginBottom: 4 }}>Demo</div><a href={selected.demo} target="_blank" rel="noopener noreferrer" className="text-sm" style={{ color: 'var(--accent-text)' }}>{selected.demo}</a></div>}
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <p className="text-secondary" style={{ fontSize: 13, marginBottom: 4 }}>Review task progress and add comments to guide students.</p>
              {selected.tasks.length === 0
                ? <EmptyState icon="◉" title="No tasks yet" />
                : selected.tasks.map((t, i) => {
                  const assignee = users.find(u => u.id === t.assignee)
                  const statusColor = { pending: 'badge-amber', completed: 'badge-teal', 'post-poned': 'badge-gray' }
                  return (
                    <div key={t.id} className={`card card-p animate-fadeIn delay-${Math.min(i + 1, 6)}`}>
                      <div className="flex-between" style={{ marginBottom: 8 }}>
                        <div style={{ fontWeight: 500, fontSize: 14 }}>{t.title}</div>
                        <span className={`badge ${statusColor[t.status] || 'badge-gray'}`}>{t.status}</span>
                      </div>
                      <div className="text-sm text-muted" style={{ marginBottom: 8 }}>{t.description}</div>
                      <div className="flex-between">
                        <div className="flex-center gap-2">
                          {assignee && <><div className={`avatar avatar-sm ${getAvatarColors(assignee.avatar)}`}>{getInitials(assignee.firstName, assignee.lastName)}</div><span className="text-xs text-muted">{assignee.firstName}</span></>}
                          {t.deadline && <span className="text-xs text-muted"> {t.deadline}</span>}
                        </div>
                        <button className="btn btn-ghost btn-sm" onClick={() => setSelectedTask(t.id === selectedTask ? null : t.id)}>
                          {selectedTask === t.id ? 'Cancel' : 'Add comment'}
                        </button>
                      </div>
                      {t.comments?.length > 0 && (
                        <div style={{ marginTop: 10, padding: 10, background: 'var(--accent-dim)', borderRadius: 'var(--radius-md)' }}>
                          {t.comments.map((c, idx) => <div key={idx} className="text-sm" style={{ color: 'var(--accent-text)', marginBottom: 4 }}>▸ {c}</div>)}
                        </div>
                      )}
                      {selectedTask === t.id && (
                        <div className="flex-center gap-2 animate-fadeIn" style={{ marginTop: 10 }}>
                          <input className="input" style={{ flex: 1 }} placeholder="Write a comment..." value={taskComment} onChange={e => setTaskComment(e.target.value)} />
                          <button className="btn btn-primary btn-sm" onClick={addTaskComment}>Post</button>
                        </div>
                      )}
                    </div>
                  )
                })}
            </div>
          )}

          {activeTab === 'feedback' && (
            <div className="animate-fadeIn" style={{ maxWidth: 600, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {}
              <div className="card card-p">
                <h3 style={{ fontSize: 15, marginBottom: 14 }}>General Project Feedback</h3>
                <div className="input-group" style={{ marginBottom: 14 }}>
                  <label className="input-label">Your feedback to the student(s)</label>
                  <textarea className="textarea" style={{ minHeight: 140 }}
                    placeholder="Write constructive feedback about this project..."
                    value={feedbackText}
                    onChange={e => setFeedbackText(e.target.value)} />
                </div>
                <button className="btn btn-primary" onClick={saveFeedback}>Save feedback</button>
              </div>
              {}
              {(selected?.thesisDrafts?.length > 0) && (
                <div className="card">
                  <div className="card-p" style={{ borderBottom: '1px solid var(--border)' }}>
                    <h3 style={{ fontSize: 15 }}>Thesis Draft Feedback</h3>
                    <p className="text-sm text-muted" style={{ marginTop: 4 }}>Leave comments on individual thesis drafts.</p>
                  </div>
                  {selected.thesisDrafts.map((draft, i) => (
                    <DraftFeedbackRow key={draft.id} draft={draft} index={i} addToast={addToast} />
                  ))}
                </div>
              )}
            </div>
          )}

          {}
          <Modal open={ratingModal} onClose={() => setRatingModal(false)} title="Rate Project"
            footer={<><button className="btn btn-ghost" onClick={() => setRatingModal(false)}>Cancel</button><button className="btn btn-primary" onClick={submitRating}>Submit rating</button></>}>
            <p className="text-secondary" style={{ fontSize: 14, marginBottom: 20 }}>Rate <strong style={{ color: 'var(--text-primary)' }}>{selected?.title}</strong></p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 12 }}>
              {[1, 2, 3, 4, 5].map(star => (
                <div key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRatingValue(star)}
                  style={{ fontSize: 36, cursor: 'pointer', color: star <= (hoverRating || ratingValue) ? 'var(--amber)' : 'var(--border)', transition: 'color 0.15s, transform 0.15s', transform: star <= (hoverRating || ratingValue) ? 'scale(1.15)' : 'scale(1)' }}>
                  
                </div>
              ))}
            </div>
            {ratingValue > 0 && <div style={{ textAlign: 'center', color: 'var(--amber)', fontSize: 14 }}>{ratingValue}/5 stars</div>}
          </Modal>

          {}
          <Modal open={flagModal} onClose={() => setFlagModal(false)} title="Flag Project"
            footer={<><button className="btn btn-ghost" onClick={() => setFlagModal(false)}>Cancel</button><button className="btn btn-danger" onClick={submitFlag}>Submit flag</button></>}>
            <p className="text-secondary" style={{ fontSize: 14, marginBottom: 14 }}>Flagging will notify the admin for review. Please provide a clear reason.</p>
            <div className="input-group">
              <label className="input-label">Reason for flagging</label>
              <textarea className="textarea" placeholder="e.g. Suspected plagiarism, inappropriate content..." value={flagReason} onChange={e => setFlagReason(e.target.value)} />
            </div>
          </Modal>
        </>
      )}
    </InstructorLayout>
  )
}

export function InstructorNotifications() {
  const { notifications, markNotifRead, markNotifUnread, markAllRead, notifOff, toggleNotifOff, addToast } = useApp()
  const [tab, setTab] = useState('all')
  const [invitations, setInvitations] = useState([
    { id: 'i1', projectTitle: 'AI-Powered Code Review Assistant', fromName: 'Ahmed Hassan', status: 'pending', time: '30m ago' },
  ])
  const handleInv = (id, action) => {
    setInvitations(prev => prev.map(i => i.id === id ? { ...i, status: action } : i))
    addToast(`Invitation ${action === 'accepted' ? 'accepted!' : 'rejected'}`, action === 'accepted' ? 'success' : 'info')
  }
  return (
    <InstructorLayout title="Notifications">
      <div style={{ maxWidth: 640 }}>
        <div className="flex-between page-header">
          <div><h1 className="page-title">Notifications</h1><p className="page-subtitle">{notifications.filter(n => !n.read).length} unread</p></div>
          <button className="btn btn-ghost btn-sm" onClick={markAllRead}>Mark all read</button>
        </div>
        <div className="tabs">
          <div className={`tab-item ${tab === 'all' ? 'active' : ''}`} onClick={() => setTab('all')}>All</div>
          <div className={`tab-item ${tab === 'invitations' ? 'active' : ''}`} onClick={() => setTab('invitations')}>
            Project Invitations ({invitations.filter(i => i.status === 'pending').length})
          </div>
        </div>
        {tab === 'invitations' && (
          <div className="card animate-scaleIn" style={{ marginBottom: 16 }}>
            {invitations.length === 0
              ? <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>No invitations</div>
              : invitations.map((inv, i) => (
                <div key={inv.id} style={{ display: 'flex', gap: 14, padding: '16px 20px', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: 'var(--teal-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--teal-light)', fontSize: 16 }}>◈</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{inv.projectTitle}</div>
                    <div className="text-xs text-muted">Invited by {inv.fromName} · {inv.time}</div>
                  </div>
                  {inv.status === 'pending' ? (
                    <div className="flex-center gap-2">
                      <button className="btn btn-danger btn-sm" onClick={() => handleInv(inv.id, 'rejected')}>Decline</button>
                      <button className="btn btn-primary btn-sm" onClick={() => handleInv(inv.id, 'accepted')}>Accept</button>
                    </div>
                  ) : <span className={`badge ${inv.status === 'accepted' ? 'badge-teal' : 'badge-red'}`}>{inv.status}</span>}
                </div>
              ))}
          </div>
        )}
        {tab === 'all' && <div className="card animate-scaleIn">
          {notifOff ? (
            <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>Notifications are turned off.</div>
          ) : notifications.map((n, i) => (
            <div key={n.id}
              className={`animate-fadeIn delay-${Math.min(i + 1, 6)}`}
              style={{ display: 'flex', gap: 14, padding: '16px 20px', borderBottom: '1px solid var(--border)', background: n.read ? 'transparent' : 'rgba(124,111,255,0.04)' }}>
              <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => markNotifRead(n.id)}>
                <div style={{ fontSize: 14, lineHeight: 1.5, color: n.read ? 'var(--text-secondary)' : 'var(--text-primary)' }}>{n.text}</div>
                <div className="text-xs text-muted" style={{ marginTop: 4 }}>{n.time}</div>
              </div>
              <button onClick={() => n.read ? markNotifUnread(n.id) : markNotifRead(n.id)}
                title={n.read ? 'Mark as unread' : 'Mark as read'}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 12, padding: '4px 6px', borderRadius: 6, alignSelf: 'center', flexShrink: 0 }}>
                {n.read ? '○' : '●'}
              </button>
            </div>
          ))}
        </div>}
        {}
        <div className="flex-center gap-2" style={{ padding: '12px 20px', marginTop: 8 }}>
          <span className="text-sm text-muted">All notifications</span>
          <div onClick={toggleNotifOff} style={{ width: 44, height: 24, borderRadius: 99, background: !notifOff ? 'var(--accent)' : 'var(--border)', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}>
            <div style={{ position: 'absolute', top: 3, left: !notifOff ? 22 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
          </div>
        </div>
      </div>
    </InstructorLayout>
  )
}

export function InstructorSettings() {
  const { currentUser, addToast } = useApp()
  const [tab, setTab] = useState('profile')
  const [profile, setProfile] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || '',
    bio: currentUser?.bio || '',
    researchInterests: currentUser?.researchInterests?.join(', ') || '',
    education: currentUser?.education || '',
  })
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' })

  return (
    <InstructorLayout title="Settings">
      <div style={{ maxWidth: 640 }}>
        <div className="page-header"><h1 className="page-title">Settings</h1></div>
        <div className="tabs">
          {['profile', 'password'].map(t => (
            <div key={t} className={`tab-item ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)} style={{ textTransform: 'capitalize' }}>{t}</div>
          ))}
        </div>
        {tab === 'profile' && (
          <div className="card card-p animate-scaleIn" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="grid-2">
              <div className="input-group"><label className="input-label">First name</label><input className="input" value={profile.firstName} onChange={e => setProfile(p => ({ ...p, firstName: e.target.value }))} /></div>
              <div className="input-group"><label className="input-label">Last name</label><input className="input" value={profile.lastName} onChange={e => setProfile(p => ({ ...p, lastName: e.target.value }))} /></div>
            </div>
            <div className="input-group"><label className="input-label">Email</label><input className="input" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} /></div>
            <div className="input-group"><label className="input-label">Bio</label><textarea className="textarea" value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))} /></div>
            <div className="input-group"><label className="input-label">Research interests (comma separated)</label><input className="input" value={profile.researchInterests} onChange={e => setProfile(p => ({ ...p, researchInterests: e.target.value }))} /></div>
            <div className="input-group"><label className="input-label">Education / Degree</label><input className="input" value={profile.education} onChange={e => setProfile(p => ({ ...p, education: e.target.value }))} /></div>
            <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }} onClick={() => addToast('Profile updated!', 'success')}>Save changes</button>
          </div>
        )}
        {tab === 'password' && (
          <div className="card card-p animate-scaleIn" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="input-group"><label className="input-label">Current password</label><input className="input" type="password" placeholder="••••••••" value={passwords.current} onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))} /></div>
            <div className="input-group"><label className="input-label">New password</label><input className="input" type="password" placeholder="Min. 6 chars" value={passwords.new} onChange={e => setPasswords(p => ({ ...p, new: e.target.value }))} /></div>
            <div className="input-group"><label className="input-label">Confirm new password</label><input className="input" type="password" placeholder="Repeat password" value={passwords.confirm} onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))} /></div>
            <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }} onClick={() => { if (passwords.new !== passwords.confirm) { addToast('Passwords do not match', 'error'); return } addToast('Password updated!', 'success') }}>Update password</button>
          </div>
        )}
      </div>
    </InstructorLayout>
  )
}
