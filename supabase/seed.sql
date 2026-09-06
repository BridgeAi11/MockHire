-- ============================================================
-- MOCKHIRE - SEED DATA SCRIPT
-- Run this in Supabase SQL Editor to populate initial companies and questions
-- ============================================================

-- 1. SEED COMPANIES
INSERT INTO companies (id, name, slug, logo_url, description, difficulty, is_active, sample_questions_count, test_blueprint_json)
VALUES 
(
  'a1111111-1111-1111-1111-111111111111',
  'Tata Consultancy Services',
  'tcs',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=128&auto=format&fit=crop&q=80',
  'TCS NQT pattern featuring Numerical Ability, Reasoning Ability, Verbal Ability, and Advanced Coding test sections.',
  'MEDIUM',
  true,
  35,
  '{
    "durationMinutes": 75,
    "totalQuestions": 30,
    "negativeMarking": false,
    "cutoffScorePercent": 65,
    "sections": [
      {"name": "Numerical Ability", "questionCount": 10, "durationMinutes": 25},
      {"name": "Reasoning Ability", "questionCount": 10, "durationMinutes": 25},
      {"name": "Verbal Ability", "questionCount": 10, "durationMinutes": 25}
    ],
    "instructions": [
      "No negative marking in foundation section",
      "Calculators are not allowed inside assessment",
      "Webcam telemetry must remain active throughout the session"
    ]
  }'::jsonb
),
(
  'a2222222-2222-2222-2222-222222222222',
  'Infosys',
  'infosys',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=128&auto=format&fit=crop&q=80',
  'Infosys Specialist & Systems Engineer pattern: Mathematical Thinking, Critical Thinking, and Hands-on Coding.',
  'MEDIUM',
  true,
  40,
  '{
    "durationMinutes": 100,
    "totalQuestions": 40,
    "negativeMarking": true,
    "cutoffScorePercent": 70,
    "sections": [
      {"name": "Mathematical Thinking", "questionCount": 15, "durationMinutes": 35},
      {"name": "Critical Reasoning", "questionCount": 15, "durationMinutes": 35},
      {"name": "Verbal Ability", "questionCount": 10, "durationMinutes": 30}
    ],
    "instructions": [
      "Negative marking applies: 0.25 deducted per incorrect response",
      "Sectional switching is locked once started",
      "Ensure an uninterrupted power and internet connection"
    ]
  }'::jsonb
),
(
  'a3333333-3333-3333-3333-333333333333',
  'Wipro',
  'wipro',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=128&auto=format&fit=crop&q=80',
  'Wipro Elite NTH assessment covering Aptitude, Written Communication, and Coding rounds.',
  'EASY',
  true,
  30,
  '{
    "durationMinutes": 60,
    "totalQuestions": 25,
    "negativeMarking": false,
    "cutoffScorePercent": 60,
    "sections": [
      {"name": "Logical Aptitude", "questionCount": 10, "durationMinutes": 20},
      {"name": "Quantitative Aptitude", "questionCount": 10, "durationMinutes": 20},
      {"name": "Verbal English", "questionCount": 5, "durationMinutes": 20}
    ],
    "instructions": [
      "Navigation between questions inside a section is permitted",
      "Review flagged questions before submitting"
    ]
  }'::jsonb
),
(
  'a4444444-4444-4444-4444-444444444444',
  'Accenture',
  'accenture',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=128&auto=format&fit=crop&q=80',
  'Accenture Cognitive and Technical Assessment with Critical Reasoning, Abstract Reasoning, and Technical MS Office / Cloud fundamentals.',
  'MEDIUM',
  true,
  45,
  '{
    "durationMinutes": 90,
    "totalQuestions": 45,
    "negativeMarking": false,
    "cutoffScorePercent": 65,
    "sections": [
      {"name": "Critical Reasoning", "questionCount": 15, "durationMinutes": 30},
      {"name": "Technical Essentials", "questionCount": 15, "durationMinutes": 30},
      {"name": "Coding Fundamentals", "questionCount": 15, "durationMinutes": 30}
    ],
    "instructions": [
      "Both cognitive and technical cutoffs must be cleared",
      "Full screen mode is enforced during test execution"
    ]
  }'::jsonb
),
(
  'a5555555-5555-5555-5555-555555555555',
  'Amazon',
  'amazon',
  'https://images.unsplash.com/photo-1523474255658-4af61b168344?w=128&auto=format&fit=crop&q=80',
  'Amazon SDE-1 Assessment: Advanced Algorithms, Data Structures, System Design Thinking, and Leadership Principles.',
  'HARD',
  true,
  25,
  '{
    "durationMinutes": 90,
    "totalQuestions": 20,
    "negativeMarking": true,
    "cutoffScorePercent": 80,
    "sections": [
      {"name": "Data Structures & Algorithms", "questionCount": 10, "durationMinutes": 45},
      {"name": "System Architecture", "questionCount": 5, "durationMinutes": 25},
      {"name": "Work Simulation & Logic", "questionCount": 5, "durationMinutes": 20}
    ],
    "instructions": [
      "Strict time complexity limits are enforced on coding evaluation",
      "Tab switching or window blurring immediately decrements integrity score"
    ]
  }'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  test_blueprint_json = EXCLUDED.test_blueprint_json;

