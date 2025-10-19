// Mock data for LinkAndLearnLabs

export const mockLearningPaths = [
  {
    id: '1',
    title: 'PC Building Fundamentals',
    description: 'Learn the essentials of building your first gaming PC from scratch',
    difficulty: 'Beginner',
    duration: '4 weeks',
    modules: 12,
    enrolled: 234
  },
  {
    id: '2',
    title: 'Advanced Overclocking',
    description: 'Master CPU and GPU overclocking for maximum performance',
    difficulty: 'Advanced',
    duration: '6 weeks',
    modules: 18,
    enrolled: 156
  },
  {
    id: '3',
    title: 'Custom Water Cooling',
    description: 'Design and install custom water cooling loops',
    difficulty: 'Intermediate',
    duration: '5 weeks',
    modules: 15,
    enrolled: 189
  },
  {
    id: '4',
    title: 'RGB & Cable Management',
    description: 'Create stunning aesthetics with proper cable management and RGB lighting',
    difficulty: 'Beginner',
    duration: '2 weeks',
    modules: 8,
    enrolled: 412
  }
];

export const mockFeaturedBuilds = [
  {
    id: '1',
    title: 'Ultimate 4K Gaming Beast',
    builder: 'TechMaster42',
    image: 'https://images.pexels.com/photos/7199194/pexels-photo-7199194.jpeg',
    specs: 'RTX 4090 | i9-14900K | 64GB DDR5',
    likes: 342,
    date: '2025-01-15'
  },
  {
    id: '2',
    title: 'Budget Productivity Powerhouse',
    builder: 'PCBuilder101',
    image: 'https://images.pexels.com/photos/6804098/pexels-photo-6804098.jpeg',
    specs: 'RTX 4060 | Ryzen 5 7600 | 32GB DDR5',
    likes: 218,
    date: '2025-01-12'
  },
  {
    id: '3',
    title: 'Compact ITX Workstation',
    builder: 'SmallFormFactor',
    image: 'https://images.unsplash.com/photo-1760114333216-604b60cf6d12',
    specs: 'RTX 4070 | Ryzen 7 7700X | 32GB DDR5',
    likes: 289,
    date: '2025-01-10'
  },
  {
    id: '4',
    title: 'RGB Dream Machine',
    builder: 'RGBKing',
    image: 'https://images.unsplash.com/photo-1722159475039-9ef93a13898b',
    specs: 'RTX 4080 | i7-14700K | 32GB DDR5',
    likes: 445,
    date: '2025-01-08'
  }
];

export const mockEvents = [
  {
    id: '1',
    title: 'Monthly Build Workshop',
    date: '2025-02-15',
    time: '14:00 EST',
    location: 'Online',
    image: 'https://images.pexels.com/photos/3184639/pexels-photo-3184639.jpeg',
    attendees: 45,
    maxAttendees: 50,
    description: 'Join us for a live PC building session where we assemble a complete gaming rig'
  },
  {
    id: '2',
    title: 'Troubleshooting Q&A',
    date: '2025-02-20',
    time: '18:00 EST',
    location: 'Online',
    image: 'https://images.pexels.com/photos/1181622/pexels-photo-1181622.jpeg',
    attendees: 32,
    maxAttendees: 100,
    description: 'Bring your PC problems and get expert advice from our community'
  }
];

export const mockForumTopics = [
  {
    id: '1',
    title: 'Best CPU for 4K Gaming in 2025?',
    author: 'GamingEnthusiast',
    category: 'Hardware Discussion',
    replies: 23,
    views: 456,
    lastActivity: '2 hours ago',
    isPinned: false
  },
  {
    id: '2',
    title: 'My First Build - Need Feedback!',
    author: 'NewBuilder2025',
    category: 'Build Showcase',
    replies: 15,
    views: 234,
    lastActivity: '4 hours ago',
    isPinned: false
  },
  {
    id: '3',
    title: 'PSU Wattage Calculator Guide',
    author: 'TechGuruPro',
    category: 'Guides & Tutorials',
    replies: 45,
    views: 1234,
    lastActivity: '1 day ago',
    isPinned: true
  },
  {
    id: '4',
    title: 'DDR5 vs DDR4 - Worth the Upgrade?',
    author: 'MemoryMaster',
    category: 'Hardware Discussion',
    replies: 67,
    views: 2341,
    lastActivity: '3 hours ago',
    isPinned: false
  },
  {
    id: '5',
    title: 'Weekly PC Part Deals Thread',
    author: 'DealHunter',
    category: 'Deals & Sales',
    replies: 89,
    views: 3456,
    lastActivity: '30 minutes ago',
    isPinned: true
  }
];

export const mockUser = {
  id: 'user123',
  name: 'John Doe',
  email: 'john@example.com',
  picture: 'https://via.placeholder.com/150',
  joined: '2024-06-15',
  buildsShared: 3,
  coursesCompleted: 2
};