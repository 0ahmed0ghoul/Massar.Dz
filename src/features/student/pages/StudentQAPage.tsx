// features/student/pages/StudentQAPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, Loader2, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useStudentQA } from "../hooks/useStudentQA";

export default function StudentQAPage() {
  const navigate = useNavigate();
  const { questions, loading, submitting, submitAnswer, refresh } = useStudentQA();
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (questionId: string) => {
    const answer = answers[questionId];
    if (!answer) return;
    await submitAnswer(questionId, answer);
    // remove the answer from local state after submission
    setAnswers((prev) => {
      const newState = { ...prev };
      delete newState[questionId];
      return newState;
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#639922]" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern" />
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-3xl">
        <button
          onClick={() => navigate("/student/dashboard")}
          className="group mb-6 flex items-center gap-2 text-foreground/60 hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Dashboard
        </button>

        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#639922]/10">
            <FileQuestion className="h-6 w-6 text-[#639922]" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Questionnaire</h1>
          <p className="text-sm text-foreground/40">
            Please answer the following questions. Your feedback helps us improve our services.
          </p>
        </div>

        {questions.length === 0 ? (
          <Card className="border-white/10 bg-white/[0.03] text-center py-12">
            <CheckCircle className="mx-auto h-12 w-12 text-[#639922] mb-3" />
            <p className="text-foreground/60">All questions answered! Thank you for your participation.</p>
          </Card>
        ) : (
          <div className="space-y-6">
            {questions.map((q) => (
              <Card key={q.id} className="border-white/10 bg-white/[0.03]">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">{q.text}</CardTitle>
                </CardHeader>
                <CardContent>
                  {q.type === "true_false" ? (
                    <RadioGroup
                      value={answers[q.id] || ""}
                      onValueChange={(val) => handleAnswerChange(q.id, val)}
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="true" id={`${q.id}-true`} />
                        <Label htmlFor={`${q.id}-true`}>True</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="false" id={`${q.id}-false`} />
                        <Label htmlFor={`${q.id}-false`}>False</Label>
                      </div>
                    </RadioGroup>
                  ) : (
                    <RadioGroup
                      value={answers[q.id] || ""}
                      onValueChange={(val) => handleAnswerChange(q.id, val)}
                      className="space-y-2"
                    >
                      {q.options.map((opt, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <RadioGroupItem value={opt} id={`${q.id}-opt-${idx}`} />
                          <Label htmlFor={`${q.id}-opt-${idx}`}>{opt}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                  <div className="mt-4 flex justify-end">
                    <Button
                      onClick={() => handleSubmit(q.id)}
                      disabled={!answers[q.id] || submitting}
                      className="bg-[#639922] text-black hover:bg-[#4f7a1a]"
                    >
                      {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Submit Answer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}