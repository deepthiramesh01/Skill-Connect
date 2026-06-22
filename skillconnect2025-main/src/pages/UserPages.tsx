import React, { useState, useMemo, useRef } from 'react';
import { Navigation, Page, User, Pronouns, ProjectStatus, UserRole } from '../types';
import { Header, Footer, PrimaryButton, Input, Select, Container, UserCard, ProjectCard, StarRating, Textarea, Button, Modal, StarRatingInput } from '../components';
import { useAppContext } from '../contexts/AppContext';
import AnimatedGlowingSearchBar from '../components/ui/animated-glowing-search-bar';

const defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMiAyQzE3LjUyMjggMiAyMiA2LjQ3NzE1IDEyIDEyQzIyIDE3LjUyMjggMTcuNTIyOCAyMiAxMiAyMkM2LjQ3NzE1IDIyIDIgMTcuNTIyOCAyIDEyQzIgNi44NzcxNSA2LjQ3NzE1IDIgMTIgMlpNMTIgNkM5Ljc5MDY1IDYgOCA3Ljc5MDY1IDggMTBDOCAxMi4yMDkzIDkuNzkwNjUgMTQgMTIgMTRDMTQuMjA9MyAxNCAxNiAxMi4yMDkzIDE2IDEwQzE2IDcuNzkwNjUgMTQuMjA5MyA2IDEyIDZaTTUuNDczMzYgMTguMjc5OUM2LjQxNzI2IDE2Ljk4MjQgOC4wMDY2MiAxNiAxMiAxNkMyMC40ODYxIDE2IDIwLjg1NCA3IDIwLjQ4OTYgMTIuNzU0NiAyMC40ODk2QzguODA0MSAyMC40ODk2IDYuMzc0ODkgMTkuMzIxOCA1LjQ3MzM2IDE4LjI3OTlaIiBmaWxsPSIjQ0FDRURBIi8+Cjwvc3ZnPg==';

interface UserPagesProps extends Navigation {
  page: Page;
  params: Record<string, any>;
}

export const UserPages: React.FC<UserPagesProps> = (props) => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header {...props} />
            <main className="flex-grow">
                {props.page === 'dashboard' && <DashboardPage navigate={props.navigate} />}
                {props.page === 'profileSetup' && <ProfileSetupPage navigate={props.navigate} />}
                {props.page === 'profile' && <ProfilePage navigate={props.navigate} params={props.params} />}
                {props.page === 'skillSearch' && <SkillSearchPage navigate={props.navigate} />}
                {props.page === 'projectSearch' && <ProjectSearchPage navigate={props.navigate} />}
                {props.page === 'projectCreate' && <ProjectCreatePage navigate={props.navigate} />}
                {props.page === 'projectDetail' && <ProjectDetailPage navigate={props.navigate} params={props.params} />}
                {props.page === 'notifications' && <NotificationsPage />}
            </main>
            <Footer navigate={props.navigate} />
        </div>
    );
};

