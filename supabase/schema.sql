-- ============================================================
-- MOCKHIRE - COMPREHENSIVE POSTGRESQL SCHEMA & RLS POLICIES
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. COLLEGES TABLE
CREATE TABLE IF NOT EXISTS colleges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    college_code VARCHAR(50) UNIQUE NOT NULL,
    subscription_plan VARCHAR(50) DEFAULT 'STARTER', -- 'STARTER', 'GROWTH', 'INSTITUTION'
    subscription_end TIMESTAMPTZ,
    tpo_user_id UUID,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id UUID UNIQUE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('STUDENT', 'TPO', 'ADMIN')),
    college_id UUID REFERENCES colleges(id) ON DELETE SET NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    department VARCHAR(100),
    batch VARCHAR(50),
    register_number VARCHAR(100),
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. COMPANIES TABLE
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    logo_url TEXT,
    description TEXT,
    difficulty VARCHAR(50) DEFAULT 'MEDIUM',
    sample_questions_count INTEGER DEFAULT 0,
    test_blueprint_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. QUESTIONS TABLE (Curated Question Bank)
CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    category VARCHAR(100) NOT NULL, -- e.g., 'Aptitude', 'Programming', 'Communication', 'Technical'
    topic VARCHAR(100) NOT NULL,
    subtopic VARCHAR(100),
    difficulty VARCHAR(50) NOT NULL CHECK (difficulty IN ('EASY', 'MEDIUM', 'HARD')),
    question_type VARCHAR(50) NOT NULL CHECK (question_type IN ('MCQ', 'MULTI_SELECT', 'CODING', 'DESCRIPTIVE')),
    question_text TEXT NOT NULL,
    options JSONB DEFAULT '[]'::jsonb,
    correct_answer_encrypted TEXT NOT NULL, -- Server-side only, never sent to clients!
    explanation TEXT,
    coding_test_cases JSONB, -- For coding question evaluation
    source_type VARCHAR(50) DEFAULT 'COMPANY_PATTERN', -- 'SME', 'INTERNAL', 'COMPANY_PATTERN', 'VERIFIED_REFERENCE'
    source_confidence NUMERIC(3,2) DEFAULT 0.95,
    status VARCHAR(50) DEFAULT 'PUBLISHED' CHECK (status IN ('DRAFT', 'UNDER_REVIEW', 'APPROVED', 'PUBLISHED', 'REPORTED', 'RETIRED')),
    times_used INTEGER DEFAULT 0,
    attempt_count INTEGER DEFAULT 0,
    correct_count INTEGER DEFAULT 0,
    average_time_seconds INTEGER DEFAULT 60,
    reported_count INTEGER DEFAULT 0,
    approved_by UUID REFERENCES users(id),
    review_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. MOCK DRIVES TABLE (TPO College Mock Drives)
CREATE TABLE IF NOT EXISTS mock_drives (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    tpo_id UUID NOT NULL REFERENCES users(id),
    company_id UUID NOT NULL REFERENCES companies(id),
    drive_name VARCHAR(255) NOT NULL,
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 60,
    status VARCHAR(50) DEFAULT 'SCHEDULED' CHECK (status IN ('DRAFT', 'SCHEDULED', 'LIVE', 'COMPLETED', 'CANCELLED')),
    instructions TEXT,
    blueprint_override_json JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. MOCK SESSIONS TABLE
CREATE TABLE IF NOT EXISTS mock_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id),
    college_id UUID REFERENCES colleges(id),
    drive_id UUID REFERENCES mock_drives(id) ON DELETE SET NULL,
    session_type VARCHAR(50) NOT NULL CHECK (session_type IN ('SELF_MOCK', 'COLLEGE_DRIVE', 'PRACTICE')),
    status VARCHAR(50) DEFAULT 'IN_PROGRESS' CHECK (status IN ('IN_PROGRESS', 'SUBMITTED', 'EXPIRED', 'ABANDONED')),
    total_score NUMERIC(5,2),
    performance_score NUMERIC(5,2),
    readiness_score NUMERIC(5,2),
    integrity_score NUMERIC(5,2) DEFAULT 100.00,
    section_scores_json JSONB DEFAULT '{}'::jsonb,
    cheat_summary_json JSONB DEFAULT '{}'::jsonb,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. SESSION QUESTIONS TABLE
