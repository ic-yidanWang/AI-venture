
import { Post, UserProfile, Answer } from './types';

export const MOCK_USERS: UserProfile[] = [
  {
    id: 'u1',
    email: 'alumni.cs@ox.ac.uk',
    university: 'University of Oxford',
    status: 'Alumni',
    year: 'Grad 2022',
    major: 'Computer Science',
    focus: ['Full-time jobs', 'Switching fields'],
    domesticStatus: 'International',
    credibilityScore: 850,
    isVerified: true,
    industry: 'Software Engineering',
    careerStage: 'Offer',
    // 第7列：AI Summarization (Narrative Bio)
    aiBio: "I am an Alumni from University of Oxford majoring in Computer Science. I am currently working in Software Engineering and focused on Full-time jobs and Switching fields."
  },
  {
    id: 'u2',
    email: 'student.econ@lse.ac.uk',
    university: 'London School of Economics',
    status: 'Undergrad',
    year: 'Year 3',
    major: 'Economics',
    focus: ['Internships', 'Academic performance'],
    domesticStatus: 'Domestic',
    credibilityScore: 420,
    isVerified: true,
    industry: 'Finance',
    careerStage: 'Applying',
    // 第7列：AI Summarization (Narrative Bio)
    aiBio: "I am an Undergrad student at London School of Economics majoring in Economics. I am currently applying for roles in Finance and focused on Internships and Academic performance."
  },
  {
    id: 'u3',
    email: 'master.eng@imperial.ac.uk',
    university: 'Imperial College London',
    status: 'Master',
    year: 'Year 1',
    major: 'Mechanical Engineering',
    focus: ['Postgrad applications', 'Internships'],
    domesticStatus: 'International',
    credibilityScore: 150,
    isVerified: true,
    careerStage: 'Struggling',
    preferences: {
      likes: ['math-heavy', 'structured'],
      dislikes: ['sales', 'long hours'],
      values: ['stability', 'visa-friendly']
    },
    // 第7列：AI Summarization (Narrative Bio)
    aiBio: "I am a Master student at Imperial College London majoring in Mechanical Engineering. I am focused on Postgrad applications and Internships, and I value stability and visa-friendly opportunities."
  },
  {
    id: 'u4',
    email: 'ug.cs@ucl.ac.uk',
    university: 'University College London',
    status: 'Undergrad',
    year: 'Year 2',
    major: 'Computer Science',
    focus: ['Internships', 'Social & student life'],
    domesticStatus: 'Domestic',
    credibilityScore: 310,
    isVerified: true,
    careerStage: 'Exploring'
  },
  {
    id: 'u5',
    email: 'j.smith@cam.ac.uk',
    university: 'University of Cambridge',
    status: 'PhD',
    year: 'Year 3',
    major: 'Physics',
    focus: ['Academic performance', 'Postgrad applications'],
    domesticStatus: 'Domestic',
    credibilityScore: 920,
    isVerified: true,
    industry: 'Research',
    careerStage: 'Preparing'
  },
  {
    id: 'u6',
    email: 'a.patel@manchester.ac.uk',
    university: 'University of Manchester',
    status: 'Undergrad',
    year: 'Year 1',
    major: 'Medicine',
    focus: ['Social & student life', 'Academic performance'],
    domesticStatus: 'Domestic',
    credibilityScore: 120,
    isVerified: true,
    careerStage: 'Exploring'
  },
  {
    id: 'u7',
    email: 'l.chen@ed.ac.uk',
    university: 'University of Edinburgh',
    status: 'Master',
    year: 'Year 1',
    major: 'Data Science',
    focus: ['Internships', 'Full-time jobs'],
    domesticStatus: 'International',
    credibilityScore: 450,
    isVerified: true,
    industry: 'Technology',
    careerStage: 'Applying'
  },
  {
    id: 'u8',
    email: 's.jones@warwick.ac.uk',
    university: 'University of Warwick',
    status: 'Undergrad',
    year: 'Year 2',
    major: 'Mathematics',
    focus: ['Internships', 'Academic performance'],
    domesticStatus: 'Domestic',
    credibilityScore: 380,
    isVerified: true,
    careerStage: 'Preparing'
  },
  {
    id: 'u9',
    email: 'm.wilson@bristol.ac.uk',
    university: 'University of Bristol',
    status: 'Alumni',
    year: 'Grad 2023',
    major: 'Law',
    focus: ['Full-time jobs'],
    domesticStatus: 'Domestic',
    credibilityScore: 670,
    isVerified: true,
    industry: 'Legal',
    careerStage: 'Offer'
  },
  {
    id: 'u10',
    email: 'k.tanaka@kcl.ac.uk',
    university: "King's College London",
    status: 'Master',
    year: 'Year 1',
    major: 'International Relations',
    focus: ['Postgrad applications', 'Social & student life'],
    domesticStatus: 'International',
    credibilityScore: 290,
    isVerified: true,
    careerStage: 'Exploring'
  },
  {
    id: 'u11',
    email: 'r.garcia@glasgow.ac.uk',
    university: 'University of Glasgow',
    status: 'Undergrad',
    year: 'Year 3',
    major: 'Psychology',
    focus: ['Internships', 'Academic performance'],
    domesticStatus: 'International',
    credibilityScore: 410,
    isVerified: true,
    careerStage: 'Applying'
  },
  {
    id: 'u12',
    email: 'h.lee@sheffield.ac.uk',
    university: 'University of Sheffield',
    status: 'PhD',
    year: 'Year 2',
    major: 'Architecture',
    focus: ['Academic performance', 'Switching fields'],
    domesticStatus: 'International',
    credibilityScore: 530,
    isVerified: true,
    careerStage: 'Preparing'
  },
  {
    id: 'u13',
    email: 'e.brown@southampton.ac.uk',
    university: 'University of Southampton',
    status: 'Undergrad',
    year: 'Year 2',
    major: 'Electrical Engineering',
    focus: ['Internships', 'Social & student life'],
    domesticStatus: 'Domestic',
    credibilityScore: 250,
    isVerified: true,
    careerStage: 'Exploring'
  },
  {
    id: 'u14',
    email: 't.nguyen@bham.ac.uk',
    university: 'University of Birmingham',
    status: 'Master',
    year: 'Year 1',
    major: 'Business Administration',
    focus: ['Full-time jobs', 'Internships'],
    domesticStatus: 'International',
    credibilityScore: 340,
    isVerified: true,
    industry: 'Consulting',
    careerStage: 'Applying'
  },
  {
    id: 'u15',
    email: 'o.davies@leeds.ac.uk',
    university: 'University of Leeds',
    status: 'Undergrad',
    year: 'Year 1',
    major: 'English Literature',
    focus: ['Social & student life', 'Academic performance'],
    domesticStatus: 'Domestic',
    credibilityScore: 180,
    isVerified: true,
    careerStage: 'Exploring'
  },
  {
    id: 'u16',
    email: 'y.wang@nottingham.ac.uk',
    university: 'University of Nottingham',
    status: 'Alumni',
    year: 'Grad 2021',
    major: 'Pharmacy',
    focus: ['Full-time jobs'],
    domesticStatus: 'International',
    credibilityScore: 780,
    isVerified: true,
    industry: 'Healthcare',
    careerStage: 'Offer'
  },
  {
    id: 'u17',
    email: 'f.murphy@st-andrews.ac.uk',
    university: 'University of St Andrews',
    status: 'Undergrad',
    year: 'Year 4+',
    major: 'History',
    focus: ['Postgrad applications', 'Academic performance'],
    domesticStatus: 'Domestic',
    credibilityScore: 490,
    isVerified: true,
    careerStage: 'Preparing'
  },
  {
    id: 'u18',
    email: 'g.white@durham.ac.uk',
    university: 'Durham University',
    status: 'Undergrad',
    year: 'Year 2',
    major: 'Geography',
    focus: ['Internships', 'Social & student life'],
    domesticStatus: 'Domestic',
    credibilityScore: 320,
    isVerified: true,
    careerStage: 'Exploring'
  },
  {
    id: 'u19',
    email: 'i.rossi@exeter.ac.uk',
    university: 'University of Exeter',
    status: 'Master',
    year: 'Year 1',
    major: 'Finance and Investment',
    focus: ['Full-time jobs', 'Internships'],
    domesticStatus: 'International',
    credibilityScore: 360,
    isVerified: true,
    industry: 'Finance',
    careerStage: 'Interviewing'
  },
  {
    id: 'u20',
    email: 'j.taylor@york.ac.uk',
    university: 'University of York',
    status: 'Undergrad',
    year: 'Year 3',
    major: 'Biology',
    focus: ['Academic performance', 'Internships'],
    domesticStatus: 'Domestic',
    credibilityScore: 440,
    isVerified: true,
    careerStage: 'Applying'
  },
  {
    id: 'u21',
    email: 's.khan@imperial.ac.uk',
    university: 'Imperial College London',
    status: 'PhD',
    year: 'Year 4+',
    major: 'Bioengineering',
    focus: ['Full-time jobs', 'Academic performance'],
    domesticStatus: 'International',
    credibilityScore: 880,
    isVerified: true,
    industry: 'Biotech',
    careerStage: 'Offer'
  },
  {
    id: 'u22',
    email: 'p.smith@ox.ac.uk',
    university: 'University of Oxford',
    status: 'Undergrad',
    year: 'Year 2',
    major: 'Philosophy, Politics and Economics',
    focus: ['Internships', 'Academic performance'],
    domesticStatus: 'Domestic',
    credibilityScore: 510,
    isVerified: true,
    careerStage: 'Preparing'
  },
  {
    id: 'u23',
    email: 'q.zhou@ucl.ac.uk',
    university: 'University College London',
    status: 'Master',
    year: 'Year 1',
    major: 'Digital Media',
    focus: ['Social & student life', 'Internships'],
    domesticStatus: 'International',
    credibilityScore: 270,
    isVerified: true,
    careerStage: 'Exploring'
  },
  {
    id: 'u24',
    email: 'v.kumar@lse.ac.uk',
    university: 'London School of Economics',
    status: 'Alumni',
    year: 'Grad 2023',
    major: 'Accounting and Finance',
    focus: ['Full-time jobs'],
    domesticStatus: 'International',
    credibilityScore: 720,
    isVerified: true,
    industry: 'Accounting',
    careerStage: 'Offer'
  }
];

