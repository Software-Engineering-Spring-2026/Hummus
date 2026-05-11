import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { getInitials, getAvatarColors, courses, users } from '../data/data'
import {
  Bell, Search, X, ChevronRight, LogOut, Home, BookOpen, FolderKanban,
  Globe, Briefcase, Heart, MessageCircle, Settings, Flag, Users, Shield,
  CheckCircle, Circle, Star, Eye, EyeOff, Plus, Trash2, Edit2, Upload,
  Download, Filter, SortAsc, MapPin, Github, ExternalLink, FileText,
  GraduationCap, Building2, LayoutDashboard, ClipboardList, UserCheck,
  AlertTriangle, Info, CheckCheck, ChevronDown, MoreHorizontal, Send,
  Inbox, CalendarDays, Clock, Tag, Layers, TrendingUp, BarChart2,
} from 'lucide-react'

export function ToastContainer() {
  const { toasts } = useApp()
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          {t.type === 'success' ? <CheckCircle size={15} /> : t.type === 'error' ? <X size={15} /> : <Info size={15} />}
          {t.message}
        </div>
      ))}
    </div>
  )
}

export function Modal({ open, onClose, title, children, footer }) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])
  if (!open) return null
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal animate-scaleIn">
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="btn btn-ghost btn-icon" onClick={onClose} style={{ padding: '6px 8px' }}>
            <X size={16} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  )
}

