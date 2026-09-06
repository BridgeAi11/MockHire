# ==============================================================================
# MOCKHIRE - REAL-TIME FULLSTACK INTEGRATION & DEPLOYMENT GUIDE
# ==============================================================================

This guide provides the complete, production-grade instructions to connect **MockHire**
with external cloud infrastructure:
1. **Supabase** (PostgreSQL Database, Row-Level Security & Realtime WebSockets)
2. **Google Authentication** (Google Cloud OAuth 2.0 Client Credentials)
3. **Database Migrations & Seed Data**
4. **Real-time Live Telemetry & Proctoring Subscriptions**
5. **Local Execution & Cloud Production Deployment**

---

## 1. ARCHITECTURE OVERVIEW

MockHire operates as a hybrid full-stack system:
- **Frontend & API Engine**: Next.js 14 (App Router) with React 18, Tailwind CSS, TypeScript.
- **Backend & Database**: Supabase managed PostgreSQL with Row Level Security (RLS).
- **Authentication**: Supabase Auth with Google OAuth provider and Email/Password.
- **Real-Time Communication**: Supabase Realtime Channels (PostgreSQL replication via WebSockets).
- **Graceful Fallback**: If external credentials are absent during local testing, built-in mock/demo engines activate automatically so development never stalls.

---

## 2. SUPABASE PROJECT SETUP

