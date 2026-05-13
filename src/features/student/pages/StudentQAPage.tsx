// StudentQAPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, Loader2, FileQuestion, Briefcase, GraduationCap, Euro } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useStudentQA } from "../hooks/useStudentQA";

export default function StudentQAPage() {
  const navigate = useNavigate();
  const { questions, loading, submitting, submitAnswer, completed } = useStudentQA();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [numericError, setNumericError] = useState<Record<string, string>>({});

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    
    // Clear numeric error if value is valid
    if (numericError[questionId] && value && !isNaN(Number(value))) {
      setNumericError((prev) => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (questionId: string) => {
    const answer = answers[questionId];
    if (!answer) return;

    // Validate numeric inputs
    const question = questions.find(q => q.id === questionId);
    if (question?.type === "numeric") {
      if (isNaN(Number(answer)) || Number(answer) < 0) {
        setNumericError((prev) => ({
          ...prev,
          [questionId]: "Please enter a valid positive number"
        }));
        return;
      }
    }

    const success = await submitAnswer(questionId, answer);
    if (success) {
      setAnswers((prev) => {
        const newState = { ...prev };
        delete newState[questionId];
        return newState;
      });
    }
  };

  // Group questions by part
  const groupedQuestions = questions.reduce((acc, q) => {
    const part = q.part || 1;
    if (!acc[part]) acc[part] = [];
    acc[part].push(q);
    return acc;
  }, {} as Record<number, typeof questions>);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#639922]" />
      </div>
    );
  }

  // Get part title and icon
  const getPartInfo = (part: number) => {
    switch (part) {
      case 1:
        return { 
          title: "Current Status", 
          icon: <GraduationCap className="h-5 w-5" />,
          description: "Tell us about your current situation"
        };
      case 2:
        return { 
          title: "Role & Industry", 
          icon: <Briefcase className="h-5 w-5" />,
          description: "Details about your professional activity"
        };
      case 3:
        return { 
          title: "Compensation & Demographics", 
          icon: <Euro className="h-5 w-5" />,
          description: "Salary information"
        };
      default:
        return { 
          title: `Part ${part}`, 
          icon: <FileQuestion className="h-5 w-5" />,
          description: ""
        };
    }
  };

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern" />
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-3xl">
        <button
          onClick={() => navigate("/student/dashboard")}
          className="group mb-6 flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Dashboard
        </button>

        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#639922]/10">
            <FileQuestion className="h-6 w-6 text-[#639922]" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Profile Questionnaire</h1>
          <p className="text-sm text-foreground/40">
            Help us understand your profile better. Answer all applicable questions.
          </p>
        </div>

        {completed || questions.length === 0 ? (
          <Card className="border-white/10 bg-white/[0.03] text-center py-12">
            <CheckCircle className="mx-auto h-12 w-12 text-[#639922] mb-3" />
            <p className="text-foreground/60">All questions answered! Thank you for your participation.</p>
          </Card>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedQuestions).map(([part, partQuestions]) => {
              const partInfo = getPartInfo(Number(part));
              return (
                <div key={part} className="space-y-4">
                  {/* Part Header */}
                  <div className="flex items-center gap-3 pb-2 border-b border-white/10">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#639922]/10 text-[#639922]">
                      {partInfo.icon}
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                        {partInfo.title}
                        <Badge variant="outline" className="text-xs border-[#639922]/30 text-[#639922]">
                          {partQuestions.length} question{partQuestions.length !== 1 ? 's' : ''}
                        </Badge>
                      </h2>
                      <p className="text-xs text-foreground/40">{partInfo.description}</p>
                    </div>
                  </div>

                  {/* Questions for this part */}
                  <div className="space-y-4">
                    {partQuestions.map((q) => (
                      <Card key={q.id} className="border-white/10 bg-white/[0.03] hover:bg-white/[0.05] transition-colors">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-base font-semibold">{q.text}</CardTitle>
                            {q.condition && (
                              <Badge variant="secondary" className="text-[10px] bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                                Conditional
                              </Badge>
                            )}
                          </div>
                          {q.condition && (
                            <p className="text-xs text-foreground/30 mt-1">
                              This question appears based on your answer to Part 1
                            </p>
                          )}
                        </CardHeader>
                        <CardContent>
                          {q.type === "numeric" ? (
                            <div className="space-y-2">
                              <div className="relative">
                                <Input
                                  type="number"
                                  placeholder="Enter amount"
                                  value={answers[q.id] || ""}
                                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                  className="pr-12 bg-white/[0.02] border-white/10"
                                  min="0"
                                  step="1000"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40">DZ</span>
                              </div>
                              {numericError[q.id] && (
                                <p className="text-sm text-red-500">{numericError[q.id]}</p>
                              )}
                            </div>
                          ) : (
                            <RadioGroup
                              value={answers[q.id] || ""}
                              onValueChange={(val) => handleAnswerChange(q.id, val)}
                              className="space-y-2"
                            >
                              {q.options.map((opt, idx) => (
                                <div 
                                  key={idx} 
                                  className="flex items-center space-x-2 p-2 rounded-md hover:bg-white/[0.02] transition-colors"
                                >
                                  <RadioGroupItem value={opt} id={`${q.id}-opt-${idx}`} />
                                  <Label htmlFor={`${q.id}-opt-${idx}`} className="cursor-pointer flex-1">
                                    {opt}
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          )}
                          <div className="mt-4 flex justify-end">
                            <Button
                              onClick={() => handleSubmit(q.id)}
                              disabled={!answers[q.id] || submitting}
                              className="bg-[#639922] text-black hover:bg-[#4f7a1a] shadow-lg shadow-[#639922]/20 transition-all"
                              size="sm"
                            >
                              {submitting ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                  Submitting...
                                </>
                              ) : (
                                "Submit Answer"
                              )}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}