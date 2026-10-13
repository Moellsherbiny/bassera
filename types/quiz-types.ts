
export type QuizQuestionType =
  | "SINGLE_CHOICE"
  | "MULTIPLE_CHOICE"
  | "TRUE_FALSE";

export type QuizOption = {
  id: string;
  text: string;
};

export type QuizQuestion = {
  id: string;
  number: number;
  text: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  type: QuizQuestionType;
  options: QuizOption[];
};

export type QuizData = {
  id: string;

  // مهم: موجود في Exam عندك
  type: "LESSON_QUIZ" | "FINAL_EXAM";

  title: string;
  description: string | null;
  passingScore: number;

  lesson: {
    id: string;
    title: string;
    order: number;
  } | null;

  course: {
    id: string;
    title: string;
  } | null;

  questions: QuizQuestion[];
};

export type QuizAttempt = {
  id: string;
  attemptNumber: number;
  isActive: boolean;
  startedAt?: Date | string;
};

export type QuizResult = {
  attemptId: string;
  attemptNumber: number;
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  unansweredQuestions: number;
  totalQuestions: number;
  passed: boolean;
  passingScore: number;
};

export type AnswerMap = Record<string, string[]>;

export type GetQuizSuccess = {
  success: true;
  quiz: QuizData;
  attempt: QuizAttempt;
};

export type GetQuizError = {
  success: false;

  error:
    | "UNAUTHORIZED"
    | "NOT_FOUND"
    | "INVALID_TYPE"
    | "NO_LESSON"
    | "NOT_ENROLLED"
    | "INSUFFICIENT_EASY_QUESTIONS"
    | "INSUFFICIENT_MEDIUM_QUESTIONS"
    | "INSUFFICIENT_HARD_QUESTIONS"
    | "INSUFFICIENT_AVAILABLE_QUESTIONS"
    | "SERVER_ERROR";

  message: string;
};

export type GetQuizResult =
  | GetQuizSuccess
  | GetQuizError;
