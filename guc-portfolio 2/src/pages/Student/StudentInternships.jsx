import { useState } from 'react'
import { Briefcase, Clock, CalendarDays, Users, Star, CheckCircle, ChevronRight } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { internships, users, getInitials, getAvatarColors } from '../../data/data'
import { Sidebar, Topbar, Modal, SearchBar, EmptyState } from '../../components/Components'

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

export function StudentInternships() {
  const { currentUser, addToast } = useApp()
  const [search, setSearch] = useState('')
  const [filterCompany, setFilterCompany] = useState('')
  const [filterDuration, setFilterDuration] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [selected, setSelected] = useState(null)
  const [applyModal, setApplyModal] = useState(null)
  const [coverLetter, setCoverLetter] = useState('')
  const [applied, setApplied] = useState(internships.filter(i => i.applicants.some(a => a.userId === currentUser?.id)).map(i => i.id))
  const [tab, setTab] = useState('browse')

  const companies = [...new Set(internships.map(i => i.company))]
  const durations = [...new Set(internships.map(i => i.duration))]

  let displayed = internships.filter(i => !i.archived)
  if (search) displayed = displayed.filter(i => i.title.toLowerCase().includes(search.toLowerCase()) || i.company.toLowerCase().includes(search.toLowerCase()))
  if (filterCompany) displayed = displayed.filter(i => i.company === filterCompany)
  if (filterDuration) displayed = displayed.filter(i => i.duration === filterDuration)
  if (sortBy === 'newest') displayed = [...displayed].sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt))

  const myApps = internships.filter(i => i.applicants.some(a => a.userId === currentUser?.id))

  const handleApply = () => {
    if (!coverLetter.trim()) { addToast('Please write a cover letter', 'error'); return }
    setApplied(prev => [...prev, applyModal.id])
    setApplyModal(null)
    setCoverLetter('')
    addToast('Application submitted!', 'success')
  }

  const getMyStatus = (internship) => {
    const app = internship.applicants.find(a => a.userId === currentUser?.id)
    return app?.status || null
  }

  const statusBadge = { accepted: 'badge-teal', rejected: 'badge-red', nominated: 'badge-amber', pending: 'badge-gray' }

  return (
    <StudentLayout title="Internships">
      <div className="page-header">
        <h1 className="page-title">Internships</h1>
        <p className="page-subtitle">Discover opportunities from verified companies</p>
      </div>
      <div className="tabs">
        <div className={`tab-item ${tab === 'browse' ? 'active' : ''}`} onClick={() => setTab('browse')}>Browse ({displayed.length})</div>
        <div className={`tab-item ${tab === 'applied' ? 'active' : ''}`} onClick={() => setTab('applied')}>My Applications ({myApps.length})</div>
      </div>

      {tab === 'browse' && !selected && (
        <>
          <div className="flex-center gap-2" style={{ marginBottom: 24, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200 }}><SearchBar value={search} onChange={setSearch} placeholder="Search by title or company..." /></div>
            <select className="select" style={{ width: 160 }} value={filterCompany} onChange={e => setFilterCompany(e.target.value)}>
              <option value="">All companies</option>
              {companies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="select" style={{ width: 160 }} value={filterDuration} onChange={e => setFilterDuration(e.target.value)}>
              <option value="">Any duration</option>
              {durations.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <select className="select" style={{ width: 160 }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </div>

          {displayed.length === 0 ? <EmptyState icon="◉" title="No internships found" text="Try adjusting your filters." /> : (
            <div className="grid-2">
              {displayed.map((intern, i) => {
                const isApplied = applied.includes(intern.id)
                const myStatus = getMyStatus(intern)
                return (
                  <div key={intern.id} className={`card card-p animate-fadeIn delay-${Math.min(i+1,6)}`}
                    onClick={() => setSelected(intern)}
                    style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div className="flex-between">
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--teal-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>◉</div>
                      <div className="flex-center gap-1">
                        {intern.status === 'hiring' ? <span className="badge badge-green">Hiring</span> : <span className="badge badge-gray">Filled</span>}
                        {myStatus && <span className={`badge ${statusBadge[myStatus]}`}>{myStatus}</span>}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{intern.title}</div>
                      <div style={{ fontSize: 13, color: 'var(--accent-text)', fontWeight: 500 }}>{intern.company}</div>
                    </div>
                    <div className="text-sm text-muted" style={{ lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{intern.details}</div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {intern.skills.map(s => <span key={s} className="badge badge-purple">{s}</span>)}
                    </div>
                    <div className="flex-between" style={{ paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                      <span className="text-xs text-muted"> {intern.duration}</span>
                      <span className="text-xs text-muted"> Deadline: {intern.deadline}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {tab === 'browse' && selected && (
        <div className="animate-scaleIn">
          <div className="flex-between" style={{ marginBottom: 20 }}>
            <div className="flex-center gap-2">
              <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}>← Back</button>
              <h2 style={{ fontSize: '1.3rem' }}>{selected.title}</h2>
            </div>
            {!applied.includes(selected.id) && selected.status === 'hiring' ? (
              <button className="btn btn-primary" onClick={() => setApplyModal(selected)}>Apply Now</button>
            ) : (
              <span className={`badge ${applied.includes(selected.id) ? 'badge-teal' : 'badge-gray'}`}>
                {applied.includes(selected.id) ? 'Applied' : 'Position filled'}
              </span>
            )}
          </div>
          <div className="card card-p">
            <div className="grid-2" style={{ marginBottom: 20 }}>
              <div><div className="text-xs text-muted" style={{ marginBottom: 4 }}>Company</div><div style={{ fontWeight: 500 }}>{selected.company}</div></div>
              <div><div className="text-xs text-muted" style={{ marginBottom: 4 }}>Duration</div><div style={{ fontWeight: 500 }}>{selected.duration}</div></div>
              <div><div className="text-xs text-muted" style={{ marginBottom: 4 }}>Application deadline</div><div style={{ fontWeight: 500 }}>{selected.deadline}</div></div>
              <div><div className="text-xs text-muted" style={{ marginBottom: 4 }}>Status</div><span className={`badge ${selected.status === 'hiring' ? 'badge-green' : 'badge-gray'}`}>{selected.status}</span></div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div className="text-xs text-muted" style={{ marginBottom: 8 }}>About the role</div>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-secondary)' }}>{selected.details}</p>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div className="text-xs text-muted" style={{ marginBottom: 8 }}>Required skills</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{selected.skills.map(s => <span key={s} className="badge badge-purple">{s}</span>)}</div>
            </div>
            <div>
              <div className="text-xs text-muted" style={{ marginBottom: 8 }}>Languages</div>
              <div style={{ display: 'flex', gap: 6 }}>{selected.languages.map(l => <span key={l} className="badge badge-gray">{l}</span>)}</div>
            </div>
          </div>
        </div>
      )}

      {tab === 'applied' && (
        myApps.length === 0 ? <EmptyState icon="◉" title="No applications yet" text="Browse internships and apply." /> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {myApps.map((intern, i) => {
              const myStatus = getMyStatus(intern)
              return (
                <div key={intern.id} className={`card card-p animate-fadeIn delay-${i+1}`} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--teal-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>◉</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{intern.title}</div>
                    <div style={{ fontSize: 13, color: 'var(--accent-text)' }}>{intern.company} · {intern.duration}</div>
                    <div className="text-xs text-muted" style={{ marginTop: 2 }}>Posted: {intern.postedAt}</div>
                  </div>
                  <span className={`badge ${statusBadge[myStatus] || 'badge-gray'}`}>{myStatus || 'pending'}</span>
                </div>
              )
            })}
          </div>
        )
      )}

      {}
      <Modal open={!!applyModal} onClose={() => setApplyModal(null)} title={`Apply: ${applyModal?.title}`}
        footer={<><button className="btn btn-ghost" onClick={() => setApplyModal(null)}>Cancel</button><button className="btn btn-primary" onClick={handleApply}>Submit application</button></>}>
        <div style={{ marginBottom: 14, fontSize: 14, color: 'var(--text-secondary)' }}>
          <strong style={{ color: 'var(--text-primary)' }}>{applyModal?.company}</strong> · {applyModal?.duration}
        </div>
        <div className="input-group">
          <label className="input-label">Cover letter *</label>
          <textarea className="textarea" style={{ minHeight: 140 }} placeholder="Tell them why you're a great fit for this role..." value={coverLetter} onChange={e => setCoverLetter(e.target.value)} />
        </div>
      </Modal>
    </StudentLayout>
  )
}