### Step 2.1: Create your Supabase Project
1. Navigate to [https://supabase.com](https://supabase.com) and log in or sign up.
2. Click **New Project** and configure:
   - **Name**: `MockHire-Production` (or your preferred name)
   - **Database Password**: Choose a strong password and save it securely.
   - **Region**: Select the region closest to your users (e.g., `ap-south-1` for India / Mumbai).
   - **Plan**: Free tier or Pro tier.
3. Wait ~2 minutes for the database instance to provision.

### Step 2.2: Retrieve API Keys & Connection Strings
1. In your Supabase Dashboard, go to **Project Settings** (gear icon) -> **API**.
2. Locate and copy:
   - **Project URL**: `https://<YOUR-PROJECT-ID>.supabase.co`
   - **Project API Keys -> `anon` (public)**: Used by client-side frontend
   - **Project API Keys -> `service_role` (secret)**: Used only on the backend / API routes
3. Go to **Project Settings** -> **Database**:
   - Copy the **Connection String (URI)** or **Transaction Pooler URL** (port 6543) for `DATABASE_URL`.

---

## 3. DATABASE SETUP & REAL-TIME MIGRATIONS

### Step 3.1: Execute Database Schema
1. In the Supabase Dashboard, click on **SQL Editor** on the left menu.
2. Click **+ New query**.
3. Open the file `supabase/schema.sql` from the repository, copy its entire contents, paste it into the query editor, and click **Run**.
4. This will create:
   - Tables: `colleges`, `users`, `companies`, `questions`, `mock_drives`, `mock_sessions`, `session_questions`, `mock_drive_students`, `ai_jobs`, `cheat_events`, `subscriptions`
   - High-performance indexes
   - Row Level Security (RLS) policies
   - Automatic user profile sync trigger `on_auth_user_created` (auto-syncs Google OAuth sign-ups to `public.users`)
   - Supabase Realtime publication setup for `mock_sessions`, `cheat_events`, and `mock_drives`

### Step 3.2: Seed Initial Companies & Question Bank
1. Open a new query tab in the Supabase **SQL Editor**.
2. Copy the contents of `supabase/seed.sql` from this repository.
3. Paste into the SQL editor and click **Run**.
4. You will see companies (TCS, Infosys, Wipro, Accenture, Amazon) and curated company-pattern questions populated instantly.

### Step 3.3: Verify Realtime Replication
1. In Supabase Dashboard, navigate to **Database** -> **Replication**.
2. Look at the `supabase_realtime` publication:
   - Verify that `mock_sessions`, `cheat_events`, and `mock_drives` have their switches toggled **ON**.
   - If not toggled, click on the publication and enable these three tables.

---

## 4. GOOGLE AUTHENTICATION SETUP (OAUTH 2.0)

### Step 4.1: Google Cloud Console Setup
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one (e.g., `MockHire-Auth`).
3. In the search bar, search for **APIs & Services** -> **OAuth consent screen**:
   - Choose **External** user type and click **Create**.
   - Fill in:
     - **App name**: `MockHire`
     - **User support email**: Your email
     - **Developer contact information**: Your email
   - Click **Save and Continue**.
   - In **Scopes**, add `.../auth/userinfo.email`, `.../auth/userinfo.profile`, and `openid`. Click **Save and Continue**.
   - Under **Test users** (if in testing mode), add your personal Google email address so you can test logging in.
   - Click **Back to Dashboard**.

### Step 4.2: Create OAuth 2.0 Credentials
1. Go to **APIs & Services** -> **Credentials**.
2. Click **+ CREATE CREDENTIALS** -> **OAuth client ID**.
3. Choose:
   - **Application type**: `Web application`
   - **Name**: `MockHire Web Client`
   - **Authorized JavaScript origins**:
     - `http://localhost:3000`
     - `https://<YOUR-PROJECT-ID>.supabase.co`
     - `https://your-domain.vercel.app` (when deployed)
   - **Authorized redirect URIs**:
     - `https://<YOUR-PROJECT-ID>.supabase.co/auth/v1/callback`
       *(Replace `<YOUR-PROJECT-ID>` with your exact Supabase project reference)*
4. Click **Create**.
5. A popup will appear displaying:
   - **Client ID** (e.g., `xxxxxxxxxxxx-xxxxxxxxxxxxxxxx.apps.googleusercontent.com`)
   - **Client Secret** (e.g., `GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxx`)
   - Copy both securely.

### Step 4.3: Configure Supabase Auth Provider
1. Return to your **Supabase Dashboard**.
2. Click on **Authentication** (lock icon) -> **Providers**.
3. Locate **Google** in the list and toggle it **ON**.
4. Paste your:
   - **Client ID** (from Google Cloud Console)
   - **Client Secret** (from Google Cloud Console)
5. Click **Save**.
6. Under **Authentication** -> **URL Configuration**:
   - Set **Site URL**: `http://localhost:3000` (for local development) or `https://your-production-domain.com`
   - In **Redirect URLs**, ensure the following are present:
     - `http://localhost:3000/auth/callback`
     - `https://<YOUR-APP-URL>/auth/callback`

---

## 5. ENVIRONMENT VARIABLES CONFIGURATION

Create a `.env.local` file in the root directory `c:\MockHire\` (this file is excluded from Git to prevent secret exposure):

```bash
# -------------------------------------------------------------
# MOCKHIRE ENVIRONMENT CONFIGURATION (.env.local)
# -------------------------------------------------------------

# Supabase Public Configuration (accessible in browser)
NEXT_PUBLIC_SUPABASE_URL=https://<YOUR-SUPABASE-PROJECT-ID>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Supabase Server-Only Secret Key (never exposed to browser)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# PostgreSQL Direct Connection URL
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.<YOUR-SUPABASE-PROJECT-ID>.supabase.co:5432/postgres

# Application Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ENABLE_WEBCAM=true
```

---

## 6. HOW TO RUN THE APPLICATION

### 6.1 Local Development
Open your terminal in `c:\MockHire\`:

```bash
# Install dependencies (if not already installed)
npm install

# Start development server
npm run dev
```

Open your browser at [http://localhost:3000](http://localhost:3000).

### 6.2 Testing Real-Time Features
1. **Google OAuth Sign In**:
   - Go to `http://localhost:3000/login`.
   - Click **Continue with Google**.
   - Authenticate with your Google account.
   - You will be redirected via `/auth/callback` straight into the Student Dashboard.
   - Your account is automatically synced to the `users` table in PostgreSQL!
2. **Real-Time Student Test Submission**:
   - As a student, start a mock assessment (e.g. TCS or Amazon).
   - Complete questions and submit.
   - The session record is automatically inserted into `mock_sessions` table in Supabase.
3. **Live TPO Proctoring Telemetry**:
   - Open a second browser or incognito window at `http://localhost:3000/login`.
   - Sign in or click **College TPO** demo shortcut to view the TPO Dashboard (`/tpo/dashboard` & `/tpo/integrity`).
   - Any test submissions or telemetry events broadcast over Supabase Realtime WebSockets instantly!

---

## 7. PRODUCTION DEPLOYMENT (VERCEL + SUPABASE)

1. Push your repository to GitHub: `https://github.com/BridgeAi11/MockHire.git`
2. Go to [https://vercel.com](https://vercel.com) and click **Add New** -> **Project**.
3. Import your `MockHire` GitHub repository.
4. In the **Environment Variables** section, paste all variables from your `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `DATABASE_URL`
   - `NEXT_PUBLIC_APP_URL` (set to your Vercel URL, e.g., `https://mockhire.vercel.app`)
5. Click **Deploy**.
6. Once deployed, copy your production Vercel URL:
   - In **Google Cloud Console**: add `https://mockhire.vercel.app` to Authorized Origins.
   - In **Supabase Dashboard**: add `https://mockhire.vercel.app/auth/callback` to Authentication Redirect URLs.