CREATE TABLE IF NOT EXISTS session_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES mock_sessions(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(id),
    position INTEGER NOT NULL,
    student_answer TEXT,
    is_correct BOOLEAN,
    time_taken_seconds INTEGER DEFAULT 0,
    ai_feedback_json JSONB,
    submitted_at TIMESTAMPTZ
);

-- 8. MOCK DRIVE STUDENTS (Relational student assignment)
CREATE TABLE IF NOT EXISTS mock_drive_students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    drive_id UUID NOT NULL REFERENCES mock_drives(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'INVITED' CHECK (status IN ('INVITED', 'IN_PROGRESS', 'SUBMITTED', 'MISSED')),
    started_at TIMESTAMPTZ,
    submitted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(drive_id, student_id)
);

-- 9. AI JOBS TABLE (Async evaluation queues)
CREATE TABLE IF NOT EXISTS ai_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES mock_sessions(id) ON DELETE CASCADE,
    question_id UUID REFERENCES questions(id),
    job_type VARCHAR(50) NOT NULL CHECK (job_type IN ('DESCRIPTIVE_EVAL', 'CODING_EXPLANATION', 'COMMUNICATION_FEEDBACK', 'SIMILARITY_CHECK')),
    status VARCHAR(50) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED')),
    input_payload JSONB NOT NULL,
    result_json JSONB,
    retry_count INTEGER DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- 10. CHEAT EVENTS TABLE (Integrity Monitoring Signals)
CREATE TABLE IF NOT EXISTS cheat_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES mock_sessions(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('TAB_SWITCH', 'WINDOW_BLUR', 'COPY', 'PASTE', 'UNUSUAL_SPEED', 'ANSWER_PATTERN_ANOMALY', 'SIMILARITY_FLAG')),
    event_data_json JSONB DEFAULT '{}'::jsonb,
    severity VARCHAR(50) DEFAULT 'LOW' CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH')),
    flagged_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    plan VARCHAR(50) NOT NULL CHECK (plan IN ('STARTER', 'GROWTH', 'INSTITUTION')),
    amount_paise BIGINT NOT NULL,
    valid_from TIMESTAMPTZ DEFAULT NOW(),
    valid_until TIMESTAMPTZ NOT NULL,
    razorpay_order_id VARCHAR(255),
    razorpay_payment_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'ACTIVE' CHECK (status IN ('PENDING', 'ACTIVE', 'EXPIRED', 'CANCELLED')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_college ON users(college_id);
CREATE INDEX IF NOT EXISTS idx_questions_company ON questions(company_id);
CREATE INDEX IF NOT EXISTS idx_questions_category_topic ON questions(category, topic);
CREATE INDEX IF NOT EXISTS idx_questions_status ON questions(status);
CREATE INDEX IF NOT EXISTS idx_mock_sessions_student ON mock_sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_mock_sessions_drive ON mock_sessions(drive_id);
CREATE INDEX IF NOT EXISTS idx_session_questions_session ON session_questions(session_id);
CREATE INDEX IF NOT EXISTS idx_cheat_events_session ON cheat_events(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_jobs_status ON ai_jobs(status);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_drives ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_drive_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE cheat_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- 1. COMPANIES (Publicly readable by all authenticated & anonymous users; admins can manage)
CREATE POLICY "Companies are viewable by everyone" ON companies
    FOR SELECT USING (true);

CREATE POLICY "Admins have full access to companies" ON companies
    FOR ALL USING (auth.jwt() ->> 'role' = 'ADMIN');

-- 2. QUESTIONS (Only published questions visible to students; correct answers hidden via API layer)
CREATE POLICY "Published questions viewable by authenticated users" ON questions
    FOR SELECT USING (status = 'PUBLISHED' OR auth.jwt() ->> 'role' = 'ADMIN');

CREATE POLICY "Admins have full access to questions" ON questions
    FOR ALL USING (auth.jwt() ->> 'role' = 'ADMIN');

-- 3. MOCK SESSIONS (Students only see their own sessions; TPOs see sessions in their college)
CREATE POLICY "Students see own sessions" ON mock_sessions
    FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Students can create own sessions" ON mock_sessions
    FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update own sessions" ON mock_sessions
    FOR UPDATE USING (auth.uid() = student_id);

CREATE POLICY "TPOs see their college sessions" ON mock_sessions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users WHERE users.id = auth.uid() 
            AND users.role = 'TPO' 
            AND users.college_id = mock_sessions.college_id
        )
    );

