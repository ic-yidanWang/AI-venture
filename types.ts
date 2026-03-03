
export type UserStatus = 'Undergrad' | 'Master' | 'PhD' | 'Alumni' | 'Other';
export type DomesticStatus = 'Domestic' | 'International';
export type CareerStage = 'Exploring' | 'Preparing' | 'Applying' | 'Interviewing' | 'Offer' | 'Struggling';
export type Mode = 'Career' | 'School Life';

export interface CareerPreferences {
  likes: string[];
  dislikes: string[];
  values: string[];
}

export interface UserProfile {
  id: string;
  email?: string;
  university?: string;
  status: UserStatus;
  year: string;
  major: string;
  focus: string[];
  domesticStatus: DomesticStatus;
  credibilityScore: number;
  isVerified: boolean;
  industry?: string;
  preferences?: CareerPreferences;
  careerStage?: CareerStage;
  aiBio?: string;
  internshipExperience?: string;
  campusExperience?: string;
  researchExperience?: string;
}

export interface Answer {
  id: string;
  postId: string;
  authorId: string;
  authorBadge: string;
  content: string;
  upvotes: number;
  isActionable?: boolean;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  category: Mode;
  tags: string[];
  authorId: string;
  authorBadge: string;
  createdAt: string;
  repliesCount: number;
}

export interface MatchResult {
  user: UserProfile;
  score: number;
  reasons: string[];
}
