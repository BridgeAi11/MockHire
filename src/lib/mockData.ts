// ============================================================
// MOCKHIRE CURATED COMPANY BLUEPRINTS & QUESTION BANKS
// Note: Assessment questions are CURATED COMPANY-PATTERN, NOT AI-generated.
// ============================================================

import { Company, Question, MockDrive, UserProfile, MockSession } from "@/types";

export const COMPANIES_DATA: Company[] = [
  {
    id: "comp-tcs",
    name: "TCS",
    slug: "tcs",
    logoUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=128&auto=format&fit=crop&q=80",
    description: "Company-pattern NQT blueprint focusing on Numerical Ability, Verbal Reasoning, and Advanced Hands-on Coding.",
    badge: "NQT Pattern",
    difficulty: "MEDIUM",
    isActive: true,
    sampleQuestionsCount: 85,
    averageReadinessScore: 78,
    blueprint: {
      totalQuestions: 25,
      durationMinutes: 45,
      negativeMarking: false,
      cutoffScorePercent: 70,
      instructions: [
        "Assessment pattern simulates the standard Tata Consultancy Services national qualifier structure.",
        "Navigation between sections is enabled; timer is collective.",
        "Server-side validation ensures integrity checks for tab switching.",
        "No dynamic AI questions are generated; questions are drawn from verified pattern banks."
      ],
      sections: [
        {
          name: "Numerical Ability",
          questionCount: 10,
          durationMinutes: 15,
          difficulty: { easy: 3, medium: 5, hard: 2 }
        },
        {
          name: "Verbal & Reasoning",
          questionCount: 10,
          durationMinutes: 15,
          difficulty: { easy: 3, medium: 5, hard: 2 }
        },
        {
          name: "Hands-on Coding",
          questionCount: 5,
          durationMinutes: 15,
          difficulty: { easy: 1, medium: 3, hard: 1 }
        }
      ]
    }
  },
  {
    id: "comp-infosys",
    name: "Infosys",
    slug: "infosys",
    logoUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=128&auto=format&fit=crop&q=80",
    description: "Springboard / Specialist pattern blueprint focusing on Mathematical Reasoning, Technical Pseudo-code, and Verbal Ability.",
    badge: "Specialist Pattern",
    difficulty: "HARD",
    isActive: true,
    sampleQuestionsCount: 75,
    averageReadinessScore: 68,
    blueprint: {
      totalQuestions: 20,
      durationMinutes: 40,
      negativeMarking: true,
      cutoffScorePercent: 65,
      instructions: [
        "Time-restricted section format replicating Infosys technical assessment tracks.",
        "Negative marking applies: -0.25 marks for incorrect multiple-choice submissions.",
        "Pseudo-code questions test memory layout, pointer logic, and recursive call stacks."
      ],
      sections: [
        {
          name: "Reasoning Ability",
          questionCount: 8,
          durationMinutes: 15,
          difficulty: { easy: 2, medium: 4, hard: 2 }
        },
        {
          name: "Technical Pseudo-code",
          questionCount: 8,
          durationMinutes: 15,
          difficulty: { easy: 1, medium: 4, hard: 3 }
        },
        {
          name: "Verbal Ability",
          questionCount: 4,
          durationMinutes: 10,
          difficulty: { easy: 2, medium: 2, hard: 0 }
        }
      ]
    }
  },
  {
    id: "comp-accenture",
    name: "Accenture",
    slug: "accenture",
    logoUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=128&auto=format&fit=crop&q=80",
    description: "Cognitive Assessment & Technical Core blueprint evaluating Critical Thinking, Cloud/Network Fundamentals, and Coding.",
    badge: "Cognitive & Tech",
    difficulty: "MEDIUM",
    isActive: true,
    sampleQuestionsCount: 90,
    averageReadinessScore: 74,
    blueprint: {
      totalQuestions: 25,
      durationMinutes: 45,
      negativeMarking: false,
      cutoffScorePercent: 72,
      instructions: [
        "Elimination round structure: Cognitive ability followed immediately by technical core competency.",
        "Questions are balanced across critical reasoning and modern cloud/security concepts."
      ],
      sections: [
        {
          name: "Cognitive Assessment",
          questionCount: 12,
          durationMinutes: 20,
          difficulty: { easy: 4, medium: 6, hard: 2 }
        },
        {
          name: "Technical Core",
          questionCount: 8,
          durationMinutes: 15,
          difficulty: { easy: 2, medium: 4, hard: 2 }
        },
        {
          name: "Coding Implementation",
          questionCount: 5,
          durationMinutes: 10,
          difficulty: { easy: 2, medium: 2, hard: 1 }
        }
      ]
    }
  },
  {
    id: "comp-wipro",
    name: "Wipro",
    slug: "wipro",
    logoUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=128&auto=format&fit=crop&q=80",
    description: "Elite NLTH pattern blueprint featuring Quantitative Aptitude, Logical Reasoning, and Written Communication feedback.",
    badge: "Elite NLTH",
    difficulty: "EASY",
    isActive: true,
    sampleQuestionsCount: 65,
    averageReadinessScore: 82,
    blueprint: {
      totalQuestions: 20,
      durationMinutes: 35,
      negativeMarking: false,
      cutoffScorePercent: 68,
      instructions: [
        "Wipro NLTH pattern emphasizes speed and quantitative accuracy.",
        "Includes descriptive communication evaluation graded via asynchronous AI criteria."
      ],
      sections: [
        {
          name: "Quantitative Aptitude",
          questionCount: 8,
          durationMinutes: 15,
          difficulty: { easy: 3, medium: 4, hard: 1 }
        },
        {
          name: "Logical Reasoning",
          questionCount: 8,
          durationMinutes: 12,
          difficulty: { easy: 3, medium: 4, hard: 1 }
        },
        {
          name: "Communication / Essay",
          questionCount: 4,
          durationMinutes: 8,
          difficulty: { easy: 1, medium: 2, hard: 1 }
        }
      ]
    }
  },
  {
    id: "comp-cognizant",
    name: "Cognizant",
    slug: "cognizant",
    logoUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=128&auto=format&fit=crop&q=80",
    description: "GenC & GenC Next pattern featuring Analytical Problem Solving, Database SQL queries, and Data Structures.",
    badge: "GenC Pattern",
    difficulty: "MEDIUM",
    isActive: true,
    sampleQuestionsCount: 70,
    averageReadinessScore: 71,
    blueprint: {
      totalQuestions: 22,
      durationMinutes: 40,
      negativeMarking: false,
      cutoffScorePercent: 70,
      instructions: [
        "Cognizant GenC track assessing problem decomposition and database query structures.",
        "All queries and choices are evaluated deterministically on the server."
      ],
      sections: [
        {
          name: "Analytical Aptitude",
          questionCount: 10,
          durationMinutes: 15,
          difficulty: { easy: 3, medium: 5, hard: 2 }
        },
        {
          name: "SQL & Data Engineering",
          questionCount: 7,
          durationMinutes: 15,
          difficulty: { easy: 2, medium: 3, hard: 2 }
        },
        {
          name: "Programming Concepts",
          questionCount: 5,
          durationMinutes: 10,
          difficulty: { easy: 1, medium: 3, hard: 1 }
        }
      ]
    }
  }
];

