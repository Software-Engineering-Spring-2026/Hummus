import { useState } from 'react'
import { FolderKanban, GraduationCap, Eye, EyeOff, Tag, Star, Plus, Trash2, Edit2, Users, ChevronUp, ChevronDown, Send, FileText, Flag, Github, ExternalLink } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { projects as initialProjects, users, courses, flags as initialFlags, getInitials, getAvatarColors } from '../../data/data'
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

const STATUSES = ['pending', 'post-poned', 'completed']
const statusColor = { pending: 'badge-amber', 'post-poned': 'badge-gray', completed: 'badge-teal' }

export function StudentProjects() {
  const { currentUser, addToast, pushNotif } = useApp()
  const [allProjects, setAllProjects] = useState(initialProjects)
  const [search, setSearch] = useState('')
  const [filterCourse, setFilterCourse] = useState('')
  const [selectedProject, setSelectedProject] = useState(null)
  const [activeTab, setActiveTab] = useState('details')
  const [showCreate, setShowCreate] = useState(false)
  const [showDelete, setShowDelete] = useState(null)
  const [showFlagAppeal, setShowFlagAppeal] = useState(false)
  const [appealText, setAppealText] = useState('')
  const [flags, setFlags] = useState(initialFlags)

  const myProjects = allProjects.filter(p =>
    p.creatorId === currentUser?.id ||
    p.collaborators.some(c => c.userId === currentUser?.id && c.status === 'accepted')
  )
  const filtered = myProjects.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase())
    const matchCourse = !filterCourse || p.course === parseInt(filterCourse)
    return matchSearch && matchCourse
  })

  const isCreator = (p) => p.creatorId === currentUser?.id

  
  const [form, setForm] = useState({ title: '', course: '', github: '', demo: '', description: '', languages: '', visibility: 'private' })
  const [editing, setEditing] = useState(null)

  const updateForm = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const handleCreate = () => {
    if (!form.title || !form.course) { addToast('Title and course are required', 'error'); return }
    const newP = {
      id: Date.now(), title: form.title, course: parseInt(form.course),
      creatorId: currentUser.id, collaborators: [], instructors: [],
      github: form.github, demo: form.demo, description: form.description,
      languages: form.languages.split(',').map(s => s.trim()).filter(Boolean),
      visibility: form.visibility, status: 'active', rating: 0,
      createdAt: new Date().toISOString().split('T')[0],
      flagged: false, thesis: null, thesisDrafts: [],
      tasks: [], instructorFeedback: '', report: null,
    }
    setAllProjects(prev => [...prev, newP])
    setForm({ title: '', course: '', github: '', demo: '', description: '', languages: '', visibility: 'private' })
    setShowCreate(false)
    addToast('Project created!', 'success')
  }

  const handleUpdate = () => {
    if (!editing) return
    setAllProjects(prev => prev.map(p => p.id === selectedProject.id ? {
      ...p,
      title: editing.title, github: editing.github, demo: editing.demo,
      description: editing.description, visibility: editing.visibility,
      languages: typeof editing.languages === 'string' ? editing.languages.split(',').map(s => s.trim()).filter(Boolean) : editing.languages,
    } : p))
    setSelectedProject(prev => ({ ...prev, ...editing, languages: typeof editing.languages === 'string' ? editing.languages.split(',').map(s => s.trim()).filter(Boolean) : editing.languages }))
    setEditing(null)
    addToast('Project updated!', 'success')
  }

  const handleDelete = (id) => {
    setAllProjects(prev => prev.filter(p => p.id !== id))
    setSelectedProject(null)
    addToast('Project deleted', 'info')
  }

  const handleTaskStatusChange = (taskId, newStatus) => {
    setAllProjects(prev => prev.map(p => p.id === selectedProject.id ? {
      ...p, tasks: p.tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t)
    } : p))
    setSelectedProject(prev => ({ ...prev, tasks: prev.tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t) }))
  }

  const p = selectedProject

  return (
    <StudentLayout title="My Projects">
      {!selectedProject ? (
        <>
          <div className="flex-between page-header">
            <div>
              <h1 className="page-title">My Projects</h1>
              <p className="page-subtitle">{myProjects.length} total projects</p>
            </div>
            <button className="btn btn-primary" onClick={() => setShowCreate(true)}>+ New Project</button>
          </div>

          {}
          <div className="flex-center gap-2" style={{ marginBottom: 24 }}>
            <div style={{ flex: 1 }}><SearchBar value={search} onChange={setSearch} placeholder="Search projects..." /></div>
            <select className="select" style={{ width: 180 }} value={filterCourse} onChange={e => setFilterCourse(e.target.value)}>
              <option value="">All courses</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          {filtered.length === 0 ? (
            <EmptyState icon="◈" title="No projects found" text="Create your first project to get started."
              action={<button className="btn btn-primary btn-sm" onClick={() => setShowCreate(true)}>+ Create Project</button>} />
          ) : (
            <div className="grid-3">
              {filtered.map((proj, i) => {
                const course = courses.find(c => c.id === proj.course)
                const flag = flags.find(f => f.projectId === proj.id)
                return (
                  <div key={proj.id} className={`card card-p animate-fadeIn delay-${Math.min(i+1,6)}`}
                    onClick={() => { setSelectedProject(proj); setActiveTab('details') }}
                    style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div className="flex-between">
                      <div style={{ width: 36, height: 36, borderRadius: 9, background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>◈</div>
                      <div className="flex-center gap-1">
                        {flag && <span className="badge badge-red">Flagged</span>}
                        <span className={`badge ${proj.visibility === 'public' ? 'badge-green' : 'badge-gray'}`}>{proj.visibility}</span>
                      </div>
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{proj.title}</div>
                      <div className="text-xs text-muted">{course?.name} · {proj.createdAt}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                      {proj.languages.slice(0,3).map(l => <span key={l} className="badge badge-gray">{l}</span>)}
                    </div>
                    <div className="flex-between" style={{ paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                      <div className="flex-center gap-1">
                        <span className="text-xs text-muted">{proj.tasks.filter(t => t.status === 'completed').length}/{proj.tasks.length} tasks</span>
                      </div>
                      {isCreator(proj) && <span className="badge badge-purple">Owner</span>}
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
              <button className="btn btn-ghost btn-sm" onClick={() => setSelectedProject(null)}>← Back</button>
              <h1 style={{ fontSize: '1.4rem' }}>{p.title}</h1>
              {flags.find(f => f.projectId === p.id) && <span className="badge badge-red">Flagged</span>}
            </div>
            {isCreator(p) && (
              <div className="flex-center gap-2">
                <button className="btn btn-ghost btn-sm" onClick={() => setEditing({ title: p.title, github: p.github, demo: p.demo, description: p.description, visibility: p.visibility, languages: p.languages.join(', ') })}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => setShowDelete(p.id)}>Delete</button>
              </div>
            )}
          </div>

          <div className="tabs">
            {['details', 'tasks', 'collaborators', 'thesis', 'feedback'].map(t => (
              <div key={t} className={`tab-item ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)} style={{ textTransform: 'capitalize' }}>{t}</div>
            ))}
          </div>

          {}
          {activeTab === 'details' && (
            <div className="animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {!editing ? (
                <div className="card card-p" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div className="grid-2">
                    <div><div className="text-xs text-muted" style={{ marginBottom: 4 }}>Course</div><div style={{ fontSize: 14 }}>{courses.find(c => c.id === p.course)?.name}</div></div>
                    <div><div className="text-xs text-muted" style={{ marginBottom: 4 }}>Visibility</div><span className={`badge ${p.visibility === 'public' ? 'badge-green' : 'badge-gray'}`}>{p.visibility}</span></div>
                    <div><div className="text-xs text-muted" style={{ marginBottom: 4 }}>Created</div><div style={{ fontSize: 14 }}>{p.createdAt}</div></div>
                    <div><div className="text-xs text-muted" style={{ marginBottom: 4 }}>Rating</div><div style={{ fontSize: 14, color: 'var(--amber)' }}>{p.rating > 0 ? ` ${p.rating}` : 'Not rated'}</div></div>
                  </div>
                  <div><div className="text-xs text-muted" style={{ marginBottom: 4 }}>Description</div><div style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-secondary)' }}>{p.description || 'No description yet'}</div></div>
                  <div><div className="text-xs text-muted" style={{ marginBottom: 6 }}>Languages</div><div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{p.languages.map(l => <span key={l} className="badge badge-purple">{l}</span>)}</div></div>
                  {p.github && <div><div className="text-xs text-muted" style={{ marginBottom: 4 }}>GitHub</div><a href={p.github} target="_blank" rel="noopener noreferrer" className="text-sm" style={{ color: 'var(--accent-text)' }}>{p.github}</a></div>}
                  {p.demo && <div><div className="text-xs text-muted" style={{ marginBottom: 4 }}>Demo video</div><a href={p.demo} target="_blank" rel="noopener noreferrer" className="text-sm" style={{ color: 'var(--accent-text)' }}>{p.demo}</a></div>}

                  {}
                  {flags.find(f => f.projectId === p.id) && !flags.find(f => f.projectId === p.id)?.appeal && (
                    <div style={{ background: 'var(--red-dim)', border: '1px solid rgba(226,75,74,0.25)', borderRadius: 'var(--radius-md)', padding: 14 }}>
                      <div style={{ fontSize: 13, color: '#F09595', marginBottom: 10 }}> Your project has been flagged: "{flags.find(f => f.projectId === p.id)?.reason}"</div>
                      <button className="btn btn-danger btn-sm" onClick={() => setShowFlagAppeal(true)}>Send Appeal</button>
                    </div>
                  )}
                  {flags.find(f => f.projectId === p.id)?.appeal && (
                    <div style={{ background: 'var(--amber-dim)', border: '1px solid rgba(239,159,39,0.25)', borderRadius: 'var(--radius-md)', padding: 14 }}>
                      <div style={{ fontSize: 13, color: 'var(--amber)' }}>◷ Appeal submitted, awaiting admin review.</div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="card card-p animate-scaleIn" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div className="input-group"><label className="input-label">Title</label><input className="input" value={editing.title} onChange={e => setEditing(prev => ({ ...prev, title: e.target.value }))} /></div>
                  <div className="input-group"><label className="input-label">Description</label><textarea className="textarea" value={editing.description} onChange={e => setEditing(prev => ({ ...prev, description: e.target.value }))} /></div>
                  <div className="input-group"><label className="input-label">GitHub link</label><input className="input" value={editing.github} onChange={e => setEditing(prev => ({ ...prev, github: e.target.value }))} /></div>
                  <div className="input-group"><label className="input-label">Demo video URL</label><input className="input" value={editing.demo} onChange={e => setEditing(prev => ({ ...prev, demo: e.target.value }))} /></div>
                  <div className="input-group"><label className="input-label">Languages (comma separated)</label><input className="input" value={editing.languages} onChange={e => setEditing(prev => ({ ...prev, languages: e.target.value }))} /></div>
                  <div className="input-group">
                    <label className="input-label">Visibility</label>
                    <select className="select" value={editing.visibility} onChange={e => setEditing(prev => ({ ...prev, visibility: e.target.value }))}>
                      <option value="private">Private</option>
                      <option value="public">Public</option>
                    </select>
                  </div>
                  <div className="flex-center gap-2">
                    <button className="btn btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
                    <button className="btn btn-primary" onClick={handleUpdate}>Save changes</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {}
          {activeTab === 'tasks' && <TasksTab project={p} isCreator={isCreator(p)} currentUser={currentUser} onStatusChange={handleTaskStatusChange} onProjectUpdate={(updated) => { setAllProjects(prev => prev.map(x => x.id === p.id ? updated : x)); setSelectedProject(updated) }} addToast={addToast} />}

          {}
          {activeTab === 'collaborators' && <CollaboratorsTab project={p} isCreator={isCreator(p)} currentUser={currentUser} onProjectUpdate={(updated) => { setAllProjects(prev => prev.map(x => x.id === p.id ? updated : x)); setSelectedProject(updated) }} addToast={addToast} pushNotif={pushNotif} />}

          {}
          {activeTab === 'thesis' && <ThesisTab project={p} isCreator={isCreator(p)} onProjectUpdate={(updated) => { setAllProjects(prev => prev.map(x => x.id === p.id ? updated : x)); setSelectedProject(updated) }} addToast={addToast} />}

          {}
          {activeTab === 'feedback' && (
            <div className="card card-p animate-fadeIn">
              <h3 style={{ fontSize: 15, marginBottom: 16 }}>Instructor Feedback</h3>
              {p.instructorFeedback ? (
                <div style={{ background: 'rgba(124,111,255,0.06)', border: '1px solid rgba(124,111,255,0.2)', borderRadius: 'var(--radius-md)', padding: 16, fontSize: 14, lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                  {p.instructorFeedback}
                </div>
              ) : <EmptyState icon="◈" title="No feedback yet" text="Feedback from your course instructor will appear here." />}
            </div>
          )}
        </>
      )}

      {}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create New Project"
        footer={<>
          <button className="btn btn-ghost" onClick={() => setShowCreate(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleCreate}>Create project</button>
        </>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="input-group"><label className="input-label">Project title *</label><input className="input" placeholder="e.g. AI Code Review Assistant" value={form.title} onChange={e => updateForm('title', e.target.value)} /></div>
          <div className="input-group">
            <label className="input-label">Course *</label>
            <select className="select" value={form.course} onChange={e => updateForm('course', e.target.value)}>
              <option value="">Select a course</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
            </select>
          </div>
          <div className="input-group"><label className="input-label">Description</label><textarea className="textarea" placeholder="Brief project description" value={form.description} onChange={e => updateForm('description', e.target.value)} /></div>
          <div className="input-group"><label className="input-label">GitHub link</label><input className="input" placeholder="https://github.com/..." value={form.github} onChange={e => updateForm('github', e.target.value)} /></div>
          <div className="input-group"><label className="input-label">Demo video URL</label><input className="input" placeholder="https://youtube.com/..." value={form.demo} onChange={e => updateForm('demo', e.target.value)} /></div>
          <div className="input-group"><label className="input-label">Languages (comma separated)</label><input className="input" placeholder="Python, React, Node.js" value={form.languages} onChange={e => updateForm('languages', e.target.value)} /></div>
          <div className="input-group">
            <label className="input-label">Visibility</label>
            <select className="select" value={form.visibility} onChange={e => updateForm('visibility', e.target.value)}>
              <option value="private">Private</option>
              <option value="public">Public</option>
            </select>
          </div>
        </div>
      </Modal>

      {}
      <ConfirmModal open={!!showDelete} onClose={() => setShowDelete(null)} onConfirm={() => handleDelete(showDelete)} danger title="Delete project" message="Are you sure you want to delete this project? This action cannot be undone." />

      {}
      <Modal open={showFlagAppeal} onClose={() => setShowFlagAppeal(false)} title="Send Appeal"
        footer={<>
          <button className="btn btn-ghost" onClick={() => setShowFlagAppeal(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={() => {
            setFlags(prev => prev.map(f => f.projectId === p?.id ? { ...f, appeal: appealText, appealDate: new Date().toISOString().split('T')[0] } : f))
            setShowFlagAppeal(false)
            addToast('Appeal submitted!', 'success')
          }}>Submit appeal</button>
        </>}>
        <div className="input-group">
          <label className="input-label">Your explanation</label>
          <textarea className="textarea" placeholder="Explain why your project should be unflagged..." value={appealText} onChange={e => setAppealText(e.target.value)} />
        </div>
      </Modal>
    </StudentLayout>
  )
}

function TasksTab({ project, isCreator, currentUser, onStatusChange, onProjectUpdate, addToast }) {
  const [showAdd, setShowAdd] = useState(false)
  const [taskForm, setTaskForm] = useState({ title: '', description: '', assignee: currentUser.id, deadline: '', status: 'pending' })
  const [order, setOrder] = useState(project.tasks.map(t => t.id))

  const tasks = [...project.tasks].sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id))

  const addTask = () => {
    if (!taskForm.title) { addToast('Task title required', 'error'); return }
    const newTask = { id: Date.now(), ...taskForm, assignee: parseInt(taskForm.assignee), comments: [] }
    const updated = { ...project, tasks: [...project.tasks, newTask] }
    onProjectUpdate(updated)
    setOrder(prev => [...prev, newTask.id])
    setTaskForm({ title: '', description: '', assignee: currentUser.id, deadline: '', status: 'pending' })
    setShowAdd(false)
    addToast('Task added!', 'success')
  }

  const deleteTask = (id) => {
    const updated = { ...project, tasks: project.tasks.filter(t => t.id !== id) }
    onProjectUpdate(updated)
    addToast('Task deleted', 'info')
  }

  const moveTask = (id, dir) => {
    setOrder(prev => {
      const idx = prev.indexOf(id)
      const newOrder = [...prev]
      const swap = idx + dir
      if (swap < 0 || swap >= newOrder.length) return prev;
      [newOrder[idx], newOrder[swap]] = [newOrder[swap], newOrder[idx]]
      return newOrder
    })
  }

  const collaborators = project.collaborators.filter(c => c.status === 'accepted').map(c => users.find(u => u.id === c.userId)).filter(Boolean)

  return (
    <div className="animate-fadeIn">
      <div className="flex-between" style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 15 }}>Tasks ({tasks.length})</h3>
        {isCreator && <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>+ Add Task</button>}
      </div>
      {tasks.length === 0 ? <EmptyState icon="◉" title="No tasks yet" text={isCreator ? 'Add tasks for your team.' : 'No tasks assigned yet.'} /> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {tasks.map((t, i) => {
            const assignee = users.find(u => u.id === t.assignee)
            const isMyTask = t.assignee === currentUser.id
            return (
              <div key={t.id} className={`card card-p animate-fadeIn delay-${Math.min(i+1,6)}`} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                {isCreator && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 2 }}>
                    <button onClick={() => moveTask(t.id, -1)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 12 }}>▲</button>
                    <button onClick={() => moveTask(t.id, 1)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 12 }}>▼</button>
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <div className="flex-between" style={{ marginBottom: 6 }}>
                    <div style={{ fontWeight: 500, fontSize: 14 }}>{t.title}</div>
                    <div className="flex-center gap-2">
                      {(isCreator || isMyTask) ? (
                        <select className="select" style={{ width: 130, padding: '4px 10px', fontSize: 12 }}
                          value={t.status} onChange={e => onStatusChange(t.id, e.target.value)}>
                          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      ) : <span className={`badge ${statusColor[t.status]}`}>{t.status}</span>}
                      {isCreator && <button onClick={() => deleteTask(t.id)} style={{ background: 'none', border: 'none', color: 'var(--red)', cursor: 'pointer', fontSize: 14 }}></button>}
                    </div>
                  </div>
                  <div className="text-sm text-muted" style={{ marginBottom: 8 }}>{t.description}</div>
                  <div className="flex-center gap-3">
                    {assignee && <div className="flex-center gap-1"><div className={`avatar avatar-sm ${getAvatarColors(assignee.avatar)}`}>{getInitials(assignee.firstName, assignee.lastName)}</div><span className="text-xs text-muted">{assignee.firstName}</span></div>}
                    {t.deadline && <span className="text-xs text-muted"> {t.deadline}</span>}
                  </div>
                  {}
                  {(
                    currentUser.id === project.creatorId ||
                    (project.collaborators || []).filter(col => col.status === 'accepted').map(col => col.userId).includes(currentUser.id) ||
                    (project.instructors || []).filter(ins => ins.status === 'accepted').map(ins => ins.userId).includes(currentUser.id)
                  ) && t.comments?.length > 0 && (
                    <div style={{ marginTop: 10, padding: 10, background: 'var(--accent-dim)', borderRadius: 'var(--radius-md)' }}>
                      {t.comments.map((cm, i) => <div key={i} className="text-sm" style={{ color: 'var(--accent-text)' }}>▸ {cm}</div>)}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Task"
        footer={<><button className="btn btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button><button className="btn btn-primary" onClick={addTask}>Add task</button></>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="input-group"><label className="input-label">Title *</label><input className="input" placeholder="Task title" value={taskForm.title} onChange={e => setTaskForm(p => ({ ...p, title: e.target.value }))} /></div>
          <div className="input-group"><label className="input-label">Description</label><input className="input" placeholder="One-line description" value={taskForm.description} onChange={e => setTaskForm(p => ({ ...p, description: e.target.value }))} /></div>
          <div className="input-group">
            <label className="input-label">Assign to</label>
            <select className="select" value={taskForm.assignee} onChange={e => setTaskForm(p => ({ ...p, assignee: e.target.value }))}>
              <option value={currentUser.id}>{currentUser.firstName} (You)</option>
              {collaborators.map(c => <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>)}
            </select>
          </div>
          <div className="input-group"><label className="input-label">Deadline</label><input className="input" type="date" value={taskForm.deadline} onChange={e => setTaskForm(p => ({ ...p, deadline: e.target.value }))} /></div>
        </div>
      </Modal>
    </div>
  )
}

function CollaboratorsTab({ project, isCreator, currentUser, onProjectUpdate, addToast, pushNotif }) {
  const [search, setSearch] = useState('')
  const [inviteType, setInviteType] = useState('student')
  const allStudents = users.filter(u => (u.role === 'student' || u.role === 'instructor') && u.id !== currentUser.id)
  const results = allStudents.filter(u =>
    (u.firstName + ' ' + u.lastName + ' ' + u.email).toLowerCase().includes(search.toLowerCase()) &&
    !project.collaborators.some(c => c.userId === u.id) &&
    !project.instructors.some(c => c.userId === u.id)
  )

  const sendInvite = (userId, type) => {
    const field = type === 'instructor' ? 'instructors' : 'collaborators'
    const updated = { ...project, [field]: [...project[field], { userId, status: 'pending' }] }
    onProjectUpdate(updated)
    addToast('Invitation sent!', 'success')
    setSearch('')
  }

  const cancelInvite = (userId, type) => {
    const field = type === 'instructor' ? 'instructors' : 'collaborators'
    const updated = { ...project, [field]: project[field].filter(c => c.userId !== userId) }
    onProjectUpdate(updated)
    addToast('Invitation cancelled', 'info')
  }

  const removeCollaborator = (userId) => {
    const updated = { ...project, collaborators: project.collaborators.filter(c => c.userId !== userId) }
    onProjectUpdate(updated)
    addToast('Collaborator removed', 'info')
  }

  const statusBadge = (status) => ({ accepted: 'badge-teal', rejected: 'badge-red', pending: 'badge-amber' }[status] || 'badge-gray')

  return (
    <div className="animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {}
      <div className="card">
        <div className="card-p" style={{ borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: 14 }}>Collaborators ({project.collaborators.length})</h3>
        </div>
        {project.collaborators.length === 0 ? <div className="card-p"><EmptyState icon="◎" title="No collaborators yet" /></div> : project.collaborators.map(c => {
          const u = users.find(x => x.id === c.userId)
          if (!u) return null
          return (
            <div key={c.userId} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: '1px solid var(--border)' }}>
              <div className={`avatar avatar-sm ${getAvatarColors(u.avatar)}`}>{getInitials(u.firstName, u.lastName)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{u.firstName} {u.lastName}</div>
                <div className="text-xs text-muted">{u.email}</div>
              </div>
              <span className={`badge ${statusBadge(c.status)}`}>{c.status}</span>
              {isCreator && c.status !== 'accepted' && <button onClick={() => cancelInvite(c.userId, 'student')} className="btn btn-ghost btn-sm">Cancel</button>}
              {isCreator && c.status === 'accepted' && <button onClick={() => removeCollaborator(c.userId)} className="btn btn-danger btn-sm">Remove</button>}
            </div>
          )
        })}
      </div>

      {}
      <div className="card">
        <div className="card-p" style={{ borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: 14 }}>Course Instructors ({project.instructors.length})</h3>
        </div>
        {project.instructors.length === 0 ? <div className="card-p"><EmptyState icon="◈" title="No instructors invited" /></div> : project.instructors.map(c => {
          const u = users.find(x => x.id === c.userId)
          if (!u) return null
          return (
            <div key={c.userId} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: '1px solid var(--border)' }}>
              <div className={`avatar avatar-sm ${getAvatarColors(u.avatar)}`}>{getInitials(u.firstName, u.lastName)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{u.firstName} {u.lastName}</div>
                <div className="text-xs text-muted">{u.email}</div>
              </div>
              <span className={`badge ${statusBadge(c.status)}`}>{c.status}</span>
              {isCreator && <button onClick={() => cancelInvite(c.userId, 'instructor')} className="btn btn-ghost btn-sm">Remove</button>}
            </div>
          )
        })}
      </div>

      {}
      {isCreator && (
        <div className="card card-p animate-fadeIn">
          <h3 style={{ fontSize: 14, marginBottom: 14 }}>Send Invitation</h3>
          <div className="flex-center gap-2" style={{ marginBottom: 12 }}>
            <SearchBar value={search} onChange={setSearch} placeholder="Search by name or email..." />
            <select className="select" style={{ width: 160 }} value={inviteType} onChange={e => setInviteType(e.target.value)}>
              <option value="student">Collaborator</option>
              <option value="instructor">Instructor</option>
            </select>
          </div>
          {search && results.slice(0,5).map(u => (
            <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <div className={`avatar avatar-sm ${getAvatarColors(u.avatar)}`}>{getInitials(u.firstName, u.lastName)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{u.firstName} {u.lastName}</div>
                <div className="text-xs text-muted">{u.email} · {u.role}</div>
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => sendInvite(u.id, inviteType)}>Invite</button>
            </div>
          ))}
          {search && results.length === 0 && <EmptyState icon="◎" title="No users found" />}
        </div>
      )}
    </div>
  )
}

function ThesisTab({ project, isCreator, onProjectUpdate, addToast }) {
  const isBachelor = courses.find(c => c.id === project.course)?.name === 'Bachelor Project'
  const drafts = project.thesisDrafts || []

  const uploadDraft = () => {
    const name = `Draft_v${drafts.length + 1}.pdf`
    const updated = { ...project, thesisDrafts: [...drafts, { id: Date.now(), name, isFinal: false, date: new Date().toISOString().split('T')[0] }] }
    onProjectUpdate(updated)
    addToast('Thesis draft uploaded!', 'success')
  }

  const setFinal = (id) => {
    const updated = { ...project, thesisDrafts: drafts.map(d => ({ ...d, isFinal: d.id === id })) }
    onProjectUpdate(updated)
    addToast('Final draft selected!', 'success')
  }

  if (!isBachelor) return (
    <div className="card card-p animate-fadeIn">
      <EmptyState icon="" title="Not a bachelor project" text="Thesis uploads are only available for bachelor projects." />
    </div>
  )

  return (
    <div className="animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="card">
        <div className="card-p flex-between" style={{ borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: 14 }}>Thesis Drafts ({drafts.length})</h3>
          {isCreator && <button className="btn btn-primary btn-sm" onClick={uploadDraft}>+ Upload Draft</button>}
        </div>
        {drafts.length === 0 ? (
          <div className="card-p"><EmptyState icon="" title="No drafts yet" text="Upload your first thesis draft." /></div>
        ) : drafts.map((d, i) => (
          <div key={d.id} className={`animate-fadeIn delay-${i+1}`}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: d.isFinal ? 'var(--teal-dim)' : 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{d.name}</div>
              <div className="text-xs text-muted">{d.date}</div>
            </div>
            {d.isFinal ? (
              <span className="badge badge-teal">Final</span>
            ) : (
              isCreator && <button className="btn btn-ghost btn-sm" onClick={() => setFinal(d.id)}>Set as final</button>
            )}
          </div>
        ))}
      </div>
      <div style={{ background: 'var(--accent-dim)', border: '1px solid rgba(124,111,255,0.2)', borderRadius: 'var(--radius-md)', padding: 14, fontSize: 13, color: 'var(--accent-text)' }}>
        ℹ When a final draft is selected, all other drafts become private and only the final is publicly visible.
      </div>
    </div>
  )
}