CREATE POLICY "Admins have full access to mock sessions" ON mock_sessions
    FOR ALL USING (auth.jwt() ->> 'role' = 'ADMIN');

-- 4. CHEAT EVENTS
CREATE POLICY "Students can insert own cheat events" ON cheat_events
    FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "TPOs and Admins view cheat events" ON cheat_events
    FOR SELECT USING (
        auth.jwt() ->> 'role' = 'ADMIN' OR
        EXISTS (
            SELECT 1 FROM users WHERE (users.id = auth.uid() OR users.auth_user_id = auth.uid()) AND users.role = 'TPO'
        )
    );

-- 5. USERS TABLE POLICIES
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (
        auth.uid() = id OR 
        auth.uid() = auth_user_id OR
        auth.jwt() ->> 'role' = 'ADMIN'
    );

CREATE POLICY "TPOs can view students in their college" ON users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users AS tpo 
            WHERE (tpo.id = auth.uid() OR tpo.auth_user_id = auth.uid()) 
            AND tpo.role = 'TPO' 
            AND tpo.college_id = users.college_id
        )
    );

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (
        auth.uid() = id OR auth.uid() = auth_user_id
    ) WITH CHECK (
        -- Regular users cannot elevate their own role
        role = (SELECT role FROM users WHERE id = auth.uid() OR auth_user_id = auth.uid())
    );

CREATE POLICY "Admins have full access to users" ON users
    FOR ALL USING (auth.jwt() ->> 'role' = 'ADMIN');

-- 6. COLLEGES TABLE POLICIES
CREATE POLICY "Colleges are viewable by authenticated users" ON colleges
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "TPOs can update their assigned college" ON colleges
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE (users.id = auth.uid() OR users.auth_user_id = auth.uid()) 
            AND users.role = 'TPO' 
            AND users.college_id = colleges.id
        )
    );

CREATE POLICY "Admins have full access to colleges" ON colleges
    FOR ALL USING (auth.jwt() ->> 'role' = 'ADMIN');

-- 7. MOCK DRIVES TABLE POLICIES
CREATE POLICY "TPOs can manage drives in their college" ON mock_drives
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE (users.id = auth.uid() OR users.auth_user_id = auth.uid()) 
            AND users.role = 'TPO' 
            AND users.college_id = mock_drives.college_id
        )
    );

CREATE POLICY "Students can view assigned drives" ON mock_drives
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM mock_drive_students 
            WHERE mock_drive_students.drive_id = mock_drives.id 
            AND (mock_drive_students.student_id = auth.uid() OR EXISTS (
                SELECT 1 FROM users WHERE users.id = mock_drive_students.student_id AND (users.id = auth.uid() OR users.auth_user_id = auth.uid())
            ))
        )
    );

CREATE POLICY "Admins have full access to mock drives" ON mock_drives
    FOR ALL USING (auth.jwt() ->> 'role' = 'ADMIN');

-- 8. MOCK DRIVE STUDENTS (ASSIGNMENTS)
CREATE POLICY "Students can view their own drive invitations" ON mock_drive_students
    FOR SELECT USING (
        student_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = mock_drive_students.student_id 
            AND (users.id = auth.uid() OR users.auth_user_id = auth.uid())
        )
    );