export const CURATED_QUESTIONS_BANK: Question[] = [
  // --- TCS PATTERN QUESTIONS ---
  {
    id: "q-tcs-1",
    companyId: "comp-tcs",
    companySlug: "tcs",
    category: "Numerical Ability",
    topic: "Work and Time",
    subtopic: "Pipes and Cisterns",
    difficulty: "EASY",
    questionType: "MCQ",
    questionText: "Pipe A can fill a tank in 12 hours, while Pipe B can empty the same tank in 18 hours. If both pipes are opened simultaneously into an initially empty tank, how many hours will it take to fill the tank completely?",
    options: [
      { id: "opt-1", text: "24 hours" },
      { id: "opt-2", text: "30 hours" },
      { id: "opt-3", text: "36 hours" },
      { id: "opt-4", text: "42 hours" }
    ],
    correctAnswer: "opt-3",
    explanation: "Rate of Pipe A = 1/12 tank/hr. Rate of Pipe B = -1/18 tank/hr. Combined net rate = 1/12 - 1/18 = (3 - 2)/36 = 1/36 tank/hr. Thus, the tank fills in 36 hours.",
    sourceType: "COMPANY_PATTERN",
    sourceConfidence: 0.98,
    status: "PUBLISHED",
    timesUsed: 1420,
    attemptCount: 1390,
    correctCount: 1112,
    averageTimeSeconds: 48
  },
  {
    id: "q-tcs-2",
    companyId: "comp-tcs",
    companySlug: "tcs",
    category: "Numerical Ability",
    topic: "Percentages and Profit",
    subtopic: "Successive Discounts",
    difficulty: "MEDIUM",
    questionType: "MCQ",
    questionText: "A retailer marks an electronic gadget 40% above its production cost. During a festival sale, he offers two successive discounts of 15% and 10%. What is his net profit or loss percentage on the item?",
    options: [
      { id: "opt-1", text: "7.1% Profit" },
      { id: "opt-2", text: "8.4% Profit" },
      { id: "opt-3", text: "9.2% Loss" },
      { id: "opt-4", text: "12.0% Profit" }
    ],
    correctAnswer: "opt-1",
    explanation: "Let Cost Price = 100. Marked Price = 140. Selling Price = 140 * (1 - 0.15) * (1 - 0.10) = 140 * 0.85 * 0.90 = 107.10. Net Profit = 107.10 - 100 = 7.10%.",
    sourceType: "COMPANY_PATTERN",
    sourceConfidence: 0.97,
    status: "PUBLISHED",
    timesUsed: 980,
    attemptCount: 950,
    correctCount: 684,
    averageTimeSeconds: 62
  },
  {
    id: "q-tcs-3",
    companyId: "comp-tcs",
    companySlug: "tcs",
    category: "Verbal & Reasoning",
    topic: "Logical Deduction",
    subtopic: "Syllogism",
    difficulty: "MEDIUM",
    questionType: "MCQ",
    questionText: "Statements: All algorithms are instructions. Some instructions are compiled. No compiled code is interpreted.\nConclusions:\nI. Some algorithms are compiled.\nII. No compiled code is an algorithm.\nWhich conclusion(s) logically follow?",
    options: [
      { id: "opt-1", text: "Only Conclusion I follows" },
      { id: "opt-2", text: "Only Conclusion II follows" },
      { id: "opt-3", text: "Neither Conclusion I nor II necessarily follows" },
      { id: "opt-4", text: "Both Conclusions I and II follow" }
    ],
    correctAnswer: "opt-3",
    explanation: "Because algorithms are merely a subset of instructions, and only 'some' instructions are compiled, there is no definite overlap required between algorithms and compiled instructions. Therefore, neither statement necessarily follows.",
    sourceType: "COMPANY_PATTERN",
    sourceConfidence: 0.96,
    status: "PUBLISHED",
    timesUsed: 1104,
    attemptCount: 1080,
    correctCount: 594,
    averageTimeSeconds: 52
  },
  {
    id: "q-tcs-4",
    companyId: "comp-tcs",
    companySlug: "tcs",
    category: "Hands-on Coding",
    topic: "Data Structures",
    subtopic: "Array Manipulation",
    difficulty: "MEDIUM",
    questionType: "CODING",
    questionText: "Given an array of integers `nums`, return the length of the longest contiguous subarray whose elements can be rearranged to form an arithmetic progression with a common difference of 1 (i.e. consecutive distinct numbers without duplicates).",
    codeSnippet: "function longestConsecutiveSubarray(nums: number[]): number {\n  // Write your code here\n}",
    correctAnswer: "O(n^2) or hashset sliding window solution",
    explanation: "For each subarray, check if max - min === right - left and all elements are distinct. The maximum length satisfying this constraint is the answer.",
    testCases: [
      { id: "tc-1", input: "[10, 12, 11]", expectedOutput: "3", isHidden: false },
      { id: "tc-2", input: "[14, 12, 11, 20]", expectedOutput: "2", isHidden: false },
      { id: "tc-3", input: "[1, 56, 58, 57, 90, 92, 94, 93, 91, 45]", expectedOutput: "5", isHidden: true }
    ],
    sourceType: "COMPANY_PATTERN",
    sourceConfidence: 0.95,
    status: "PUBLISHED",
    timesUsed: 890,
    attemptCount: 840,
    correctCount: 420,
    averageTimeSeconds: 210
  },

  // --- INFOSYS PATTERN QUESTIONS ---
  {
    id: "q-inf-1",
    companyId: "comp-infosys",
    companySlug: "infosys",
    category: "Technical Pseudo-code",
    topic: "Recursion & Memory",
    subtopic: "Stack Frames",
    difficulty: "HARD",
    questionType: "MCQ",
    questionText: "What will be the output printed by the following pseudo-code function when called with `mystery(3, 4)`?\n\nInteger mystery(Integer a, Integer b):\n  if (a == 0) return b + 1;\n  if (b == 0) return mystery(a - 1, 1);\n  return mystery(a - 1, mystery(a, b - 1));",
    options: [
      { id: "opt-1", text: "29" },
      { id: "opt-2", text: "125" },
      { id: "opt-3", text: "253" },
      { id: "opt-4", text: "61" }
    ],
    correctAnswer: "opt-2",
    explanation: "This is the Ackermann function A(m, n). For m = 3, A(3, n) = 2^(n + 3) - 3. Thus, for A(3, 4) = 2^(4 + 3) - 3 = 2^7 - 3 = 128 - 3 = 125.",
    sourceType: "COMPANY_PATTERN",
    sourceConfidence: 0.99,
    status: "PUBLISHED",
    timesUsed: 750,
    attemptCount: 710,
    correctCount: 228,
    averageTimeSeconds: 85
  },
  {
    id: "q-inf-2",
    companyId: "comp-infosys",
    companySlug: "infosys",
    category: "Reasoning Ability",
    topic: "Data Sufficiency",
    subtopic: "Linear Arrangements",
    difficulty: "MEDIUM",
    questionType: "MCQ",
    questionText: "Five engineers (P, Q, R, S, T) sit in a row facing north. Who sits in the exact middle?\nStatement 1: P is to the immediate right of Q, and S is to the immediate left of R.\nStatement 2: T is sitting at the extreme right end, and Q is adjacent to S.\nCan the question be answered?",
    options: [
      { id: "opt-1", text: "Statement 1 alone is sufficient" },
      { id: "opt-2", text: "Statement 2 alone is sufficient" },
      { id: "opt-3", text: "Both statements TOGETHER are sufficient" },
      { id: "opt-4", text: "Statements 1 and 2 together are NOT sufficient" }
    ],
    correctAnswer: "opt-3",
    explanation: "Combining both: T is at extreme right (position 5). Q and P are adjacent (QP). S and R are adjacent (SR). Q is adjacent to S. Order: S, R, Q, P, T or R, S, Q, P, T. With fixed adjacency, Q is in position 3 (the middle). Both statements together are sufficient.",
    sourceType: "COMPANY_PATTERN",
    sourceConfidence: 0.94,
    status: "PUBLISHED",
    timesUsed: 830,
    attemptCount: 800,
    correctCount: 440,
    averageTimeSeconds: 65
  },

  // --- ACCENTURE PATTERN QUESTIONS ---
  {
    id: "q-acc-1",
    companyId: "comp-accenture",
    companySlug: "accenture",
    category: "Technical Core",
    topic: "Database Systems",
    subtopic: "ACID & Isolation",
    difficulty: "MEDIUM",
    questionType: "MCQ",
    questionText: "In relational database transactions, which transaction isolation level prevents 'Non-repeatable Reads' and 'Dirty Reads' but may still permit 'Phantom Reads' under standard SQL-92 definition?",
    options: [
      { id: "opt-1", text: "Read Uncommitted" },
      { id: "opt-2", text: "Read Committed" },
      { id: "opt-3", text: "Repeatable Read" },
      { id: "opt-4", text: "Serializable" }
    ],
    correctAnswer: "opt-3",
    explanation: "Repeatable Read guarantees that any data read cannot change, preventing Dirty and Non-repeatable reads. However, range queries may still encounter newly inserted phantom rows unless Serializable isolation is used.",
    sourceType: "COMPANY_PATTERN",
    sourceConfidence: 0.98,
    status: "PUBLISHED",
    timesUsed: 1320,
    attemptCount: 1290,
    correctCount: 815,
    averageTimeSeconds: 40
  },
  {
    id: "q-acc-2",
    companyId: "comp-accenture",
    companySlug: "accenture",
    category: "Cognitive Assessment",
    topic: "Abstract Reasoning",
    subtopic: "Series Pattern",
    difficulty: "EASY",
    questionType: "MCQ",
    questionText: "Find the missing number in the sequence: 4, 18, 48, 100, 180, ?",
    options: [
      { id: "opt-1", text: "252" },
      { id: "opt-2", text: "294" },
      { id: "opt-3", text: "312" },
      { id: "opt-4", text: "276" }
    ],
    correctAnswer: "opt-2",
    explanation: "The pattern follows n^2 * (n + 1) or n^3 + n^2: for n=1: 1^2 * 2 = ? Wait: for n=1: 1^2*4? Let's check n=2: 2^2 * 1 = 4 (or 2^3 - 4); for n=3: 3^3 - 9 = 18; for n=4: 4^3 - 16 = 48; for n=5: 5^3 - 25 = 100; for n=6: 6^3 - 36 = 180; for n=7: 7^3 - 49 = 343 - 49 = 294.",
    sourceType: "COMPANY_PATTERN",
    sourceConfidence: 0.99,
    status: "PUBLISHED",
    timesUsed: 1600,
    attemptCount: 1550,
    correctCount: 1040,
    averageTimeSeconds: 50
  },

  // --- WIPRO PATTERN QUESTIONS ---
  {
    id: "q-wip-1",
    companyId: "comp-wipro",
    companySlug: "wipro",
    category: "Quantitative Aptitude",
    topic: "Probability",
    subtopic: "Independent Events",
    difficulty: "EASY",
    questionType: "MCQ",
    questionText: "A problem in mathematics is given to three engineering students A, B, and C whose chances of solving it independently are 1/2, 1/3, and 1/4 respectively. What is the probability that the problem is solved?",
    options: [
      { id: "opt-1", text: "1/4" },
      { id: "opt-2", text: "1/2" },
      { id: "opt-3", text: "3/4" },
      { id: "opt-4", text: "7/8" }
    ],
    correctAnswer: "opt-3",
    explanation: "P(solved) = 1 - P(none solve it). P(A fails) = 1/2, P(B fails) = 2/3, P(C fails) = 3/4. P(none) = (1/2) * (2/3) * (3/4) = 1/4. P(solved) = 1 - 1/4 = 3/4.",
    sourceType: "COMPANY_PATTERN",
    sourceConfidence: 0.99,
    status: "PUBLISHED",
    timesUsed: 2100,
    attemptCount: 2040,
    correctCount: 1690,
    averageTimeSeconds: 42
  },
  {
    id: "q-wip-2",
    companyId: "comp-wipro",
    companySlug: "wipro",
    category: "Communication / Essay",
    topic: "Professional Writing",
    subtopic: "Workplace Communication",
    difficulty: "MEDIUM",
    questionType: "DESCRIPTIVE",
    questionText: "In 150-250 words, describe the ethical and security considerations that engineering organizations must address when adopting public large language models for proprietary code synthesis.",
    correctAnswer: "Evaluated asynchronously via AI semantic and structured communication rubrics.",
    explanation: "A strong response addresses proprietary data leakage, intellectual property rights, licensing conflicts, hallucinations in safety-critical systems, and dependency risk.",
    sourceType: "COMPANY_PATTERN",
    sourceConfidence: 0.92,
    status: "PUBLISHED",
    timesUsed: 540,
    attemptCount: 510,
    correctCount: 460,
    averageTimeSeconds: 300
  },

  // --- COGNIZANT PATTERN QUESTIONS ---
  {
    id: "q-cog-1",
    companyId: "comp-cognizant",
    companySlug: "cognizant",
    category: "SQL & Data Engineering",
    topic: "Analytical SQL",
    subtopic: "Window Functions",
    difficulty: "MEDIUM",
    questionType: "MCQ",
    questionText: "Consider a table `employees(dept_id, emp_id, salary)`. Which query accurately ranks employees within each department in descending order of salary without skipping ranks in case of ties?",
    options: [
      { id: "opt-1", text: "SELECT emp_id, RANK() OVER(PARTITION BY dept_id ORDER BY salary DESC) FROM employees;" },
      { id: "opt-2", text: "SELECT emp_id, DENSE_RANK() OVER(PARTITION BY dept_id ORDER BY salary DESC) FROM employees;" },
      { id: "opt-3", text: "SELECT emp_id, ROW_NUMBER() OVER(PARTITION BY dept_id ORDER BY salary DESC) FROM employees;" },
      { id: "opt-4", text: "SELECT emp_id, NTILE(4) OVER(PARTITION BY dept_id ORDER BY salary DESC) FROM employees;" }
    ],
    correctAnswer: "opt-2",
    explanation: "DENSE_RANK() assigns consecutive rank values to unique salary quantities without skipping numbers when duplicates occur, unlike RANK().",
    sourceType: "COMPANY_PATTERN",
    sourceConfidence: 0.97,
    status: "PUBLISHED",
    timesUsed: 940,
    attemptCount: 910,
    correctCount: 655,
    averageTimeSeconds: 45
  },
  {
    id: "q-cog-2",
    companyId: "comp-cognizant",
    companySlug: "cognizant",
    category: "Analytical Aptitude",
    topic: "Data Interpretation",
    subtopic: "Speed, Time & Distance",
    difficulty: "EASY",
    questionType: "MCQ",
    questionText: "A train traveling at 72 km/h crosses a 250m long bridge in 20 seconds. What is the length of the train in meters?",
    options: [
      { id: "opt-1", text: "120 m" },
      { id: "opt-2", text: "150 m" },
      { id: "opt-3", text: "180 m" },
      { id: "opt-4", text: "200 m" }
    ],
    correctAnswer: "opt-2",
    explanation: "Speed in m/s = 72 * (5/18) = 20 m/s. Total distance covered in 20s = 20 * 20 = 400 meters. Total distance = Train Length + Bridge Length. Train Length = 400 - 250 = 150 meters.",
    sourceType: "COMPANY_PATTERN",
    sourceConfidence: 0.99,
    status: "PUBLISHED",
    timesUsed: 1890,
    attemptCount: 1840,
    correctCount: 1472,
    averageTimeSeconds: 42
  }
];

