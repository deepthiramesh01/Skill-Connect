
export enum UserRole {
  Student = 'Student',
  TeachingFaculty = 'Teaching Faculty',
  NonTeachingFaculty = 'Non-Teaching Faculty',
  Administrator = 'Administrator'
}

export enum Pronouns {
  HeHim = 'He/Him',
  SheHer = 'She/Her',
  TheyThem = 'They/Them',
  Custom = 'Custom'
}

export enum ProjectStatus {
    Upcoming = 'Upcoming',
    LookingForCollaborators = 'Looking for Collaborators',
    InProgress = 'In Progress',
    Completed = 'Completed'
}

export interface SocialLinks {
  [key: string]: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  profilePic?: string;
  bio?: string;
  pronouns?: Pronouns;
  contactNumber?: string;
  socials?: SocialLinks;
  skills: string[];
  isProfileComplete: boolean;
  isBanned: boolean;
  createdAt: string;
}

export interface Skill {
  id: string;
  name: string;
  isApproved: boolean;
  suggestedBy?: string; // userId
}

export interface Project {
  id: string;
  title: string;
  description: string;
  ownerId: string;
  requiredSkills: string[];
  attachments?: { name: string; url: string }[];
  status: ProjectStatus;
  team: string[]; // array of userIds
  createdAt: string;
  startDate?: string;
  endDate?: string;
  isFeatured: boolean;
}

export interface Rating {
  id: string;
  projectId: string;
  ratedUserId: string;
  raterUserId: string;
  stars: number; // 1-5
  review?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface Report {
  id: string;
  reportedBy: string; // userId
  reportedContentId: string; // userId or projectId
  reportedContentType: 'user' | 'project';
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
}

export interface CollaborationRequest {
  id: string;
  projectId: string;
  requesterId: string; // userId
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string; // The user to be notified
  type: 'COLLABORATION_REQUEST' | 'REQUEST_ACCEPTED' | 'REQUEST_REJECTED' | 'REMOVED_FROM_TEAM';
  message: string;
  relatedRequestId?: string; // CollaborationRequest ID
  link?: { page: Page; params: Record<string, any> };
  isRead: boolean;
  createdAt: string;
}

export type Page = 
  | 'home' | 'login' | 'signup' | 'about' | 'terms' | 'privacy' | 'contact'
  | 'dashboard' | 'profileSetup' | 'profile' | 'skillSearch' | 'projectSearch' | 'projectCreate' | 'projectDetail' | 'notifications'
  | 'adminDashboard' | 'adminUsers' | 'adminSkills' | 'adminProjects' | 'adminReports' | 'adminAnnouncements' | 'adminSettings';

export interface Navigation {
    navigate: (page: Page, params?: Record<string, any>) => void;
}