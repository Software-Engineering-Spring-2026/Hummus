import { createContext, useContext, useState, useRef } from 'react'
import { users as initialUsers } from '../data/data'

const AppContext = createContext(null)
const avatarColors = ['purple', 'teal', 'coral', 'pink', 'amber', 'green']

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [registeredUsers, setRegisteredUsers] = useState(initialUsers)
  
  const registeredUsersRef = useRef(initialUsers)
  const [notifOff, setNotifOff] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Ahmed Hassan invited you to collaborate on "AI Code Review"', read: false, time: '2m ago', type: 'invite' },
    { id: 2, text: 'Dr. Mona Salem left feedback on your project', read: false, time: '1h ago', type: 'feedback' },
    { id: 3, text: 'Your project "Smart Farm" was rated 4.9 ', read: true, time: '3h ago', type: 'rating' },
    { id: 4, text: 'TechCorp accepted your internship application!', read: false, time: '1d ago', type: 'internship' },
    { id: 5, text: 'Admin flagged project "Web Scraper" for review', read: true, time: '2d ago', type: 'flag' },
  ])
  const [toasts, setToasts] = useState([])

  const login  = (user) => setCurrentUser(user)
  const logout = () => setCurrentUser(null)

  const register = ({ role, firstName, lastName, email, password, companyName, companyEmail }) => {
    const isEmployer = role === 'employer'
    const newUser = {
      id: Date.now(), role,
      firstName: isEmployer ? companyName : firstName,
      lastName:  isEmployer ? '' : lastName,
      email:     isEmployer ? companyEmail : email,
      avatar:    avatarColors[Math.floor(Math.random() * avatarColors.length)],
      active: true,
      major: '', skills: [], linkedin: '',
      bio: '', researchInterests: [], education: '', courses: [],
      company: isEmployer ? companyName : undefined,
      companyBio: '', address: '', contact: '', verified: false,
    }
    setRegisteredUsers(prev => {
      const updated = [...prev, newUser]
      registeredUsersRef.current = updated
      return updated
    })
    setCurrentUser(newUser)
    return newUser
  }

  const findUser = (email) => registeredUsersRef.current.find(u => u.email === email)

  
  const addToast = (message, type = 'info') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
  }

  
  
  const pushNotif = (text, type = 'info') => {
    if (notifOff) return   
    const id = Date.now() + Math.random()
    setNotifications(prev => [{ id, text, read: false, time: 'Just now', type }, ...prev])
  }

  const markNotifRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  
  const markNotifUnread = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: false } : n))
  }

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })))

  const toggleNotifOff = () => {
    setNotifOff(prev => !prev)
    addToast(notifOff ? 'Notifications enabled' : 'All notifications turned off', 'info')
  }

  const unreadCount = notifOff ? 0 : notifications.filter(n => !n.read).length

  return (
    <AppContext.Provider value={{
      currentUser, login, logout, register, findUser,
      notifications, markNotifRead, markNotifUnread, markAllRead,
      unreadCount, notifOff, toggleNotifOff,
      pushNotif,
      toasts, addToast,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