export function ConfirmModal({ open, onClose, onConfirm, title, message, danger }) {
  return (
    <Modal open={open} onClose={onClose} title={title}
      footer={<>
        <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        <button className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`} onClick={() => { onConfirm(); onClose() }}>
          {danger ? <><Trash2 size={14} /> Delete</> : <><CheckCircle size={14} /> Confirm</>}
        </button>
      </>}>
      <p className="text-secondary">{message}</p>
    </Modal>
  )
}

const sidebarConfigs = {
  student: [
    { section: 'Main', items: [
      { to: '/student',             Icon: LayoutDashboard, label: 'Dashboard'    },
      { to: '/student/portfolio',   Icon: UserCheck,       label: 'My Portfolio' },
      { to: '/student/projects',    Icon: FolderKanban,    label: 'My Projects'  },
      { to: '/explore',             Icon: Globe,           label: 'Explore'      },
    ]},
    { section: 'Career', items: [
      { to: '/student/internships', Icon: Briefcase,       label: 'Internships'  },
      { to: '/student/favorites',   Icon: Heart,           label: 'Favorites'    },
      { to: '/student/messages',    Icon: MessageCircle,   label: 'Messages'     },
    ]},
    { section: 'Account', items: [
      { to: '/student/notifications', Icon: Bell,          label: 'Notifications', badge: true },
      { to: '/student/settings',      Icon: Settings,      label: 'Settings'     },
    ]},
  ],
  employer: [
    { section: 'Main', items: [
      { to: '/employer',             Icon: LayoutDashboard, label: 'Dashboard'    },
      { to: '/employer/internships', Icon: Briefcase,       label: 'Internships'  },
      { to: '/employer/applicants',  Icon: Users,           label: 'Applicants'   },
      { to: '/explore',              Icon: Globe,           label: 'Browse Talent'},
    ]},
    { section: 'Account', items: [
      { to: '/employer/favorites',     Icon: Heart,         label: 'Favorites'    },
      { to: '/employer/messages',      Icon: MessageCircle, label: 'Messages'     },
      { to: '/employer/notifications', Icon: Bell,          label: 'Notifications', badge: true },
      { to: '/employer/settings',      Icon: Settings,      label: 'Settings'     },
    ]},
  ],
  instructor: [
    { section: 'Main', items: [
      { to: '/instructor',           Icon: LayoutDashboard, label: 'Dashboard'  },
      { to: '/instructor/courses',   Icon: BookOpen,        label: 'My Courses' },
      { to: '/instructor/projects',  Icon: FolderKanban,    label: 'Projects'   },
      { to: '/explore',              Icon: Globe,           label: 'Explore'    },
    ]},
    { section: 'Account', items: [
      { to: '/instructor/notifications', Icon: Bell,        label: 'Notifications', badge: true },
      { to: '/instructor/messages',      Icon: MessageCircle,label: 'Messages'  },
      { to: '/instructor/settings',      Icon: Settings,    label: 'Settings'   },
    ]},
  ],
  admin: [
    { section: 'Management', items: [
      { to: '/admin',            Icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/admin/users',      Icon: Users,           label: 'Users'     },
      { to: '/admin/courses',    Icon: BookOpen,        label: 'Courses'   },
      { to: '/admin/projects',   Icon: FolderKanban,    label: 'Projects'  },
      { to: '/admin/employers',  Icon: Building2,       label: 'Employers' },
    ]},
    { section: 'Moderation', items: [
      { to: '/admin/flags',         Icon: Flag,   label: 'Flagged'       },
      { to: '/admin/notifications', Icon: Bell,   label: 'Notifications', badge: true },
    ]},
  ],
}

const navBarLinks = {
  student: [
    { to: '/student/projects',      Icon: FolderKanban,  label: 'Projects'      },
    { to: '/student/portfolio',     Icon: UserCheck,     label: 'Portfolio'     },
    { to: '/student/internships',   Icon: Briefcase,     label: 'Internships'   },
    { to: '/explore',               Icon: Globe,         label: 'Explore'       },
    { to: '/student/favorites',     Icon: Heart,         label: 'Favorites'     },
    { to: '/student/messages',      Icon: MessageCircle, label: 'Messages'      },
    { to: '/student/notifications', Icon: Bell,          label: 'Notifications' },
    { to: '/student/settings',      Icon: Settings,      label: 'Settings'      },
  ],
  instructor: [
    { to: '/instructor/courses',       Icon: BookOpen,     label: 'Courses'       },
    { to: '/instructor/projects',      Icon: FolderKanban, label: 'Projects'      },
    { to: '/explore',                  Icon: Globe,        label: 'Explore'       },
    { to: '/instructor/messages',      Icon: MessageCircle,label: 'Messages'      },
    { to: '/instructor/notifications', Icon: Bell,         label: 'Notifications' },
    { to: '/instructor/settings',      Icon: Settings,     label: 'Settings'      },
  ],
  employer: [
    { to: '/employer/internships',   Icon: Briefcase,     label: 'Internships'   },
    { to: '/employer/applicants',    Icon: Users,         label: 'Applicants'    },
    { to: '/explore',                Icon: Globe,         label: 'Browse Talent' },
    { to: '/employer/favorites',     Icon: Heart,         label: 'Saved'         },
    { to: '/employer/messages',      Icon: MessageCircle, label: 'Messages'      },
    { to: '/employer/notifications', Icon: Bell,          label: 'Notifications' },
    { to: '/employer/settings',      Icon: Settings,      label: 'Settings'      },
  ],
  admin: [
    { to: '/admin/users',         Icon: Users,        label: 'Users'     },
    { to: '/admin/courses',       Icon: BookOpen,     label: 'Courses'   },
    { to: '/admin/projects',      Icon: FolderKanban, label: 'Projects'  },
    { to: '/admin/employers',     Icon: Building2,    label: 'Employers' },
    { to: '/admin/flags',         Icon: Flag,         label: 'Flags'     },
    { to: '/admin/notifications', Icon: Bell,         label: 'Notifications' },
  ],
}

const dashboardPaths = ['/student', '/instructor', '/employer', '/admin']

export function Sidebar({ role }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { currentUser, logout, unreadCount } = useApp()
  const config = sidebarConfigs[role] || sidebarConfigs.student

  return (
    <aside className="sidebar animate-slideInLeft">
      <div className="sidebar-logo">port<span>folio</span>.<em>guc</em></div>
      <nav className="sidebar-nav">
        {config.map(section => (
          <div key={section.section} className="nav-section">
            <div className="nav-section-title">{section.section}</div>
            {section.items.map(item => (
              <Link key={item.to} to={item.to}
                className={`nav-item ${location.pathname === item.to ? 'active' : ''}`}>
                <item.Icon size={16} className="nav-icon" />
                {item.label}
                {item.badge && unreadCount > 0 && (
                  <span className="nav-badge">{unreadCount}</span>
                )}
              </Link>
            ))}
          </div>
        ))}
      </nav>
      {currentUser && (
        <div className="sidebar-footer">
          <div className="nav-item" style={{ cursor: 'default' }}>
            <div className={`avatar avatar-sm ${getAvatarColors(currentUser.avatar)}`}>
              {getInitials(currentUser.firstName, currentUser.lastName)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentUser.firstName} {currentUser.lastName}
              </div>
              <div className="text-xs text-muted">{currentUser.role}</div>
            </div>
          </div>
          <div className="nav-item" onClick={() => { logout(); navigate('/') }} style={{ color: '#F09595', marginTop: 4 }}>
            <LogOut size={16} /> Logout
          </div>
        </div>
      )}
    </aside>
  )
}

export function Topbar({ title }) {
  const { currentUser, notifications, markNotifRead, markAllRead, unreadCount } = useApp()
  const [showNotif, setShowNotif] = useState(false)
  const notifRef = useRef(null)
  const location = useLocation()

  const isDashboard = dashboardPaths.includes(location.pathname)
  const links = navBarLinks[currentUser?.role] || []

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div style={{ background: 'rgba(8,12,10,0.95)', backdropFilter: 'blur(8px)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 50 }}>
      <div className="topbar" style={{ borderBottom: !isDashboard ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, letterSpacing: -0.5 }}>{title}</div>
        <div className="flex-center gap-2">
          <div style={{ position: 'relative' }} ref={notifRef}>
            <button className="btn btn-ghost btn-icon" onClick={() => setShowNotif(!showNotif)} style={{ position: 'relative' }}>
              <Bell size={18} />
              {unreadCount > 0 && (
                <span style={{ position: 'absolute', top: 4, right: 4, width: 8, height: 8, background: 'var(--accent)', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
              )}
            </button>
            {showNotif && (
              <div className="dropdown" style={{ width: 320 }}>
                <div className="flex-between" style={{ padding: '12px 16px 8px' }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>Notifications</span>
                  <button className="btn btn-ghost btn-sm" onClick={markAllRead}>
                    <CheckCheck size={13} /> Mark all read
                  </button>
                </div>
                <div className="dropdown-divider" />
                {notifications.map(n => (
                  <div key={n.id} className="dropdown-item" onClick={() => markNotifRead(n.id)}
                    style={{ alignItems: 'flex-start', gap: 10, padding: '10px 16px' }}>
                    {!n.read && <div className="notif-dot" style={{ marginTop: 6, flexShrink: 0 }} />}
                    {n.read  && <div style={{ width: 8, flexShrink: 0 }} />}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, lineHeight: 1.5, color: n.read ? 'var(--text-muted)' : 'var(--text-primary)' }}>{n.text}</div>
                      <div className="text-xs text-muted" style={{ marginTop: 3 }}>{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {currentUser && (
            <div className="flex-center gap-2">
              <div className={`avatar avatar-sm ${getAvatarColors(currentUser.avatar)}`}>
                {getInitials(currentUser.firstName, currentUser.lastName)}
              </div>
              <span style={{ fontSize: 13, fontWeight: 500 }}>{currentUser.firstName}</span>
            </div>
          )}
        </div>
      </div>

      {!isDashboard && links.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, padding: '0 32px', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {links.map(({ to, Icon, label }) => (
            <Link key={to} to={to} style={{
              padding: '8px 14px', fontSize: 13,
              fontWeight: location.pathname === to ? 600 : 400,
              color: location.pathname === to ? 'var(--accent-text)' : 'var(--text-muted)',
              borderBottom: `2px solid ${location.pathname === to ? 'var(--accent)' : 'transparent'}`,
              whiteSpace: 'nowrap', transition: 'all 0.2s', textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              <Icon size={13} />
              {label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div className="search-bar">
      <Search size={15} className="search-icon" />
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
      {value && <button onClick={() => onChange('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}><X size={14} /></button>}
    </div>
  )
}

export function ProjectCard({ project, onClick, showRating = true }) {
  const course = courses.find(c => c.id === project.course)
  const creator = users.find(u => u.id === project.creatorId)
  const isBachelor = course?.name === 'Bachelor Project'

  return (
    <div className="card card-p animate-fadeIn" onClick={onClick}
      style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className="flex-between">
        <div style={{ width: 38, height: 38, borderRadius: 10, background: isBachelor ? 'var(--gold-dim)' : 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isBachelor ? 'var(--gold)' : 'var(--accent)' }}>
          {isBachelor ? <GraduationCap size={18} /> : <FolderKanban size={18} />}
        </div>
        <div className="flex-center gap-1">
          {project.visibility === 'public'
            ? <span className="badge badge-green"><Eye size={10} /> Public</span>
            : <span className="badge badge-gray"><EyeOff size={10} /> Private</span>}
          {isBachelor
            ? <span className="badge badge-amber">Bachelor</span>
            : <span className="badge badge-purple">{course?.code || 'Course'}</span>}
        </div>
      </div>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, marginBottom: 6, lineHeight: 1.3 }}>{project.title}</div>
        <div className="text-sm text-secondary" style={{ lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {project.description}
        </div>
      </div>
      <div className="flex-center gap-1" style={{ flexWrap: 'wrap' }}>
        {project.languages.slice(0,3).map(l => <span key={l} className="badge badge-gray"><Tag size={9} /> {l}</span>)}
      </div>
      <div className="flex-between" style={{ paddingTop: 10, borderTop: '1px solid var(--border)' }}>
        <div className="flex-center gap-2">
          <div className={`avatar avatar-sm ${getAvatarColors(creator?.avatar)}`}>{getInitials(creator?.firstName, creator?.lastName)}</div>
          <span className="text-sm text-muted">{creator?.firstName} {creator?.lastName}</span>
        </div>
        {showRating && project.rating > 0 && (
          <span className="flex-center gap-1 text-sm" style={{ color: 'var(--gold)' }}><Star size={12} fill="currentColor" /> {project.rating}</span>
        )}
      </div>
    </div>
  )
}

export function EmptyState({ icon, title, text, action }) {
  return (
    <div className="empty-state animate-fadeIn">
      <div className="empty-state-icon">{icon || <Inbox size={40} strokeWidth={1} />}</div>
      <div className="empty-state-title">{title}</div>
      {text && <p className="empty-state-text">{text}</p>}
      {action && <div style={{ marginTop: 20 }}>{action}</div>}
    </div>
  )
}

export {
  Bell, Search, X, ChevronRight, LogOut, Home, BookOpen, FolderKanban,
  Globe, Briefcase, Heart, MessageCircle, Settings, Flag, Users, Shield,
  CheckCircle, Circle, Star, Eye, EyeOff, Plus, Trash2, Edit2, Upload,
  Download, Filter, SortAsc, MapPin, Github, ExternalLink, FileText,
  GraduationCap, Building2, LayoutDashboard, ClipboardList, UserCheck,
  AlertTriangle, Info, CheckCheck, ChevronDown, MoreHorizontal, Send,
  Inbox, CalendarDays, Clock, Tag, Layers, TrendingUp, BarChart2,
}
