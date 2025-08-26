"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { QuizData, QuizConfig, Question, UserAnswer } from "@/types/quiz";

const initialState: QuizData = {
  config: {
    level: "fácil",
    themes: [],
    quantityQuestions: 3,
    timerMinutes: 1,
  },
  questions: [],
  currentQuestionIndex: 0,
  userAnswers: [],
  isCompleted: false,
};

type QuizAction =
  | { type: "SET_CONFIG"; payload: QuizConfig }
  | { type: "SET_QUESTIONS"; payload: Question[] }
  | { type: "NEXT_QUESTION" }
  | { type: "PREVIOUS_QUESTION" }
  | {
      type: "SET_ANSWER";
      payload: {
        questionIndex: number;
        answer: string;
        timeSpentSeconds: number;
      };
    }
  | { type: "COMPLETE_QUIZ" }
  | { type: "RESET_QUIZ" }
  | { type: "GO_TO_QUESTION"; payload: number };

function quizReducer(state: QuizData, action: QuizAction): QuizData {
  switch (action.type) {
    case "SET_CONFIG":
      return {
        ...state,
        config: action.payload,
        userAnswers: new Array(action.payload.quantityQuestions).fill({
          answer: "",
          timeSpentSeconds: 0,
        }),
      };

    case "SET_QUESTIONS":
      return {
        ...state,
        questions: action.payload,
        userAnswers: new Array(action.payload.length).fill({
          answer: "",
          timeSpentSeconds: 0,
        }),
      };

    case "NEXT_QUESTION":
      const nextIndex = Math.min(
        state.currentQuestionIndex + 1,
        state.questions.length - 1
      );
      return {
        ...state,
        currentQuestionIndex: nextIndex,
      };

    case "PREVIOUS_QUESTION":
      const prevIndex = Math.max(state.currentQuestionIndex - 1, 0);
      return {
        ...state,
        currentQuestionIndex: prevIndex,
      };

    case "SET_ANSWER":
      const newAnswers = [...state.userAnswers];
      newAnswers[action.payload.questionIndex] = {
        answer: action.payload.answer,
        timeSpentSeconds: action.payload.timeSpentSeconds,
      };
      return {
        ...state,
        userAnswers: newAnswers,
      };

    case "GO_TO_QUESTION":
      return {
        ...state,
        currentQuestionIndex: Math.max(
          0,
          Math.min(action.payload, state.questions.length - 1)
        ),
      };

    case "COMPLETE_QUIZ":
      return {
        ...state,
        isCompleted: true,
      };

    case "RESET_QUIZ":
      return initialState;

    default:
      return state;
  }
}

type QuizContextType = {
  state: QuizData;
  setConfig: (config: QuizConfig) => void;
  setQuestions: (questions: Question[]) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  setAnswer: (
    questionIndex: number,
    answer: string,
    timeSpentSeconds?: number
  ) => void;
  goToQuestion: (index: number) => void;
  completeQuiz: () => void;
  resetQuiz: () => void;
  getCurrentQuestion: () => Question | null;
  getProgress: () => { current: number; total: number; percentage: number };
  getScore: () => { correct: number; total: number; percentage: number };
  isLastQuestion: () => boolean;
  isFirstQuestion: () => boolean;
};

const QuizContext = createContext<QuizContextType | undefined>(undefined);

interface QuizProviderProps {
  children: ReactNode;
}

export function QuizProvider({ children }: QuizProviderProps) {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  const setConfig = (config: QuizConfig) => {
    dispatch({ type: "SET_CONFIG", payload: config });
  };

  const setQuestions = (questions: Question[]) => {
    dispatch({ type: "SET_QUESTIONS", payload: questions });
  };

  const nextQuestion = () => {
    dispatch({ type: "NEXT_QUESTION" });
  };

  const previousQuestion = () => {
    dispatch({ type: "PREVIOUS_QUESTION" });
  };

  const setAnswer = (
    questionIndex: number,
    answer: string,
    timeSpentSeconds: number = 0
  ) => {
    dispatch({
      type: "SET_ANSWER",
      payload: { questionIndex, answer, timeSpentSeconds },
    });
  };

  const goToQuestion = (index: number) => {
    dispatch({ type: "GO_TO_QUESTION", payload: index });
  };

  const completeQuiz = () => {
    dispatch({ type: "COMPLETE_QUIZ" });
  };

  const resetQuiz = () => {
    dispatch({ type: "RESET_QUIZ" });
  };

  const getCurrentQuestion = (): Question | null => {
    if (
      state.questions.length === 0 ||
      state.currentQuestionIndex >= state.questions.length
    ) {
      return null;
    }
    return state.questions[state.currentQuestionIndex];
  };

  const getProgress = () => {
    const current = state.currentQuestionIndex + 1;
    const total = state.questions.length;
    const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
    return { current, total, percentage };
  };

  const getScore = () => {
    let correct = 0;
    state.questions.forEach((question, index) => {
      if (state.userAnswers[index]?.answer === question.answer) {
        correct++;
      }
    });
    const total = state.questions.length;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    return { correct, total, percentage };
  };

  const isLastQuestion = () => {
    return state.currentQuestionIndex === state.questions.length - 1;
  };

  const isFirstQuestion = () => {
    return state.currentQuestionIndex === 0;
  };

  const value: QuizContextType = {
    state,
    setConfig,
    setQuestions,
    nextQuestion,
    previousQuestion,
    setAnswer,
    goToQuestion,
    completeQuiz,
    resetQuiz,
    getCurrentQuestion,
    getProgress,
    getScore,
    isLastQuestion,
    isFirstQuestion,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error("useQuiz deve ser usado dentro de um QuizProvider");
  }
  return context;
}
