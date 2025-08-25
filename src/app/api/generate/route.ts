import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import type { Question } from "@/types/quiz";

const gemini = new GoogleGenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const model = "gemini-2.5-flash";

export async function POST(req: Request) {
  const { level, theme, quantityQuestions } = await req.json();

  const response = await gemini.models.generateContent({
    model,
    contents: [
      {
        text: `
          Crie ${quantityQuestions} perguntas de matemática no nível ${level}, relacionadas ao contexto de uma empresa industrial chamada A.J Rorato, que fabrica pias, tanques, armários de banheiro e de cozinha.

          As perguntas devem abordar os seguintes temas de matemática básica:

          ${theme.join(", ")}

          Regras:

          Todas as questões devem estar contextualizadas com situações reais da empresa (ex: venda de tanques, parcelamento de armários, custo de produção de pias, etc.).

          O nível deve ser ${level}.

          Cada pergunta deve ser objetiva e clara, sem enunciados muito longos.

          O resultado deve trazer apenas as perguntas em formato JSON, no seguinte padrão:

          [
            {
              "question": "Pergunta aqui...",
              "options": [
                "Alternativa A",
                "Alternativa B",
                "Alternativa C",
                "Alternativa D"
              ],
              "answer": "Alternativa correta"
            }
          ]


          Gere ${quantityQuestions} objetos dentro do array, um para cada pergunta.

          Observação:
          Responda **somente** com JSON puro. 
          Não inclua ${"```json ou explicações extras, apenas o array de objetos."}

        `,
      },
    ],
  });

  if (!response.text) {
    return NextResponse.json({ error: "Não foi possível gerar perguntas." }, { status: 500 });
  }

  const questions: Question[] = JSON.parse(response.text);

  return NextResponse.json({ questions });
}
