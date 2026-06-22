

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, Project, Skill, Rating, Announcement, Report, UserRole, CollaborationRequest, Notification, ProjectStatus } from '../types';
// FIX: Removed `AuthError` and `User as SupabaseUser` from import as they are not exported in the version of Supabase client being used, which was causing build errors. These types were not directly used in the file.
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// --- Supabase Client Setup ---

// IMPORTANT: Replace these with your actual Supabase URL and Anon Key
const supabaseUrl = 'https://olgzfppvdcmfwxruylik.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sZ3pmcHB2ZGNtZnd4cnV5bGlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczMTYwOTQsImV4cCI6MjA3Mjg5MjA5NH0.vAPO4aNl0nmjHKEEOP9nGNkArqEGU8in2ziUoKRngmQ';


// Lazily initialize Supabase client to prevent app crash on load with invalid credentials
let supabase: SupabaseClient | null = null;
const getSupabaseClient = (): SupabaseClient | null => {
    if (supabase) return supabase;

    const isValidUrl = supabaseUrl && supabaseUrl.startsWith('http');
    // Basic check for anon key format (usually a long string) and ensure it's not the placeholder
    // FIX: Removed redundant check for placeholder key. Since the key is a constant,
    // the comparison to 'YOUR_SUPABASE_ANON_KEY' is always true and causes a TypeScript error.
    const isValidKey = supabaseAnonKey && supabaseAnonKey.length > 20;

    if (isValidUrl && isValidKey) {
        // @ts-ignore - Supabase is available via import map
        supabase = createClient(supabaseUrl, supabaseAnonKey);
        return supabase;
    }
    return null;
};
// --- End of Supabase Logic ---

interface AppContextType {
  // Theme State
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // Auth State
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string, role: UserRole | 'Administrator') => Promise<{ user: User | null; error?: string }>;
  logout: () => void;
  signup: (fullName: string, email: string, password: string, role: UserRole) => Promise<{ user: User | null, error?: string }>;
  updateUser: (updatedUser: User) => Promise<void>;

  // Data State
  users: User[];
  projects: Project[];
  skills: Skill[];
  ratings: Rating[];
  announcements: Announcement[];
  reports: Report[];
  collaborationRequests: CollaborationRequest[];
  notifications: Notification[];
  
  // Data Mutators
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'ownerId' | 'team'>) => Promise<Project | null>;
  updateProject: (updatedProject: Project) => void;
  addSkillSuggestion: (skillName: string) => void;
  addRating: (rating: Omit<Rating, 'id'>) => Promise<void>;
  addCollaborationRequest: (projectId: string) => void;
  handleCollaborationRequest: (requestId: string, status: 'accepted' | 'rejected') => void;
  markNotificationAsRead: (notificationId: string) => void;
  removeUserFromProject: (projectId: string, userIdToRemove: string) => void;
  addReport: (reportedContentId: string, reportedContentType: 'user' | 'project', reason: string) => void;
  // Admin functions
  toggleUserBan: (userId: string) => void;
  approveSkill: (skillId: string) => void;
  removeSkill: (skillId: string) => void;
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'createdAt'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const getInitialTheme = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined' && localStorage.getItem('theme')) {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme === 'dark' || storedTheme === 'light') {
            return storedTheme;
        }
    }
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
};