const DashboardPage: React.FC<Navigation> = ({ navigate }) => {
    const { currentUser, announcements, projects, users } = useAppContext();

    if (!currentUser) return null;
    
    const relevantProjects = projects
        .filter(p => p.status === ProjectStatus.LookingForCollaborators)
        .slice(0, 5);
        
    const suggestedCollaborators = users
        .filter(u => u.id !== currentUser.id && u.skills.some(skill => currentUser.skills.includes(skill)))
        .slice(0, 3);
        
    return (
        <Container>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Welcome, {currentUser.fullName}!</h1>
            
            {/* Announcements */}
            {announcements.length > 0 && (
                <div className="bg-slate-100 border-l-4 border-slate-500 text-slate-700 p-4 mb-8 rounded-r-lg dark:bg-slate-800 dark:border-slate-400 dark:text-slate-300" role="alert">
                    <p className="font-bold">{announcements[0].title}</p>
                    <p>{announcements[0].content}</p>
                </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content: Project Feed */}
                <div className="lg:col-span-2">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold">New Projects</h2>
                        <PrimaryButton onClick={() => navigate('projectCreate')}>Post a Project</PrimaryButton>
                    </div>
                    <div className="space-y-4">
                        {relevantProjects.length > 0 ? (
                            relevantProjects.map(p => <ProjectCard key={p.id} project={p} navigate={navigate} />)
                        ) : (
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm text-center">
                                <p className="text-gray-600 dark:text-gray-400">No new projects seeking collaborators right now.</p>
                                <p className="mt-2 text-sm">Why not be the first to post one?</p>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Right Sidebar */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Suggested Collaborators</h2>
                    <div className="space-y-4">
                        {suggestedCollaborators.length > 0 ? (
                            suggestedCollaborators.map(u => <UserCard key={u.id} user={u} navigate={navigate} />)
                        ) : (
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm text-center">
                                <p className="text-gray-600 dark:text-gray-400">No members to suggest yet.</p>
                                <p className="mt-2 text-sm">Complete your profile to get better suggestions.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Container>
    );
};

const ProfileSetupPage: React.FC<Navigation> = ({ navigate }) => {
    const { currentUser, updateUser, addSkillSuggestion, skills: allSkills } = useAppContext();
    const [formData, setFormData] = useState({
        fullName: currentUser?.fullName || '',
        bio: currentUser?.bio || '',
        pronouns: currentUser?.pronouns || Pronouns.HeHim,
        contactNumber: currentUser?.contactNumber || '',
    });
    const [skills, setSkills] = useState<string[]>(currentUser?.skills || []);
    const [skillInput, setSkillInput] = useState('');
    const [profilePic, setProfilePic] = useState<string | undefined>(currentUser?.profilePic);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!currentUser) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setProfilePic(event.target?.result as string);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };
    
    const handleAddSkill = () => {
        const trimmedSkill = skillInput.trim();
        if (trimmedSkill && !skills.includes(trimmedSkill)) {
            setSkills([...skills, trimmedSkill]);
            setSkillInput('');
        }
    };

    const handleSkillAddKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddSkill();
        }
    };

    const handleRemoveSkill = (skillToRemove: string) => {
        setSkills(skills.filter(s => s !== skillToRemove));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Suggest any new skills that aren't in the global list yet.
        // This can happen in the background and doesn't need to block saving the profile.
        skills.forEach(skill => {
            if (!allSkills.some(s => s.name.toLowerCase() === skill.toLowerCase())) {
                addSkillSuggestion(skill);
            }
        });

        const updatedUser: User = {
            ...currentUser,
            ...formData,
            profilePic,
            skills,
            isProfileComplete: true,
        };
        
        // Wait for the user update to complete before navigating.
        await updateUser(updatedUser);
        
        // Now navigate to the dashboard. The App component will also recognize
        // the profile is complete and show the correct pages.
        navigate('dashboard');
    };

    return (
        <Container className="max-w-2xl">
            <h1 className="text-3xl font-bold mb-2">Complete Your Profile</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Let others know who you are. This information will be visible on your public profile.</p>
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md space-y-6">
                <div className="flex flex-col items-center space-y-4">
                    <img className="h-24 w-24 rounded-full object-cover" src={profilePic || defaultAvatar} alt="Profile Preview" />
                    <input type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} className="hidden" />
                    <Button type="button" onClick={() => fileInputRef.current?.click()} className="bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                        Upload Picture
                    </Button>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
                    <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
                    <Textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} rows={3} placeholder="Tell us a bit about yourself..." />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pronouns</label>
                    <Select id="pronouns" name="pronouns" value={formData.pronouns} onChange={handleChange}>
                        {Object.values(Pronouns).map(p => <option key={p} value={p}>{p}</option>)}
                    </Select>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Number *</label>
                    <Input id="contactNumber" name="contactNumber" type="tel" value={formData.contactNumber} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="skillInput" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Skills</label>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Add skills that you are proficient in. This will help others find you.</p>
                    <div className="flex items-center gap-2">
                        <Input 
                            id="skillInput"
                            name="skill" 
                            value={skillInput} 
                            onChange={e => setSkillInput(e.target.value)} 
                            onKeyDown={handleSkillAddKeyDown}
                            placeholder="e.g., React, Python, etc."
                        />
                        <Button type="button" onClick={handleAddSkill} className="bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                        {skills.map(skill => (
                            <span key={skill} className="bg-slate-100 text-slate-800 text-sm font-medium px-3 py-1.5 rounded-full flex items-center dark:bg-slate-700 dark:text-slate-200">
                                {skill}
                                <button type="button" onClick={() => handleRemoveSkill(skill)} className="ml-2 text-slate-800 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white font-bold text-lg leading-none">&times;</button>
                            </span>
                        ))}
                    </div>
                </div>
                <PrimaryButton type="submit" className="w-full">Save and Continue</PrimaryButton>
            </form>
        </Container>
    );
};

