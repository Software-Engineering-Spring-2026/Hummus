import { useState, useEffect, useRef } from 'react'
import { Briefcase, Users, Star, CheckCircle, Clock, CalendarDays, Building2, MapPin, Download, Archive, Edit2, Trash2, Eye, Heart, Bell, CheckCheck } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { internships as initialInternships, users, projects, defaultFavorites, getInitials, getAvatarColors } from '../../data/data'
import { Sidebar, Topbar, Modal, ConfirmModal, SearchBar, EmptyState } from '../../components/Components'

function LeafletMapPicker({ coords, onChange }) {
  const mapRef    = useRef(null)
  const mapObjRef = useRef(null)
  const markerRef = useRef(null)
  const [ready, setReady] = useState(false)

  
  useEffect(() => {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id   = 'leaflet-css'
      link.rel  = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }
    if (window.L) {
      setReady(true)
    } else if (!document.getElementById('leaflet-js')) {
      const script = document.createElement('script')
      script.id  = 'leaflet-js'
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      script.onload = () => setReady(true)
      document.head.appendChild(script)
    } else {
      
      const interval = setInterval(() => {
        if (window.L) { setReady(true); clearInterval(interval) }
      }, 100)
      return () => clearInterval(interval)
    }
  }, [])

  
  useEffect(() => {
    if (!ready || !mapRef.current || mapObjRef.current) return
    const L   = window.L
    const lat = coords?.lat || 30.0444
    const lng = coords?.lng || 31.2357

    const map = L.map(mapRef.current, { zoomControl: true }).setView([lat, lng], 13)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)

    const icon = L.divIcon({
      html: `<div style="width:20px;height:20px;background:#7C6FFF;border:3px solid #fff;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 2px 8px rgba(0,0,0,0.5)"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 20],
      className: '',
    })

    const marker = L.marker([lat, lng], { draggable: true, icon }).addTo(map)
    marker.bindPopup('<b>Company location</b><br>Click map or drag pin to move').openPopup()

    map.on('click', (e) => {
      marker.setLatLng(e.latlng)
      onChange({ lat: +e.latlng.lat.toFixed(6), lng: +e.latlng.lng.toFixed(6) })
    })

    marker.on('dragend', (e) => {
      const pos = e.target.getLatLng()
      onChange({ lat: +pos.lat.toFixed(6), lng: +pos.lng.toFixed(6) })
    })

    
    setTimeout(() => map.invalidateSize(), 200)

    mapObjRef.current = map
    markerRef.current = marker

    return () => {
      map.remove()
      mapObjRef.current = null
      markerRef.current = null
    }
  }, [ready])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {!ready && (
        <div style={{
          height: 300, borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text-muted)', fontSize: 13, gap: 10,
          background: 'var(--bg-card)',
        }}>
          <span style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid rgba(124,111,255,0.3)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          Loading map...
        </div>
      )}
      <div
        ref={mapRef}
        style={{
          height: 300,
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          overflow: 'hidden',
          display: ready ? 'block' : 'none',
        }}
      />
      <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ width: 8, height: 8, background: 'var(--accent)', borderRadius: '50%', flexShrink: 0 }} />
        Click anywhere on the map or drag the pin to set location
        {coords && (
          <span style={{ marginLeft: 'auto', color: 'var(--accent-text)' }}>
             {coords.lat}, {coords.lng}
          </span>
        )}
      </div>
    </div>
  )
}

function EmployerLayout({ children, title }) {
  return (
    <div className="layout">
      <Sidebar role="employer" />
      <div className="main-content">
        <Topbar title={title} />
        <div className="page">{children}</div>
      </div>
    </div>
  )
}

export function EmployerDashboard() {
  const { currentUser } = useApp()
  const myInternships = initialInternships.filter(i => i.employerId === currentUser?.id)
  const totalApplicants = myInternships.reduce((sum, i) => sum + i.applicants.length, 0)
  const accepted = myInternships.reduce((sum, i) => sum + i.applicants.filter(a => a.status === 'accepted').length, 0)
  const hiring = myInternships.filter(i => i.status === 'hiring').length

  const stats = [
    { num: myInternships.length, label: 'Internships posted',  icon: '◉', color: 'var(--teal)'   },
    { num: totalApplicants,       label: 'Total applicants',   icon: '◎', color: 'var(--accent)'  },
    { num: accepted,              label: 'Accepted students',  icon: '', color: 'var(--green)'   },
    { num: hiring,                label: 'Currently hiring',   icon: '⊙', color: 'var(--amber)'   },
  ]

  const recent = myInternships.flatMap(i => i.applicants.map(a => ({ ...a, internshipTitle: i.title, internship: i }))).slice(0, 5)
  const acceptedStudents = [...new Set(myInternships.flatMap(i => i.applicants.filter(a => a.status === 'accepted').map(a => a.userId)))]

  return (
    <EmployerLayout title="Dashboard">
      <div className="animate-fadeInDown" style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: 6 }}>
          Welcome, <span style={{ color: 'var(--accent-text)' }}>{currentUser?.company || currentUser?.firstName}</span>
        </h1>
        <p className="text-secondary">Manage your internships and discover top talent.</p>
      </div>

      {!currentUser?.verified && (
        <div className="animate-fadeInDown" style={{ background: 'rgba(239,159,39,0.08)', border: '1px solid rgba(239,159,39,0.25)', borderRadius: 'var(--radius-lg)', padding: 16, marginBottom: 24 }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--amber)', marginBottom: 4 }}>◷ Account pending verification</div>
          <div className="text-sm text-muted">Your account is awaiting admin approval. Some features may be limited.</div>
        </div>
      )}

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

      {}
      <div className="card card-p animate-fadeIn delay-5" style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 15, marginBottom: 16 }}>Platform Statistics</h3>
        <div className="grid-3" style={{ gap: 16 }}>
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--teal-light)' }}>{myInternships.length}</div>
            <div className="text-xs text-muted" style={{ marginTop: 4 }}>Internships offered</div>
          </div>
          <div style={{ textAlign: 'center', padding: '16px 0', borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--accent-text)' }}>{totalApplicants}</div>
            <div className="text-xs text-muted" style={{ marginTop: 4 }}>Total applicants</div>
          </div>
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--green-light)' }}>{acceptedStudents.length}</div>
            <div className="text-xs text-muted" style={{ marginTop: 4 }}>Students hired</div>
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ gap: 20 }}>
        {}
        <div className="card card-p animate-fadeIn delay-2">
          <h3 style={{ fontSize: 15, marginBottom: 16 }}>My Internships</h3>
          {myInternships.length === 0
            ? <EmptyState icon="◉" title="No internships posted" />
            : myInternships.map((i, idx) => (
              <div key={i.id} className={`animate-fadeIn delay-${idx + 1}`}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{i.title}</div>
                  <div className="text-xs text-muted">{i.applicants.length} applicants · {i.duration}</div>
                </div>
                <span className={`badge ${i.status === 'hiring' ? 'badge-green' : 'badge-gray'}`}>{i.status}</span>
              </div>
            ))}
        </div>

        {}
        <div className="card card-p animate-fadeIn delay-3">
          <h3 style={{ fontSize: 15, marginBottom: 16 }}>Recent Applicants</h3>
          {recent.length === 0
            ? <EmptyState icon="◎" title="No applicants yet" />
            : recent.map((a, i) => {
              const student = users.find(u => u.id === a.userId)
              const statusColor = { accepted: 'badge-teal', nominated: 'badge-amber', rejected: 'badge-red', pending: 'badge-gray' }
              return (
                <div key={i} className={`animate-fadeIn delay-${i + 1}`}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <div className={`avatar avatar-sm ${getAvatarColors(student?.avatar)}`}>{getInitials(student?.firstName, student?.lastName)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{student?.firstName} {student?.lastName}</div>
                    <div className="text-xs text-muted">{a.internshipTitle}</div>
                  </div>
                  <span className={`badge ${statusColor[a.status]}`}>{a.status}</span>
                </div>
              )
            })}
        </div>
      </div>
    </EmployerLayout>
  )
}

export function EmployerInternships() {
  const { currentUser, addToast } = useApp()
  const [allInternships, setAllInternships] = useState(initialInternships.filter(i => i.employerId === currentUser?.id))
  const [showCreate, setShowCreate] = useState(false)
  const [editModal, setEditModal] = useState(null)
  const [deleteModal, setDeleteModal] = useState(null)
  const [showArchived, setShowArchived] = useState(false)
  const [form, setForm] = useState({ title: '', details: '', skills: '', duration: '', deadline: '', languages: '', status: 'hiring' })

  const active = allInternships.filter(i => !i.archived)
  const archived = allInternships.filter(i => i.archived)
  const displayed = showArchived ? archived : active

  const upForm = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const handleCreate = () => {
    if (!form.title || !form.details) { addToast('Title and details are required', 'error'); return }
    const newI = {
      id: Date.now(),
      employerId: currentUser.id,
      company: currentUser.company || currentUser.firstName,
      title: form.title,
      details: form.details,
      skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
      duration: form.duration,
      deadline: form.deadline,
      languages: form.languages.split(',').map(s => s.trim()).filter(Boolean),
      status: form.status,
      archived: false,
      postedAt: new Date().toISOString().split('T')[0],
      applicants: [],
    }
    setAllInternships(prev => [...prev, newI])
    setForm({ title: '', details: '', skills: '', duration: '', deadline: '', languages: '', status: 'hiring' })
    setShowCreate(false)
    addToast('Internship posted!', 'success')
  }

  const handleUpdate = () => {
    setAllInternships(prev => prev.map(i => i.id === editModal.id ? {
      ...i,
      title: editModal.title, details: editModal.details,
      skills: typeof editModal.skills === 'string' ? editModal.skills.split(',').map(s => s.trim()).filter(Boolean) : editModal.skills,
      duration: editModal.duration, deadline: editModal.deadline,
      languages: typeof editModal.languages === 'string' ? editModal.languages.split(',').map(s => s.trim()).filter(Boolean) : editModal.languages,
      status: editModal.status,
    } : i))
    setEditModal(null)
    addToast('Internship updated!', 'success')
  }

  const handleDelete = (id) => {
    setAllInternships(prev => prev.filter(i => i.id !== id))
    addToast('Internship deleted', 'info')
  }

  const toggleArchive = (id) => {
    const intern = allInternships.find(i => i.id === id)
    if (!intern.archived && intern.deadline) {
      const deadlinePassed = new Date(intern.deadline) < new Date()
      if (!deadlinePassed) {
        addToast('Cannot archive: application deadline has not passed yet', 'error')
        return
      }
    }
    setAllInternships(prev => prev.map(i => i.id === id ? { ...i, archived: !i.archived } : i))
    addToast(intern.archived ? 'Internship unarchived' : 'Internship archived', 'info')
  }

  const formBody = (data, setData) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className="input-group"><label className="input-label">Title *</label><input className="input" value={data.title} onChange={e => setData(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Frontend Developer Intern" /></div>
      <div className="input-group"><label className="input-label">Details *</label><textarea className="textarea" value={data.details} onChange={e => setData(p => ({ ...p, details: e.target.value }))} placeholder="Role description and responsibilities" /></div>
      <div className="input-group"><label className="input-label">Required skills (comma separated)</label><input className="input" value={Array.isArray(data.skills) ? data.skills.join(', ') : data.skills} onChange={e => setData(p => ({ ...p, skills: e.target.value }))} placeholder="React, TypeScript, CSS" /></div>
      <div className="grid-2">
        <div className="input-group"><label className="input-label">Duration</label><input className="input" value={data.duration} onChange={e => setData(p => ({ ...p, duration: e.target.value }))} placeholder="e.g. 3 months" /></div>
        <div className="input-group"><label className="input-label">Deadline</label><input className="input" type="date" value={data.deadline} onChange={e => setData(p => ({ ...p, deadline: e.target.value }))} /></div>
      </div>
      <div className="input-group"><label className="input-label">Languages (comma separated)</label><input className="input" value={Array.isArray(data.languages) ? data.languages.join(', ') : data.languages} onChange={e => setData(p => ({ ...p, languages: e.target.value }))} placeholder="JavaScript, Python" /></div>
      <div className="input-group">
        <label className="input-label">Status</label>
        <select className="select" value={data.status} onChange={e => setData(p => ({ ...p, status: e.target.value }))}>
          <option value="hiring">Hiring</option>
          <option value="filled">Filled</option>
        </select>
      </div>
    </div>
  )

  return (
    <EmployerLayout title="Internships">
      <div className="flex-between page-header">
        <div>
          <h1 className="page-title">Internships</h1>
          <p className="page-subtitle">{active.length} active · {archived.length} archived</p>
        </div>
        <div className="flex-center gap-2">
          <button className="btn btn-ghost btn-sm" onClick={() => setShowArchived(!showArchived)}>
            {showArchived ? 'Show active' : 'Show archived'}
          </button>
          <button className="btn btn-primary" onClick={() => setShowCreate(true)}>+ Post Internship</button>
        </div>
      </div>

      {displayed.length === 0
        ? <EmptyState icon="◉" title={showArchived ? 'No archived internships' : 'No internships yet'} text="Post your first internship to start receiving applications." action={!showArchived && <button className="btn btn-primary btn-sm" onClick={() => setShowCreate(true)}>Post Internship</button>} />
        : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {displayed.map((intern, i) => (
              <div key={intern.id} className={`card card-p animate-fadeIn delay-${Math.min(i + 1, 6)}`} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--teal-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>◉</div>
                <div style={{ flex: 1 }}>
                  <div className="flex-between" style={{ marginBottom: 6 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>{intern.title}</div>
                    <div className="flex-center gap-2">
                      <span className={`badge ${intern.status === 'hiring' ? 'badge-green' : 'badge-gray'}`}>{intern.status}</span>
                      {showArchived && <span className="badge badge-gray">Archived</span>}
                    </div>
                  </div>
                  <div className="text-sm text-muted" style={{ marginBottom: 10 }}>{intern.details.slice(0, 100)}...</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                    {intern.skills.map(s => <span key={s} className="badge badge-purple">{s}</span>)}
                  </div>
                  <div className="flex-between">
                    <div className="flex-center gap-3">
                      <span className="text-xs text-muted"> {intern.duration}</span>
                      <span className="text-xs text-muted"> {intern.deadline}</span>
                      <span className="text-xs text-muted"> {intern.applicants.length} applicants</span>
                    </div>
                    <div className="flex-center gap-2">
                      <button className="btn btn-ghost btn-sm" onClick={() => toggleArchive(intern.id)}>{intern.archived ? 'Unarchive' : 'Archive'}</button>
                      <button className="btn btn-ghost btn-sm" onClick={() => setEditModal({ ...intern, skills: intern.skills.join(', '), languages: intern.languages.join(', ') })}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => setDeleteModal(intern.id)}>Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Post New Internship"
        footer={<><button className="btn btn-ghost" onClick={() => setShowCreate(false)}>Cancel</button><button className="btn btn-primary" onClick={handleCreate}>Post internship</button></>}>
        {formBody(form, setForm)}
      </Modal>

      <Modal open={!!editModal} onClose={() => setEditModal(null)} title="Edit Internship"
        footer={<><button className="btn btn-ghost" onClick={() => setEditModal(null)}>Cancel</button><button className="btn btn-primary" onClick={handleUpdate}>Save changes</button></>}>
        {editModal && formBody(editModal, setEditModal)}
      </Modal>

      <ConfirmModal open={!!deleteModal} onClose={() => setDeleteModal(null)} onConfirm={() => handleDelete(deleteModal)} danger title="Delete internship" message="Are you sure? This will also remove all applications." />
    </EmployerLayout>
  )
}

export function EmployerApplicants() {
  const { currentUser, addToast, pushNotif } = useApp()
  const [allInternships, setAllInternships] = useState(initialInternships.filter(i => i.employerId === currentUser?.id))
  const [selectedInternship, setSelectedInternship] = useState(null)
  const [sortBy, setSortBy] = useState('status')
  const [filterStatus, setFilterStatus] = useState('all')
  const [coverLetterModal, setCoverLetterModal] = useState(null)

  const internship = allInternships.find(i => i.id === selectedInternship) || allInternships[0]

  const setStatus = (internshipId, userId, newStatus) => {
    setAllInternships(prev => prev.map(i => i.id === internshipId
      ? { ...i, applicants: i.applicants.map(a => a.userId === userId ? { ...a, status: newStatus } : a) }
      : i))
    addToast(`Status updated to "${newStatus}"`, 'success')
    
    if (newStatus === 'accepted' || newStatus === 'rejected') {
      const intern = allInternships.find(i => i.id === internshipId)
      pushNotif(
        newStatus === 'accepted'
          ? `Congratulations! You have been accepted for "${intern?.title}" at ${intern?.company}`
          : `Your application for "${intern?.title}" at ${intern?.company} was not successful this time`,
        newStatus === 'accepted' ? 'internship' : 'flag'
      )
    }
  }

  const getStudentProjects = (userId) => projects.filter(p => p.creatorId === userId && p.visibility === 'public')

  let applicants = internship?.applicants || []
  if (filterStatus !== 'all') applicants = applicants.filter(a => a.status === filterStatus)
  if (sortBy === 'projects') applicants = [...applicants].sort((a, b) => getStudentProjects(b.userId).length - getStudentProjects(a.userId).length)

  const statusOptions = ['pending', 'nominated', 'accepted', 'rejected']
  const statusColor = { pending: 'badge-gray', nominated: 'badge-amber', accepted: 'badge-teal', rejected: 'badge-red' }

  return (
    <EmployerLayout title="Applicants">
      <div className="page-header">
        <h1 className="page-title">Applicants</h1>
        <p className="page-subtitle">Manage applications for your internships</p>
      </div>

      {}
      <div className="tabs" style={{ marginBottom: 20 }}>
        {allInternships.map(i => (
          <div key={i.id}
            className={`tab-item ${(selectedInternship || allInternships[0]?.id) === i.id ? 'active' : ''}`}
            onClick={() => setSelectedInternship(i.id)}>
            {i.title} ({i.applicants.length})
          </div>
        ))}
      </div>

      {internship && (
        <>
          <div className="flex-center gap-2" style={{ marginBottom: 20 }}>
            <select className="select" style={{ width: 160 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="all">All statuses</option>
              {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select className="select" style={{ width: 200 }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="status">Sort: By status</option>
              <option value="projects">Sort: Top contributors</option>
            </select>
          </div>

          {applicants.length === 0
            ? <EmptyState icon="◎" title="No applicants yet" text="Applications will appear here once students apply." />
            : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {applicants.map((app, i) => {
                  const student = users.find(u => u.id === app.userId)
                  const studentProjects = getStudentProjects(app.userId)
                  if (!student) return null
                  return (
                    <div key={app.userId} className={`card card-p animate-fadeIn delay-${Math.min(i + 1, 6)}`} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                      <div className={`avatar avatar-md ${getAvatarColors(student.avatar)}`}>{getInitials(student.firstName, student.lastName)}</div>
                      <div style={{ flex: 1 }}>
                        <div className="flex-between" style={{ marginBottom: 6 }}>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 14 }}>{student.firstName} {student.lastName}</div>
                            <div className="text-xs text-muted">{student.major} · {student.email}</div>
                          </div>
                          <span className={`badge ${statusColor[app.status]}`}>{app.status}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                          {student.skills?.map(s => <span key={s} className="badge badge-gray">{s}</span>)}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
                          {studentProjects.length} public project{studentProjects.length !== 1 ? 's' : ''}
                        </div>
                        <div className="flex-center gap-2">
                          <button className="btn btn-ghost btn-sm" onClick={() => setCoverLetterModal(app)}>View cover letter</button>
                          <select className="select" style={{ padding: '6px 12px', fontSize: 12, width: 160 }}
                            value={app.status}
                            onChange={e => setStatus(internship.id, app.userId, e.target.value)}>
                            {statusOptions.map(s => <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
        </>
      )}

      <Modal open={!!coverLetterModal} onClose={() => setCoverLetterModal(null)} title="Cover Letter"
        footer={<button className="btn btn-ghost" onClick={() => setCoverLetterModal(null)}>Close</button>}>
        {coverLetterModal && (
          <>
            <div className="flex-center gap-2" style={{ marginBottom: 14 }}>
              <div className={`avatar avatar-sm ${getAvatarColors(users.find(u => u.id === coverLetterModal.userId)?.avatar)}`}>
                {getInitials(users.find(u => u.id === coverLetterModal.userId)?.firstName, users.find(u => u.id === coverLetterModal.userId)?.lastName)}
              </div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>
                {users.find(u => u.id === coverLetterModal.userId)?.firstName} {users.find(u => u.id === coverLetterModal.userId)?.lastName}
              </div>
            </div>
            <div style={{ background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', padding: 16, fontSize: 14, lineHeight: 1.7, color: 'var(--text-secondary)' }}>
              {coverLetterModal.coverLetter}
            </div>
          </>
        )}
      </Modal>
    </EmployerLayout>
  )
}

export function EmployerFavorites() {
  const [favPortfolios, setFavPortfolios] = useState(defaultFavorites.portfolios)
  const { addToast } = useApp()
  const students = users.filter(u => u.role === 'student' && favPortfolios.includes(u.id))

  return (
    <EmployerLayout title="Favorites">
      <div className="page-header"><h1 className="page-title">Saved Portfolios</h1><p className="page-subtitle">Talent you've bookmarked</p></div>
      {students.length === 0
        ? <EmptyState icon="" title="No saved portfolios" text="Browse student portfolios and save promising candidates." />
        : (
          <div className="grid-4">
            {students.map((s, i) => (
              <div key={s.id} className={`card card-p animate-fadeIn delay-${i + 1}`} style={{ textAlign: 'center', position: 'relative' }}>
                <button onClick={() => { setFavPortfolios(prev => prev.filter(x => x !== s.id)); addToast('Removed from saved', 'info') }}
                  style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 16 }}></button>
                <div className={`avatar avatar-lg ${getAvatarColors(s.avatar)}`} style={{ margin: '0 auto 12px' }}>{getInitials(s.firstName, s.lastName)}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14 }}>{s.firstName} {s.lastName}</div>
                <div className="text-xs text-muted" style={{ margin: '4px 0 10px' }}>{s.major}</div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 10 }}>
                  {s.skills.slice(0, 3).map(sk => <span key={sk} className="badge badge-gray">{sk}</span>)}
                </div>
                <div style={{ fontSize: 12, color: 'var(--accent-text)', fontWeight: 500 }}>
                  {projects.filter(p => p.creatorId === s.id && p.visibility === 'public').length} public projects
                </div>
              </div>
            ))}
          </div>
        )}
    </EmployerLayout>
  )
}

export function EmployerNotifications() {
  const { notifications, markNotifRead, markNotifUnread, markAllRead, notifOff, toggleNotifOff } = useApp()
  return (
    <EmployerLayout title="Notifications">
      <div style={{ maxWidth: 640 }}>
        <div className="flex-between page-header">
          <div><h1 className="page-title">Notifications</h1><p className="page-subtitle">{notifications.filter(n => !n.read).length} unread</p></div>
          <button className="btn btn-ghost btn-sm" onClick={markAllRead}>Mark all read</button>
        </div>
        <div className="card animate-scaleIn">
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
          {}
          <div className="flex-center gap-2" style={{ padding: '12px 20px', borderTop: '1px solid var(--border)' }}>
            <span className="text-sm text-muted">All notifications</span>
            <div onClick={toggleNotifOff} style={{ width: 44, height: 24, borderRadius: 99, background: !notifOff ? 'var(--accent)' : 'var(--border)', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}>
              <div style={{ position: 'absolute', top: 3, left: !notifOff ? 22 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
            </div>
          </div>
        </div>
      </div>
    </EmployerLayout>
  )
}

export function EmployerSettings() {
  const { currentUser, addToast } = useApp()
  const [tab, setTab] = useState('company')
  const [profile, setProfile] = useState({
    company: currentUser?.company || '',
    email: currentUser?.email || '',
    bio: currentUser?.companyBio || '',
    address: currentUser?.address || '',
    contact: currentUser?.contact || '',
  })
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' })
  const [mapCoords, setMapCoords] = useState(
    currentUser?.location || { lat: 30.0444, lng: 31.2357 }  
  )

  return (
    <EmployerLayout title="Settings">
      <div style={{ maxWidth: 640 }}>
        <div className="page-header"><h1 className="page-title">Settings</h1></div>
        <div className="tabs">
          {['company', 'documents', 'password'].map(t => (
            <div key={t} className={`tab-item ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)} style={{ textTransform: 'capitalize' }}>{t}</div>
          ))}
        </div>
        {tab === 'company' && (
          <div className="card card-p animate-scaleIn" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="input-group"><label className="input-label">Company name</label><input className="input" value={profile.company} onChange={e => setProfile(p => ({ ...p, company: e.target.value }))} /></div>
            <div className="input-group"><label className="input-label">Email</label><input className="input" type="email" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} /></div>
            <div className="input-group"><label className="input-label">Company bio</label><textarea className="textarea" value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))} /></div>
            <div className="input-group"><label className="input-label">Address</label><input className="input" value={profile.address} onChange={e => setProfile(p => ({ ...p, address: e.target.value }))} /></div>
            <div className="input-group"><label className="input-label">Contact number</label><input className="input" value={profile.contact} onChange={e => setProfile(p => ({ ...p, contact: e.target.value }))} /></div>
            {}
            <div className="input-group">
              <label className="input-label">Company location on map</label>
              <LeafletMapPicker coords={mapCoords} onChange={setMapCoords} />
            </div>
            <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }} onClick={() => {
              addToast('Company profile updated!', 'success')
            }}>Save changes</button>
          </div>
        )}
        {tab === 'documents' && (
          <div className="card card-p animate-scaleIn" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: currentUser?.verified ? 'var(--teal-dim)' : 'rgba(239,159,39,0.08)', border: `1px solid ${currentUser?.verified ? 'rgba(29,158,117,0.3)' : 'rgba(239,159,39,0.25)'}`, borderRadius: 'var(--radius-md)', padding: 14 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: currentUser?.verified ? 'var(--teal-light)' : 'var(--amber)', marginBottom: 4 }}>
                {currentUser?.verified ? ' Account verified' : '◷ Pending verification'}
              </div>
              <div className="text-sm text-muted">{currentUser?.verified ? 'Your company is verified and can post internships.' : 'Submit your documents for admin approval.'}</div>
            </div>
            <div className="input-group">
              <label className="input-label">Tax certificate (PDF)</label>
              <input className="input" type="file" accept=".pdf" style={{ paddingTop: 8 }} />
            </div>
            <div className="input-group">
              <label className="input-label">Commercial register (optional)</label>
              <input className="input" type="file" accept=".pdf" style={{ paddingTop: 8 }} />
            </div>
            <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }} onClick={() => addToast('Documents submitted for review!', 'success')}>Submit documents</button>
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
    </EmployerLayout>
  )
}
