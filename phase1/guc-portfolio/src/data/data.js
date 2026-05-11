
export const users = [
  { id: 1,  role: 'student',     firstName: 'Ahmed',   lastName: 'Hassan',    email: 'ahmed.hassan@student.guc.edu.eg',      major: 'Computer Science',        skills: ['React','Node.js','Python','ML'], avatar: 'purple', linkedin: 'https://linkedin.com/in/ahmedhassan', active: true },
  { id: 2,  role: 'student',     firstName: 'Sara',    lastName: 'Radwan',    email: 'sara.radwan@student.guc.edu.eg',       major: 'Mechatronics Engineering', skills: ['Arduino','ROS','Python','CAD'],  avatar: 'teal',   linkedin: 'https://linkedin.com/in/sararadwan',  active: true },
  { id: 3,  role: 'student',     firstName: 'Karim',   lastName: 'Mostafa',   email: 'karim.mostafa@student.guc.edu.eg',     major: 'Networks Engineering',     skills: ['Networking','Java','C++'],      avatar: 'coral',  linkedin: '', active: true },
  { id: 4,  role: 'student',     firstName: 'Nour',    lastName: 'Youssef',   email: 'nour.youssef@student.guc.edu.eg',      major: 'Media Eng. & Technology',  skills: ['UI/UX','Figma','React','CSS'],  avatar: 'pink',   linkedin: '', active: true },
  { id: 5,  role: 'student',     firstName: 'Omar',    lastName: 'Khalil',    email: 'omar.khalil@student.guc.edu.eg',       major: 'Computer Science',         skills: ['Java','Spring','PostgreSQL'],   avatar: 'amber',  linkedin: '', active: true },
  { id: 6,  role: 'instructor',  firstName: 'Dr. Mona',lastName: 'Salem',     email: 'mona.salem@guc.edu.eg',                bio: 'AI & ML researcher with 10+ years experience.', researchInterests: ['Machine Learning','Computer Vision','NLP'], education: 'PhD MIT', avatar: 'purple', courses: [1,2], active: true },
  { id: 7,  role: 'instructor',  firstName: 'Dr. Hany',lastName: 'Farid',     email: 'hany.farid@guc.edu.eg',                bio: 'Software Engineering expert.', researchInterests: ['Software Architecture','Design Patterns'], education: 'PhD TU Berlin', avatar: 'teal', courses: [3], active: true },
  { id: 8,  role: 'employer',    firstName: 'Layla',   lastName: 'Ibrahim',   email: 'layla@techcorp.io',   company: 'TechCorp',   companyBio: 'Leading software company.', address: '5th Settlement, Cairo', contact: '+20 100 000 0001', location: { lat: 30.01, lng: 31.43 }, verified: true,  avatar: 'coral', active: true },
  { id: 9,  role: 'employer',    firstName: 'Tarek',   lastName: 'Mansour',   email: 'tarek@innova.com',    company: 'Innova',     companyBio: 'Fintech startup.',         address: 'Smart Village, Cairo',  contact: '+20 100 000 0002', location: { lat: 30.07, lng: 31.01 }, verified: false, avatar: 'amber', active: true },
  { id: 10, role: 'admin',       firstName: 'Admin',   lastName: 'GUC',       email: 'admin@guc.edu.eg',    avatar: 'purple', active: true },
]

export const courses = [
  { id: 1, name: 'Machine Learning',             code: 'CSEN901', instructors: [6] },
  { id: 2, name: 'Computer Vision',              code: 'CSEN907', instructors: [6] },
  { id: 3, name: 'Software Engineering',         code: 'CSEN603', instructors: [7] },
  { id: 4, name: 'Computer Networks',            code: 'CSEN604', instructors: [] },
  { id: 5, name: 'Database Systems',             code: 'CSEN501', instructors: [] },
  { id: 6, name: 'Operating Systems',            code: 'CSEN502', instructors: [] },
  { id: 7, name: 'Bachelor Project',             code: 'CSEN901P', instructors: [6,7] },
]

