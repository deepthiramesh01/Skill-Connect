import React, { ReactNode, useState, ComponentProps } from 'react';
import { User, Project, Navigation, Page, ProjectStatus } from './types';
import { useAppContext } from './contexts/AppContext';
import { GlowCard } from './components/ui/spotlight-card';
import { motion, useReducedMotion } from 'framer-motion';
import { Network, Facebook, Instagram, Youtube, Linkedin } from 'lucide-react';
import { StarWarsToggleSwitch } from './components/ui/star-wars-toggle-switch';


const defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMiAyQzE3LjUyMjggMiAyMiA2LjQ3NzE1IDIyIDEyQzIyIDE3LjUyMjggMTcuNTIyOCAyMiAxMiAyMkM2LjQ3NzE1IDIyIDIgMTcuNTIyOCAyIDEyQzIgNi40NzcxNSA2LjQ3NzE1IDIgMTIgMlpNMTIgNkM5Ljc5MDY1IDYgOCA3Ljc5MDY1IDggMTBDOCAxMi4yMDkzIDkuNzkwNjUgMTQgMTIgMTRDMTQuMjA5MyAxNCAxNiAxMi4yMDkzIDE2IDEwQzE2IDcuNzkwNjUgMTQuMjA5MyA2IDEyIDZaTTUuNDczMzYgMTguMjc5OUM2LjQxNzI0IDE2Ljk4MjQgOC4wMDY2MiAxNiAxMiAxNkMyMC40ODYxIDE2IDIwLjg1NDcgMjAuNDg5NiAxMi43NTQ2IDIwLjQ4OTZDOC44MDM0MSAyMC40ODk2IDYuMzc0ODkgMTkuMzIxOCA1LjQ3MzM2IDE4LjI3OTlaIiBmaWxsPSIjQ0FDRURBIi8+Cjwvc3ZnPg==';

const NotificationIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
    >
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
);


// Reusable UI Components
export const Button: React.FC<{ onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void; children: ReactNode; className?: string; type?: 'button' | 'submit' | 'reset', disabled?: boolean }> = ({ onClick, children, className = '', type = 'button', disabled = false }) => (
  <button type={type} onClick={onClick} disabled={disabled} className={`px-4 py-2 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}>
    {children}
  </button>
);

export const PrimaryButton: React.FC<{ onClick?: () => void; children: ReactNode; className?: string; type?: 'button' | 'submit' | 'reset', disabled?: boolean }> = ({ children, ...props }) => (
  <Button {...props} className={`bg-slate-800 text-white hover:bg-slate-900 focus:ring-slate-500 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-slate-300 dark:focus:ring-slate-400 ${props.className}`}>
    {children}
  </Button>
);

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input {...props} className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-500 focus:bg-white sm:text-sm transition duration-150 ease-in-out dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-slate-500 dark:focus:border-slate-500 dark:focus:bg-gray-700 ${props.className}`} />
);

export const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
  <textarea {...props} className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-500 focus:bg-white sm:text-sm transition duration-150 ease-in-out dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-slate-500 dark:focus:border-slate-500 dark:focus:bg-gray-700 ${props.className}`} />
);


export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
    <select {...props} className={`block w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-500 focus:bg-white sm:text-sm transition duration-150 ease-in-out dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-slate-500 dark:focus:border-slate-500 dark:focus:bg-gray-700 ${props.className}`}>
        {props.children}
    </select>
);

// Theme Toggle
const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useAppContext();
    return (
        <div aria-label="Toggle theme">
             {/*
                The StarWarsToggleSwitch is 'checked' when the night scene (dark mode) is active.
                This correctly maps our 'dark' theme state to the visual representation of the toggle.
                Clicking the toggle fires `toggleTheme`, which updates the application's theme state.
             */}
             <StarWarsToggleSwitch checked={theme === 'dark'} onChange={toggleTheme} />
        </div>
    );
};


// Layout Components
export const Header: React.FC<Navigation & { page: Page }> = ({ navigate, page }) => {
  const { currentUser, logout, notifications } = useAppContext();
  const hasUnreadNotifications = currentUser ? notifications.some(n => n.userId === currentUser.id && !n.isRead) : false;

  return (
    <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="font-bold text-xl text-slate-800 dark:text-white cursor-pointer" onClick={() => navigate(currentUser ? 'dashboard' : 'home')}>
              Skill Connect
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                <NavLink navigate={navigate} page={page} target="dashboard">Dashboard</NavLink>
                <NavLink navigate={navigate} page={page} target="projectSearch">Projects</NavLink>
                <NavLink navigate={navigate} page={page} target="skillSearch">Members</NavLink>
                <NavLink navigate={navigate} page={page} target="notifications">
                    <div className="relative">
                        <span className="sr-only">View notifications</span>
                        <NotificationIcon className="h-6 w-6" />
                        {hasUnreadNotifications && <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800" />}
                    </div>
                </NavLink>
                <ThemeToggle />
                <div className="relative">
                  <button onClick={() => navigate('profile', { userId: currentUser.id })} className="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-gray-300 transition">
                      <img className="h-8 w-8 rounded-full object-cover" src={currentUser.profilePic || defaultAvatar} alt="User profile" />
                  </button>
                </div>
                <button onClick={logout} className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Logout</button>
              </>
            ) : (
              <>
                <NavLink navigate={navigate} page={page} target="about">About Us</NavLink>
                <NavLink navigate={navigate} page={page} target="contact">Contact</NavLink>
                <ThemeToggle />
                <button onClick={() => navigate('login')} className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Sign In</button>
                <PrimaryButton onClick={() => navigate('signup')}>Sign Up</PrimaryButton>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

const NavLink: React.FC<Navigation & { page: Page, target: Page, children: ReactNode }> = ({ navigate, page, target, children }) => (
    <button onClick={() => navigate(target)} className={`text-sm font-medium ${page === target ? 'text-slate-800 dark:text-white' : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'}`}>{children}</button>
);

