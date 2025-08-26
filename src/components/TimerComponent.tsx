"use client";

import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, AlertTriangle } from "lucide-react";
import { useTimer } from "@/hooks/useTimer";
import { cn } from "@/lib/utils";

interface TimerComponentProps {
  timeInMinutes: number;
  onTimeUp?: () => void;
  onTimeChange?: (timeSpentSeconds: number) => void;
  autoStart?: boolean;
  className?: string;
}

export interface TimerComponentRef {
  getTimeSpent: () => number;
  resetTimer: (newTimeInMinutes?: number) => void;
}

export const TimerComponent = forwardRef<
  TimerComponentRef,
  TimerComponentProps
>(
  (
    { timeInMinutes, onTimeUp, onTimeChange, autoStart = true, className },
    ref
  ) => {
    const timeUpCalledRef = useRef(false);

    const {
      timeLeft,
      isRunning,
      startTimer,
      resetTimer,
      getTimeSpent,
      formatTime,
      getProgressPercentage,
      isTimeUp,
      timeLeftFormatted,
    } = useTimer(timeInMinutes);

    useImperativeHandle(ref, () => ({
      getTimeSpent,
      resetTimer,
    }));

    useEffect(() => {
      timeUpCalledRef.current = false;
      resetTimer(timeInMinutes);

      if (autoStart) {
        const timer = setTimeout(() => startTimer(), 300);
        return () => clearTimeout(timer);
      }
    }, [timeInMinutes]);

    useEffect(() => {
      if (isTimeUp && onTimeUp && !timeUpCalledRef.current) {
        timeUpCalledRef.current = true;
        onTimeUp();
      }
    }, [isTimeUp, onTimeUp, timeLeft]);

    useEffect(() => {
      if (timeLeft > 0 && timeUpCalledRef.current) {
        timeUpCalledRef.current = false;
      }
    }, [timeLeft]);

    useEffect(() => {
      if (onTimeChange && isRunning) {
        onTimeChange(getTimeSpent());
      }
    }, [getTimeSpent(), onTimeChange, isRunning]);

    const progressPercentage = getProgressPercentage();
    const isLowTime = timeLeft <= 30 && timeLeft > 0;
    const isCriticalTime = timeLeft <= 10 && timeLeft > 0;

    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Tempo restante</span>
            </div>
            {isLowTime && (
              <AlertTriangle
                className={cn(
                  "w-4 h-4",
                  isCriticalTime
                    ? "text-red-500 animate-pulse"
                    : "text-yellow-500"
                )}
              />
            )}
          </div>

          <div className="space-y-3">
            <div className="text-center">
              <div
                className={cn(
                  "text-3xl font-bold font-mono transition-all duration-300",
                  isCriticalTime
                    ? "text-red-500 animate-pulse scale-110"
                    : isLowTime
                    ? "text-yellow-500"
                    : "text-foreground"
                )}
              >
                {timeLeftFormatted}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {isRunning
                  ? "Em andamento"
                  : isTimeUp
                  ? "⏰ Tempo esgotado!"
                  : "Pausado"}
              </div>
            </div>

            <div className="space-y-2">
              <Progress
                value={progressPercentage}
                className={cn(
                  "h-2",
                  isCriticalTime
                    ? "bg-red-100"
                    : isLowTime
                    ? "bg-yellow-100"
                    : "bg-muted"
                )}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0:00</span>
                <span>{formatTime(timeInMinutes * 60)}</span>
              </div>
            </div>

            <div className="text-xs text-muted-foreground text-center">
              Tempo gasto: {formatTime(getTimeSpent())}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
);

TimerComponent.displayName = "TimerComponent";

export default TimerComponent;
