import React, { useState } from 'react';
import { Navigation, Page, UserRole } from '../types';
import { Header, Footer, PrimaryButton, Input, Select, Container } from '../components';
import { useAppContext } from '../contexts/AppContext';
import { BackgroundPaths } from '../components/ui/background-paths';

interface PublicPagesProps extends Navigation {
  page: Page;
  params: Record<string, any>;
}

export const PublicPages: React.FC<PublicPagesProps> = (props) => {
  return (
    <>
      <Header {...props} />
      <main className="flex-grow">
        {/* FIX: Pass navigate prop explicitly instead of spreading all props. */}
        {props.page === 'home' && <HomePage navigate={props.navigate} />}
        {props.page === 'login' && <LoginPage navigate={props.navigate} />}
        {props.page === 'signup' && <SignUpPage navigate={props.navigate} />}
        {props.page === 'about' && <AboutUsPage navigate={props.navigate} />}
        {props.page === 'terms' && <TermsOfServicePage />}
        {props.page === 'privacy' && <PrivacyPolicyPage />}
        {props.page === 'contact' && <ContactPage />}
      </main>
      <Footer navigate={props.navigate} />
    </>
  );
};

const HomePage: React.FC<Navigation> = ({ navigate }) => (
  <>
    {/* Hero Section */}
    <BackgroundPaths 
      title="Connect Collaborate Innovate"
      buttonText="Join Our Community"
      onButtonClick={() => navigate('signup')}
    />

    {/* Features Section */}
    <div className="bg-gray-50 dark:bg-slate-800 py-16">
      <Container>
        <div className="grid md:grid-cols-3 gap-12 text-center">
          <div className="p-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-500 dark:text-slate-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <h2 className="text-xl font-bold mb-2">Showcase Your Expertise</h2>
            <p className="text-gray-600 dark:text-gray-400">Create a detailed profile, list your skills, and let others know what you bring to the table.</p>
          </div>
          <div className="p-4">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-500 dark:text-slate-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h2 className="text-xl font-bold mb-2">Find Your Collaborators</h2>
            <p className="text-gray-600 dark:text-gray-400">Search for students and faculty by skills, interests, and project history to build the perfect team.</p>
          </div>
          <div className="p-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-500 dark:text-slate-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h2 className="text-xl font-bold mb-2">Manage Your Projects</h2>
            <p className="text-gray-600 dark:text-gray-400">Post new project ideas, recruit team members, and track your progress from start to finish.</p>
          </div>
        </div>
      </Container>
    </div>

    {/* Exclusivity Section */}
    <div className="bg-white dark:bg-slate-900 py-16">
        <Container className="text-center">
             <h2 className="text-3xl font-bold mb-4">A Secure, Private Network</h2>
             <p className="max-w-3xl mx-auto text-gray-600 dark:text-gray-400">Skill Connect is an exclusive platform for the members of our institution. To maintain a secure and trusted environment, all accounts are verified through an institutional email address. Your work and data remain within our private community.</p>
        </Container>
    </div>
  </>
);

const LoginPage: React.FC<Navigation> = ({ navigate }) => {
    const { login } = useAppContext();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<UserRole | 'Administrator'>(UserRole.Student);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const result = await login(email, password, role);
        
        if (result.error) {
            setError(result.error);
        } else if (result.user) {
            // Navigation is handled by the App.tsx useEffect on currentUser change
        }
    };
    
    return (
        <Container className="max-w-md">
            <h2 className="text-3xl font-bold text-center mb-6">Sign In</h2>
            {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
                <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Login as</label>
                    <Select id="role" value={role} onChange={e => setRole(e.target.value as UserRole | 'Administrator')}>
                        <option value={UserRole.Student}>Student</option>
                        <option value={UserRole.TeachingFaculty}>Teaching Faculty</option>
                        <option value={UserRole.NonTeachingFaculty}>Non-Teaching Faculty</option>
                        <option value="Administrator">Administrator</option>
                    </Select>
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email address</label>
                    <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                    <div className="relative">
                        <Input 
                            id="password" 
                            type={showPassword ? 'text' : 'password'} 
                            value={password} onChange={e => setPassword(e.target.value)} 
                            required 
                            className="pr-10"
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a10.05 10.05 0 013.453-5.118l8.974 8.974zM12 15a3 3 0 100-6 3 3 0 000 6z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.33 10.67a10.04 10.04 0 00-2.458-3.784m-2.981 1.053A10.04 10.04 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.04 10.04 0 01-.454 1.487m-2.121-2.121l-8.974-8.974M1.67 1.67l20.66 20.66" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
                <PrimaryButton type="submit" className="w-full">Sign In</PrimaryButton>
            </form>
             <p className="text-center mt-4 text-sm">Don't have an account? <button onClick={() => navigate('signup')} className="font-medium text-slate-600 hover:text-slate-500 dark:text-slate-400 dark:hover:text-slate-300">Sign Up</button></p>
        </Container>
    );
};