// Card Components
export const UserCard: React.FC<{ user: User } & Navigation> = ({ user, navigate }) => {
  const { ratings } = useAppContext();
  const userRatings = ratings.filter(r => r.ratedUserId === user.id);
  const avgRating = userRatings.length > 0 ? userRatings.reduce((acc, r) => acc + r.stars, 0) / userRatings.length : 0;
  
  return (
    <GlowCard className="p-6" glowColor="blue" customSize={true}>
      <div className="flex items-center space-x-4 mb-4">
        <img className="h-16 w-16 rounded-full object-cover" src={user.profilePic || defaultAvatar} alt={user.fullName} />
        <div>
          <h3 className="text-lg font-bold text-white">{user.fullName}</h3>
          <p className="text-sm text-gray-300">{user.role}</p>
        </div>
      </div>
      <p className="text-gray-300 text-sm mb-4 h-10 overflow-hidden">{user.bio || 'No bio provided.'}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {user.skills.slice(0, 3).map(skill => (
          <span key={skill} className="bg-white/10 text-gray-200 text-xs font-medium px-2.5 py-0.5 rounded-full">{skill}</span>
        ))}
      </div>
      <div className="flex justify-between items-center mt-auto">
        <StarRating rating={avgRating} />
        <PrimaryButton onClick={() => navigate('profile', { userId: user.id })}>View Profile</PrimaryButton>
      </div>
    </GlowCard>
  );
};