export const projects = [
  {
    id: 1, title: 'AI-Powered Code Review Assistant',
    course: 3, creatorId: 1,
    collaborators: [{ userId: 2, status: 'accepted' }, { userId: 3, status: 'pending' }],
    instructors: [{ userId: 7, status: 'accepted' }],
    github: 'https://github.com/ahmedhassan/ai-code-review',
    demo: 'https://youtube.com/watch?v=demo1',
    description: 'An automated code analysis tool using large language models to detect bugs, suggest improvements, and enforce coding standards across multiple programming languages.',
    languages: ['Python', 'React', 'FastAPI'],
    visibility: 'public', status: 'active', rating: 4.8,
    createdAt: '2026-02-14', flagged: false, thesis: null,
    tasks: [
      { id: 1, title: 'Setup LLM API integration', description: 'Integrate OpenAI API', assignee: 1, status: 'completed', deadline: '2026-02-20', comments: [] },
      { id: 2, title: 'Build React frontend',       description: 'Create UI dashboard',  assignee: 2, status: 'completed', deadline: '2026-02-28', comments: ['Great work! - Dr. Hany'] },
      { id: 3, title: 'Write unit tests',            description: '80% coverage target', assignee: 3, status: 'pending',   deadline: '2026-03-10', comments: [] },
    ],
    instructorFeedback: 'Excellent project! The LLM integration is innovative. Consider adding support for more languages.',
    report: null,
  },
  {
    id: 2, title: 'Smart Urban Farming Management',
    course: 7, creatorId: 2,
    collaborators: [{ userId: 5, status: 'accepted' }],
    instructors: [{ userId: 6, status: 'accepted' }, { userId: 7, status: 'accepted' }],
    github: 'https://github.com/sararadwan/smart-farm',
    demo: 'https://youtube.com/watch?v=demo2',
    description: 'IoT-based system for monitoring and optimizing hydroponic urban farms. Includes sensor dashboards, automated irrigation, and ML-based crop health prediction.',
    languages: ['Python', 'Arduino', 'React', 'TensorFlow'],
    visibility: 'public', status: 'active', rating: 4.9,
    createdAt: '2026-01-20', flagged: false,
    thesis: { name: 'Smart_Farm_Final.pdf', isFinal: true },
    thesisDrafts: [
      { id: 1, name: 'Draft_v1.pdf', isFinal: false, date: '2026-01-15' },
      { id: 2, name: 'Draft_v2.pdf', isFinal: false, date: '2026-02-01' },
      { id: 3, name: 'Smart_Farm_Final.pdf', isFinal: true, date: '2026-03-01' },
    ],
    tasks: [
      { id: 1, title: 'Hardware prototype',  description: 'Build sensor array',     assignee: 2, status: 'completed', deadline: '2026-02-01', comments: ['Good progress'] },
      { id: 2, title: 'ML model training',   description: 'Train crop classifier',  assignee: 5, status: 'completed', deadline: '2026-02-15', comments: [] },
      { id: 3, title: 'Write thesis',        description: 'Complete final chapter', assignee: 2, status: 'pending',   deadline: '2026-04-01', comments: ['Add more references - Dr. Mona'] },
    ],
    instructorFeedback: 'Outstanding bachelor project. The IoT integration and ML components are well-executed.',
    report: null,
  },
  {
    id: 3, title: 'Distributed File Storage Protocol',
    course: 4, creatorId: 3,
    collaborators: [],
    instructors: [],
    github: 'https://github.com/karimmostafa/dfs',
    demo: '',
    description: 'A peer-to-peer file sharing protocol with end-to-end encryption, fault tolerance, and automatic replication across distributed nodes.',
    languages: ['Java', 'C++', 'Python'],
    visibility: 'public', status: 'active', rating: 4.6,
    createdAt: '2026-02-28', flagged: false, thesis: null,
    tasks: [],
    instructorFeedback: '',
    report: null,
  },
  {
    id: 4, title: 'GUC Course Registration Portal',
    course: 3, creatorId: 4,
    collaborators: [{ userId: 1, status: 'accepted' }],
    instructors: [{ userId: 7, status: 'accepted' }],
    github: 'https://github.com/nouryoussef/guc-portal',
    demo: 'https://youtube.com/watch?v=demo4',
    description: 'A modern redesign of the GUC course registration system with better UX, real-time seat availability, and conflict detection.',
    languages: ['React', 'Node.js', 'MongoDB'],
    visibility: 'private', status: 'active', rating: 4.5,
    createdAt: '2026-03-01', flagged: false, thesis: null,
    tasks: [
      { id: 1, title: 'Design mockups', description: 'Figma wireframes', assignee: 4, status: 'completed', deadline: '2026-03-05', comments: [] },
      { id: 2, title: 'Implement auth', description: 'JWT login flow',   assignee: 1, status: 'pending',   deadline: '2026-03-20', comments: [] },
    ],
    instructorFeedback: 'Good concept. Focus more on the conflict detection algorithm.',
    report: null,
  },
  {
    id: 5, title: 'NLP Arabic Sentiment Analysis',
    course: 1, creatorId: 1,
    collaborators: [],
    instructors: [{ userId: 6, status: 'accepted' }],
    github: 'https://github.com/ahmedhassan/arabic-nlp',
    demo: '',
    description: 'Deep learning model for Arabic text sentiment analysis using BERT fine-tuned on Egyptian dialect social media data.',
    languages: ['Python', 'PyTorch', 'HuggingFace'],
    visibility: 'public', status: 'active', rating: 4.7,
    createdAt: '2026-01-10', flagged: false, thesis: null,
    tasks: [],
    instructorFeedback: 'Impressive results on the dialect data. Consider publishing.',
    report: null,
  },
]

