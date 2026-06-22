
import React, { useState } from 'react';
import { Navigation, Page, UserRole, User, Skill, Project, Report, Announcement } from '../types';
import { Container, PrimaryButton, Input, Textarea } from '../components';
import { useAppContext } from '../contexts/AppContext';

interface AdminPagesProps extends Navigation {
  page: Page;
  params: Record<string, any>;
}

const adminNavItems: { page: Page; label: string }[] = [
    { page: 'adminDashboard', label: 'Dashboard' },
    { page: 'adminUsers', label: 'User Management' },
    { page: 'adminSkills', label: 'Skill Management' },
    { page: 'adminProjects', label: 'Project Management' },
    { page: 'adminReports', label: 'Reports & Complaints' },
    { page: 'adminAnnouncements', label: 'Announcements' },
];

export const AdminPages: React.FC<AdminPagesProps> = (props) => {
    const { logout } = useAppContext();
    
    const handleLogout = () => {
        logout();
        // App.tsx's useEffect will handle navigation to 'home' when currentUser becomes null
    };
    
    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 text-white flex flex-col">
                <div className="p-4 border-b border-gray-700">
                    <h1 className="text-xl font-bold">Skill Connect Admin</h1>
                </div>
                <nav className="flex-grow p-2">
                    {adminNavItems.map(item => (
                        <button key={item.page}
                            onClick={() => props.navigate(item.page)}
                            className={`w-full text-left px-4 py-2 rounded-md transition-colors ${props.page === item.page ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                            {item.label}
                        </button>
                    ))}
                </nav>
                 <div className="p-4 border-t border-gray-700">
                    <button onClick={handleLogout} className="w-full text-left text-sm hover:text-gray-300">Logout</button>
                </div>
            </aside>
            
            {/* Main Content */}
            <main className="flex-1 p-8">
                {props.page === 'adminDashboard' && <AdminDashboard />}
                {props.page === 'adminUsers' && <UserManagementPage />}
                {props.page === 'adminSkills' && <SkillManagementPage />}
                {props.page === 'adminProjects' && <ProjectManagementPage />}
                {props.page === 'adminReports' && <ReportsPage />}
                {props.page === 'adminAnnouncements' && <AnnouncementsPage />}
            </main>
        </div>
    );
};

const AdminDashboard: React.FC = () => {
    const { users, projects, reports } = useAppContext();
    return (
        <>
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Users</h3>
                    <p className="text-4xl font-bold">{users.length}</p>
                </div>
                 <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Active Projects</h3>
                    <p className="text-4xl font-bold">{projects.filter(p => p.status !== 'Completed').length}</p>
                </div>
                 <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Pending Reports</h3>
                    <p className="text-4xl font-bold">{reports.filter(r => r.status === 'pending').length}</p>
                </div>
            </div>
            {/* Add recent activity log here if needed */}
        </>
    );
};

const UserManagementPage: React.FC = () => {
    const { users, toggleUserBan } = useAppContext();
    return (
        <>
            <h1 className="text-3xl font-bold mb-6">User Management</h1>
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {users.filter(u=>u.role !== UserRole.Administrator).map(user => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{user.fullName}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isBanned ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' : 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'}`}>
                                        {user.isBanned ? 'Banned' : 'Active'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button onClick={() => toggleUserBan(user.id)} className={`text-sm font-medium ${user.isBanned ? 'text-green-700 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300' : 'text-red-700 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300'}`}>
                                        {user.isBanned ? 'Unban' : 'Ban'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

const SkillManagementPage: React.FC = () => {
    const { skills, approveSkill, removeSkill, users } = useAppContext();
    return (
        <>
            <h1 className="text-3xl font-bold mb-6">Skill Management</h1>
             <h2 className="text-xl font-semibold mb-4">Approved Skills</h2>
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-8">
                <table className="min-w-full">
                    <tbody>
                         {skills.filter(s => s.isApproved).map(skill => (
                            <tr key={skill.id} className="border-b dark:border-gray-700">
                                <td className="px-6 py-4">{skill.name}</td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => removeSkill(skill.id)} className="text-red-700 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 font-medium">Remove</button>
                                </td>
                            </tr>
                         ))}
                    </tbody>
                </table>
            </div>
             <h2 className="text-xl font-semibold mb-4">Pending Suggestions</h2>
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                <table className="min-w-full">
                    <tbody>
                         {skills.filter(s => !s.isApproved).map(skill => (
                             <tr key={skill.id} className="border-b dark:border-gray-700">
                                <td className="px-6 py-4">{skill.name}</td>
                                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">Suggested by {users.find(u => u.id === skill.suggestedBy)?.fullName || 'Unknown'}</td>
                                <td className="px-6 py-4 text-right space-x-4">
                                    <button onClick={() => approveSkill(skill.id)} className="text-green-700 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 font-medium">Approve</button>
                                    <button onClick={() => removeSkill(skill.id)} className="text-red-700 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 font-medium">Reject</button>
                                </td>
                             </tr>
                         ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

const ProjectManagementPage: React.FC = () => {
    const { projects, updateProject } = useAppContext();
     return (
        <>
            <h1 className="text-3xl font-bold mb-6">Project Management</h1>
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Featured</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {projects.map(project => (
                            <tr key={project.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{project.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{project.status}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{project.isFeatured ? 'Yes' : 'No'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button onClick={() => updateProject({...project, isFeatured: !project.isFeatured})} className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300 font-medium">
                                        {project.isFeatured ? 'Unfeature' : 'Feature'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

const ReportsPage: React.FC = () => {
    const { reports } = useAppContext();
    return (
        <>
            <h1 className="text-3xl font-bold mb-6">Reports & Complaints</h1>
             <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
                <p className="text-gray-700 dark:text-gray-300">{reports.length > 0 ? `${reports.length} pending reports.` : "No pending reports."}</p>
            </div>
        </>
    );
};

const AnnouncementsPage: React.FC = () => {
    const { announcements, addAnnouncement } = useAppContext();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addAnnouncement({ title, content });
        setTitle('');
        setContent('');
    };
    
    return (
        <>
            <h1 className="text-3xl font-bold mb-6">Announcements</h1>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
                <h2 className="text-xl font-semibold mb-4">Create New Announcement</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
                    <Textarea placeholder="Content" value={content} onChange={e => setContent(e.target.value)} required rows={4} />
                    <PrimaryButton type="submit">Post Announcement</PrimaryButton>
                </form>
            </div>
            
            <h2 className="text-xl font-semibold mb-4">Past Announcements</h2>
            <div className="space-y-4">
                {announcements.map(ann => (
                    <div key={ann.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                        <h3 className="font-bold">{ann.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{ann.content}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{new Date(ann.createdAt).toLocaleString()}</p>
                    </div>
                ))}
            </div>
        </>
    );
};