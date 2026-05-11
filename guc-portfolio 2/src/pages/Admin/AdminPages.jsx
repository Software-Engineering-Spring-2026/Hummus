import { useState } from 'react'
import { Users, BookOpen, FolderKanban, Building2, Flag, Bell, CheckCheck, CheckCircle, XCircle, Shield, Download, Plus, Edit2, Trash2, AlertTriangle } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { users as initialUsers, courses as initialCourses, projects as initialProjects, internships, flags as initialFlags, employerDocs, getInitials, getAvatarColors } from '../../data/data'
import { Sidebar, Topbar, Modal, ConfirmModal, SearchBar, EmptyState } from '../../components/Components'

function AdminLayout({ children, title }) {
  return (
    <div className="layout">
      <Sidebar role="admin" />
      <div className="main-content">
        <Topbar title={title} />
        <div className="page">{children}</div>
      </div>
    </div>
  )
}

export function AdminDashboard() {
  const students = initialUsers.filter(u => u.role === 'student')
  const instructors = initialUsers.filter(u => u.role === 'instructor')
  const employers = initialUsers.filter(u => u.role === 'employer')
  const publicProjects = initialProjects.filter(p => p.visibility === 'public')
  const pendingEmployers = employers.filter(e => !e.verified)
  const flaggedProjects = initialProjects.filter(p => p.flagged)
  const totalApplicants = internships.reduce((sum, i) => sum + i.applicants.length, 0)

  const stats = [
    { num: students.length,        label: 'Students',           icon: '◎', color: 'var(--accent)' },
    { num: instructors.length,     label: 'Instructors',        icon: '◈', color: 'var(--teal)'   },
    { num: employers.length,       label: 'Employers',          icon: '◉', color: 'var(--coral)'  },
    { num: publicProjects.length,  label: 'Public projects',    icon: '⊙', color: 'var(--green)'  },
    { num: internships.length,     label: 'Internships',        icon: '⊞', color: 'var(--amber)'  },
    { num: totalApplicants,        label: 'Applications total', icon: '◷', color: 'var(--pink)'   },
    { num: pendingEmployers.length,label: 'Pending employers',  icon: '◷', color: 'var(--amber)'  },
    { num: flaggedProjects.length, label: 'Flagged projects',   icon: '', color: 'var(--red)'    },
  ]

  const langUsage = {}
  initialProjects.forEach(p => p.languages.forEach(l => { langUsage[l] = (langUsage[l] || 0) + 1 }))
  const topLangs = Object.entries(langUsage).sort((a, b) => b[1] - a[1]).slice(0, 5)
  const maxLang = topLangs[0]?.[1] || 1

  return (
    <AdminLayout title="Dashboard">
      <div className="animate-fadeInDown" style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: 6 }}>Platform Overview</h1>
        <p className="text-secondary">Real-time stats across the entire portfolio platform.</p>
      </div>

      <div className="grid-4" style={{ marginBottom: 32 }}>
        {stats.map((s, i) => (
          <div key={i} className={`stat-card animate-fadeIn delay-${Math.min(i + 1, 6)}`}>
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
        <div className="card card-p animate-fadeIn delay-3">
          <h3 style={{ fontSize: 15, marginBottom: 18 }}>Top Languages Platform-wide</h3>
          {topLangs.map(([lang, count]) => (
            <div key={lang} style={{ marginBottom: 14 }}>
              <div className="flex-between" style={{ marginBottom: 6 }}>
                <span style={{ fontSize: 13 }}>{lang}</span>
                <span className="text-xs text-muted">{count} project{count !== 1 ? 's' : ''}</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${(count / maxLang) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>

        {}
        <div className="card card-p animate-fadeIn delay-4">
          <h3 style={{ fontSize: 15, marginBottom: 16 }}>Requires Attention</h3>
          {pendingEmployers.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--amber-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--amber)' }}>◷</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{pendingEmployers.length} employer{pendingEmployers.length > 1 ? 's' : ''} awaiting approval</div>
                <div className="text-xs text-muted">Review submitted documents</div>
              </div>
            </div>
          )}
          {flaggedProjects.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--red-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--red)' }}></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{flaggedProjects.length} flagged project{flaggedProjects.length > 1 ? 's' : ''}</div>
                <div className="text-xs text-muted">Appeals waiting for review</div>
              </div>
            </div>
          )}
          {pendingEmployers.length === 0 && flaggedProjects.length === 0 && (
            <EmptyState icon="" title="All clear" text="No pending actions at the moment." />
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

export function AdminUsers() {
  const { addToast } = useApp()
  const [allUsers, setAllUsers] = useState(initialUsers)
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [createModal, setCreateModal] = useState(false)
  const [deactivateModal, setDeactivateModal] = useState(null)
  const [adminForm, setAdminForm] = useState({ firstName: '', lastName: '', email: '', password: '' })

  let displayed = allUsers
  if (search) displayed = displayed.filter(u => (u.firstName + ' ' + u.lastName + ' ' + u.email).toLowerCase().includes(search.toLowerCase()))
  if (filterRole !== 'all') displayed = displayed.filter(u => u.role === filterRole)

  const toggleActive = (userId) => {
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, active: !u.active } : u))
    const user = allUsers.find(u => u.id === userId)
    addToast(`${user?.firstName} ${user?.active ? 'deactivated' : 'activated'}`, 'info')
  }

  const createAdmin = () => {
    if (!adminForm.firstName || !adminForm.email) { addToast('Name and email required', 'error'); return }
    const newAdmin = { id: Date.now(), role: 'admin', ...adminForm, avatar: 'purple', active: true }
    setAllUsers(prev => [...prev, newAdmin])
    setCreateModal(false)
    setAdminForm({ firstName: '', lastName: '', email: '', password: '' })
    addToast('Admin account created!', 'success')
  }

  const roleBadge = { student: 'badge-purple', instructor: 'badge-teal', employer: 'badge-coral', admin: 'badge-gray' }

  return (
    <AdminLayout title="Users">
      <div className="flex-between page-header">
        <div><h1 className="page-title">User Management</h1><p className="page-subtitle">{allUsers.length} total users</p></div>
        <button className="btn btn-primary" onClick={() => setCreateModal(true)}>+ Create Admin</button>
      </div>

      <div className="flex-center gap-2" style={{ marginBottom: 20 }}>
        <div style={{ flex: 1 }}><SearchBar value={search} onChange={setSearch} placeholder="Search users..." /></div>
        <select className="select" style={{ width: 160 }} value={filterRole} onChange={e => setFilterRole(e.target.value)}>
          <option value="all">All roles</option>
          <option value="student">Students</option>
          <option value="instructor">Instructors</option>
          <option value="employer">Employers</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      <div className="table-wrap animate-scaleIn">
        <table>
          <thead>
            <tr><th>User</th><th>Email</th><th>Role</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            {displayed.map((u, i) => (
              <tr key={u.id} className={`animate-fadeIn delay-${Math.min(i + 1, 6)}`}>
                <td>
                  <div className="flex-center gap-2">
                    <div className={`avatar avatar-sm ${getAvatarColors(u.avatar)}`}>{getInitials(u.firstName, u.lastName)}</div>
                    <span style={{ fontWeight: 500, fontSize: 13 }}>{u.firstName} {u.lastName}</span>
                  </div>
                </td>
                <td className="text-sm text-muted">{u.email}</td>
                <td><span className={`badge ${roleBadge[u.role] || 'badge-gray'}`}>{u.role}</span></td>
                <td><span className={`badge ${u.active ? 'badge-green' : 'badge-red'}`}>{u.active ? 'Active' : 'Inactive'}</span></td>
                <td>
                  {u.role !== 'admin' && (
                    <button className={`btn ${u.active ? 'btn-danger' : 'btn-ghost'} btn-sm`} onClick={() => toggleActive(u.id)}>
                      {u.active ? 'Deactivate' : 'Activate'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={createModal} onClose={() => setCreateModal(false)} title="Create Admin Account"
        footer={<><button className="btn btn-ghost" onClick={() => setCreateModal(false)}>Cancel</button><button className="btn btn-primary" onClick={createAdmin}>Create admin</button></>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="input-group">
            <label className="input-label">Username *</label>
            <input className="input" placeholder="e.g. admin_sara" value={adminForm.firstName} onChange={e => setAdminForm(p => ({ ...p, firstName: e.target.value }))} />
            <span className="text-xs text-muted">This will be the display name for the admin account</span>
          </div>
          <div className="input-group"><label className="input-label">Email *</label><input className="input" type="email" placeholder="admin@guc.edu.eg" value={adminForm.email} onChange={e => setAdminForm(p => ({ ...p, email: e.target.value }))} /></div>
          <div className="input-group"><label className="input-label">Password *</label><input className="input" type="password" placeholder="Min. 6 characters" value={adminForm.password} onChange={e => setAdminForm(p => ({ ...p, password: e.target.value }))} /></div>
        </div>
      </Modal>
    </AdminLayout>
  )
}

export function AdminCourses() {
  const { addToast } = useApp()
  const [allCourses, setAllCourses] = useState(initialCourses)
  const [createModal, setCreateModal] = useState(false)
  const [editModal, setEditModal] = useState(null)
  const [deleteModal, setDeleteModal] = useState(null)
  const [form, setForm] = useState({ name: '', code: '' })
  const [search, setSearch] = useState('')
  
  const [linkRequests] = useState([
    { id: 1, courseId: 4, instructorId: 6, course: 'Computer Networks', instructor: 'Dr. Mona Salem', date: '2026-04-20' },
  ])
  const [handledRequests, setHandledRequests] = useState([])

  const filtered = allCourses.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase()))

  const handleCreate = () => {
    if (!form.name || !form.code) { addToast('Name and code required', 'error'); return }
    setAllCourses(prev => [...prev, { id: Date.now(), name: form.name, code: form.code, instructors: [] }])
    setForm({ name: '', code: '' })
    setCreateModal(false)
    addToast('Course created!', 'success')
  }

  const handleEdit = () => {
    setAllCourses(prev => prev.map(c => c.id === editModal.id ? { ...c, name: editModal.name, code: editModal.code } : c))
    setEditModal(null)
    addToast('Course updated!', 'success')
  }

  const handleDelete = (id) => {
    setAllCourses(prev => prev.filter(c => c.id !== id))
    addToast('Course deleted', 'info')
  }

  const handleLinkRequest = (id, accept) => {
    setHandledRequests(prev => [...prev, id])
    addToast(accept ? 'Instructor link approved!' : 'Request rejected', accept ? 'success' : 'info')
  }

  const pendingRequests = linkRequests.filter(r => !handledRequests.includes(r.id))

  return (
    <AdminLayout title="Courses">
      <div className="flex-between page-header">
        <div><h1 className="page-title">Course Management</h1><p className="page-subtitle">{allCourses.length} courses</p></div>
        <button className="btn btn-primary" onClick={() => setCreateModal(true)}>+ Add Course</button>
      </div>

      {pendingRequests.length > 0 && (
        <div className="animate-fadeInDown" style={{ background: 'rgba(239,159,39,0.08)', border: '1px solid rgba(239,159,39,0.25)', borderRadius: 'var(--radius-lg)', padding: 16, marginBottom: 24 }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--amber)', marginBottom: 12 }}>◷ Pending instructor link requests</div>
          {pendingRequests.map(r => (
            <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0' }}>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{r.instructor}</span>
                <span className="text-muted" style={{ fontSize: 12 }}> wants to link to {r.course}</span>
                <span className="text-xs text-muted"> · {r.date}</span>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => handleLinkRequest(r.id, false)}>Reject</button>
              <button className="btn btn-primary btn-sm" onClick={() => handleLinkRequest(r.id, true)}>Approve</button>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginBottom: 16 }}><SearchBar value={search} onChange={setSearch} placeholder="Search courses..." /></div>

      <div className="table-wrap animate-scaleIn">
        <table>
          <thead><tr><th>Course name</th><th>Code</th><th>Instructors</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map((c, i) => {
              const instructorNames = c.instructors.map(id => { const u = initialUsers.find(x => x.id === id); return u ? `${u.firstName} ${u.lastName}` : '' }).filter(Boolean)
              return (
                <tr key={c.id} className={`animate-fadeIn delay-${Math.min(i + 1, 6)}`}>
                  <td style={{ fontWeight: 500 }}>{c.name}</td>
                  <td><span className="badge badge-purple">{c.code}</span></td>
                  <td className="text-sm text-muted">{instructorNames.join(', ') || '—'}</td>
                  <td>
                    <div className="flex-center gap-2">
                      <button className="btn btn-ghost btn-sm" onClick={() => setEditModal({ ...c })}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => setDeleteModal(c.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <Modal open={createModal} onClose={() => setCreateModal(false)} title="Add Course"
        footer={<><button className="btn btn-ghost" onClick={() => setCreateModal(false)}>Cancel</button><button className="btn btn-primary" onClick={handleCreate}>Create</button></>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="input-group"><label className="input-label">Course name</label><input className="input" placeholder="e.g. Machine Learning" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></div>
          <div className="input-group"><label className="input-label">Course code</label><input className="input" placeholder="e.g. CSEN901" value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value }))} /></div>
        </div>
      </Modal>

      <Modal open={!!editModal} onClose={() => setEditModal(null)} title="Edit Course"
        footer={<><button className="btn btn-ghost" onClick={() => setEditModal(null)}>Cancel</button><button className="btn btn-primary" onClick={handleEdit}>Save</button></>}>
        {editModal && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="input-group"><label className="input-label">Course name</label><input className="input" value={editModal.name} onChange={e => setEditModal(p => ({ ...p, name: e.target.value }))} /></div>
            <div className="input-group"><label className="input-label">Course code</label><input className="input" value={editModal.code} onChange={e => setEditModal(p => ({ ...p, code: e.target.value }))} /></div>
          </div>
        )}
      </Modal>

      <ConfirmModal open={!!deleteModal} onClose={() => setDeleteModal(null)} onConfirm={() => handleDelete(deleteModal)} danger title="Delete course" message="Are you sure? This will affect all linked projects." />
    </AdminLayout>
  )
}

export function AdminProjects() {
  const { addToast } = useApp()
  const [allProjects, setAllProjects] = useState(initialProjects)
  const [search, setSearch] = useState('')
  const [filterVis, setFilterVis] = useState('all')

  let displayed = allProjects
  if (search) displayed = displayed.filter(p => p.title.toLowerCase().includes(search.toLowerCase()))
  if (filterVis !== 'all') displayed = displayed.filter(p => p.visibility === filterVis)

  const toggleStatus = (id) => {
    setAllProjects(prev => prev.map(p => p.id === id ? { ...p, status: p.status === 'active' ? 'deactivated' : 'active' } : p))
    const p = allProjects.find(x => x.id === id)
    addToast(`Project ${p?.status === 'active' ? 'deactivated' : 'activated'}`, 'info')
  }

  return (
    <AdminLayout title="Projects">
      <div className="page-header"><h1 className="page-title">All Projects</h1><p className="page-subtitle">{allProjects.length} projects on platform</p></div>
      <div className="flex-center gap-2" style={{ marginBottom: 20 }}>
        <div style={{ flex: 1 }}><SearchBar value={search} onChange={setSearch} placeholder="Search projects..." /></div>
        <select className="select" style={{ width: 160 }} value={filterVis} onChange={e => setFilterVis(e.target.value)}>
          <option value="all">All visibility</option>
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
      </div>
      <div className="table-wrap animate-scaleIn">
        <table>
          <thead><tr><th>Project</th><th>Course</th><th>Creator</th><th>Visibility</th><th>Status</th><th>Rating</th><th>Actions</th></tr></thead>
          <tbody>
            {displayed.map((p, i) => {
              const course = initialCourses.find(c => c.id === p.course)
              const creator = initialUsers.find(u => u.id === p.creatorId)
              return (
                <tr key={p.id} className={`animate-fadeIn delay-${Math.min(i + 1, 6)}`}>
                  <td style={{ fontWeight: 500, maxWidth: 200 }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                    {p.flagged && <span className="badge badge-red" style={{ marginTop: 4 }}>Flagged</span>}
                  </td>
                  <td className="text-sm text-muted">{course?.code}</td>
                  <td className="text-sm">{creator?.firstName} {creator?.lastName}</td>
                  <td><span className={`badge ${p.visibility === 'public' ? 'badge-green' : 'badge-gray'}`}>{p.visibility}</span></td>
                  <td><span className={`badge ${p.status === 'active' ? 'badge-teal' : 'badge-red'}`}>{p.status || 'active'}</span></td>
                  <td style={{ color: 'var(--amber)', fontSize: 13 }}>{p.rating > 0 ? ` ${p.rating}` : '—'}</td>
                  <td>
                    <button className={`btn ${(p.status || 'active') === 'active' ? 'btn-danger' : 'btn-ghost'} btn-sm`} onClick={() => toggleStatus(p.id)}>
                      {(p.status || 'active') === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  )
}

export function AdminEmployers() {
  const { addToast } = useApp()
  const [allEmployers, setAllEmployers] = useState(initialUsers.filter(u => u.role === 'employer'))
  const [docsModal, setDocsModal] = useState(null)
  const [filterVerified, setFilterVerified] = useState('all')

  let displayed = allEmployers
  if (filterVerified === 'pending') displayed = displayed.filter(e => !e.verified)
  if (filterVerified === 'verified') displayed = displayed.filter(e => e.verified)

  const approve = (id) => {
    setAllEmployers(prev => prev.map(e => e.id === id ? { ...e, verified: true } : e))
    addToast('Employer verified!', 'success')
  }

  const reject = (id) => {
    setAllEmployers(prev => prev.map(e => e.id === id ? { ...e, active: false } : e))
    addToast('Employer application rejected', 'info')
  }

  const getDocs = (employerId) => {
    const doc = employerDocs.find(d => d.employerId === employerId)
    return doc?.docs || []
  }

  return (
    <AdminLayout title="Employers">
      <div className="page-header">
        <h1 className="page-title">Employer Management</h1>
        <p className="page-subtitle">{allEmployers.filter(e => !e.verified).length} pending · {allEmployers.filter(e => e.verified).length} verified</p>
      </div>
      <div style={{ marginBottom: 20 }}>
        <select className="select" style={{ width: 200 }} value={filterVerified} onChange={e => setFilterVerified(e.target.value)}>
          <option value="all">All employers</option>
          <option value="pending">Pending approval</option>
          <option value="verified">Verified</option>
        </select>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {displayed.map((emp, i) => {
          const docs = getDocs(emp.id)
          const empInternships = internships.filter(x => x.employerId === emp.id)
          return (
            <div key={emp.id} className={`card card-p animate-fadeIn delay-${Math.min(i + 1, 6)}`} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div className={`avatar avatar-md ${getAvatarColors(emp.avatar)}`}>{getInitials(emp.firstName, emp.lastName)}</div>
              <div style={{ flex: 1 }}>
                <div className="flex-between" style={{ marginBottom: 6 }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>{emp.company || emp.firstName}</div>
                    <div className="text-sm text-muted">{emp.email}</div>
                  </div>
                  <div className="flex-center gap-2">
                    <span className={`badge ${emp.verified ? 'badge-teal' : 'badge-amber'}`}>{emp.verified ? 'Verified' : 'Pending'}</span>
                    <span className={`badge ${emp.active ? 'badge-green' : 'badge-red'}`}>{emp.active ? 'Active' : 'Inactive'}</span>
                  </div>
                </div>
                {emp.address && <div className="text-sm text-muted" style={{ marginBottom: 8 }}> {emp.address}</div>}
                <div className="flex-between">
                  <div className="flex-center gap-3">
                    <span className="text-xs text-muted">{empInternships.length} internship{empInternships.length !== 1 ? 's' : ''}</span>
                    <span className="text-xs text-muted">{docs.length} document{docs.length !== 1 ? 's' : ''} submitted</span>
                  </div>
                  <div className="flex-center gap-2">
                    {docs.length > 0 && <button className="btn btn-ghost btn-sm" onClick={() => setDocsModal({ emp, docs })}>View docs</button>}
                    {!emp.verified && emp.active && (
                      <>
                        <button className="btn btn-danger btn-sm" onClick={() => reject(emp.id)}>Reject</button>
                        <button className="btn btn-primary btn-sm" onClick={() => approve(emp.id)}>Approve</button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <Modal open={!!docsModal} onClose={() => setDocsModal(null)} title={`Documents — ${docsModal?.emp.company}`}
        footer={<button className="btn btn-ghost" onClick={() => setDocsModal(null)}>Close</button>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {docsModal?.docs.map(doc => (
            <div key={doc} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: 20 }}></span>
              <span style={{ flex: 1, fontSize: 14 }}>{doc}</span>
              <a
                href={`data:text/plain;charset=utf-8,Simulated PDF download: ${encodeURIComponent(doc)}`}
                download={doc}
                className="btn btn-ghost btn-sm"
                style={{ textDecoration: 'none' }}
              >
                Download
              </a>
            </div>
          ))}
        </div>
      </Modal>
    </AdminLayout>
  )
}

export function AdminFlags() {
  const { addToast } = useApp()
  const [allFlags, setAllFlags] = useState(initialFlags)
  const [allProjects, setAllProjects] = useState(initialProjects)

  const activateProject = (projectId) => {
    setAllProjects(prev => prev.map(p => p.id === projectId ? { ...p, flagged: false, status: 'active' } : p))
    setAllFlags(prev => prev.filter(f => f.projectId !== projectId))
    addToast('Project unflagged and activated', 'success')
  }

  const deactivateProject = (projectId) => {
    setAllProjects(prev => prev.map(p => p.id === projectId ? { ...p, status: 'deactivated' } : p))
    addToast('Project deactivated', 'info')
  }

  return (
    <AdminLayout title="Flagged Projects">
      <div className="page-header">
        <h1 className="page-title">Flagged Projects</h1>
        <p className="page-subtitle">{allFlags.length} project{allFlags.length !== 1 ? 's' : ''} under review</p>
      </div>
      {allFlags.length === 0
        ? <EmptyState icon="" title="No flagged projects" text="All projects are compliant." />
        : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {allFlags.map((flag, i) => {
              const project = allProjects.find(p => p.id === flag.projectId)
              const flaggedBy = initialUsers.find(u => u.id === flag.flaggedBy)
              const creator = initialUsers.find(u => u.id === project?.creatorId)
              return (
                <div key={flag.id} className={`card card-p animate-fadeIn delay-${i + 1}`} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div className="flex-between">
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{project?.title}</div>
                      <div className="text-xs text-muted">by {creator?.firstName} {creator?.lastName} · Flagged by {flaggedBy?.firstName} {flaggedBy?.lastName} on {flag.date}</div>
                    </div>
                    <span className="badge badge-red"> Flagged</span>
                  </div>
                  <div style={{ background: 'var(--red-dim)', border: '1px solid rgba(226,75,74,0.2)', borderRadius: 'var(--radius-md)', padding: 12 }}>
                    <div className="text-xs text-muted" style={{ marginBottom: 4 }}>Reason for flagging</div>
                    <div style={{ fontSize: 14, color: '#F09595', lineHeight: 1.6 }}>{flag.reason}</div>
                  </div>
                  {flag.appeal && (
                    <div style={{ background: 'var(--amber-dim)', border: '1px solid rgba(239,159,39,0.2)', borderRadius: 'var(--radius-md)', padding: 12 }}>
                      <div className="text-xs text-muted" style={{ marginBottom: 4 }}>Student appeal ({flag.appealDate})</div>
                      <div style={{ fontSize: 14, color: 'var(--amber)', lineHeight: 1.6 }}>{flag.appeal}</div>
                    </div>
                  )}
                  <div className="flex-center gap-2" style={{ paddingTop: 4, borderTop: '1px solid var(--border)' }}>
                    <button className="btn btn-danger btn-sm" onClick={() => deactivateProject(flag.projectId)}>Deactivate project</button>
                    <button className="btn btn-primary btn-sm" onClick={() => activateProject(flag.projectId)}>Clear flag & activate</button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
    </AdminLayout>
  )
}

export function AdminNotifications() {
  const { notifications, markNotifRead, markAllRead } = useApp()
  
  const adminNotifs = [
    { id: 'a1', text: 'Dr. Mona Salem requested to link to Computer Networks (CSEN604)', read: false, time: '1h ago', type: 'link' },
    { id: 'a2', text: 'New employer "Innova" submitted documents for verification', read: false, time: '3h ago', type: 'employer' },
    { id: 'a3', text: 'Student appeal received for flagged project "Distributed File Storage"', read: true, time: '1d ago', type: 'flag' },
    ...notifications,
  ]
  const [localNotifs, setLocalNotifs] = useState(adminNotifs)
  const unread = localNotifs.filter(n => !n.read).length
  const markRead = (id) => setLocalNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  const markAll = () => { setLocalNotifs(prev => prev.map(n => ({ ...n, read: true }))); markAllRead() }

  return (
    <AdminLayout title="Notifications">
      <div style={{ maxWidth: 640 }}>
        <div className="flex-between page-header">
          <div><h1 className="page-title">Notifications</h1><p className="page-subtitle">{unread} unread</p></div>
          <button className="btn btn-ghost btn-sm" onClick={markAll}>Mark all read</button>
        </div>
        <div className="card animate-scaleIn">
          {localNotifs.map((n, i) => (
            <div key={n.id}
              className={`animate-fadeIn delay-${Math.min(i + 1, 6)}`}
              style={{ display: 'flex', gap: 14, padding: '16px 20px', borderBottom: '1px solid var(--border)', background: n.read ? 'transparent' : 'rgba(124,111,255,0.04)' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
                background: n.type === 'link' ? 'var(--teal-dim)' : n.type === 'employer' ? 'var(--amber-dim)' : n.type === 'flag' ? 'var(--red-dim)' : 'var(--accent-dim)',
                color: n.type === 'link' ? 'var(--teal-light)' : n.type === 'employer' ? 'var(--amber)' : n.type === 'flag' ? '#F09595' : 'var(--accent-text)',
              }}>
                {n.type === 'link' ? '◈' : n.type === 'employer' ? '◉' : n.type === 'flag' ? '' : '◎'}
              </div>
              <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => markRead(n.id)}>
                <div style={{ fontSize: 14, lineHeight: 1.5, color: n.read ? 'var(--text-secondary)' : 'var(--text-primary)' }}>{n.text}</div>
                <div className="text-xs text-muted" style={{ marginTop: 4 }}>{n.time}</div>
              </div>
              {}
              <button onClick={() => n.read ? setLocalNotifs(prev => prev.map(x => x.id === n.id ? {...x, read: false} : x)) : markRead(n.id)}
                title={n.read ? 'Mark as unread' : 'Mark as read'}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 12, padding: '4px 6px', borderRadius: 6, alignSelf: 'center', flexShrink: 0 }}>
                {n.read ? '○' : '●'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