const SkillEditor: React.FC<{ user: User }> = ({ user }) => {
    const { updateUser, addSkillSuggestion, skills: allSkills } = useAppContext();
    const [skillInput, setSkillInput] = useState('');

    const handleAddSkill = () => {
        const trimmedSkill = skillInput.trim();
        if (trimmedSkill && !user.skills.includes(trimmedSkill)) {
            if (!allSkills.some(s => s.name.toLowerCase() === trimmedSkill.toLowerCase())) {
                addSkillSuggestion(trimmedSkill);
            }
            const updatedUser = { ...user, skills: [...user.skills, trimmedSkill] };
            updateUser(updatedUser);
            setSkillInput('');
        }
    };

    const handleSkillAddKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddSkill();
        }
    };

    const handleRemoveSkill = (skillToRemove: string) => {
        const updatedUser = { ...user, skills: user.skills.filter(s => s !== skillToRemove) };
        updateUser(updatedUser);
    };
    
    return (
        <div>
            <div className="flex items-center gap-2 mb-4">
                <Input
                    value={skillInput}
                    onChange={e => setSkillInput(e.target.value)}
                    onKeyDown={handleSkillAddKeyDown}
                    placeholder="Add a new skill"
                />
                <PrimaryButton onClick={handleAddSkill}>Add</PrimaryButton>
            </div>
            <div className="flex flex-wrap gap-2">
                {user.skills.map(skill => (
                    <span key={skill} className="bg-slate-100 text-slate-800 text-sm font-medium px-3 py-1.5 rounded-full flex items-center dark:bg-slate-700 dark:text-slate-200">
                        {skill}
                        <button type="button" onClick={() => handleRemoveSkill(skill)} className="ml-2 text-slate-800 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white font-bold text-lg leading-none">&times;</button>
                    </span>
                ))}
                {user.skills.length === 0 && <p className="text-gray-700 dark:text-gray-300">No skills listed yet. Add one above!</p>}
            </div>
        </div>
    );
};

const ProfilePage: React.FC<Navigation & { params: { userId?: string } }> = ({ navigate, params }) => {
    const { users, projects, ratings, currentUser, updateUser } = useAppContext();
    const user = users.find(u => u.id === params.userId);
    const isOwnProfile = currentUser?.id === user?.id;
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!user) {
        return <Container><p>User not found.</p></Container>;
    }

    const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const updatedUser = { ...user, profilePic: event.target?.result as string };
                updateUser(updatedUser);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };
    
    const userProjects = projects.filter(p => p.team.includes(user.id));
    const userRatings = ratings.filter(r => r.ratedUserId === user.id);
    const avgRating = userRatings.length > 0 ? userRatings.reduce((acc, r) => acc + r.stars, 0) / userRatings.length : 0;
    const totalReviewPoints = userRatings.reduce((acc, r) => acc + r.stars, 0);
    
    return (
        <Container>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-8">
                    <div className="relative">
                        <img className="h-32 w-32 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-md" src={user.profilePic || defaultAvatar} alt={user.fullName} />
                        {isOwnProfile && (
                             <>
                                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleProfilePicChange} className="hidden" />
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute bottom-0 right-0 bg-white dark:bg-gray-600 p-2 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                                    aria-label="Change profile picture"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-200" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </>
                        )}
                    </div>
                    <div className="text-center md:text-left mt-4 md:mt-0">
                        <h1 className="text-3xl font-bold">{user.fullName}</h1>
                        <p className="text-gray-700 dark:text-gray-300">{user.role}</p>
                        <p className="text-gray-700 dark:text-gray-300">{user.pronouns}</p>
                        <div className="mt-2 flex flex-col sm:flex-row items-center justify-center md:justify-start sm:space-x-4 space-y-2 sm:space-y-0">
                            <StarRating rating={avgRating} size="md" />
                            <div className="flex items-center text-gray-700 dark:text-gray-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span className="ml-1 font-semibold">{totalReviewPoints}</span>
                                <span className="ml-1.5">Review Points</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-8">
                    <h2 className="text-xl font-semibold border-b dark:border-gray-600 pb-2 mb-4">About</h2>
                    <p className="text-gray-700 dark:text-gray-300">{user.bio || 'No bio provided.'}</p>
                </div>
                 <div className="mt-8">
                    <h2 className="text-xl font-semibold border-b dark:border-gray-600 pb-2 mb-4">Contact Information</h2>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Phone:</strong> {user.contactNumber || 'Not provided'}</p>
                </div>
                <div className="mt-8">
                    <h2 className="text-xl font-semibold border-b dark:border-gray-600 pb-2 mb-4">Skills</h2>
                    {isOwnProfile ? (
                        <SkillEditor user={user} />
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {user.skills.length > 0 ? (
                                user.skills.map(skill => (
                                    <span key={skill} className="bg-slate-100 text-slate-800 text-md font-medium px-4 py-1.5 rounded-full dark:bg-slate-700 dark:text-slate-200">{skill}</span>
                                ))
                            ) : (
                                <p className="text-gray-600 dark:text-gray-400">This user has not listed any skills yet.</p>
                            )}
                        </div>
                    )}
                </div>
                 <div className="mt-8">
                    <h2 className="text-xl font-semibold border-b dark:border-gray-600 pb-2 mb-4">Projects ({userProjects.length})</h2>
                    <div className="space-y-4">
                        {userProjects.length > 0 ? (
                            userProjects.map(p => <ProjectCard key={p.id} project={p} navigate={navigate} />)
                        ) : (
                            <p className="text-gray-600 dark:text-gray-400">This user has not been involved in any projects yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </Container>
    );
};

