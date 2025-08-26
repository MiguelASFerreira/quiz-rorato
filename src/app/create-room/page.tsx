"use client";

import { toast } from "sonner"
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { mathThemes } from "@/data/mathThemes";
import { generateQuestions } from "@/services/quizService";
import { useQuiz } from "@/contexts/QuizContext";

const formSchema = z.object({
  level: z.enum(["fácil", "médio", "difícil"], "Selecione um nível"),
  themes: z.array(z.string()).min(1, "Selecione pelo menos um tema"),
  quantityQuestions: z
    .number()
    .min(3, "Mínimo 3 questão")
    .max(5, "Máximo 5 questões"),
  timerMinutes: z
    .number()
    .min(1, "Mínimo 1 minutos")
    .max(5, "Máximo 5 minutos"),
});

type FormData = z.infer<typeof formSchema>;

export default function CreateRoomPage() {
  const router = useRouter();
  const { setConfig, setQuestions } = useQuiz();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      level: "fácil",
      themes: [],
      quantityQuestions: 3,
      timerMinutes: 1,
    },
  });

  async function onSubmit(values: FormData) {
    try {
      setConfig({
        level: values.level,
        themes: values.themes,
        quantityQuestions: values.quantityQuestions,
        timerMinutes: values.timerMinutes,
      });

      const questions = await generateQuestions({
        level: values.level,
        theme: values.themes,
        quantityQuestions: values.quantityQuestions,
      });

      setQuestions(questions);

      router.push("/quiz");
    } catch (error) {
      toast.error("Erro ao criar a sala. Tente novamente.");
      console.error("Erro ao criar a sala:", error);
    }
  }

  return (
    <div className="flex flex-col gap-4 items-center justify-center w-full p-4">
      <h1 className="text-4xl font-bold text-foreground">Criação da Sala</h1>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Crie uma sala</CardTitle>
          <CardDescription>
            Escolha o nível de dificuldade, os temas e a quantidade de perguntas
            para iniciar o quiz.
          </CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nível de dificuldade</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o nível" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="fácil">Fácil</SelectItem>
                        <SelectItem value="médio">Médio</SelectItem>
                        <SelectItem value="difícil">Difícil</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="themes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Temas</FormLabel>
                    <div className="flex flex-col gap-2">
                      {mathThemes.map((theme) => (
                        <label
                          key={theme}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <Checkbox
                            checked={field.value?.includes(theme)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, theme])
                                : field.onChange(
                                    field.value.filter((t) => t !== theme)
                                  );
                            }}
                          />
                          <span>{theme}</span>
                        </label>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantityQuestions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade de perguntas</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={5}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="timerMinutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tempo por pergunta (minutos)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={5}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        placeholder="Ex: 1"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>

            <CardFooter>
              <Button
                type="submit"
                className="w-full mt-2"
                disabled={form.formState.isSubmitting}
              >
                Criar sala
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