export const internships = [
  {
    id: 1, employerId: 8, company: 'TechCorp',
    title: 'Frontend Developer Intern',
    details: 'Work on our main SaaS product UI using React and TypeScript.',
    skills: ['React', 'TypeScript', 'CSS'],
    duration: '3 months', deadline: '2026-06-01',
    languages: ['JavaScript', 'TypeScript'],
    status: 'hiring', archived: false,
    postedAt: '2026-04-01',
    applicants: [
      { userId: 1, coverLetter: 'I am passionate about frontend development...', status: 'accepted' },
      { userId: 4, coverLetter: 'My UI/UX background makes me a great fit...', status: 'nominated' },
      { userId: 5, coverLetter: 'I have strong JavaScript skills...', status: 'pending' },
    ],
  },
  {
    id: 2, employerId: 8, company: 'TechCorp',
    title: 'Backend Engineer Intern',
    details: 'Design and implement REST APIs for our microservices architecture.',
    skills: ['Node.js', 'PostgreSQL', 'Docker'],
    duration: '6 months', deadline: '2026-05-15',
    languages: ['JavaScript', 'Python'],
    status: 'filled', archived: false,
    postedAt: '2026-03-15',
    applicants: [
      { userId: 3, coverLetter: 'Network engineering background...', status: 'accepted' },
    ],
  },
  {
    id: 3, employerId: 9, company: 'Innova',
    title: 'ML Engineer Intern',
    details: 'Build and deploy machine learning models for fraud detection.',
    skills: ['Python', 'TensorFlow', 'SQL'],
    duration: '4 months', deadline: '2026-07-01',
    languages: ['Python'],
    status: 'hiring', archived: false,
    postedAt: '2026-04-10',
    applicants: [
      { userId: 2, coverLetter: 'My robotics ML work is relevant...', status: 'nominated' },
    ],
  },
]

export const messages = [
  { id: 1, participants: [1, 8], messages: [
    { from: 8, text: 'Hi Ahmed! We loved your portfolio. Are you available for an interview?', time: '10:30 AM' },
    { from: 1, text: 'Thank you! Yes, I would love to discuss the opportunity.', time: '10:45 AM' },
    { from: 8, text: 'Great! How about next Tuesday at 3pm?', time: '10:46 AM' },
  ]},
  { id: 2, participants: [1, 6], messages: [
    { from: 6, text: 'Ahmed, your NLP project is impressive. I recommend submitting to the IEEE conference.', time: 'Yesterday' },
    { from: 1, text: 'Thank you Dr. Mona! I will start preparing the paper.', time: 'Yesterday' },
  ]},
]

export const defaultFavorites = {
  projects: [2, 5],
  portfolios: [2, 3],
}

export const employerDocs = [
  { employerId: 8, docs: ['TechCorp_Tax_Certificate.pdf', 'TechCorp_Commercial_Register.pdf'] },
  { employerId: 9, docs: ['Innova_Tax_Certificate.pdf'] },
]

export const flags = [
  { id: 1, projectId: 3, reason: 'Suspected plagiarism from open source project', flaggedBy: 7, date: '2026-04-15', appeal: 'This is entirely original work. The similar structure is due to standard P2P protocol conventions.', appealDate: '2026-04-16' },
]

export const getUserById = (id) => users.find(u => u.id === id)
export const getProjectById = (id) => projects.find(p => p.id === id)
export const getCourseById = (id) => courses.find(c => c.id === id)
export const getInternshipById = (id) => internships.find(i => i.id === id)
export const getAvatarColors = (avatar) => {
  const map = {
    purple: 'avatar-purple', teal: 'avatar-teal', coral: 'avatar-coral',
    pink: 'avatar-pink', amber: 'avatar-amber', green: 'avatar-green',
  }
  return map[avatar] || 'avatar-purple'
}
export const getInitials = (firstName, lastName) =>
  `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase()
