import React, { useState, useEffect } from 'react';
import { AppProvider, useAppContext } from './contexts/AppContext';
import { Page, UserRole, Navigation } from './types';
import { PublicPages } from './pages/PublicPages';
import { UserPages } from './pages/UserPages';
import { AdminPages } from './pages/AdminPages';

const App: React.FC = () => {
  return (
    <AppProvider>
      <Main />
    </AppProvider>
  );
};

const Main: React.FC = () => {
  const { currentUser, loading, theme } = useAppContext();
  const [page, setPage] = useState<Page>('home');
  const [params, setParams] = useState<Record<string, any>>({});
  
  // A user is considered "new" for 5 minutes after account creation.
  // This gives them time to complete their profile, even with a page refresh.
  // After this window, they are treated as an existing user and can access the dashboard
  // even with an incomplete profile.
  const isNewUser = currentUser && (new Date().getTime() - new Date(currentUser.createdAt).getTime()) < 5 * 60 * 1000;

  useEffect(() => {
    // Synchronize the dark mode class on the root <html> element with the theme state.
    // The second argument of `toggle` adds the class if true, and removes it if false.
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    if (!loading) {
      if (currentUser) {
          if (isNewUser && !currentUser.isProfileComplete) {
              setPage('profileSetup');
          } else if (currentUser.role === UserRole.Administrator) {
              setPage('adminDashboard');
          } else {
              setPage('dashboard');
          }
      } else {
        setPage('home');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, loading, isNewUser]);

  const navigate = (newPage: Page, newParams: Record<string, any> = {}) => {
    setPage(newPage);
    setParams(newParams);
    window.scrollTo(0, 0);
  };
  
  const navigationProps: Navigation & { page: Page; params: Record<string, any> } = {
      navigate,
      page,
      params,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="text-xl font-semibold text-gray-800 dark:text-gray-200">Loading...</div>
      </div>
    );
  }

  const renderPage = () => {
    if (!currentUser) {
      return <PublicPages {...navigationProps} />;
    }
    if (isNewUser && !currentUser.isProfileComplete && page !== 'profileSetup') {
        return <UserPages {...navigationProps} page="profileSetup" />;
    }
    if (currentUser.role === UserRole.Administrator) {
      return <AdminPages {...navigationProps} />;
    }
    return <UserPages {...navigationProps} />;
  };

  return (
      <div className="flex flex-col min-h-screen font-sans bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-gray-200">
          {renderPage()}
      </div>
  );
};

export default App;
