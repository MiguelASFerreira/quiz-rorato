"use client";

import { useRef, useEffect } from "react";
import { useQuiz } from "@/contexts/QuizContext";
import {
  useQuizNavigation,
  useQuizAnswers,
  useQuizStats,
} from "@/hooks/useQuizHooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Home } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TimerComponent, { TimerComponentRef } from "@/components/TimerComponent";

export default function QuizPage() {
  const router = useRouter();
  const { completeQuiz, setAnswer, state } = useQuiz();
  const timerRef = useRef<TimerComponentRef>(null);

  const navigation = useQuizNavigation();
  const answers = useQuizAnswers();
  const stats = useQuizStats();

  const saveCurrentAnswerWithTime = (answer: string) => {
    const timeSpent = timerRef.current?.getTimeSpent() || 0;
    setAnswer(state.currentQuestionIndex, answer, timeSpent);
  };

  if (!stats.isQuizReady) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Nenhum quiz ativo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Você precisa criar uma sala primeiro para começar o quiz.
            </p>
            <Link href="/create-room">
              <Button className="w-full">Criar Sala</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleAnswerSelect = (answer: string) => {
    saveCurrentAnswerWithTime(answer);
  };

  const handleNext = () => {
    if (answers.currentAnswer) {
      saveCurrentAnswerWithTime(answers.currentAnswer);
    }

    if (navigation.isLastQuestion) {
      completeQuiz();
      router.push("/quiz/result");
    } else {
      navigation.nextQuestion();
    }
  };

  const handlePrevious = () => {
    if (answers.currentAnswer) {
      saveCurrentAnswerWithTime(answers.currentAnswer);
    }
    navigation.previousQuestion();
  };

  const handleTimeUp = () => {
    if (answers.currentAnswer) {
      saveCurrentAnswerWithTime(answers.currentAnswer);
    } else {
      const timeSpent = timerRef.current?.getTimeSpent() || 0;
      setAnswer(state.currentQuestionIndex, "", timeSpent);
    }

    if (navigation.isLastQuestion) {
      completeQuiz();
      router.push("/quiz/result");
    } else {
      navigation.nextQuestion();
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <Home className="w-4 h-4 mr-2" />
              Início
            </Button>
          </Link>
          <Badge variant="secondary">Nível: {stats.config.level}</Badge>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">
              Questão {navigation.progress.current} de{" "}
              {navigation.progress.total}
            </span>
            <span className="text-sm text-muted-foreground">
              {navigation.progress.percentage}% concluído
            </span>
          </div>
          <Progress value={navigation.progress.percentage} className="w-full" />
        </div>

        <div className="mb-6">
          <TimerComponent
            timeInMinutes={stats.config.timerMinutes}
            onTimeUp={handleTimeUp}
            autoStart={true}
            key={navigation.currentQuestionIndex}
            ref={timerRef}
          />
        </div>

        {answers.currentQuestion && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">
                {answers.currentQuestion.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {answers.currentQuestion.options.map((option, index) => (
                <Button
                  key={index}
                  variant={
                    answers.isAnswerSelected(option) ? "default" : "outline"
                  }
                  className="w-full justify-start text-left h-auto p-4"
                  onClick={() => handleAnswerSelect(option)}
                >
                  <span className="font-medium mr-2">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option}
                </Button>
              ))}
            </CardContent>
          </Card>
        )}

        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={!navigation.canGoPrevious}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>

          {/* <div className="flex gap-2">
            {Array.from({ length: stats.totalQuestions }, (_, index) => (
              <Badge
                key={index}
                variant={
                  index === navigation.currentQuestionIndex
                    ? "default"
                    : answers.allAnswers[index]?.answer
                    ? "secondary"
                    : "outline"
                }
                className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
                onClick={() => navigation.goToQuestion(index)}
              >
                {index + 1}
              </Badge>
            ))}
          </div> */}

          <Button
            onClick={handleNext}
            disabled={!answers.hasAnsweredCurrentQuestion}
          >
            {navigation.isLastQuestion ? "Finalizar" : "Próxima"}
            {!navigation.isLastQuestion && (
              <ArrowRight className="w-4 h-4 ml-2" />
            )}
          </Button>
        </div>

        <Card className="mt-6 bg-muted/50">
          <CardHeader>
            <CardTitle className="text-sm">Progresso</CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-2">
            <p>
              <strong>Temas:</strong> {stats.config.themes.join(", ")}
            </p>
            <p>
              <strong>Questões respondidas:</strong> {stats.questionsAnswered}{" "}
              de {stats.totalQuestions}
            </p>
            <p>
              <strong>Progresso de conclusão:</strong>{" "}
              {stats.completionPercentage}%
            </p>
            <p>
              <strong>Tempo por questão:</strong> {stats.config.timerMinutes}{" "}
              minutos
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