export const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    title: 'How to handle JP Morgan HireVue for summer internship?',
    content: 'Just received the invite. I am super nervous. Any tips on the behavior questions? Especially the one about "tell me a time you failed"?',
    category: 'Career',
    tags: ['Finance', 'Interview', 'Internship'],
    authorId: 'u2',
    authorBadge: 'LSE • Economics • Year 3',
    createdAt: '2h ago',
    repliesCount: 12
  },
  {
    id: 'p2',
    title: 'Is CS still worth it in 2024? Feeling discouraged.',
    content: 'Seeing all these layoffs and the hiring freeze at big tech. I am in Year 2 and wondering if I should pivot to something else like Quant or Data Science.',
    category: 'Career',
    tags: ['CS', 'Market', 'Advice'],
    authorId: 'u4',
    authorBadge: 'UCL • CS • Year 2',
    createdAt: '5h ago',
    repliesCount: 45
  },
  {
    id: 'p3',
    title: 'Best library for silent study during finals week?',
    content: 'Main library is always packed. Any hidden gems on campus that are quiet and have good WiFi?',
    category: 'School Life',
    tags: ['Campus', 'Study', 'Productivity'],
    authorId: 'u3',
    authorBadge: 'Imperial • ME • Master',
    createdAt: '1d ago',
    repliesCount: 8
  }
];