const SkillSearchPage: React.FC<Navigation> = ({ navigate }) => {
    const { users } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');
    
    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const nameMatch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase());
            return nameMatch && user.isProfileComplete && user.role !== UserRole.Administrator;
        });
    }, [users, searchTerm]);
    
    return (
        <Container>
            <h1 className="text-3xl font-bold mb-6">Find Members</h1>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-8 sticky top-16 z-40">
                <div className="flex items-center justify-center">
                    <AnimatedGlowingSearchBar placeholder="Search by name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.length > 0 ? (
                    filteredUsers.map(user => <UserCard key={user.id} user={user} navigate={navigate} />)
                ) : (
                    <p className="md:col-span-2 lg:col-span-3 text-center text-gray-600 dark:text-gray-400 mt-8">No members match your search criteria.</p>
                )}
            </div>
        </Container>
    );
};

const ProjectSearchPage: React.FC<Navigation> = ({ navigate }) => {
    const { projects } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');
    
    const filteredProjects = useMemo(() => {
        return projects.filter(project => {
            const searchTermMatch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) || project.description.toLowerCase().includes(searchTerm.toLowerCase());
            return searchTermMatch;
        });
    }, [projects, searchTerm]);
    
    return (
        <Container>
            <h1 className="text-3xl font-bold mb-6">Find Projects</h1>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-8 sticky top-16 z-40">
                <div className="flex items-center justify-center">
                    <AnimatedGlowingSearchBar placeholder="Search projects..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.length > 0 ? (
                    filteredProjects.map(project => <ProjectCard key={project.id} project={project} navigate={navigate} />)
                ) : (
                    <p className="md:col-span-2 lg:col-span-3 text-center text-gray-600 dark:text-gray-400 mt-8">No projects match your search criteria.</p>
                )}
            </div>
        </Container>
    );
};

