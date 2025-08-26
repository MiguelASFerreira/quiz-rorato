import { useQuiz } from "@/contexts/QuizContext";
import { UserAnswer } from "@/types/quiz";

export function useQuizNavigation() {
  const {
    state,
    nextQuestion,
    previousQuestion,
    goToQuestion,
    isFirstQuestion,
    isLastQuestion,
    getProgress,
  } = useQuiz();

  const canGoNext = () => {
    const currentAnswer = state.userAnswers[state.currentQuestionIndex];
    return !!currentAnswer?.answer;
  };

  const goToNextWithValidation = () => {
    if (canGoNext()) {
      nextQuestion();
      return true;
    }
    return false;
  };

  return {
    currentQuestionIndex: state.currentQuestionIndex,
    totalQuestions: state.questions.length,
    progress: getProgress(),
    canGoNext: canGoNext(),
    canGoPrevious: !isFirstQuestion(),
    isFirstQuestion: isFirstQuestion(),
    isLastQuestion: isLastQuestion(),
    nextQuestion: goToNextWithValidation,
    previousQuestion,
    goToQuestion,
  };
}

export function useQuizAnswers() {
  const { state, setAnswer, getCurrentQuestion } = useQuiz();

  const currentQuestion = getCurrentQuestion();
  const currentAnswer = state.userAnswers[state.currentQuestionIndex];

  const selectAnswer = (answer: string, timeSpentSeconds?: number) => {
    setAnswer(state.currentQuestionIndex, answer, timeSpentSeconds);
  };

  const isAnswerSelected = (answer: string) => {
    return currentAnswer?.answer === answer;
  };

  const hasAnsweredCurrentQuestion = () => {
    return !!currentAnswer?.answer;
  };

  const getAnsweredQuestionsCount = () => {
    return state.userAnswers.filter(
      (userAnswer: UserAnswer) => userAnswer?.answer !== ""
    ).length;
  };

  return {
    currentQuestion,
    currentAnswer: currentAnswer?.answer || "",
    currentAnswerFull: currentAnswer,
    allAnswers: state.userAnswers,
    selectAnswer,
    isAnswerSelected,
    hasAnsweredCurrentQuestion: hasAnsweredCurrentQuestion(),
    answeredQuestionsCount: getAnsweredQuestionsCount(),
    totalQuestions: state.questions.length,
  };
}

export function useQuizStats() {
  const { state, getScore, getProgress } = useQuiz();

  const progress = getProgress();
  const score = getScore();

  const getCompletionPercentage = () => {
    const answeredCount = state.userAnswers.filter(
      (userAnswer: UserAnswer) => userAnswer?.answer !== ""
    ).length;
    return state.questions.length > 0
      ? Math.round((answeredCount / state.questions.length) * 100)
      : 0;
  };

  const isQuizReady = () => {
    return state.questions.length > 0;
  };

  const isQuizComplete = () => {
    return state.isCompleted;
  };

  const getTotalTimeSpent = () => {
    return state.userAnswers.reduce((total: number, userAnswer: UserAnswer) => {
      return total + (userAnswer?.timeSpentSeconds || 0);
    }, 0);
  };

  const getAverageTimePerQuestion = () => {
    const answeredCount = state.userAnswers.filter(
      (userAnswer: UserAnswer) => userAnswer?.answer !== ""
    ).length;
    if (answeredCount === 0) return 0;
    return Math.round(getTotalTimeSpent() / answeredCount);
  };

  return {
    config: state.config,
    progress,
    score,
    completionPercentage: getCompletionPercentage(),
    isQuizReady: isQuizReady(),
    isQuizComplete: isQuizComplete(),
    totalTimeSpent: getTotalTimeSpent(),
    averageTimePerQuestion: getAverageTimePerQuestion(),
    totalQuestions: state.questions.length,
    questionsAnswered: state.userAnswers.filter(
      (userAnswer: UserAnswer) => userAnswer?.answer !== ""
    ).length,
  };
}
