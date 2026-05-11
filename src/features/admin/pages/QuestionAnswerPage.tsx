// features/admin/pages/QuestionAnswerPage.tsx
import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  BarChart3,
  Loader2,
  ChevronDown,
  ChevronUp,
  Users,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QuestionFormModal } from "../components/QuestionFormModal";
import { useQuestions } from "../hooks/useQuestions";
import { Question } from "../services/question.service";
import { questionService } from "../services/question.service";
import { Progress } from "@/components/ui/progress";

export default function QuestionAnswerPage() {
  const {
    questions,
    loading,
    addQuestion,
    publishQuestion,
    editQuestion,
    removeQuestion,
    refresh: refreshQuestions,
  } = useQuestions();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [stats, setStats] = useState<
    Record<string, { answers: { answer: string; count: number }[]; total: number }>
  >({});
  const [totalGraduated, setTotalGraduated] = useState(0);
  const [totalRespondents, setTotalRespondents] = useState(0);
  const [loadingStats, setLoadingStats] = useState(false);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  // Load statistics (totals and per‑question responses)
  const loadStats = async () => {
    setLoadingStats(true);
    try {
      const [totalGrad, respondents] = await Promise.all([
        questionService.getTotalGraduatedStudentsCount(),
        questionService.getTotalRespondentsCount(),
      ]);
      setTotalGraduated(totalGrad);
      setTotalRespondents(respondents);

      const statsMap: Record<string, any> = {};
      for (const q of questions) {
        const answers = await questionService.getQuestionStats(q.id);
        const total = answers.reduce((acc, a) => acc + a.count, 0);
        statsMap[q.id] = { answers, total };
      }
      setStats(statsMap);
    } catch (error) {
      console.error("Failed to load stats:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  // Refresh stats when questions change
  useEffect(() => {
    if (questions.length > 0) {
      loadStats();
    }
  }, [questions]);

  // Edit handler – only for drafts
  const handleEdit = (q: Question) => {
    if (q.status === "published") {
      alert("Published questions cannot be edited. You can delete and create a new one.");
      return;
    }
    setEditingQuestion(q);
    setModalOpen(true);
  };

  // Delete handler
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure? This will also delete all student responses.")) {
      await removeQuestion(id);
      await loadStats();
    }
  };

  // Publish handler – only for drafts
  const handlePublish = async (id: string) => {
    if (
      confirm(
        "Publishing will make this question visible to students. You will no longer be able to edit it. Continue?"
      )
    ) {
      await publishQuestion(id);
      await refreshQuestions();
      await loadStats();
    }
  };

  // Save new question (as draft) or update existing draft
  const handleSave = async (data: Omit<Question, "id" | "created_at" | "updated_at" | "status">) => {
    if (editingQuestion) {
      await editQuestion(editingQuestion.id, data);
    } else {
      await addQuestion(data); // creates as draft
    }
    setEditingQuestion(null);
    await loadStats();
  };

  const toggleExpand = (id: string) => {
    setExpandedQuestion(expandedQuestion === id ? null : id);
  };

  const participationRate = totalGraduated > 0 ? (totalRespondents / totalGraduated) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header + Add Button */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Question & Answer Management</h1>
          <p className="text-sm text-foreground/40">
            Create questions for graduated students and view response statistics.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingQuestion(null);
            setModalOpen(true);
          }}
          className="bg-[#639922] text-black"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Question
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-white/10 bg-white/[0.03]">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#639922]/10">
                <Users className="h-5 w-5 text-[#639922]" />
              </div>
              <div>
                <p className="text-sm text-foreground/40">Total Graduated Students</p>
                <p className="text-2xl font-bold text-foreground">{totalGraduated}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-white/[0.03]">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#639922]/10">
                <BarChart3 className="h-5 w-5 text-[#639922]" />
              </div>
              <div>
                <p className="text-sm text-foreground/40">Respondents</p>
                <p className="text-2xl font-bold text-foreground">{totalRespondents}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-white/[0.03]">
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-foreground/40">Participation Rate</p>
              <p className="text-2xl font-bold text-foreground">{participationRate.toFixed(1)}%</p>
              <Progress value={participationRate} className="mt-2 h-1 bg-white/10" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Questions Table with expandable stats */}
      <Card className="border-white/10 bg-white/[0.03]">
        <CardHeader>
          <CardTitle>Questions & Responses</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-[#639922]" />
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center py-8 text-foreground/40">
              No questions yet. Click "Add Question" to start.
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((q) => {
                const questionStats = stats[q.id];
                const totalResponses = questionStats?.total || 0;
                const answers = questionStats?.answers || [];

                return (
                  <div
                    key={q.id}
                    className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden"
                  >
                    {/* Question row */}
                    <div className="flex flex-wrap items-center justify-between gap-3 p-4">
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{q.text}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline" className="capitalize text-xs">
                            {q.type === "true_false" ? "True/False" : "Multiple Choice"}
                          </Badge>
                          <Badge
                            className={
                              q.status === "published"
                                ? "bg-green-500/20 text-green-500"
                                : "bg-yellow-500/20 text-yellow-500"
                            }
                          >
                            {q.status === "published" ? "Published" : "Draft"}
                          </Badge>
                          <span className="text-xs text-foreground/40">
                            {totalResponses} response{totalResponses !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleExpand(q.id)}
                          className="p-1 text-foreground/60 hover:text-foreground"
                        >
                          {expandedQuestion === q.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </button>
                        {q.status === "draft" && (
                          <button
                            onClick={() => handlePublish(q.id)}
                            className="p-1 text-green-400/70 hover:text-green-400"
                            title="Publish"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(q)}
                          className="p-1 text-foreground/60 hover:text-foreground disabled:opacity-40"
                          disabled={q.status === "published"}
                          title={q.status === "published" ? "Cannot edit published question" : "Edit"}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(q.id)}
                          className="p-1 text-red-400/70 hover:text-red-400"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Expanded statistics (per answer) */}
                    {expandedQuestion === q.id && (
                      <div className="border-t border-white/10 bg-white/[0.01] p-4">
                        {loadingStats ? (
                          <div className="flex justify-center py-2">
                            <Loader2 className="h-4 w-4 animate-spin text-[#639922]" />
                          </div>
                        ) : answers.length === 0 ? (
                          <p className="text-sm text-foreground/40 text-center py-2">
                            No responses yet.
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {answers.map((ans, idx) => {
                              const percentage =
                                totalResponses > 0 ? (ans.count / totalResponses) * 100 : 0;
                              return (
                                <div key={idx} className="space-y-1">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-foreground/70">{ans.answer}</span>
                                    <span className="text-foreground/50">
                                      {ans.count} ({percentage.toFixed(1)}%)
                                    </span>
                                  </div>
                                  <Progress value={percentage} className="h-1.5 bg-white/10" />
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal for adding/editing questions */}
      <QuestionFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        initialData={editingQuestion}
        onSave={handleSave}
      />
    </div>
  );
}