const SignUpPage: React.FC<Navigation> = ({ navigate }) => {
    const { signup } = useAppContext();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState<UserRole>(UserRole.Student);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        const result = await signup(fullName, email, password, role);
        if (result.error) {
            setError(result.error);
        } else {
            // Navigation handled by App.tsx useEffect
        }
    };

    return (
        <Container className="max-w-md">
            <h2 className="text-3xl font-bold text-center mb-6">Create an Account</h2>
            {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
                <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                    <Input id="fullName" type="text" value={fullName} onChange={e => setFullName(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="email-signup" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                    <Input id="email-signup" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="password-signup" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                    <div className="relative">
                        <Input 
                            id="password-signup"
                            type={showPassword ? 'text' : 'password'} 
                            value={password} 
                            onChange={e => setPassword(e.target.value)} 
                            required 
                            className="pr-10"
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a10.05 10.05 0 013.453-5.118l8.974 8.974zM12 15a3 3 0 100-6 3 3 0 000 6z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.33 10.67a10.04 10.04 0 00-2.458-3.784m-2.981 1.053A10.04 10.04 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.04 10.04 0 01-.454 1.487m-2.121-2.121l-8.974-8.974M1.67 1.67l20.66 20.66" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
                     <div className="relative">
                        <Input
                            id="confirmPassword" 
                            type={showConfirmPassword ? 'text' : 'password'} 
                            value={confirmPassword} 
                            onChange={e => setConfirmPassword(e.target.value)} 
                            required 
                            className="pr-10"
                        />
                         <button 
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                        >
                            {showConfirmPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a10.05 10.05 0 013.453-5.118l8.974 8.974zM12 15a3 3 0 100-6 3 3 0 000 6z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.33 10.67a10.04 10.04 0 00-2.458-3.784m-2.981 1.053A10.04 10.04 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.04 10.04 0 01-.454 1.487m-2.121-2.121l-8.974-8.974M1.67 1.67l20.66 20.66" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
                <div>
                    <label htmlFor="role-signup" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Role</label>
                    <Select id="role-signup" value={role} onChange={e => setRole(e.target.value as UserRole)}>
                        <option value={UserRole.Student}>Student</option>
                        <option value={UserRole.TeachingFaculty}>Teaching Faculty</option>
                        <option value={UserRole.NonTeachingFaculty}>Non-Teaching Faculty</option>
                    </Select>
                </div>
                <div className="flex items-center">
                    <input id="terms" name="terms" type="checkbox" required className="h-4 w-4 text-slate-600 focus:ring-slate-500 border-gray-300 rounded"/>
                    <label htmlFor="terms" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                        I agree to the <button type="button" onClick={() => navigate('terms')} className="font-medium text-slate-600 hover:text-slate-500 dark:text-slate-400 dark:hover:text-slate-300">Terms of Service</button> and <button type="button" onClick={() => navigate('privacy')} className="font-medium text-slate-600 hover:text-slate-500 dark:text-slate-400 dark:hover:text-slate-300">Privacy Policy</button>.
                    </label>
                </div>
                <PrimaryButton type="submit" className="w-full">Sign Up</PrimaryButton>
            </form>
            <p className="text-center mt-4 text-sm">Already have an account? <button onClick={() => navigate('login')} className="font-medium text-slate-600 hover:text-slate-500 dark:text-slate-400 dark:hover:text-slate-300">Sign In</button></p>
        </Container>
    );
};


const StaticPage: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <Container className="max-w-4xl">
        <div className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">{title}</h1>
            <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">{children}</div>
        </div>
    </Container>
);

const AboutUsPage: React.FC<Navigation> = ({ navigate }) => (
    <StaticPage title="About Skill Connect">
        <p className="text-lg leading-relaxed">
            Skill Connect is a private collaboration platform designed to foster innovation and project-based learning within our institution.
        </p>
        
        <h2 className="font-bold text-2xl mt-8 mb-4 border-b pb-2 dark:border-gray-600">Our Vision</h2>
        <p>
            Our vision is to bridge the gap between talented individuals across different departments. We address the challenge of finding skilled collaborators and project opportunities within a large institution by creating a centralized, searchable network of our members' unique abilities.
        </p>

        <div className="bg-gray-50 dark:bg-gray-700/50 -mx-8 md:-mx-12 px-8 md:px-12 py-8 my-8 rounded-lg">
             <h2 className="font-bold text-2xl mb-6 text-center">Key Benefits</h2>
             <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-500 dark:text-slate-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <h3 className="font-semibold text-lg">For Students</h3>
                    <p>Find mentors, build your portfolio, and work on real-world projects to enhance your skills.</p>
                </div>
                 <div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-500 dark:text-slate-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <h3 className="font-semibold text-lg">For Faculty</h3>
                    <p>Discover talented students for research collaborations and innovative class projects.</p>
                </div>
                 <div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-500 dark:text-slate-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <h3 className="font-semibold text-lg">For the Institution</h3>
                    <p>Cultivate a culture of interdisciplinary collaboration and drive forward-thinking initiatives.</p>
                </div>
             </div>
        </div>

        <h2 className="font-bold text-2xl mt-8 mb-4 border-b pb-2 dark:border-gray-600">A Secure Community, For Us</h2>
        <p>
            This is an exclusive platform. Only members with a verified institutional email can join, ensuring a safe and trusted environment. We are committed to protecting your data and fostering a respectful community for professional collaboration.
        </p>

        <div className="text-center mt-10">
            <PrimaryButton onClick={() => navigate('signup')} className="px-8 py-3 text-lg">Join Now</PrimaryButton>
        </div>
    </StaticPage>
);

const TermsOfServicePage: React.FC = () => (
    <StaticPage title="Terms of Service">
        <p>By using Skill Connect, you agree to these terms. You must be a member of our institution to use this service. You are responsible for your account and its content. Do not harass others, post inappropriate content, or misuse the platform. We reserve the right to suspend accounts that violate these terms.</p>
    </StaticPage>
);

const PrivacyPolicyPage: React.FC = () => (
    <StaticPage title="Privacy Policy">
        <p>We collect information you provide, such as your name, email, skills, and project details, to operate the platform. Your profile information is visible to other members of the institution. We do not share your data with third parties. You can update or delete your information at any time.</p>
    </StaticPage>
);

const ContactPage: React.FC = () => (
    <StaticPage title="Contact Us">
        <p>For technical support, reporting issues, or general inquiries, please use the information below.</p>
        <h2 className="font-bold text-xl mt-6 mb-2">Technical Support</h2>
        <p>For issues related to bugs, login problems, or platform errors, please email our IT support at: <strong>support@vignan.edu</strong></p>
        <h2 className="font-bold text-xl mt-6 mb-2">General Inquiries</h2>
        <p>For general questions about the platform's features, suggestions, or feedback, please email: <strong>skillconnect@vignan.edu</strong></p>
        <h2 className="font-bold text-xl mt-6 mb-2">Reporting Violations</h2>
        <p>To report a violation of our Terms of Service, such as harassment or inappropriate content, please contact the administrators directly at: <strong>admin@vignan.edu</strong></p>
        <h2 className="font-bold text-xl mt-6 mb-2">Visit Us</h2>
        <p>You can also visit us at the IT Department Office, Room 101, between 9:00 AM and 5:00 PM on weekdays.</p>
    </StaticPage>
);