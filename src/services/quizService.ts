import { Question } from "@/types/quiz";
import { api } from "./axios";

type GenerateQuestionsPayload = {
  level: "fácil" | "médio" | "difícil";
  theme: string[];
  quantityQuestions: number;
};

export async function generateQuestions(
  payload: GenerateQuestionsPayload
): Promise<Question[]> {
  const { data } = await api.post<{ questions: Question[] }>(
    "/api/generate",
    payload
  );

  return data.questions;
}
