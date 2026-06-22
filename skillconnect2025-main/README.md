# Skill Connect

Skill Connect is a private networking and collaboration platform designed exclusively for members of an educational institution, including students, teaching faculty, and non-teaching faculty. The platform aims to foster innovation and project-based learning by making it easy to find skilled collaborators and manage projects within a secure, trusted community.

## Key Features

### For Students & Faculty
- **Profile Management**: Create and manage a detailed profile showcasing skills, bio, contact information, and social links.
- **Project Marketplace**: Post new project ideas, search for existing projects, and request to join teams.
- **Skill-Based Search**: Find other members (students or faculty) based on their specific skills to build the perfect team.
- **Collaboration Workflow**: Send and receive requests to collaborate on projects.
- **Notifications**: Stay updated on collaboration requests and their status (accepted/rejected).
- **Peer Rating System**: Rate team members upon project completion to build a reputation system within the community.

### For Administrators
- **Admin Dashboard**: Get a high-level overview of platform statistics, including total users, active projects, and pending reports.
- **User Management**: View all users, and ban or unban accounts to maintain community standards.
- **Skill Management**: Approve or reject new skills suggested by users to maintain a curated list.
- **Project Management**: Feature interesting or important projects to increase their visibility.
- **Announcements**: Post announcements that are displayed to all users on their dashboard.

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend & Database**: Supabase (Authentication, PostgreSQL Database, Row Level Security, Storage, Edge Functions via Triggers)
- **State Management**: React Context API

## Getting Started: Local Development Setup

To run the Skill Connect application locally, you need Node.js, a code editor, and a Supabase project.

### Step 1: Install Dependencies

First, navigate to the project directory and install the required npm packages.

```bash
npm install
```

### Step 2: Create a Supabase Project

1.  Go to [supabase.com](https://supabase.com) and sign in or create a new account.
2.  Click on "**New project**".
3.  Choose an organization, give your project a **Name**, generate a secure **Database Password**, and select a **Region**.
4.  Click "**Create project**" and wait for it to be provisioned.

### Step 3: Get Supabase API Credentials

1.  In your Supabase project dashboard, navigate to **Project Settings** (gear icon) > **API**.
2.  Under "Project API keys", you will find your **Project URL** and the `anon` **public** key. You'll need these next.

### Step 4: Configure the Application

1.  In the project's source code, open the file: `src/contexts/AppContext.tsx`.
2.  Locate these two constant variables at the top of the file:
    ```typescript
    const supabaseUrl = 'YOUR_SUPABASE_URL';
    const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
    ```
3.  Replace the placeholder values with the **Project URL** and `anon` **public** key you copied from your Supabase settings.

### Step 5: Disable Email Confirmation (Important!)

To allow users to log in immediately after signing up (as intended for this internal platform), you must disable email confirmation.

1.  In your Supabase project dashboard, navigate to **Authentication** (the user icon in the left sidebar).
2.  In the **Configuration** section, click on **Providers**.
3.  Click on the **Email** provider.
4.  Find the **Confirm email** toggle and switch it **OFF**.

### Step 6: Set Up the Database Schema

The application requires a specific database structure. A complete SQL script is provided in the `schema.sql` file located in the root of this project. This script will set up all the required tables, user roles, security policies, and automation (triggers) for the application to function correctly.

The script is **idempotent**, meaning you can run it multiple times without causing errors. It will automatically clean up old database objects before creating new ones.

1.  In your Supabase project dashboard, navigate to the **SQL Editor** (the database icon).
2.  Click **+ New query**.
3.  Open the `schema.sql` file from the project's source code.
4.  Copy the **entire contents** of the file.
5.  Paste the SQL script into the Supabase SQL Editor.
6.  Click the **RUN** button. A "Success" message confirms it worked.

This script will:
- Create all the necessary tables (`users`, `projects`, `skills`, etc.).
- Define custom data types (`ENUMS`) for consistency.
- Implement Row Level Security (RLS) policies to secure your data.
- **Crucially, it sets up a trigger (`on_auth_user_created`) that automatically creates a user profile in the `public.users` table whenever a new user signs up. This is essential for the app's functionality.**

### Step 7: Run the Development Server

You're all set! To start the local development server, run:

```bash
npm run dev
```

The application will now be running, typically at `http://localhost:5173`.

## Deployment

This project is configured to be easily deployed on services like Netlify, Vercel, or Render.

1.  Push your code to a Git provider (GitHub, GitLab, etc.).
2.  Connect your repository to your chosen hosting service.
3.  Configure the build settings (most services will auto-detect Vite):
    -   **Build Command**: `npm run build`
    -   **Publish Directory**: `dist`
4.  Make sure to set your Supabase URL and Anon Key as environment variables in your hosting provider's settings. You would then access them in your code via `import.meta.env.VITE_SUPABASE_URL` and `import.meta.env.VITE_SUPABASE_ANON_KEY` instead of hardcoding them.
5.  Deploy!"# SkillConnect" 
"# skillconnect2025" 
