export const demoUsers = [
  {
    id: 'user-priya',
    name: 'Priya Sharma',
    email: 'priya@apniskill.demo',
    password: 'demo12345',
    location: 'Delhi',
    bio: 'Frontend engineer who loves helping beginners get comfortable with React and design systems.',
    availability: 'Weekends',
    rating: 4.9,
    completedSwaps: 18,
    skillsOffered: ['React', 'Tailwind CSS', 'UI Reviews'],
    skillsWanted: ['Python', 'Django', 'Data Analysis'],
    headline: 'Build cleaner interfaces, faster.',
  },
  {
    id: 'user-rahul',
    name: 'Rahul Patel',
    email: 'rahul@apniskill.demo',
    password: 'demo12345',
    location: 'Ahmedabad',
    bio: 'Backend-focused developer interested in mentoring around APIs, Node.js, and deployment basics.',
    availability: 'Evenings',
    rating: 4.8,
    completedSwaps: 14,
    skillsOffered: ['Node.js', 'Express', 'MongoDB'],
    skillsWanted: ['Figma', 'Public Speaking', 'Copywriting'],
    headline: 'API architecture with a practical lens.',
  },
  {
    id: 'user-anita',
    name: 'Anita Gupta',
    email: 'anita@apniskill.demo',
    password: 'demo12345',
    location: 'Lucknow',
    bio: 'Brand and content strategist who can help with social media plans, writing systems, and messaging.',
    availability: 'Flexible',
    rating: 4.7,
    completedSwaps: 10,
    skillsOffered: ['SEO', 'Content Writing', 'Brand Strategy'],
    skillsWanted: ['Illustration', 'Video Editing', 'Motion Design'],
    headline: 'Turn rough ideas into clear storytelling.',
  },
  {
    id: 'user-aiman',
    name: 'Aiman Khan',
    email: 'aiman@apniskill.demo',
    password: 'demo12345',
    location: 'Bhopal',
    bio: 'Data learner who enjoys helping with SQL and Excel dashboards while learning product design.',
    availability: 'Mornings',
    rating: 4.6,
    completedSwaps: 7,
    skillsOffered: ['SQL', 'Excel', 'Dashboards'],
    skillsWanted: ['Product Design', 'Framer', 'User Research'],
    headline: 'Numbers that actually tell a story.',
  },
];

export const defaultCurrentUser = {
  id: 'user-demo',
  name: 'Aarav Mehta',
  email: 'demo@apniskill.demo',
  password: 'demo12345',
  location: 'Jaipur',
  bio: 'Full-stack learner exchanging frontend help for backend and system design guidance.',
  availability: 'After 7 PM',
  rating: 5,
  completedSwaps: 3,
  skillsOffered: ['HTML', 'CSS', 'JavaScript'],
  skillsWanted: ['React', 'Node.js', 'System Design'],
  headline: 'Learning in public, shipping every week.',
};

export const demoMatches = [
  {
    id: 'match-priya',
    userId: 'user-priya',
    status: 'active',
    compatibility: 92,
    note: 'Priya can help you level up your React components.',
  },
  {
    id: 'match-rahul',
    userId: 'user-rahul',
    status: 'requested',
    compatibility: 86,
    note: 'Strong backend exchange potential with Rahul.',
  },
];

export const demoConversations = [
  {
    id: 'chat-priya',
    participantId: 'user-priya',
    messages: [
      {
        id: 'msg-priya-1',
        senderId: 'user-priya',
        text: 'Hi! I saw your profile. Happy to trade React help for backend guidance.',
        createdAt: '2026-03-24T18:20:00.000Z',
      },
      {
        id: 'msg-priya-2',
        senderId: 'user-demo',
        text: 'That sounds perfect. I can help with Node fundamentals and REST API structure.',
        createdAt: '2026-03-24T18:27:00.000Z',
      },
    ],
  },
  {
    id: 'chat-rahul',
    participantId: 'user-rahul',
    messages: [
      {
        id: 'msg-rahul-1',
        senderId: 'user-rahul',
        text: 'Can we schedule a quick session this weekend?',
        createdAt: '2026-03-23T13:15:00.000Z',
      },
    ],
  },
];