export const ProjectCard: React.FC<{ project: Project } & Navigation> = ({ project, navigate }) => {
    const { users } = useAppContext();
    const owner = users.find(u => u.id === project.ownerId);

    const statusColors: Record<ProjectStatus, string> = {
        [ProjectStatus.Upcoming]: 'bg-purple-500/20 text-purple-300',
        [ProjectStatus.LookingForCollaborators]: 'bg-sky-500/20 text-sky-300',
        [ProjectStatus.InProgress]: 'bg-yellow-500/20 text-yellow-300',
        [ProjectStatus.Completed]: 'bg-green-500/20 text-green-300',
    };

    return (
        <GlowCard className="p-6 flex flex-col justify-between" glowColor="green" customSize={true}>
            <div>
                <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusColors[project.status]}`}>{project.status}</span>
                </div>
                <p className="text-sm text-gray-300 mb-3">By {owner?.fullName || 'Unknown'}</p>
                <p className="text-gray-300 text-sm mb-4 h-16 overflow-hidden">{project.description}</p>
                 <div className="flex flex-wrap gap-2 mb-4">
                    {project.requiredSkills.map(skill => (
                        <span key={skill} className="bg-white/10 text-gray-200 text-xs font-medium px-2.5 py-0.5 rounded-full">{skill}</span>
                    ))}
                </div>
            </div>
            <PrimaryButton onClick={() => navigate('projectDetail', { projectId: project.id })} className="w-full mt-2">
                View Details
            </PrimaryButton>
        </GlowCard>
    );
};

export const Star = ({ className }: { className: string }) => <svg className={className} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>;
export const StarHalf = ({ className }: { className: string }) => <svg className={className} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z M10 4.24v11.516l2.18 1.58-0.82-2.583 2.18-1.58H10.95l-0.82-2.583L10 4.24z"></path></svg>;

export const StarRating: React.FC<{ rating: number, size?: 'sm' | 'md' | 'lg' }> = ({ rating, size = 'sm' }) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    const starSize = size === 'sm' ? 'h-4 w-4' : size === 'md' ? 'h-5 w-5' : 'h-6 w-6';

    return (
        <div className="flex items-center">
            {[...Array(fullStars)].map((_, i) => <Star key={`full-${i}`} className={`${starSize} text-yellow-400`} />)}
            {halfStar && <StarHalf key="half" className={`${starSize} text-yellow-400`} />}
            {[...Array(emptyStars)].map((_, i) => <Star key={`empty-${i}`} className={`${starSize} text-gray-300`} />)}
            <span className={`ml-2 text-xs text-gray-300`}>({rating.toFixed(1)})</span>
        </div>
    );
};

export const StarRatingInput: React.FC<{ rating: number; onRatingChange: (rating: number) => void; size?: 'sm' | 'md' | 'lg' }> = ({ rating, onRatingChange, size = 'md' }) => {
    const [hoverRating, setHoverRating] = useState(0);
    const starSize = size === 'sm' ? 'h-5 w-5' : size === 'md' ? 'h-8 w-8' : 'h-10 w-10';

    return (
        <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => {
                const starValue = i + 1;
                return (
                    <button
                        type="button"
                        key={starValue}
                        onClick={() => onRatingChange(starValue)}
                        onMouseEnter={() => setHoverRating(starValue)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="focus:outline-none"
                        aria-label={`Rate ${starValue} star${starValue > 1 ? 's' : ''}`}
                    >
                        <Star
                            className={`${starSize} transition-colors ${
                                starValue <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-500'
                            }`}
                        />
                    </button>
                );
            })}
        </div>
    );
};

export const Modal: React.FC<{ isOpen: boolean; onClose: () => void; children: React.ReactNode; title: string }> = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{title}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white text-3xl leading-none font-bold focus:outline-none" aria-label="Close modal">&times;</button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};


export const Container: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <div className={`container mx-auto px-4 sm:px-6 lg:px-8 py-8 ${className}`}>
        {children}
    </div>
);


// --- New Animated Footer ---

type ViewAnimationProps = {
	delay?: number;
	className?: ComponentProps<typeof motion.div>['className'];
	children: ReactNode;
};

const AnimatedContainer: React.FC<ViewAnimationProps> = ({ className, delay = 0.1, children }) => {
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return <div className={className}>{children}</div>;
	}

	return (
		<motion.div
			initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
			whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
			viewport={{ once: true }}
			transition={{ delay, duration: 0.8 }}
			className={className}
		>
			{children}
		</motion.div>
	);
};

interface FooterLink {
	title: string;
	href?: string;
    page?: Page;
	icon?: React.ComponentType<{ className?: string }>;
}

interface FooterSection {
	label: string;
	links: FooterLink[];
}

const getFooterLinks = (): FooterSection[] => [
	{
		label: 'Explore',
		links: [
			{ title: 'Find Projects', page: 'projectSearch' },
			{ title: 'Find Members', page: 'skillSearch' },
			{ title: 'Create Project', page: 'projectCreate' },
		],
	},
	{
		label: 'Company',
		links: [
			{ title: 'About Us', page: 'about' },
			{ title: 'Contact Us', page: 'contact' },
			{ title: 'Privacy Policy', page: 'privacy' },
			{ title: 'Terms of Service', page: 'terms' },
		],
	},
	{
		label: 'Social Links',
		links: [
			{ title: 'Facebook', href: '#', icon: Facebook },
			{ title: 'Instagram', href: '#', icon: Instagram },
			{ title: 'Youtube', href: '#', icon: Youtube },
			{ title: 'LinkedIn', href: '#', icon: Linkedin },
		],
	},
];

export const Footer: React.FC<Navigation> = ({ navigate }) => {
    const footerSections = getFooterLinks();

	return (
		<footer className="md:rounded-t-3xl relative w-full bg-white dark:bg-gray-800 border-t dark:border-gray-700 flex flex-col items-center justify-center rounded-t-2xl bg-[radial-gradient(35%_128px_at_50%_0%,theme(backgroundColor.slate.50),transparent)] dark:bg-[radial-gradient(35%_128px_at_50%_0%,theme(backgroundColor.slate.900),transparent)] px-6 py-12 lg:py-16 mt-auto">
			<div className="bg-slate-800/20 dark:bg-slate-200/20 absolute top-0 right-1/2 left-1/2 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur" />
            <div className="container mx-auto">
                <div className="grid w-full gap-8 xl:grid-cols-3 xl:gap-8">
                    <AnimatedContainer className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Network className="size-8 text-slate-800 dark:text-white" />
                            <span className="font-bold text-xl text-slate-800 dark:text-white">Skill Connect</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mt-8 text-sm md:mt-0">
                            © {new Date().getFullYear()} Skill Connect. All rights reserved.
                        </p>
                    </AnimatedContainer>

                    <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-3 xl:col-span-2 xl:mt-0">
                        {footerSections.map((section, index) => (
                            <AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
                                <div className="mb-10 md:mb-0">
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{section.label}</h3>
                                    <ul className="text-gray-600 dark:text-gray-400 mt-4 space-y-2 text-sm">
                                        {section.links.map((link) => (
                                            <li key={link.title}>
                                                {link.page ? (
                                                    <button
                                                        onClick={() => navigate(link.page!)}
                                                        className="hover:text-slate-900 dark:hover:text-white inline-flex items-center transition-all duration-300"
                                                    >
                                                        {link.title}
                                                    </button>
                                                ) : (
                                                    <a
                                                        href={link.href}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="hover:text-slate-900 dark:hover:text-white inline-flex items-center transition-all duration-300"
                                                    >
                                                        {link.icon && <link.icon className="me-1 size-4" />}
                                                        {link.title}
                                                    </a>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </AnimatedContainer>
                        ))}
                    </div>
                </div>
            </div>
		</footer>
	);
};