// Sample default user accounts for instant test verification
export const DEMO_USERS: Record<string, UserProfile> = {
  student: {
    id: "usr-student-001",
    email: "student@mockhire.com",
    fullName: "Aarav Sharma",
    role: "STUDENT",
    collegeId: "col-rvce",
    collegeName: "RV College of Engineering",
    department: "Computer Science & Engineering",
    batch: "2025",
    registerNumber: "1RV21CS042",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    createdAt: "2024-01-15T09:00:00Z"
  },
  tpo: {
    id: "usr-tpo-001",
    email: "tpo@mockhire.com",
    fullName: "Dr. Meenakshi Sundaram",
    role: "TPO",
    collegeId: "col-rvce",
    collegeName: "RV College of Engineering",
    department: "Head of Placement & Career Services",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
    createdAt: "2023-08-10T10:00:00Z"
  },
  admin: {
    id: "usr-admin-001",
    email: "admin@mockhire.com",
    fullName: "MockHire Platform Lead",
    role: "ADMIN",
    department: "Platform Engineering & Content Curation",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    createdAt: "2023-01-01T00:00:00Z"
  }
};

// Sample Mock Drives for TPO
export const DEMO_MOCK_DRIVES: MockDrive[] = [
  {
    id: "drv-001",
    collegeId: "col-rvce",
    collegeName: "RV College of Engineering",
    tpoId: "usr-tpo-001",
    companyId: "comp-tcs",
    companyName: "TCS",
    driveName: "TCS Prime & Digital Pre-Placement Mock 2025",
    scheduledAt: new Date(Date.now() + 86400000 * 2).toISOString(),
    durationMinutes: 45,
    status: "SCHEDULED",
    instructions: "Mandatory mock drive for all final year CSE, ISE, and ECE students.",
    totalStudentsAssigned: 320,
    studentsCompleted: 0
  },
  {
    id: "drv-002",
    collegeId: "col-rvce",
    collegeName: "RV College of Engineering",
    tpoId: "usr-tpo-001",
    companyId: "comp-infosys",
    companyName: "Infosys",
    driveName: "Infosys Specialist Assessment Drill #1",
    scheduledAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    durationMinutes: 40,
    status: "COMPLETED",
    instructions: "Evaluation drill for pseudo-code recursion and quantitative logic.",
    totalStudentsAssigned: 280,
    studentsCompleted: 264,
    averageScore: 71.4,
    averageReadiness: 69.8
  },
  {
    id: "drv-003",
    collegeId: "col-rvce",
    collegeName: "RV College of Engineering",
    tpoId: "usr-tpo-001",
    companyId: "comp-accenture",
    companyName: "Accenture",
    driveName: "Accenture Advanced Cognitive Mock Session",
    scheduledAt: new Date().toISOString(),
    durationMinutes: 45,
    status: "LIVE",
    instructions: "Active assessment session. Real-time integrity indicators enabled.",
    totalStudentsAssigned: 150,
    studentsCompleted: 88,
    averageScore: 76.2,
    averageReadiness: 74.5
  }
];

