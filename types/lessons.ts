
// ==========================================
// Lesson Content
// ==========================================

export type LessonContentVariant = {
  id: string;

  type: "INFOGRAPHIC" | "VIDEO" | "INTERACTIVE";

  interactiveType:
    | "MULTIPLE_CHOICE"
    | "TRUE_FALSE"
    | "DRAG_DROP"
    | "MATCHING"
    | "ORDERING"
    | "FLASHCARDS"
    | "HOTSPOT"
    | "SIMULATION"
    | null;

  isSimplified: boolean;
  isSplitIntoParts: boolean;
  hasGraphics: boolean;

  data: unknown;

  variantOrder: number;
  generatedByAI: boolean;
  createdAt: Date;
};

// ==========================================
// Questions
// ==========================================

export type QuestionOption = {
  id: string;
  text: string;
};

export type Question = {
  id: string;
  text: string;

  difficulty: "EASY" | "MEDIUM" | "HARD";

  generatedByAI: boolean;

  options: QuestionOption[];
};

// ==========================================
// External Resources
// ==========================================

export type ExternalResource = {
  id: string;
  title: string;
  url: string;
  source: string;
  createdAt: Date;
};

// ==========================================
// Exams
// ==========================================

export type Exam = {
  id: string;

  type: "LESSON_QUIZ" | "FINAL_EXAM";

  passingScore: number;

  createdAt: Date;
};

// ==========================================
// Exam Attempts
// ==========================================

export type Attempt = {
  id: string;
  examId: string;

  attemptNumber: number;

  score: number;

  passed: boolean;

  contentVariantId: string | null;

  startedAt: Date;

  submittedAt: Date | null;

  exam: {
    id: string;

    type: "LESSON_QUIZ" | "FINAL_EXAM";

    passingScore: number;
  };
};

// ==========================================
// Lesson Progress
// ==========================================

export type LessonProgress = {
  id: string | null;

  status:
    | "LOCKED"
    | "AVAILABLE"
    | "IN_PROGRESS"
    | "PASSED";

  bestScore: number;

  attemptsCount: number;

  unlockedAt: Date | null;

  completedAt: Date | null;
};

// ==========================================
// Adaptive Remediation
// ==========================================

export type RecommendedRemediation = {
  variant: LessonContentVariant;

  reason:
    | "CLOSE_TO_PASSING"
    | "LOW_SCORE"
    | "LAST_ATTEMPT";

  score: number;

  attemptNumber: number;

};

// ==========================================
// Lesson Navigation
// ==========================================

export type LessonNavigationItem = {
  id: string;
  title: string;
  order: number;
};

export type LessonNavigation = {
  previous: LessonNavigationItem | null;

  next: LessonNavigationItem | null;

  current: number;

  total: number;
};

// ==========================================
// Lesson Counts
// ==========================================

export type LessonCounts = {
  questions: number;

  exams: number;

  contentVariants: number;

  externalResources: number;
};

// ==========================================
// Full Lesson Data
// ==========================================

export type LessonData = {
  lesson: {
    id: string;
    title: string;
    order: number;
    sourceContent: string;
    createdAt: Date;
  };

  course: {
    id: string;
    title: string;
    description: string | null;
  };

  enrollment: {
    id: string;
    enrolledAt: Date;
  };

  access: {
    status:
      | "LOCKED"
      | "AVAILABLE"
      | "IN_PROGRESS"
      | "PASSED";

    isUnlocked: boolean;

    isCompleted: boolean;
  };

  progress: LessonProgress;

  contentVariants: LessonContentVariant[];

  recommendedRemediation:
    | RecommendedRemediation
    | null;

  questions: Question[];

  exams: Exam[];

  attempts: Attempt[];

  externalResources: ExternalResource[];

  navigation: LessonNavigation;

  counts: LessonCounts;
};

// ==========================================
// Locked Lesson Data
// ==========================================

export type LockedLessonData = {
  lesson: {
    id: string;
    title: string;
    order: number;
  };

  course: {
    id: string;
    title: string;
    description: string | null;
  };

  access: {
    status: "LOCKED";

    isUnlocked: false;

    isCompleted: false;
  };

  previousLesson: {
    id: string | null;

    title: string | null;

    order: number | null;

    status:
      | "LOCKED"
      | "AVAILABLE"
      | "IN_PROGRESS"
      | "PASSED";

    bestScore: number;

    attemptsCount: number;
  };
};

// ==========================================
// Lesson Client Props
// ==========================================

export type LessonClientProps =
  | {
      locked: false;

      data: LessonData;

      lockedData?: never;
    }
  | {
      locked: true;

      data?: never;

      lockedData: LockedLessonData;
    };


export type InteractiveVariantDataProps = {
  type: NonNullable<LessonContentVariant["interactiveType"]>;
  data: unknown;
};

export type MatchingPair = {
  id: string;
  left: string;
  right: string;
};

export type MatchingData = {
  title?: string;
  instruction?: string;
  pairs: MatchingPair[];
};