export const MOCK_ANSWERS: Answer[] = [
  {
    id: 'a1',
    postId: 'p1',
    authorId: 'u1',
    authorBadge: 'Oxford • CS • Alumni @ Google',
    content: 'Focus on the STAR method. For the failure question, make sure the "Action" and "Result" parts emphasize what you learned and how you changed your approach later. They want to see growth mindset.',
    upvotes: 24,
    isActionable: true
  },
  {
    id: 'a2',
    postId: 'p1',
    authorId: 'u3',
    authorBadge: 'Imperial • ME • Master',
    content: 'Make sure you dress professionally and look at the camera, not the screen. Practice with a timer!',
    upvotes: 15,
    isActionable: true
  },
  {
    id: 'a3',
    postId: 'p1',
    authorId: 'u4',
    authorBadge: 'UCL • CS • Year 2',
    content: 'Check Glassdoor, most of the questions for JPM are leaked there already.',
    upvotes: 10,
    isActionable: true
  }
];

// Initialize aiBio for all mock users to simulate the 7th column database template
MOCK_USERS.forEach(u => {
  if (!u.aiBio) {
    u.aiBio = `I am a ${u.status} student at ${u.university || 'my university'} majoring in ${u.major}. I am focused on ${u.focus.join(' and ')}.`;
  }
});
