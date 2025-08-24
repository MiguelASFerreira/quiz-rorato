import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calculator, Trophy } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-muted/20 to-accent/10 py-20 px-4 min-h-screen flex items-center">
        <div className="absolute inset-0 bg-[url('/mathematical-formulas-and-geometric-shapes-pattern.png')] opacity-5"></div>
        <div className="relative max-w-4xl mx-auto text-center w-full">
          <Badge variant="secondary" className="mb-6 text-sm font-medium">
            <Calculator className="w-4 h-4 mr-2" />
            Quiz Educacional
          </Badge>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 tracking-tight">
            Quiz A.J Rorato
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed px-4">
            Desperte seu gênio matemático! Desafie-se com questões envolventes e
            descubra o prazer de aprender matemática.
          </p>
          <div className="flex justify-center">
            <Link href={"/admin"}>
              <Button
                size="lg"
                className="text-lg px-8 py-6 bg-primary hover:bg-primary/90"
              >
                <Trophy className="w-5 h-5 mr-2" />
                Iniciar o Quiz
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