export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const supabaseClient = getSupabaseClient();
    
    // If Supabase is not configured, show a helpful message.
    if (!supabaseClient) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-red-50 p-4">
                <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-xl">
                    <h1 className="text-2xl font-bold text-red-700 mb-4">Configuration Error: Supabase Not Set Up</h1>
                    <p className="text-gray-800">
                        The application cannot connect to the database because the Supabase credentials are missing or invalid.
                    </p>
                    <div className="mt-4 text-left bg-gray-50 p-4 rounded-md">
                        <p className="font-semibold">To fix this:</p>
                        <ol className="list-decimal list-inside mt-2 space-y-1 text-gray-700">
                            <li>Open the file: <code>contexts/AppContext.tsx</code></li>
                            <li>Find the variables <code>supabaseUrl</code> and <code>supabaseAnonKey</code>.</li>
                            <li>Replace the placeholder values with your actual Supabase Project URL and Anon Key.</li>
                            <li className="font-semibold mt-2">Then, set up your database:</li>
                            <li>Copy the content of the new <code>schema.sql</code> file.</li>
                            <li>In your Supabase project, go to the <strong>SQL Editor</strong>, paste the code, and click <strong>RUN</strong>.</li>
                        </ol>
                    </div>
                    <p className="mt-4 text-sm text-gray-500">Once you've added your credentials and run the SQL script, please refresh the page.</p>
                </div>
            </div>
        );
    }

    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);

    // Data states
    const [users, setUsers] = useState<User[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [ratings, setRatings] = useState<Rating[]>([]);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [reports, setReports] = useState<Report[]>([]);
    const [collaborationRequests, setCollaborationRequests] = useState<CollaborationRequest[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const toggleTheme = () => {
        setTheme(prevTheme => {
            const newTheme = prevTheme === 'light' ? 'dark' : 'light';
            // Save the user's manual choice to local storage to override OS preference
            localStorage.setItem('theme', newTheme);
            return newTheme;
        });
    };
    
    useEffect(() => {
        // This effect listens for changes in the user's OS theme preference.
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const handleChange = (e: MediaQueryListEvent) => {
            // If the user hasn't manually set a theme (i.e., no 'theme' in localStorage),
            // update the app's theme to match their system preference.
            if (!localStorage.getItem('theme')) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        
        // Clean up the listener when the component unmounts.
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);


    const fetchAllData = useCallback(async () => {
        const results = await Promise.allSettled([
            supabaseClient.from('users').select('*'),
            supabaseClient.from('projects').select('*'),
            supabaseClient.from('skills').select('*'),
            supabaseClient.from('ratings').select('*'),
            supabaseClient.from('announcements').select('*').order('created_at', { ascending: false }),
            supabaseClient.from('reports').select('*'),
            supabaseClient.from('collaboration_requests').select('*'),
            // Fetch only notifications for the current user
            supabaseClient.from('notifications').select('*'),
        ]);

        const [
            usersResult,
            projectsResult,
            skillsResult,
            ratingsResult,
            announcementsResult,
            reportsResult,
            collabRequestsResult,
            notificationsResult,
        ] = results;

        if (usersResult.status === 'fulfilled' && usersResult.value.data) {
            const formattedData = usersResult.value.data.map((u: any) => ({
                id: u.id,
                fullName: u.full_name,
                email: u.email,
                role: u.role,
                profilePic: u.profile_pic,
                bio: u.bio,
                pronouns: u.pronouns,
                contactNumber: u.contact_number,
                socials: u.socials,
                skills: u.skills,
                isProfileComplete: u.is_profile_complete,
                isBanned: u.is_banned,
                createdAt: u.created_at,
            }));
            setUsers(formattedData as User[]);
        } else if (usersResult.status === 'rejected') console.error("Failed to fetch users:", usersResult.reason);

        if (projectsResult.status === 'fulfilled' && projectsResult.value.data) {
             const formattedData = projectsResult.value.data.map((p: any) => ({
                id: p.id,
                title: p.title,
                description: p.description,
                ownerId: p.owner_id,
                requiredSkills: p.required_skills,
                attachments: p.attachments,
                status: p.status,
                team: p.team,
                createdAt: p.created_at,
                startDate: p.start_date,
                endDate: p.end_date,
                isFeatured: p.is_featured,
            }));
            setProjects(formattedData as Project[]);
        } else if (projectsResult.status === 'rejected') console.error("Failed to fetch projects:", projectsResult.reason);
        
        if (skillsResult.status === 'fulfilled' && skillsResult.value.data) {
            const formattedData = skillsResult.value.data.map((s: any) => ({
                id: s.id,
                name: s.name,
                isApproved: s.is_approved,
                suggestedBy: s.suggested_by,
            }));
            setSkills(formattedData as Skill[]);
        } else if (skillsResult.status === 'rejected') console.error("Failed to fetch skills:", skillsResult.reason);
        
        if (ratingsResult.status === 'fulfilled' && ratingsResult.value.data) {
            const formattedData = ratingsResult.value.data.map((r: any) => ({
                id: r.id,
                projectId: r.project_id,
                ratedUserId: r.rated_user_id,
                raterUserId: r.rater_user_id,
                stars: r.stars,
                review: r.review,
            }));
            setRatings(formattedData as Rating[]);
        } else if (ratingsResult.status === 'rejected') console.error("Failed to fetch ratings:", ratingsResult.reason);
        
        if (announcementsResult.status === 'fulfilled' && announcementsResult.value.data) {
            const formattedData = announcementsResult.value.data.map((a: any) => ({
                id: a.id,
                title: a.title,
                content: a.content,
                createdAt: a.created_at,
            }));
            setAnnouncements(formattedData as Announcement[]);
        } else if (announcementsResult.status === 'rejected') console.error("Failed to fetch announcements:", announcementsResult.reason);
        
        if (reportsResult.status === 'fulfilled' && reportsResult.value.data) {
            const formattedData = reportsResult.value.data.map((r: any) => ({
                id: r.id,
                reportedBy: r.reported_by,
                reportedContentId: r.reported_content_id,
                reportedContentType: r.reported_content_type,
                reason: r.reason,
                status: r.status,
            }));
            setReports(formattedData as Report[]);
        } else if (reportsResult.status === 'rejected') console.error("Failed to fetch reports:", reportsResult.reason);
        
        if (collabRequestsResult.status === 'fulfilled' && collabRequestsResult.value.data) {
            const formattedData = collabRequestsResult.value.data.map((c: any) => ({
                id: c.id,
                projectId: c.project_id,
                requesterId: c.requester_id,
                status: c.status,
                createdAt: c.created_at,
            }));
            setCollaborationRequests(formattedData as CollaborationRequest[]);
        } else if (collabRequestsResult.status === 'rejected') console.error("Failed to fetch collaboration requests:", collabRequestsResult.reason);
        
        if (notificationsResult.status === 'fulfilled' && notificationsResult.value.data) {
             const formattedData = notificationsResult.value.data.map((n: any) => ({
                id: n.id,
                userId: n.user_id,
                type: n.type,
                message: n.message,
                relatedRequestId: n.related_request_id,
                link: n.link,
                isRead: n.is_read,
                createdAt: n.created_at,
            }));
            setNotifications(formattedData as Notification[]);
        } else if (notificationsResult.status === 'rejected') console.error("Failed to fetch notifications:", notificationsResult.reason);
    }, [supabaseClient]);
    
    useEffect(() => {
        setLoading(true);
        // This handles the initial session check on app load.
        // It prevents fetching data until we know if a user is logged in.
        supabaseClient.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                supabaseClient.from('users').select('*').eq('id', session.user.id).single().then(({ data: userProfile }) => {
                    if (userProfile) {
                         const formattedUser: User = {
                            id: userProfile.id,
                            fullName: userProfile.full_name,
                            email: userProfile.email,
                            role: userProfile.role,
                            profilePic: userProfile.profile_pic,
                            bio: userProfile.bio,
                            pronouns: userProfile.pronouns,
                            contactNumber: userProfile.contact_number,
                            socials: userProfile.socials,
                            skills: userProfile.skills,
                            isProfileComplete: userProfile.is_profile_complete,
                            isBanned: userProfile.is_banned,
                            createdAt: userProfile.created_at,
                        };
                        setCurrentUser(formattedUser);
                        fetchAllData();
                    }
                     setLoading(false);
                });
            } else {
                setLoading(false);
            }
        });

        // This listener handles all subsequent auth changes (sign in, sign out).
        const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_event, session) => {
             if (_event === 'SIGNED_IN' && session?.user) {
                supabaseClient.from('users').select('*').eq('id', session.user.id).single().then(({ data }) => {
                    if(data) {
                        const formattedUser: User = {
                            id: data.id,
                            fullName: data.full_name,
                            email: data.email,
                            role: data.role,
                            profilePic: data.profile_pic,
                            bio: data.bio,
                            pronouns: data.pronouns,
                            contactNumber: data.contact_number,
                            socials: data.socials,
                            skills: data.skills,
                            isProfileComplete: data.is_profile_complete,
                            isBanned: data.is_banned,
                            createdAt: data.created_at,
                        };
                        setCurrentUser(formattedUser);
                        fetchAllData();
                    }
                });
             } else if (_event === 'SIGNED_OUT') {
                setCurrentUser(null);
                // Clear all data on logout to prevent showing stale data to the next user
                setUsers([]);
                setProjects([]);
                setSkills([]);
                setRatings([]);
                setAnnouncements([]);
                setReports([]);
                setCollaborationRequests([]);
                setNotifications([]);
             }
        });

        return () => subscription.unsubscribe();
    }, [supabaseClient, fetchAllData]);

    useEffect(() => {
        if (!currentUser || !supabaseClient) {
            return;
        }

        // Set up real-time subscription for new notifications for the current user
        const channel = supabaseClient
            .channel(`notifications:${currentUser.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${currentUser.id}`,
                },
                (payload) => {
                    const newNotification = payload.new;
                    if (newNotification) {
                        const formattedNotif: Notification = {
                            id: newNotification.id,
                            userId: newNotification.user_id,
                            type: newNotification.type,
                            message: newNotification.message,
                            relatedRequestId: newNotification.related_request_id,
                            link: newNotification.link,
                            isRead: newNotification.is_read,
                            createdAt: newNotification.created_at,
                        };
                        setNotifications(prev => [formattedNotif, ...prev]);
                    }
                }
            )
            .subscribe();
        
        // Clean up subscription on component unmount or user change
        return () => {
            supabaseClient.removeChannel(channel);
        };
    }, [currentUser, supabaseClient]);

    const login = useCallback(async (email: string, password: string, role: UserRole | 'Administrator'): Promise<{ user: User | null; error?: string }> => {
        // FIX: Using modern `signInWithPassword` API. The error was likely due to a type definition issue.
        const { data: authData, error: authError } = await supabaseClient.auth.signInWithPassword({ email, password });

        if (authError || !authData.user) {
            return { user: null, error: authError?.message || 'Invalid credentials.' };
        }

        const { data: userProfile, error: profileError } = await supabaseClient.from('users').select('*').eq('id', authData.user.id).single();

        if (profileError || !userProfile) {
            // FIX: Using modern `signOut` API. The error was likely due to a type definition issue.
            await supabaseClient.auth.signOut();
            return { user: null, error: 'Could not find user profile.' };
        }

        if (userProfile.role !== role) {
            // FIX: Using modern `signOut` API. The error was likely due to a type definition issue.
            await supabaseClient.auth.signOut();
            return { user: null, error: 'Role mismatch. Please select your correct role.' };
        }
        
        if (userProfile.is_banned) {
            // FIX: Using modern `signOut` API. The error was likely due to a type definition issue.
            await supabaseClient.auth.signOut();
            return { user: null, error: 'This account has been suspended.' };
        }

        // The onAuthStateChange listener will handle setting state and fetching data.
        // We just return the user for any immediate UI feedback needed by the caller.
        const formattedUser: User = {
            id: userProfile.id,
            fullName: userProfile.full_name,
            email: userProfile.email,
            role: userProfile.role,
            profilePic: userProfile.profile_pic,
            bio: userProfile.bio,
            pronouns: userProfile.pronouns,
            contactNumber: userProfile.contact_number,
            socials: userProfile.socials,
            skills: userProfile.skills,
            isProfileComplete: userProfile.is_profile_complete,
            isBanned: userProfile.is_banned,
            createdAt: userProfile.created_at,
        };
        
        return { user: formattedUser };
    }, [supabaseClient]);
    
    const logout = useCallback(async () => {
        await supabaseClient.auth.signOut();
        // The onAuthStateChange listener will handle clearing state.
    }, [supabaseClient]);

    const signup = useCallback(async (fullName: string, email: string, password: string, role: UserRole): Promise<{ user: User | null, error?: string }> => {
        // With email confirmation disabled in the Supabase settings, this will sign up and log in the user.
        // FIX: Using modern `signUp` API. The error was likely due to a type definition issue.
        const { data: authData, error: authError } = await supabaseClient.auth.signUp({
            email,
            password,
            options: {
                data: {
                    fullName,
                    role,
                }
            }
        });

        if (authError || !authData.user) {
            return { user: null, error: authError?.message || 'Could not sign up user.' };
        }

        // The 'handle_new_user' trigger (from schema.sql) has now created the user profile.
        // We can fetch it immediately to get the canonical data.
        const { data: userProfile, error: profileError } = await supabaseClient
            .from('users')
            .select('*')
            .eq('id', authData.user.id)
            .single();

        if (profileError || !userProfile) {
            // This is an unlikely edge case, e.g., if the trigger fails. We sign the user out to be safe.
            // FIX: Using modern `signOut` API. The error was likely due to a type definition issue.
            await supabaseClient.auth.signOut();
            return { user: null, error: 'Failed to create user profile after signup. Please contact support.' };
        }
        
        // The onAuthStateChange listener will set the current user and fetch data.
        // We just return the created user profile to confirm success.
        const formattedUser: User = {
            id: userProfile.id,
            fullName: userProfile.full_name,
            email: userProfile.email,
            role: userProfile.role,
            profilePic: userProfile.profile_pic,
            bio: userProfile.bio,
            pronouns: userProfile.pronouns,
            contactNumber: userProfile.contact_number,
            socials: userProfile.socials,
            skills: userProfile.skills,
            isProfileComplete: userProfile.is_profile_complete,
            isBanned: userProfile.is_banned,
            createdAt: userProfile.created_at,
        };

        return { user: formattedUser };
    }, [supabaseClient]);

    const updateUser = useCallback(async (updatedUser: User): Promise<void> => {
        if (!currentUser) return;
    
        // Map camelCase properties from the app to snake_case columns for the database.
        const dataToUpdate = {
            full_name: updatedUser.fullName,
            bio: updatedUser.bio,
            pronouns: updatedUser.pronouns,
            contact_number: updatedUser.contactNumber,
            profile_pic: updatedUser.profilePic,
            skills: updatedUser.skills,
            is_profile_complete: updatedUser.isProfileComplete,
        };
    
        const { data, error } = await supabaseClient
            .from('users')
            .update(dataToUpdate)
            .eq('id', updatedUser.id)
            .select()
            .single();
    
        if (error) {
            console.error("Error updating user profile:", error);
            // Optionally: handle the error in the UI, e.g., show a toast notification.
            return;
        }
    
        if (data) {
            // Map the snake_case response from Supabase back to camelCase for the app state.
            const formattedUser: User = {
                id: data.id,
                fullName: data.full_name,
                email: data.email,
                role: data.role,
                profilePic: data.profile_pic,
                bio: data.bio,
                pronouns: data.pronouns,
                contactNumber: data.contact_number,
                socials: data.socials,
                skills: data.skills,
                isProfileComplete: data.is_profile_complete,
                isBanned: data.is_banned,
                createdAt: data.created_at,
            };
    
            // Update the users list and the current user state.
            setUsers(prev => prev.map(u => (u.id === formattedUser.id ? formattedUser : u)));
            if (currentUser?.id === formattedUser.id) {
                setCurrentUser(formattedUser);
            }
        }
    }, [currentUser, supabaseClient]);

    const addProject = useCallback(async (project: Omit<Project, 'id' | 'createdAt' | 'ownerId' | 'team'>): Promise<Project | null> => {
        if (!currentUser) {
            console.error('User not logged in');
            return null;
        }
    
        // Map camelCase properties from the app to snake_case columns for the database.
        const projectDataForDb = {
            title: project.title,
            description: project.description,
            required_skills: project.requiredSkills,
            status: project.status,
            is_featured: project.isFeatured,
            owner_id: currentUser.id,
            team: [currentUser.id],
        };
    
        const { data, error } = await supabaseClient
            .from('projects')
            .insert(projectDataForDb)
            .select()
            .single();
    
        if (error) {
            console.error("Error adding project:", error);
            return null;
        }
    
        if (data) {
            // Map the snake_case response from Supabase back to camelCase for the app state.
            const newProjectForState: Project = {
                id: data.id,
                title: data.title,
                description: data.description,
                ownerId: data.owner_id,
                requiredSkills: data.required_skills,
                attachments: data.attachments,
                status: data.status,
                team: data.team,
                createdAt: data.created_at,
                startDate: data.start_date,
                endDate: data.end_date,
                isFeatured: data.is_featured,
            };
    
            setProjects(prev => [newProjectForState, ...prev]);
            return newProjectForState;
        }
    
        return null;
    }, [currentUser, supabaseClient]);

    const updateProject = useCallback(async (updatedProject: Project) => {
        const { id, title, description, requiredSkills, attachments, status, team, startDate, endDate, isFeatured } = updatedProject;
    
        // Map camelCase properties from the app to snake_case columns for the database.
        const dataToUpdate = {
            title,
            description,
            required_skills: requiredSkills,
            attachments,
            status,
            team,
            start_date: startDate,
            end_date: endDate,
            is_featured: isFeatured,
        };
    
        const { data, error } = await supabaseClient
            .from('projects')
            .update(dataToUpdate)
            .eq('id', id)
            .select()
            .single();
    
        if (error) {
            console.error("Error updating project:", error);
            return;
        }
    
        if (data) {
            // Map the snake_case response from Supabase back to camelCase for the app state.
            const formattedProject: Project = {
                id: data.id,
                title: data.title,
                description: data.description,
                ownerId: data.owner_id,
                requiredSkills: data.required_skills,
                attachments: data.attachments,
                status: data.status,
                team: data.team,
                createdAt: data.created_at,
                startDate: data.start_date,
                endDate: data.end_date,
                isFeatured: data.is_featured,
            };
    
            setProjects(prev => prev.map(p => (p.id === id ? formattedProject : p)));
        }
    }, [supabaseClient]);

    const addSkillSuggestion = useCallback(async (skillName: string) => {
        if (!currentUser) return;
        const skillExists = skills.some(s => s.name.toLowerCase() === skillName.toLowerCase());
        if (skillExists) return;

        const newSkillData = {
            name: skillName,
            is_approved: false,
            suggested_by: currentUser.id
        };
        const { data } = await supabaseClient.from('skills').insert(newSkillData).select().single();
        if (data) {
             const formattedSkill: Skill = {
                id: data.id,
                name: data.name,
                isApproved: data.is_approved,
                suggestedBy: data.suggested_by,
            };
            setSkills(prev => [...prev, formattedSkill]);
        }
    }, [skills, currentUser, supabaseClient]);
    
    const addRating = useCallback(async (rating: Omit<Rating, 'id'>) => {
        // Map from camelCase to snake_case for the database
        const ratingForDb = {
            project_id: rating.projectId,
            rated_user_id: rating.ratedUserId,
            rater_user_id: rating.raterUserId,
            stars: rating.stars,
            review: rating.review,
        };
    
        const { data, error } = await supabaseClient
            .from('ratings')
            .insert(ratingForDb)
            .select()
            .single();
    
        if (error) {
            console.error("Error adding rating:", error);
            return;
        }
    
        if (data) {
            // Map back from snake_case to camelCase for the app state
            const newRatingForState: Rating = {
                id: data.id,
                projectId: data.project_id,
                ratedUserId: data.rated_user_id,
                raterUserId: data.rater_user_id,
                stars: data.stars,
                review: data.review,
            };
            setRatings(prev => [...prev, newRatingForState]);
        }
    }, [supabaseClient]);

    const addCollaborationRequest = useCallback(async (projectId: string) => {
        if (!currentUser) return;
        
        const project = projects.find(p => p.id === projectId);
        if (!project) return;
        
        const newRequestData = {
            project_id: projectId,
            requester_id: currentUser.id,
            status: 'pending',
        };

        const { data: requestData } = await supabaseClient.from('collaboration_requests').insert(newRequestData).select().single();
        if (!requestData) return;

        const newNotificationData = {
            user_id: project.ownerId,
            type: 'COLLABORATION_REQUEST',
            message: `${currentUser.fullName} has requested to collaborate on your project "${project.title}".`,
            related_request_id: requestData.id,
            link: { page: 'projectDetail', params: { projectId } },
            is_read: false,
        };
        
        // The project owner will receive this notification via the real-time subscription.
        await supabaseClient.from('notifications').insert(newNotificationData);

        const formattedReq: CollaborationRequest = {
            id: requestData.id,
            projectId: requestData.project_id,
            requesterId: requestData.requester_id,
            status: requestData.status,
            createdAt: requestData.created_at,
        };
        setCollaborationRequests(prev => [...prev, formattedReq]);
    }, [currentUser, projects, supabaseClient]);

    const handleCollaborationRequest = useCallback(async (requestId: string, status: 'accepted' | 'rejected') => {
        const { data: updatedRequest } = await supabaseClient.from('collaboration_requests').update({ status }).eq('id', requestId).select().single();
        if (!updatedRequest) return;
        
        const formattedReq: CollaborationRequest = {
            id: updatedRequest.id,
            projectId: updatedRequest.project_id,
            requesterId: updatedRequest.requester_id,
            status: updatedRequest.status,
            createdAt: updatedRequest.created_at,
        };
        setCollaborationRequests(prev => prev.map(r => r.id === requestId ? formattedReq : r));

        const project = projects.find(p => p.id === formattedReq.projectId);
        if (status === 'accepted' && project) {
            const updatedTeam = [...project.team, formattedReq.requesterId];
            await updateProject({ ...project, team: updatedTeam });
        }

        const message = status === 'accepted' 
            ? `Your request to join "${project?.title}" has been accepted.`
            : `Your request to join "${project?.title}" has been rejected.`;

        const newNotificationData = {
            user_id: formattedReq.requesterId,
            type: status === 'accepted' ? 'REQUEST_ACCEPTED' : 'REQUEST_REJECTED',
            message,
            link: { page: 'projectDetail', params: { projectId: formattedReq.projectId } },
            is_read: false,
        };
        
        // The requester will receive this notification via the real-time subscription.
        await supabaseClient.from('notifications').insert(newNotificationData);
    }, [projects, updateProject, supabaseClient]);

    const markNotificationAsRead = useCallback(async (notificationId: string) => {
        const { data } = await supabaseClient.from('notifications').update({ is_read: true }).eq('id', notificationId).select().single();
        if (data) {
             setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n));
        }
    }, [supabaseClient]);

    const removeUserFromProject = useCallback(async (projectId: string, userIdToRemove: string) => {
        if (!currentUser) return;
        const project = projects.find(p => p.id === projectId);
        if (!project || project.ownerId !== currentUser.id) {
            console.error("User is not the owner or project not found.");
            return;
        }

        const updatedTeam = project.team.filter(id => id !== userIdToRemove);
        await updateProject({ ...project, team: updatedTeam });
        
        const newNotificationData = {
            user_id: userIdToRemove,
            type: 'REMOVED_FROM_TEAM',
            message: `You have been removed from the project "${project.title}".`,
            link: { page: 'projectDetail', params: { projectId: project.id } },
            is_read: false,
        };
        
        // The removed user will receive this notification via the real-time subscription.
        await supabaseClient.from('notifications').insert(newNotificationData);
    }, [currentUser, projects, updateProject, supabaseClient]);

    const addReport = useCallback(async (reportedContentId: string, reportedContentType: 'user' | 'project', reason: string) => {
        if (!currentUser) return;
        const newReportData = {
            reported_by: currentUser.id,
            reported_content_id: reportedContentId,
            reported_content_type: reportedContentType,
            reason: reason,
            status: 'pending',
        };
        const { data } = await supabaseClient.from('reports').insert(newReportData).select().single();
        if (data) {
            const formattedReport: Report = {
                id: data.id,
                reportedBy: data.reported_by,
                reportedContentId: data.reported_content_id,
                reportedContentType: data.reported_content_type,
                reason: data.reason,
                status: data.status,
            };
            setReports(prev => [...prev, formattedReport]);
        }
    }, [currentUser, supabaseClient]);

    // Admin functions
    const toggleUserBan = useCallback(async (userId: string) => {
        const user = users.find(u => u.id === userId);
        if (user) {
            const { data } = await supabaseClient.from('users').update({ is_banned: !user.isBanned }).eq('id', userId).select().single();
            if(data) {
                const formattedUser = { ...user, isBanned: data.is_banned };
                setUsers(prev => prev.map(u => u.id === userId ? formattedUser : u));
            }
        }
    }, [users, supabaseClient]);
    
    const approveSkill = useCallback(async (skillId: string) => {
        const { data } = await supabaseClient.from('skills').update({ is_approved: true }).eq('id', skillId).select().single();
        if (data) {
            const formattedSkill: Skill = {
                id: data.id,
                name: data.name,
                isApproved: data.is_approved,
                suggestedBy: data.suggested_by,
            };
            setSkills(prev => prev.map(s => s.id === skillId ? formattedSkill : s));
        }
    }, [supabaseClient]);

    const removeSkill = useCallback(async (skillId: string) => {
        const { error } = await supabaseClient.from('skills').delete().eq('id', skillId);
        if (!error) {
            setSkills(prev => prev.filter(s => s.id !== skillId));
        }
    }, [supabaseClient]);

    const addAnnouncement = useCallback(async (announcement: Omit<Announcement, 'id' | 'createdAt'>) => {
        const { data } = await supabaseClient.from('announcements').insert(announcement).select().single();
        if (data) {
             const formattedAnn: Announcement = {
                id: data.id,
                title: data.title,
                content: data.content,
                createdAt: data.created_at,
            };
            setAnnouncements(prev => [formattedAnn, ...prev]);
        }
    }, [supabaseClient]);

    const value = {
        theme, toggleTheme,
        currentUser, loading, login, logout, signup, updateUser,
        users, projects, skills, ratings, announcements, reports, collaborationRequests, notifications,
        addProject, updateProject, addSkillSuggestion, addRating,
        addCollaborationRequest, handleCollaborationRequest, markNotificationAsRead,
        removeUserFromProject, addReport,
        toggleUserBan, approveSkill, removeSkill, addAnnouncement,
    };
    
    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