CREATE POLICY "TPOs can manage student assignments for their college drives" ON mock_drive_students
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM mock_drives 
            JOIN users ON users.college_id = mock_drives.college_id 
            WHERE mock_drives.id = mock_drive_students.drive_id 
            AND (users.id = auth.uid() OR users.auth_user_id = auth.uid()) 
            AND users.role = 'TPO'
        )
    );

CREATE POLICY "Admins have full access to drive assignments" ON mock_drive_students
    FOR ALL USING (auth.jwt() ->> 'role' = 'ADMIN');

-- 9. SESSION QUESTIONS
CREATE POLICY "Students can view questions for own session" ON session_questions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM mock_sessions 
            WHERE mock_sessions.id = session_questions.session_id 
            AND (mock_sessions.student_id = auth.uid() OR EXISTS (
                SELECT 1 FROM users WHERE users.id = mock_sessions.student_id AND (users.id = auth.uid() OR users.auth_user_id = auth.uid())
            ))
        )
    );

CREATE POLICY "Students can submit answers for own session" ON session_questions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM mock_sessions 
            WHERE mock_sessions.id = session_questions.session_id 
            AND (mock_sessions.student_id = auth.uid() OR EXISTS (
                SELECT 1 FROM users WHERE users.id = mock_sessions.student_id AND (users.id = auth.uid() OR users.auth_user_id = auth.uid())
            ))
        )
    );

CREATE POLICY "TPOs can view questions for their college sessions" ON session_questions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM mock_sessions 
            JOIN users ON users.college_id = mock_sessions.college_id 
            WHERE mock_sessions.id = session_questions.session_id 
            AND (users.id = auth.uid() OR users.auth_user_id = auth.uid()) 
            AND users.role = 'TPO'
        )
    );

CREATE POLICY "Admins have full access to session questions" ON session_questions
    FOR ALL USING (auth.jwt() ->> 'role' = 'ADMIN');

-- 10. AI JOBS
CREATE POLICY "Students can view AI jobs for own session" ON ai_jobs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM mock_sessions 
            WHERE mock_sessions.id = ai_jobs.session_id 
            AND (mock_sessions.student_id = auth.uid() OR EXISTS (
                SELECT 1 FROM users WHERE users.id = mock_sessions.student_id AND (users.id = auth.uid() OR users.auth_user_id = auth.uid())
            ))
        )
    );

CREATE POLICY "Admins have full access to AI jobs" ON ai_jobs
    FOR ALL USING (auth.jwt() ->> 'role' = 'ADMIN');

-- 11. SUBSCRIPTIONS
CREATE POLICY "TPOs can view subscription for their college" ON subscriptions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE (users.id = auth.uid() OR users.auth_user_id = auth.uid()) 
            AND users.role = 'TPO' 
            AND users.college_id = subscriptions.college_id
        )
    );

CREATE POLICY "Admins have full access to subscriptions" ON subscriptions
    FOR ALL USING (auth.jwt() ->> 'role' = 'ADMIN');

-- ============================================================
-- AUTOMATIC AUTH USER SYNC (GOOGLE AUTH & EMAIL SIGNUP)
-- SECURITY: ALWAYS assigns role = 'STUDENT'. Never trusts client metadata!
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (
    id,
    auth_user_id,
    email,
    full_name,
    role,
    avatar_url
  )
  VALUES (
    NEW.id,
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    'STUDENT', -- SECURITY: Strictly default to STUDENT. Role elevation requires authenticated admin action.
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (email) DO UPDATE SET
    auth_user_id = EXCLUDED.auth_user_id,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute on new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- SUPABASE REALTIME REPLICATION SETUP
-- Enables live updates for student sessions, proctoring events, and drives
-- ============================================================
BEGIN;
  -- Drop if already exists to prevent duplicate error
  ALTER PUBLICATION supabase_realtime ADD TABLE mock_sessions;
  ALTER PUBLICATION supabase_realtime ADD TABLE cheat_events;
  ALTER PUBLICATION supabase_realtime ADD TABLE mock_drives;
COMMIT;

