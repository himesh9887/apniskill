import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDirectory = join(__dirname, '..', 'data');
const dataFile = join(dataDirectory, 'store.json');

const defaultStore = {
  users: [
    {
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
    },
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
    }
  ],
  matches: [
    {
      id: 'match-priya',
      requesterId: 'user-demo',
      targetUserId: 'user-priya',
      status: 'active',
      compatibility: 92,
      note: 'Priya can help you level up your React components.',
      createdAt: '2026-03-22T14:00:00.000Z'
    },
    {
      id: 'match-rahul',
      requesterId: 'user-demo',
      targetUserId: 'user-rahul',
      status: 'requested',
      compatibility: 86,
      note: 'Strong backend exchange potential with Rahul.',
      createdAt: '2026-03-23T11:20:00.000Z'
    },
    {
      id: 'match-anita',
      requesterId: 'user-anita',
      targetUserId: 'user-demo',
      status: 'requested',
      compatibility: 89,
      note: 'Anita wants to exchange content strategy help for JavaScript basics.',
      createdAt: '2026-03-25T06:40:00.000Z'
    }
  ],
  conversations: [
    {
      id: 'chat-priya',
      participantIds: ['user-demo', 'user-priya'],
      messages: [
        {
          id: 'msg-priya-1',
          senderId: 'user-priya',
          text: 'Hi! I saw your profile. Happy to trade React help for backend guidance.',
          createdAt: '2026-03-24T18:20:00.000Z'
        },
        {
          id: 'msg-priya-2',
          senderId: 'user-demo',
          text: 'That sounds perfect. I can help with Node fundamentals and REST API structure.',
          createdAt: '2026-03-24T18:27:00.000Z'
        }
      ]
    },
    {
      id: 'chat-rahul',
      participantIds: ['user-demo', 'user-rahul'],
      messages: [
        {
          id: 'msg-rahul-1',
          senderId: 'user-rahul',
          text: 'Can we schedule a quick session this weekend?',
          createdAt: '2026-03-23T13:15:00.000Z'
        }
      ]
    }
  ],
  sessions: []
};

export async function ensureDatabase() {
  await mkdir(dataDirectory, { recursive: true });

  try {
    const raw = await readFile(dataFile, 'utf8');

    if (!raw.trim()) {
      await writeFile(dataFile, JSON.stringify(defaultStore, null, 2));
    }
  } catch (error) {
    await writeFile(dataFile, JSON.stringify(defaultStore, null, 2));
  }
}

export async function readDatabase() {
  await ensureDatabase();
  const raw = await readFile(dataFile, 'utf8');
  return JSON.parse(raw);
}

export async function writeDatabase(data) {
  await ensureDatabase();
  await writeFile(dataFile, JSON.stringify(data, null, 2));
}
