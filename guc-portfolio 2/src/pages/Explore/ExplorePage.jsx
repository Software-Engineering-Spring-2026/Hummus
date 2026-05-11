import { useState } from 'react'
import { FolderKanban, GraduationCap, Star, Heart, Eye, Tag, Users, BookOpen, Globe, Send, CalendarDays, CheckCircle, XCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { projects, users, courses, internships, defaultFavorites, getInitials, getAvatarColors } from '../../data/data'
import { Sidebar, Topbar, Modal, SearchBar, EmptyState } from '../../components/Components'

export function ExplorePage() {
  const { currentUser } = useApp()
  const [tab, setTab] = useState('projects')
  const [search, setSearch] = useState('')
  const [filterCourse, setFilterCourse] = useState('')
  const [filterInstructor, setFilterInstructor] = useState('')   
  const [filterDate, setFilterDate] = useState('')                
  const [filterMajor, setFilterMajor] = useState('')
  const [filterSkill, setFilterSkill] = useState('')
  const [sortProjects, setSortProjects] = useState('rating')
  const [sortPortfolios, setSortPortfolios] = useState('projects')
  const [favorites, setFavorites] = useState(defaultFavorites)
  const [selectedProject, setSelectedProject] = useState(null)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [msgModal, setMsgModal] = useState(null)
  const navigate = useNavigate()

  const role = currentUser?.role || 'guest'

  const publicProjects = projects.filter(p => p.visibility === 'public')
  let filteredProjects = publicProjects
  if (search) filteredProjects = filteredProjects.filter(p => p.title.toLowerCase().includes(search.toLowerCase()))
  if (filterCourse) filteredProjects = filteredProjects.filter(p => p.course === parseInt(filterCourse))
  
  if (filterInstructor) filteredProjects = filteredProjects.filter(p =>
    p.instructors.some(i => i.userId === parseInt(filterInstructor) && i.status === 'accepted')
  )
  
  if (filterDate) filteredProjects = filteredProjects.filter(p => p.createdAt.startsWith(filterDate))
  if (sortProjects === 'rating') filteredProjects = [...filteredProjects].sort((a, b) => b.rating - a.rating)
  if (sortProjects === 'newest') filteredProjects = [...filteredProjects].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  if (sortProjects === 'oldest') filteredProjects = [...filteredProjects].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

  const students = users.filter(u => u.role === 'student')
  let filteredStudents = students
  if (search) filteredStudents = filteredStudents.filter(s => (s.firstName + ' ' + s.lastName + ' ' + s.email).toLowerCase().includes(search.toLowerCase()))
  if (filterMajor) filteredStudents = filteredStudents.filter(s => s.major === filterMajor)
  if (filterSkill) filteredStudents = filteredStudents.filter(s => s.skills.some(sk => sk.toLowerCase().includes(filterSkill.toLowerCase())))
  if (sortPortfolios === 'projects') filteredStudents = [...filteredStudents].sort((a, b) => projects.filter(p => p.creatorId === b.id).length - projects.filter(p => p.creatorId === a.id).length)

  const instructors = users.filter(u => u.role === 'instructor')
  let filteredInstructors = instructors
  
  if (search) filteredInstructors = filteredInstructors.filter(i => {
    const nameMatch = (i.firstName + ' ' + i.lastName + ' ' + (i.email || '')).toLowerCase().includes(search.toLowerCase())
    const linkedCourses = courses.filter(c => c.instructors.includes(i.id))
    const courseMatch = linkedCourses.some(c => c.name.toLowerCase().includes(search.toLowerCase()))
    return nameMatch || courseMatch
  })

  const majors = [...new Set(students.map(s => s.major))]

  const toggleFav = (type, id) => {
    setFavorites(prev => ({
      ...prev,
      [type]: prev[type].includes(id) ? prev[type].filter(x => x !== id) : [...prev[id], id]
    }))
  }
  const toggleFavFixed = (type, id) => {
    setFavorites(prev => ({
      ...prev,
      [type]: prev[type].includes(id) ? prev[type].filter(x => x !== id) : [...prev[type], id]
    }))
  }

  const recommended = publicProjects.filter(p => p.rating >= 4.7).slice(0, 3)

  
  const suggestedStudents = role === 'employer'
    ? students.filter(s => favorites.portfolios.includes(s.id))
    : []

  const content = (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Explore</h1>
        <p className="page-subtitle">Discover student projects, portfolios, and course instructors</p>
      </div>

      {}
      {role === 'employer' && suggestedStudents.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <h3 style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 14 }}>
             Suggested from your favorites
          </h3>
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
            {suggestedStudents.map(s => (
              <div key={s.id} onClick={() => { setTab('portfolios'); setSelectedStudent(s) }}
                style={{ minWidth: 180, background: 'linear-gradient(135deg, rgba(29,158,117,0.1), rgba(124,111,255,0.08))', border: '1px solid rgba(29,158,117,0.2)', borderRadius: 'var(--radius-lg)', padding: 14, cursor: 'pointer', flexShrink: 0, textAlign: 'center' }}>
                <div className={`avatar avatar-md ${getAvatarColors(s.avatar)}`} style={{ margin: '0 auto 8px' }}>{getInitials(s.firstName, s.lastName)}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13 }}>{s.firstName} {s.lastName}</div>
                <div className="text-xs text-muted" style={{ marginTop: 3 }}>{s.major}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {}
      {tab === 'projects' && !selectedProject && (
        <div style={{ marginBottom: 28 }}>
          <div className="flex-between" style={{ marginBottom: 14 }}>
            <h3 style={{ fontSize: 14, color: 'var(--text-secondary)' }}> Recommended projects</h3>
          </div>
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
            {recommended.map(p => {
              const creator = users.find(u => u.id === p.creatorId)
              return (
                <div key={p.id} onClick={() => setSelectedProject(p)}
                  style={{ minWidth: 220, background: 'linear-gradient(135deg, rgba(124,111,255,0.12), rgba(29,158,117,0.08))', border: '1px solid rgba(124,111,255,0.2)', borderRadius: 'var(--radius-lg)', padding: 16, cursor: 'pointer', flexShrink: 0 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{p.title}</div>
                  <div className="text-xs text-muted" style={{ marginBottom: 8 }}>{creator?.firstName} {creator?.lastName}</div>
                  <div style={{ fontSize: 12, color: 'var(--amber)' }}> {p.rating}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="flex-center gap-2" style={{ marginBottom: 16 }}>
        <div style={{ flex: 1 }}>
          <SearchBar value={search} onChange={setSearch} placeholder={`Search ${tab}...`} />
        </div>
      </div>

      <div className="tabs">
        <div className={`tab-item ${tab === 'projects' ? 'active' : ''}`} onClick={() => { setTab('projects'); setSelectedProject(null); setSelectedStudent(null) }}>Projects ({filteredProjects.length})</div>
        <div className={`tab-item ${tab === 'portfolios' ? 'active' : ''}`} onClick={() => { setTab('portfolios'); setSelectedProject(null); setSelectedStudent(null) }}>Portfolios ({filteredStudents.length})</div>
        <div className={`tab-item ${tab === 'instructors' ? 'active' : ''}`} onClick={() => { setTab('instructors'); setSelectedProject(null); setSelectedStudent(null) }}>Instructors ({filteredInstructors.length})</div>
      </div>

      {}
      {tab === 'projects' && !selectedProject && (
        <>
          {}
          <div className="flex-center gap-2" style={{ marginBottom: 20, flexWrap: 'wrap' }}>
            <select className="select" style={{ width: 180 }} value={filterCourse} onChange={e => setFilterCourse(e.target.value)}>
              <option value="">All courses</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select className="select" style={{ width: 200 }} value={filterInstructor} onChange={e => setFilterInstructor(e.target.value)}>
              <option value="">All instructors</option>
              {instructors.map(i => <option key={i.id} value={i.id}>{i.firstName} {i.lastName}</option>)}
            </select>
            <input className="input" type="month" style={{ width: 170 }} value={filterDate} onChange={e => setFilterDate(e.target.value)}
              title="Filter by creation date" placeholder="Filter by date" />
            <select className="select" style={{ width: 170 }} value={sortProjects} onChange={e => setSortProjects(e.target.value)}>
              <option value="rating">Sort: Top rated</option>
              <option value="newest">Sort: Newest</option>
              <option value="oldest">Sort: Oldest</option>
            </select>
            {(filterCourse || filterInstructor || filterDate) && (
              <button className="btn btn-ghost btn-sm" onClick={() => { setFilterCourse(''); setFilterInstructor(''); setFilterDate('') }}>Clear filters</button>
            )}
          </div>

          {filteredProjects.length === 0
            ? <EmptyState icon="◈" title="No projects found" text="Try adjusting your search or filters." />
            : (
              <div className="grid-3">
                {filteredProjects.map((p, i) => {
                  const course = courses.find(c => c.id === p.course)
                  const creator = users.find(u => u.id === p.creatorId)
                  const isFav = favorites.projects.includes(p.id)
                  return (
                    <div key={p.id} className={`card card-p animate-fadeIn delay-${Math.min(i+1,6)}`}
                      style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 12, position: 'relative' }}>
                      <div onClick={() => setSelectedProject(p)} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div className="flex-between">
                          <span className={`badge ${course?.name === 'Bachelor Project' ? 'badge-teal' : 'badge-purple'}`}>
                            {course?.name === 'Bachelor Project' ? 'Bachelor' : course?.code}
                          </span>
                          <span style={{ fontSize: 12, color: 'var(--amber)' }}> {p.rating}</span>
                        </div>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, lineHeight: 1.3 }}>{p.title}</div>
                        <div className="text-sm text-muted" style={{ lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.description}</div>
                        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                          {p.languages.slice(0,3).map(l => <span key={l} className="badge badge-gray">{l}</span>)}
                        </div>
                        <div className="text-xs text-muted"> {p.createdAt}</div>
                      </div>
                      <div className="flex-between" style={{ paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                        <div className="flex-center gap-2" onClick={() => setSelectedProject(p)}>
                          <div className={`avatar avatar-sm ${getAvatarColors(creator?.avatar)}`}>{getInitials(creator?.firstName, creator?.lastName)}</div>
                          <span className="text-sm text-muted">{creator?.firstName}</span>
                        </div>
                        {currentUser && (
                          <button onClick={(e) => { e.stopPropagation(); toggleFavFixed('projects', p.id) }}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: isFav ? '#ED93B1' : 'var(--text-muted)' }}>
                            {isFav ? '' : ''}
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
        </>
      )}

      {}
      {tab === 'projects' && selectedProject && (
        <div className="animate-scaleIn">
          <button className="btn btn-ghost btn-sm" onClick={() => setSelectedProject(null)} style={{ marginBottom: 20 }}>← Back to projects</button>
          <div className="card card-p" style={{ maxWidth: 680 }}>
            <div className="flex-between" style={{ marginBottom: 16 }}>
              <h2 style={{ fontSize: '1.3rem' }}>{selectedProject.title}</h2>
              <span style={{ fontSize: 14, color: 'var(--amber)' }}> {selectedProject.rating}</span>
            </div>
            <div className="grid-2" style={{ marginBottom: 16 }}>
              <div><div className="text-xs text-muted" style={{ marginBottom: 4 }}>Course</div><div style={{ fontSize: 14 }}>{courses.find(c => c.id === selectedProject.course)?.name}</div></div>
              <div><div className="text-xs text-muted" style={{ marginBottom: 4 }}>Created</div><div style={{ fontSize: 14 }}>{selectedProject.createdAt}</div></div>
            </div>
            {}
            {selectedProject.instructors?.filter(i => i.status === 'accepted').length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <div className="text-xs text-muted" style={{ marginBottom: 6 }}>Course Instructors</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {selectedProject.instructors.filter(i => i.status === 'accepted').map(i => {
                    const u = users.find(x => x.id === i.userId)
                    return u ? <span key={i.userId} className="badge badge-teal">{u.firstName} {u.lastName}</span> : null
                  })}
                </div>
              </div>
            )}
            <div style={{ marginBottom: 16 }}><div className="text-xs text-muted" style={{ marginBottom: 8 }}>Description</div><p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-secondary)' }}>{selectedProject.description}</p></div>
            <div style={{ marginBottom: 16 }}><div className="text-xs text-muted" style={{ marginBottom: 8 }}>Languages</div><div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{selectedProject.languages.map(l => <span key={l} className="badge badge-purple">{l}</span>)}</div></div>
            {selectedProject.github && <div style={{ marginBottom: 10 }}><div className="text-xs text-muted" style={{ marginBottom: 4 }}>GitHub</div><a href={selectedProject.github} target="_blank" rel="noopener noreferrer" className="text-sm" style={{ color: 'var(--accent-text)' }}>{selectedProject.github}</a></div>}
            {selectedProject.demo && <div style={{ marginBottom: 10 }}><div className="text-xs text-muted" style={{ marginBottom: 4 }}>Demo</div><a href={selectedProject.demo} target="_blank" rel="noopener noreferrer" className="text-sm" style={{ color: 'var(--accent-text)' }}>{selectedProject.demo}</a></div>}
            {selectedProject.thesis && <div><div className="text-xs text-muted" style={{ marginBottom: 4 }}>Thesis</div><span className="badge badge-teal"> {selectedProject.thesis.name} (Final)</span></div>}
          </div>
        </div>
      )}

      {}
      {tab === 'portfolios' && !selectedStudent && (
        <>
          <div className="flex-center gap-2" style={{ marginBottom: 20, flexWrap: 'wrap' }}>
            <select className="select" style={{ width: 200 }} value={filterMajor} onChange={e => setFilterMajor(e.target.value)}>
              <option value="">All majors</option>
              {majors.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <input className="input" style={{ width: 180 }} placeholder="Filter by skill..." value={filterSkill} onChange={e => setFilterSkill(e.target.value)} />
            <select className="select" style={{ width: 190 }} value={sortPortfolios} onChange={e => setSortPortfolios(e.target.value)}>
              <option value="projects">Sort: Most projects</option>
            </select>
            {(filterMajor || filterSkill) && (
              <button className="btn btn-ghost btn-sm" onClick={() => { setFilterMajor(''); setFilterSkill('') }}>Clear</button>
            )}
          </div>
          <div className="grid-4">
            {filteredStudents.map((s, i) => {
              const projCount = projects.filter(p => p.creatorId === s.id).length
              const isFav = favorites.portfolios.includes(s.id)
              return (
                <div key={s.id} className={`card card-p animate-fadeIn delay-${Math.min(i+1,6)}`}
                  style={{ textAlign: 'center', cursor: 'pointer', position: 'relative' }}
                  onClick={() => setSelectedStudent(s)}>
                  {currentUser && (
                    <button onClick={e => { e.stopPropagation(); toggleFavFixed('portfolios', s.id) }}
                      style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: isFav ? '#ED93B1' : 'var(--text-muted)' }}>
                      {isFav ? '' : ''}
                    </button>
                  )}
                  <div className={`avatar avatar-lg ${getAvatarColors(s.avatar)}`} style={{ margin: '0 auto 12px' }}>{getInitials(s.firstName, s.lastName)}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14 }}>{s.firstName} {s.lastName}</div>
                  <div className="text-xs text-muted" style={{ margin: '4px 0 10px' }}>{s.major}</div>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 10 }}>
                    {s.skills.slice(0,3).map(sk => <span key={sk} className="badge badge-gray">{sk}</span>)}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--accent-text)', fontWeight: 500 }}>{projCount} projects</div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {}
      {tab === 'portfolios' && selectedStudent && (
        <div className="animate-scaleIn">
          <button className="btn btn-ghost btn-sm" onClick={() => setSelectedStudent(null)} style={{ marginBottom: 20 }}>← Back to portfolios</button>
          <div style={{ maxWidth: 680 }}>
            <div className="card card-p" style={{ marginBottom: 16, display: 'flex', gap: 20, alignItems: 'center' }}>
              <div className={`avatar avatar-xl ${getAvatarColors(selectedStudent.avatar)}`}>{getInitials(selectedStudent.firstName, selectedStudent.lastName)}</div>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '1.4rem', marginBottom: 4 }}>{selectedStudent.firstName} {selectedStudent.lastName}</h2>
                <div className="text-secondary" style={{ fontSize: 14, marginBottom: 10 }}>{selectedStudent.major}</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                  {selectedStudent.skills.map(sk => <span key={sk} className="badge badge-purple">{sk}</span>)}
                </div>
                {selectedStudent.linkedin && <a href={selectedStudent.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm" style={{ color: 'var(--accent-text)' }}> LinkedIn</a>}
              </div>
              {currentUser && (currentUser.role === 'employer' || currentUser.role === 'instructor') && (
                <button className="btn btn-primary btn-sm" onClick={() => setMsgModal(selectedStudent)}>Message</button>
              )}
            </div>
            <h3 style={{ fontSize: 15, marginBottom: 14 }}>Projects</h3>
            {projects.filter(p => p.creatorId === selectedStudent.id && p.visibility === 'public').length === 0
              ? <EmptyState icon="◈" title="No public projects" />
              : projects.filter(p => p.creatorId === selectedStudent.id && p.visibility === 'public').map(p => {
                const course = courses.find(c => c.id === p.course)
                return (
                  <div key={p.id} className="card card-p" style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 9, background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>◈</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{p.title}</div>
                      <div className="text-xs text-muted">{course?.name}</div>
                    </div>
                    {p.rating > 0 && <span style={{ fontSize: 12, color: 'var(--amber)' }}> {p.rating}</span>}
                  </div>
                )
              })}
            {}
            {internships.filter(i => i.applicants.some(a => a.userId === selectedStudent.id && a.status === 'accepted')).length > 0 && (
              <>
                <h3 style={{ fontSize: 15, margin: '20px 0 14px' }}>Completed Internships</h3>
                {internships.filter(i => i.applicants.some(a => a.userId === selectedStudent.id && a.status === 'accepted')).map(i => (
                  <div key={i.id} className="card card-p" style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 9, background: 'var(--teal-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>◉</div>
                    <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 14 }}>{i.title}</div><div className="text-xs text-muted">{i.company} · {i.duration}</div></div>
                    <span className="badge badge-teal">Completed</span>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}

      {}
      {tab === 'instructors' && (
        <div className="grid-3">
          {filteredInstructors.map((inst, i) => {
            const instCourses = courses.filter(c => c.instructors.includes(inst.id))
            return (
              <div key={inst.id} className={`card card-p animate-fadeIn delay-${Math.min(i+1,6)}`} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className="flex-center gap-3">
                  <div className={`avatar avatar-md ${getAvatarColors(inst.avatar)}`}>{getInitials(inst.firstName, inst.lastName)}</div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14 }}>{inst.firstName} {inst.lastName}</div>
                    <div className="text-xs text-muted">{inst.email}</div>
                  </div>
                </div>
                {inst.bio && <div className="text-sm text-muted" style={{ lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{inst.bio}</div>}
                {inst.education && <div className="text-xs text-muted"> {inst.education}</div>}
                {inst.researchInterests?.length > 0 && (
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                    {inst.researchInterests.map(r => <span key={r} className="badge badge-teal">{r}</span>)}
                  </div>
                )}
                <div style={{ paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                  <div className="text-xs text-muted" style={{ marginBottom: 6 }}>Linked courses</div>
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                    {instCourses.length > 0
                      ? instCourses.map(c => <span key={c.id} className="badge badge-purple">{c.name}</span>)
                      : <span className="text-xs text-muted">No linked courses</span>}
                  </div>
                </div>
              </div>
            )
          })}
          {filteredInstructors.length === 0 && <EmptyState icon="◈" title="No instructors found" />}
        </div>
      )}

      {}
      <Modal open={!!msgModal} onClose={() => setMsgModal(null)} title={`Message ${msgModal?.firstName}`}
        footer={<><button className="btn btn-ghost" onClick={() => setMsgModal(null)}>Cancel</button><button className="btn btn-primary" onClick={() => { setMsgModal(null) }}>Send message</button></>}>
        <p className="text-secondary" style={{ fontSize: 14, marginBottom: 14 }}>Start a conversation with <strong style={{ color: 'var(--text-primary)' }}>{msgModal?.firstName} {msgModal?.lastName}</strong>.</p>
        <textarea className="textarea" placeholder="Write your message..." style={{ minHeight: 100 }} />
      </Modal>
    </div>
  )

  if (!currentUser) return <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>{content}</div>

  return (
    <div className="layout">
      <Sidebar role={currentUser.role} />
      <div className="main-content">
        <Topbar title="Explore" />
        {content}
      </div>
    </div>
  )
}

export function MessagesPage({ role = 'student' }) {
  const { currentUser, addToast } = useApp()
  const [selectedConvo, setSelectedConvo] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [convos, setConvos] = useState([
    { id: 1, participants: [1, 8], messages: [
      { from: 8, text: 'Hi Ahmed! We loved your portfolio. Are you available for an interview?', time: '10:30 AM' },
      { from: 1, text: 'Thank you! Yes, I would love to discuss the opportunity.', time: '10:45 AM' },
      { from: 8, text: 'Great! How about next Tuesday at 3pm?', time: '10:46 AM' },
    ]},
    { id: 2, participants: [1, 6], messages: [
      { from: 6, text: 'Ahmed, your NLP project is impressive. Consider submitting to IEEE.', time: 'Yesterday' },
      { from: 1, text: 'Thank you Dr. Mona! I will start preparing the paper.', time: 'Yesterday' },
    ]},
  ])

  const myConvos = convos.filter(c => c.participants.includes(currentUser?.id))
  const getOtherUser = (convo) => users.find(u => u.id === convo.participants.find(id => id !== currentUser?.id))

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConvo) return
    const updated = { ...selectedConvo, messages: [...selectedConvo.messages, { from: currentUser.id, text: newMessage, time: 'Now' }] }
    setConvos(prev => prev.map(c => c.id === selectedConvo.id ? updated : c))
    setSelectedConvo(updated)
    setNewMessage('')
    
    addToast('Message sent!', 'success')
  }

  return (
    <div className="layout">
      <Sidebar role={role} />
      <div className="main-content">
        <Topbar title="Messages" />
        <div style={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
          <div style={{ width: 280, borderRight: '1px solid var(--border)', overflowY: 'auto', padding: '12px 8px' }}>
            <div style={{ padding: '8px 10px', marginBottom: 8 }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>Messages</div>
              <SearchBar value="" onChange={() => {}} placeholder="Search..." />
            </div>
            {myConvos.length === 0
              ? <EmptyState icon="◷" title="No messages" text="Start a conversation from a portfolio." />
              : myConvos.map(convo => {
                const other = getOtherUser(convo)
                const last = convo.messages[convo.messages.length - 1]
                return (
                  <div key={convo.id} onClick={() => setSelectedConvo(convo)}
                    className="nav-item animate-fadeIn"
                    style={{ alignItems: 'flex-start', padding: '12px 10px', background: selectedConvo?.id === convo.id ? 'var(--accent-dim)' : 'transparent' }}>
                    <div className={`avatar avatar-sm ${getAvatarColors(other?.avatar)}`} style={{ marginTop: 2 }}>{getInitials(other?.firstName, other?.lastName)}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{other?.firstName} {other?.lastName}</div>
                      <div className="text-xs text-muted" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{last?.text}</div>
                      <div className="text-xs text-muted">{last?.time}</div>
                    </div>
                  </div>
                )
              })}
          </div>

          {selectedConvo ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
                {(() => { const other = getOtherUser(selectedConvo); return <>
                  <div className={`avatar avatar-md ${getAvatarColors(other?.avatar)}`}>{getInitials(other?.firstName, other?.lastName)}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{other?.firstName} {other?.lastName}</div>
                    <div className="text-xs text-muted">{other?.role}</div>
                  </div>
                </> })()}
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {selectedConvo.messages.map((msg, i) => {
                  const isMe = msg.from === currentUser?.id
                  const sender = users.find(u => u.id === msg.from)
                  return (
                    <div key={i} className={`animate-fadeIn delay-${Math.min(i+1,6)}`} style={{ display: 'flex', gap: 10, flexDirection: isMe ? 'row-reverse' : 'row' }}>
                      {!isMe && <div className={`avatar avatar-sm ${getAvatarColors(sender?.avatar)}`}>{getInitials(sender?.firstName, sender?.lastName)}</div>}
                      <div style={{ maxWidth: '65%', padding: '10px 14px', background: isMe ? 'var(--accent)' : 'var(--bg-card)', border: isMe ? 'none' : '1px solid var(--border)', borderRadius: isMe ? '14px 14px 4px 14px' : '14px 14px 14px 4px', fontSize: 14, lineHeight: 1.5 }}>
                        {msg.text}
                        <div style={{ fontSize: 11, color: isMe ? 'rgba(255,255,255,0.6)' : 'var(--text-muted)', marginTop: 4 }}>{msg.time}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10 }}>
                <input className="input" placeholder="Type a message..." value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  style={{ flex: 1 }} />
                <button className="btn btn-primary" onClick={sendMessage}>Send</button>
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <EmptyState icon="◷" title="Select a conversation" text="Choose a conversation from the list to start messaging." />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