// Sample Student Historical Mock Sessions
export const DEMO_STUDENT_SESSIONS: MockSession[] = [
  {
    id: "ses-101",
    studentId: "usr-student-001",
    studentName: "Aarav Sharma",
    companyId: "comp-tcs",
    companyName: "TCS",
    companySlug: "tcs",
    sessionType: "SELF_MOCK",
    status: "SUBMITTED",
    startedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    completedAt: new Date(Date.now() - 86400000 * 1 + 2400000).toISOString(),
    durationMinutes: 45,
    totalScore: 82.5,
    performanceScore: 84.0,
    readinessScore: 81.0,
    integrityScore: 98.0,
    integrityStatus: "NORMAL",
    questionsCount: 25,
    answeredCount: 24,
    markedForReviewCount: 2,
    sectionScores: {
      "Numerical Ability": {
        sectionName: "Numerical Ability",
        score: 8.5,
        totalPossible: 10,
        accuracyPercent: 85,
        timeSpentSeconds: 780,
        questionsAnswered: 10,
        totalQuestions: 10
      },
      "Verbal & Reasoning": {
        sectionName: "Verbal & Reasoning",
        score: 8.0,
        totalPossible: 10,
        accuracyPercent: 80,
        timeSpentSeconds: 720,
        questionsAnswered: 9,
        totalQuestions: 10
      },
      "Hands-on Coding": {
        sectionName: "Hands-on Coding",
        score: 4.0,
        totalPossible: 5,
        accuracyPercent: 80,
        timeSpentSeconds: 900,
        questionsAnswered: 5,
        totalQuestions: 5
      }
    },
    cheatEventsSummary: {
      tabSwitches: 1,
      windowBlurs: 1,
      copyPastes: 0,
      unusualSpeedFlags: 0,
      totalFlags: 2
    }
  },
  {
    id: "ses-102",
    studentId: "usr-student-001",
    studentName: "Aarav Sharma",
    companyId: "comp-infosys",
    companyName: "Infosys",
    companySlug: "infosys",
    sessionType: "COLLEGE_DRIVE",
    status: "SUBMITTED",
    startedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    completedAt: new Date(Date.now() - 86400000 * 4 + 2100000).toISOString(),
    durationMinutes: 40,
    totalScore: 68.0,
    performanceScore: 68.0,
    readinessScore: 66.5,
    integrityScore: 92.0,
    integrityStatus: "NORMAL",
    questionsCount: 20,
    answeredCount: 18,
    markedForReviewCount: 3,
    cheatEventsSummary: {
      tabSwitches: 2,
      windowBlurs: 2,
      copyPastes: 0,
      unusualSpeedFlags: 0,
      totalFlags: 4
    }
  }
];