-- 2. SEED QUESTIONS
INSERT INTO questions (
  company_id, category, topic, subtopic, difficulty, question_type, 
  question_text, options, correct_answer_encrypted, explanation, status
)
VALUES 
(
  'a1111111-1111-1111-1111-111111111111',
  'Aptitude',
  'Numerical Ability',
  'Time and Work',
  'MEDIUM',
  'MCQ',
  'A can complete a piece of work in 12 days and B can do it in 16 days. They work together for 4 days, then A leaves. How many more days will B take to complete the remaining work?',
  '[
    {"id": "opt-1", "text": "4 days"},
    {"id": "opt-2", "text": "6 days"},
    {"id": "opt-3", "text": "6.67 days"},
    {"id": "opt-4", "text": "8 days"}
  ]'::jsonb,
  'opt-3',
  '1 day work of A = 1/12, B = 1/16. Together 1 day = (4+3)/48 = 7/48. In 4 days = 28/48 = 7/12. Remaining work = 5/12. Time taken by B = (5/12) / (1/16) = (5/12) * 16 = 20/3 = 6.67 days.',
  'PUBLISHED'
),
(
  'a1111111-1111-1111-1111-111111111111',
  'Programming',
  'Data Structures',
  'Binary Trees',
  'EASY',
  'MCQ',
  'What is the maximum number of nodes in a binary tree of depth K (where depth of root is 1)?',
  '[
    {"id": "opt-1", "text": "2^K - 1"},
    {"id": "opt-2", "text": "2^(K-1)"},
    {"id": "opt-3", "text": "2^(K+1) - 1"},
    {"id": "opt-4", "text": "2*K - 1"}
  ]'::jsonb,
  'opt-1',
  'The maximum number of nodes on level i is 2^(i-1). Total maximum nodes across levels 1 to K is the sum of geometric series = 2^K - 1.',
  'PUBLISHED'
),
(
  'a2222222-2222-2222-2222-222222222222',
  'Aptitude',
  'Critical Reasoning',
  'Syllogisms',
  'MEDIUM',
  'MCQ',
  'Statements: Some clouds are smoke. All smoke are white. Conclusions: I. Some white are clouds. II. No cloud is white.',
  '[
    {"id": "opt-1", "text": "Only conclusion I follows"},
    {"id": "opt-2", "text": "Only conclusion II follows"},
    {"id": "opt-3", "text": "Either I or II follows"},
    {"id": "opt-4", "text": "Neither follows"}
  ]'::jsonb,
  'opt-1',
  'Since some clouds are smoke and all smoke are white, the clouds that are smoke are definitely white. Hence, some white are clouds follows directly.',
  'PUBLISHED'
),
(
  'a5555555-5555-5555-5555-555555555555',
  'Technical',
  'Algorithms',
  'Dynamic Programming',
  'HARD',
  'MCQ',
  'Given an array of positive integers, what is the best known time complexity to find if a subset sums to exactly Target T using dynamic programming?',
  '[
    {"id": "opt-1", "text": "O(N * T)"},
    {"id": "opt-2", "text": "O(2^N)"},
    {"id": "opt-3", "text": "O(N log N)"},
    {"id": "opt-4", "text": "O(T^2)"}
  ]'::jsonb,
  'opt-1',
  'Subset sum pseudo-polynomial solution runs in O(N * T) time and O(T) space using dynamic programming table/array.',
  'PUBLISHED'
);
