import type { Resume } from '@/types/resume'

export const sampleResume: Resume = {
  id: 'sample-resume',
  template: 'modern',
  accentColor: '#2563eb',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  personalInfo: {
    fullName: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    phone: '(555) 867-5309',
    location: 'San Francisco, CA',
    website: 'https://alexjohnson.dev',
    linkedin: 'https://linkedin.com/in/alexjohnson',
    github: 'https://github.com/alexjohnson',
    summary:
      'Experienced software engineer with 6+ years building scalable web applications. Passionate about clean code, developer experience, and making technology accessible. Led teams of 3–8 engineers across multiple product launches.',
  },
  experiences: [
    {
      id: 'exp-1',
      jobTitle: 'Senior Software Engineer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      startDate: '2021-03',
      endDate: '',
      currentlyWorking: true,
      description:
        '• Led development of microservices architecture serving 2M+ users daily\n• Reduced API response time by 40% through caching and query optimization\n• Mentored 4 junior engineers and conducted 50+ code reviews per quarter\n• Implemented CI/CD pipeline reducing deployment time from 45 min to 8 min',
    },
    {
      id: 'exp-2',
      jobTitle: 'Software Engineer',
      company: 'StartupXYZ',
      location: 'Remote',
      startDate: '2019-06',
      endDate: '2021-02',
      currentlyWorking: false,
      description:
        '• Built React/Node.js SaaS platform from 0 to $2M ARR in 18 months\n• Designed and implemented real-time collaboration features using WebSockets\n• Owned full-stack development of core product features end-to-end\n• Integrated payment processing with Stripe, handling $500K+ monthly transactions',
    },
    {
      id: 'exp-3',
      jobTitle: 'Junior Developer',
      company: 'Digital Agency Co.',
      location: 'New York, NY',
      startDate: '2018-01',
      endDate: '2019-05',
      currentlyWorking: false,
      description:
        '• Developed responsive websites for 15+ client projects using React and Vue.js\n• Collaborated with design team to implement pixel-perfect UI from Figma mockups\n• Improved site performance scores from 55 to 92 on Google PageSpeed Insights',
    },
  ],
  education: [
    {
      id: 'edu-1',
      school: 'University of California, Berkeley',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      startDate: '2014-09',
      endDate: '2018-05',
      gpa: '3.8',
    },
  ],
  skills: [
    { id: 'skill-1', name: 'TypeScript', level: 'expert' },
    { id: 'skill-2', name: 'React', level: 'expert' },
    { id: 'skill-3', name: 'Node.js', level: 'advanced' },
    { id: 'skill-4', name: 'PostgreSQL', level: 'advanced' },
    { id: 'skill-5', name: 'AWS', level: 'intermediate' },
    { id: 'skill-6', name: 'Docker', level: 'intermediate' },
    { id: 'skill-7', name: 'GraphQL', level: 'intermediate' },
    { id: 'skill-8', name: 'Python', level: 'intermediate' },
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'OpenResume — Open Source Resume Builder',
      description:
        'A free, privacy-first resume builder with 5 templates and real-time PDF preview. Built with Next.js, TypeScript, and Tailwind CSS.',
      link: 'https://github.com/alexjohnson/open-resume',
      technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'jsPDF'],
      startDate: '2023-01',
      endDate: '2023-06',
    },
    {
      id: 'proj-2',
      title: 'Real-Time Chat Application',
      description:
        'End-to-end encrypted chat app with rooms, direct messages, and file sharing. Supports 10K+ concurrent users.',
      link: 'https://github.com/alexjohnson/chat-app',
      technologies: ['React', 'Socket.io', 'Redis', 'PostgreSQL'],
      startDate: '2022-06',
      endDate: '2022-12',
    },
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'AWS Solutions Architect — Associate',
      issuer: 'Amazon Web Services',
      issueDate: '2022-08',
      expirationDate: '2025-08',
      credentialUrl: 'https://aws.amazon.com/certification/',
    },
    {
      id: 'cert-2',
      name: 'Google Professional Cloud Developer',
      issuer: 'Google Cloud',
      issueDate: '2021-11',
      expirationDate: '',
      credentialUrl: '',
    },
  ],
}
