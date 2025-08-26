"use client";

import { useQuiz } from "@/contexts/QuizContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, RefreshCw, Home, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function QuizResultPage() {
  const router = useRouter();
  const { state, getScore, resetQuiz } = useQuiz();

  const score = getScore();

  if (state.questions.length === 0 || !state.isCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Quiz não encontrado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Você precisa completar um quiz primeiro.
            </p>
            <Link href="/create-room">
              <Button className="w-full">Criar Nova Sala</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleNewQuiz = () => {
    resetQuiz();
    router.push("/create-room");
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-500";
    if (percentage >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 80) return "Excelente! Você domina bem esses conceitos!";
    if (percentage >= 60) return "Bom trabalho! Continue praticando!";
    return "Continue estudando, você vai conseguir!";
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getTotalTimeSpent = () => {
    return state.userAnswers.reduce((total, userAnswer) => {
      return total + (userAnswer?.timeSpentSeconds || 0);
    }, 0);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-primary/10">
              <Trophy
                className={`w-12 h-12 ${getScoreColor(score.percentage)}`}
              />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2">Quiz Finalizado!</h1>
          <p className="text-muted-foreground">
            {getScoreMessage(score.percentage)}
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Seu Resultado</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-6xl font-bold">
              <span className={getScoreColor(score.percentage)}>
                {score.percentage}%
              </span>
            </div>
            <div className="text-lg text-muted-foreground">
              {score.correct} de {score.total} questões corretas
            </div>
            <div className="flex justify-center gap-2">
              <Badge variant="secondary">Nível: {state.config.level}</Badge>
              <Badge variant="outline">
                {state.config.themes.length} temas
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Revisão das Questões</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {state.questions.map((question, index) => {
              const userAnswer = state.userAnswers[index];
              const isCorrect = userAnswer?.answer === question.answer;

              return (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-shrink-0">
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium mb-2">
                        Questão {index + 1}: {question.question}
                      </h4>
                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="font-medium">Sua resposta:</span>{" "}
                          <span
                            className={
                              isCorrect ? "text-green-600" : "text-red-600"
                            }
                          >
                            {userAnswer?.answer || "Não respondida"}
                          </span>
                        </p>
                        {!isCorrect && (
                          <p>
                            <span className="font-medium">
                              Resposta correta:
                            </span>{" "}
                            <span className="text-green-600">
                              {question.answer}
                            </span>
                          </p>
                        )}
                        <p>
                          <span className="font-medium">Tempo gasto:</span>{" "}
                          <span className="text-blue-600">
                            {formatTime(userAnswer?.timeSpentSeconds || 0)}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Configuração do Quiz</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <h4 className="font-medium mb-2">Nível</h4>
                <Badge variant="secondary">{state.config.level}</Badge>
              </div>
              <div>
                <h4 className="font-medium mb-2">Questões</h4>
                <Badge variant="outline">
                  {state.config.quantityQuestions}
                </Badge>
              </div>
              <div>
                <h4 className="font-medium mb-2">Tempo por questão</h4>
                <Badge variant="outline">{state.config.timerMinutes} min</Badge>
              </div>
              <div>
                <h4 className="font-medium mb-2">Tempo total gasto</h4>
                <Badge variant="outline">
                  {formatTime(getTotalTimeSpent())}
                </Badge>
              </div>
              <div className="md:col-span-2 lg:col-span-4">
                <h4 className="font-medium mb-2">Temas</h4>
                <div className="flex flex-wrap gap-1">
                  {state.config.themes.map((theme, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {theme}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center gap-4">
          <Link href="/">
            <Button variant="outline">
              <Home className="w-4 h-4 mr-2" />
              Início
            </Button>
          </Link>
          <Button onClick={handleNewQuiz}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Novo Quiz
          </Button>
        </div>
      </div>
    </div>
  );
}
