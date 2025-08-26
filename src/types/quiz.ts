export type Question = {
  question: string;
  options: string[];
  answer: string;
};

export type QuizConfig = {
  level: "fácil" | "médio" | "difícil";
  themes: string[];
  quantityQuestions: number;
  timerMinutes: number;
};

export type UserAnswer = {
  answer: string;
  timeSpentSeconds: number;
};

export type QuizData = {
  config: QuizConfig;
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: UserAnswer[];
  isCompleted: boolean;
};