const ProjectCreatePage: React.FC<Navigation> = ({ navigate }) => {
    const { addProject, skills: allSkills } = useAppContext();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
    const [skillInput, setSkillInput] = useState('');
    const [status, setStatus] = useState<ProjectStatus>(ProjectStatus.LookingForCollaborators);

    const handleAddSkill = () => {
        const trimmedSkill = skillInput.trim();
        if (trimmedSkill && !requiredSkills.includes(trimmedSkill)) {
            setRequiredSkills([...requiredSkills, trimmedSkill]);
            setSkillInput('');
        }
    };
    
    const handleSkillAddKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddSkill();
        }
    };

    const handleRemoveSkill = (skillToRemove: string) => {
        setRequiredSkills(requiredSkills.filter(s => s !== skillToRemove));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newProject = await addProject({
            title,
            description,
            requiredSkills,
            status,
            isFeatured: false, // Default value
        });

        if (newProject) {
            navigate('projectDetail', { projectId: newProject.id });
        }
    };

    return (
        <Container className="max-w-2xl">
            <h1 className="text-3xl font-bold mb-6">Create a New Project</h1>
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Title *</label>
                    <Input value={title} onChange={e => setTitle(e.target.value)} required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description *</label>
                    <Textarea value={description} onChange={e => setDescription(e.target.value)} required rows={5} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Required Skills</label>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Add skills needed for this project. You can choose from existing skills or add new ones.</p>
                    <div className="flex items-center gap-2">
                        <Input 
                            value={skillInput} 
                            onChange={e => setSkillInput(e.target.value)} 
                            onKeyDown={handleSkillAddKeyDown}
                            placeholder="e.g., Data Analysis"
                            list="skills-datalist"
                        />
                        <datalist id="skills-datalist">
                            {allSkills.filter(s => s.isApproved).map(s => <option key={s.id} value={s.name} />)}
                        </datalist>
                        <Button type="button" onClick={handleAddSkill} className="bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Add</Button>
                    </div>
                     <div className="flex flex-wrap gap-2 mt-3">
                        {requiredSkills.map(skill => (
                            <span key={skill} className="bg-slate-100 text-slate-800 text-sm font-medium px-3 py-1.5 rounded-full flex items-center dark:bg-slate-700 dark:text-slate-200">
                                {skill}
                                <button type="button" onClick={() => handleRemoveSkill(skill)} className="ml-2 text-slate-800 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white font-bold text-lg leading-none">&times;</button>
                            </span>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Status *</label>
                    <Select value={status} onChange={e => setStatus(e.target.value as ProjectStatus)} required>
                        <option value={ProjectStatus.Upcoming}>Upcoming</option>
                        <option value={ProjectStatus.LookingForCollaborators}>Looking for Collaborators</option>
                        <option value={ProjectStatus.InProgress}>In Progress</option>
                        <option value={ProjectStatus.Completed}>Completed</option>
                    </Select>
                </div>
                <PrimaryButton type="submit" className="w-full">Create Project</PrimaryButton>
            </form>
        </Container>
    );
};

const ProjectDetailPage: React.FC<Navigation & { params: { projectId?: string } }> = ({ navigate, params }) => {
    const { 
        projects, 
        users, 
        currentUser, 
        addCollaborationRequest, 
        collaborationRequests, 
        handleCollaborationRequest,
        removeUserFromProject,
        addRating,
        ratings,
        addReport,
        updateProject,
    } = useAppContext();
    const project = projects.find(p => p.id === params.projectId);

    const [isRateModalOpen, setRateModalOpen] = useState(false);
    const [isReportModalOpen, setReportModalOpen] = useState(false);
    const [userToRate, setUserToRate] = useState<User | null>(null);
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [reportReason, setReportReason] = useState('');
    const [isBulkRateModalOpen, setBulkRateModalOpen] = useState(false);
    const [teamRatings, setTeamRatings] = useState<Record<string, { stars: number; review: string }>>({});
    
    if (!project || !currentUser) {
        return <Container><p>Project not found.</p></Container>;
    }

    const owner = users.find(u => u.id === project.ownerId);
    const teamMembers = users.filter(u => project.team.includes(u.id));
    const isOwner = currentUser.id === project.ownerId;
    const isTeamMember = project.team.includes(currentUser.id);
    const hasRequested = collaborationRequests.some(r => r.projectId === project.id && r.requesterId === currentUser.id);
    const pendingRequests = collaborationRequests.filter(r => r.projectId === project.id && r.status === 'pending');

    const handleRequestJoin = () => {
        addCollaborationRequest(project.id);
    };

    const handleRateUser = (user: User) => {
        setUserToRate(user);
        setRateModalOpen(true);
    };

    const handleReportProject = () => {
        setReportModalOpen(true);
    };

    const submitRating = () => {
        if (!userToRate) return;
        addRating({
            projectId: project.id,
            ratedUserId: userToRate.id,
            raterUserId: currentUser.id,
            stars: rating,
            review: review
        });
        setRateModalOpen(false);
        setRating(0);
        setReview('');
    };

    const submitReport = () => {
        addReport(project.id, 'project', reportReason);
        setReportModalOpen(false);
        setReportReason('');
    };
    
    const handleLeaveProject = () => {
        if (window.confirm("Are you sure you want to leave this project?")) {
            const updatedTeam = project.team.filter(id => id !== currentUser.id);
            updateProject({ ...project, team: updatedTeam });
        }
    };
    
    const statusColors: Record<ProjectStatus, string> = {
        [ProjectStatus.Upcoming]: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
        [ProjectStatus.LookingForCollaborators]: 'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300',
        [ProjectStatus.InProgress]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
        [ProjectStatus.Completed]: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    };

    // --- New Mandatory Rating Flow ---
    const teamMembersToRate = teamMembers.filter(m => m.id !== currentUser.id);

    const handleOpenBulkRateModal = () => {
        const initialRatings = teamMembersToRate.reduce((acc, member) => {
            acc[member.id] = { stars: 0, review: '' };
            return acc;
        }, {} as Record<string, { stars: number; review: string }>);
        setTeamRatings(initialRatings);
        setBulkRateModalOpen(true);
    };

    const handleRatingChange = (userId: string, stars: number) => {
        setTeamRatings(prev => ({ ...prev, [userId]: { ...prev[userId], stars } }));
    };

    const handleReviewChange = (userId: string, reviewText: string) => {
        setTeamRatings(prev => ({ ...prev, [userId]: { ...prev[userId], review: reviewText } }));
    };

    const areAllMembersRated = teamMembersToRate.every(member => teamRatings[member.id]?.stars > 0);

    const submitAllRatingsAndComplete = async () => {
        if (teamMembersToRate.length > 0 && !areAllMembersRated) {
            alert("Please provide a star rating for every team member.");
            return;
        }

        const ratingPromises = Object.entries(teamRatings).map(([ratedUserId, ratingData]) => {
            if (ratingData.stars > 0) {
                return addRating({
                    projectId: project.id,
                    ratedUserId,
                    raterUserId: currentUser.id,
                    stars: ratingData.stars,
                    review: ratingData.review
                });
            }
            return Promise.resolve();
        });

        await Promise.all(ratingPromises);
        
        await updateProject({ ...project, status: ProjectStatus.Completed });
        setBulkRateModalOpen(false);
    };
    // --- End of New Flow ---

    return (
        <Container>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-4xl font-bold">{project.title}</h1>
                        <p className="text-gray-700 dark:text-gray-300 mt-2">Created by <button onClick={() => navigate('profile', { userId: owner?.id })} className="font-semibold text-slate-700 hover:underline dark:text-slate-300">{owner?.fullName}</button></p>
                    </div>
                    <span className={`text-sm font-medium px-3 py-1 rounded-full ${statusColors[project.status]}`}>{project.status}</span>
                </div>
                
                <div className="mt-8">
                    <h2 className="text-xl font-semibold border-b dark:border-gray-600 pb-2 mb-4">Description</h2>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{project.description}</p>
                </div>
                
                <div className="mt-8">
                    <h2 className="text-xl font-semibold border-b dark:border-gray-600 pb-2 mb-4">Required Skills</h2>
                    <div className="flex flex-wrap gap-2">
                         {project.requiredSkills.map(skill => (
                            <span key={skill} className="bg-slate-100 text-slate-800 text-md font-medium px-4 py-1.5 rounded-full dark:bg-slate-700 dark:text-slate-200">{skill}</span>
                         ))}
                    </div>
                </div>

                <div className="mt-8">
                    <h2 className="text-xl font-semibold border-b dark:border-gray-600 pb-2 mb-4">Team Members ({teamMembers.length})</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {teamMembers.map(member => (
                            <div key={member.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{member.fullName} {member.id === owner?.id && <span className="text-xs text-gray-500 dark:text-gray-400">(Owner)</span>}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{member.role}</p>
                                </div>
                                <div>
                                    {isOwner && member.id !== owner?.id && (
                                        <Button onClick={() => removeUserFromProject(project.id, member.id)} className="text-xs bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900/80">Remove</Button>
                                    )}
                                    {project.status === ProjectStatus.Completed && isTeamMember && member.id !== currentUser.id && !ratings.some(r => r.raterUserId === currentUser.id && r.ratedUserId === member.id) && (
                                        <Button onClick={() => handleRateUser(member)} className="text-xs bg-yellow-100 text-yellow-700 hover:bg-yellow-200 ml-2 dark:bg-yellow-900/50 dark:text-yellow-300 dark:hover:bg-yellow-900/80">Rate</Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actions Section */}
                <div className="mt-8 pt-6 border-t dark:border-gray-600">
                    {!isTeamMember && project.status === ProjectStatus.LookingForCollaborators && (
                        <PrimaryButton onClick={handleRequestJoin} disabled={hasRequested}>
                            {hasRequested ? 'Request Sent' : 'Request to Join'}
                        </PrimaryButton>
                    )}
                    {isTeamMember && !isOwner && project.status !== ProjectStatus.Completed && (
                        <Button onClick={handleLeaveProject} className="bg-red-600 text-white hover:bg-red-700">Leave Project</Button>
                    )}
                    <Button onClick={handleReportProject} className="ml-4 bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Report Project</Button>
                    
                    {isOwner && project.status !== ProjectStatus.Completed && (
                        <Button onClick={handleOpenBulkRateModal} className="ml-4 bg-green-600 text-white hover:bg-green-700">
                           Mark as Completed
                        </Button>
                    )}
                     {isOwner && project.status === ProjectStatus.Completed && (
                        <Button onClick={() => {
                            if (window.confirm(`Are you sure you want to re-open this project and set its status to 'In Progress'?`)) {
                                updateProject({...project, status: ProjectStatus.InProgress});
                            }
                        }} className="ml-4 bg-yellow-500 text-white hover:bg-yellow-600">
                           Re-open Project
                        </Button>
                    )}
                </div>

                {/* Owner: Request Management */}
                {isOwner && pendingRequests.length > 0 && (
                     <div className="mt-8">
                        <h2 className="text-xl font-semibold border-b dark:border-gray-600 pb-2 mb-4">Collaboration Requests ({pendingRequests.length})</h2>
                        <div className="space-y-3">
                            {pendingRequests.map(req => {
                                const requester = users.find(u => u.id === req.requesterId);
                                return (
                                    <div key={req.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md flex justify-between items-center">
                                        <p>{requester?.fullName} wants to join.</p>
                                        <div className="space-x-2">
                                            <Button onClick={() => handleCollaborationRequest(req.id, 'accepted')} className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">Accept</Button>
                                            <Button onClick={() => handleCollaborationRequest(req.id, 'rejected')} className="bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300">Reject</Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
            {/* Modals */}
            <Modal isOpen={isRateModalOpen} onClose={() => setRateModalOpen(false)} title={`Rate ${userToRate?.fullName}`}>
                <div className="space-y-4">
                    <p>Provide a rating based on your experience working with {userToRate?.fullName}.</p>
                    <StarRatingInput rating={rating} onRatingChange={setRating} />
                    <Textarea value={review} onChange={e => setReview(e.target.value)} placeholder="Optional: Leave a short review..." rows={3}/>
                    <PrimaryButton onClick={submitRating} className="w-full">Submit Rating</PrimaryButton>
                </div>
            </Modal>
            <Modal isOpen={isReportModalOpen} onClose={() => setReportModalOpen(false)} title="Report Project">
                <div className="space-y-4">
                    <p>Please provide a reason for reporting this project.</p>
                    <Textarea value={reportReason} onChange={e => setReportReason(e.target.value)} placeholder="Reason for reporting..." rows={4}/>
                    <PrimaryButton onClick={submitReport} className="w-full">Submit Report</PrimaryButton>
                </div>
            </Modal>
            <Modal isOpen={isBulkRateModalOpen} onClose={() => setBulkRateModalOpen(false)} title="Rate Your Team Members">
                <div className="space-y-6">
                    <p>To complete the project, please provide a mandatory rating for each team member's contribution.</p>
                    
                    {teamMembersToRate.length > 0 ? teamMembersToRate.map(member => (
                        <div key={member.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                            <p className="font-semibold text-lg mb-2">{member.fullName}</p>
                            <div className="mb-3">
                                 <StarRatingInput 
                                    rating={teamRatings[member.id]?.stars || 0} 
                                    onRatingChange={(stars) => handleRatingChange(member.id, stars)} 
                                />
                            </div>
                            <Textarea 
                                value={teamRatings[member.id]?.review || ''} 
                                onChange={(e) => handleReviewChange(member.id, e.target.value)} 
                                placeholder={`Optional: Leave a review for ${member.fullName}...`}
                                rows={2}
                            />
                        </div>
                    )) : <p className="text-gray-600 dark:text-gray-400 text-center py-4">You were the only member on this project.</p>}

                    <PrimaryButton 
                        onClick={submitAllRatingsAndComplete} 
                        disabled={teamMembersToRate.length > 0 && !areAllMembersRated} 
                        className="w-full"
                    >
                        Submit Ratings & Complete Project
                    </PrimaryButton>
                </div>
            </Modal>
        </Container>
    );
};

const NotificationsPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      <p>No notifications yet.</p>
    </div>
  );
};