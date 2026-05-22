// pages/student/ExperiencePage.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  CalendarDays,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Briefcase,
  Building2,
  MapPin,
  Clock,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Zap,
  Target,
  Star,
  LinkIcon,
  MessageSquare,
  Crown,
  Brain,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useStudentExperiences } from "../hooks/useStudentExperiences";
import {
  EXPERIENCE_TYPES,
  statusConfig,
} from "@/constants/experience.constants";
import { Link } from "react-router-dom";

export default function ExperiencePage() {
  const {
    experiences,
    applications,
    loading,
    adding,
    updating,
    recommendedJobs,
    deleting,
    addExperience,
    updateExperience,
    deleteExperience,
    isPremium,
    monthlyApplicationsCount,
  } = useStudentExperiences();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    type: "internship" as const,
    start_date: "",
    end_date: "",
    current: false,
    description: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setForm({
      title: "",
      company: "",
      location: "",
      type: "internship",
      start_date: "",
      end_date: "",
      current: false,
      description: "",
    });
    setEditingId(null);
    setFormErrors({});
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!form.title.trim()) errors.title = "Title is required";
    if (form.start_date && form.end_date && !form.current) {
      if (new Date(form.end_date) < new Date(form.start_date)) {
        errors.end_date = "End date must be after start date";
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const openEdit = (exp: any) => {
    setEditingId(exp.id);
    setForm({
      title: exp.title,
      company: exp.company || "",
      location: exp.location || "",
      type: exp.type,
      start_date: exp.start_date || "",
      end_date: exp.end_date || "",
      current: exp.current,
      description: exp.description || "",
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = {
      ...form,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
    };

    if (editingId) {
      await updateExperience(editingId, data);
    } else {
      await addExperience(data as any);
    }
    setModalOpen(false);
    resetForm();
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    return format(new Date(dateStr), "MMM yyyy");
  };

  const calculateMonths = (start: string, end: string) => {
    if (!start) return 0;
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : new Date();
    const months =
      (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth());
    return Math.max(1, months);
  };

  const totalMonths = experiences.reduce((sum, exp) => {
    return sum + calculateMonths(exp.start_date, exp.end_date);
  }, 0);

  const totalYears = Math.floor(totalMonths / 12);

  // Stats for experience section
  const experienceStats = [
    {
      icon: Briefcase,
      label: "Total Positions",
      value: experiences.length,
      color: "from-blue-500/20 to-blue-600/20",
      textColor: "text-blue-400",
    },
    {
      icon: TrendingUp,
      label: "Years of Experience",
      value: totalYears,
      color: "from-emerald-500/20 to-emerald-600/20",
      textColor: "text-emerald-400",
    },
    {
      icon: Clock,
      label: "Total Duration",
      value: `${totalMonths} months`,
      color: "from-amber-500/20 to-amber-600/20",
      textColor: "text-amber-400",
    },
  ];

  // Application stats
  const appStats = {
    total: applications.length,
    shortlisted: applications.filter((a) => a.status === "shortlisted").length,
    interviewing: applications.filter(
      (a) => a.status === "interview_scheduled" || a.status === "interview"
    ).length,
    accepted: applications.filter((a) => a.status === "accepted").length,
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center ">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-[#639922] mx-auto" />
          <p className="text-sm text-slate-400">Loading your experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen ">
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#639922] to-emerald-400 bg-clip-text text-transparent mb-2">
                My Experience
              </h1>
              <p className="text-base text-slate-400 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Track your career journey and job applications
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="experience" className="space-y-8">
          {/* Tab Navigation */}
          <TabsList className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-1.5 w-fit backdrop-blur-sm">
            <TabsTrigger
              value="experience"
              className="rounded-lg px-4 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#639922] data-[state=active]:to-emerald-500 data-[state=active]:text-black data-[state=active]:shadow-lg transition-all"
            >
              <Briefcase className="h-4 w-4 mr-2" />
              Work Experience
            </TabsTrigger>
            <TabsTrigger
              value="applications"
              className="rounded-lg px-4 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
            >
              <Target className="h-4 w-4 mr-2" />
              Job Applications
            </TabsTrigger>
          </TabsList>

          {/* EXPERIENCE TAB */}
          <TabsContent value="experience" className="space-y-8">
            {/* Stats Cards */}
            {experiences.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {experienceStats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <Card
                      key={stat.label}
                      className={`border-0 bg-gradient-to-br ${stat.color} backdrop-blur-sm hover:shadow-lg transition-all duration-300 group`}
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm text-slate-400 mb-2">
                              {stat.label}
                            </p>
                            <p
                              className={`text-3xl font-bold ${stat.textColor}`}
                            >
                              {stat.value}
                            </p>
                          </div>
                          <Icon
                            className={`h-8 w-8 ${stat.textColor} opacity-60 group-hover:opacity-100 transition-opacity`}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Add Experience Button */}
            <div className="flex justify-end">
              <Button
                onClick={() => {
                  resetForm();
                  setModalOpen(true);
                }}
                className="bg-gradient-to-r from-[#639922] to-emerald-500 hover:from-[#5a8a1f] hover:to-emerald-600 text-black font-semibold shadow-lg hover:shadow-xl transition-all duration-300 px-6"
              >
                <Plus className="mr-2 h-5 w-5" /> Add Experience
              </Button>
            </div>

            {/* Experience List */}
            {experiences.length === 0 ? (
              <Card className="border-slate-700/50 bg-slate-800/30 backdrop-blur-sm p-12">
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#639922]/20 to-emerald-500/20">
                    <Briefcase className="h-8 w-8 text-[#639922]" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-300">
                    No experience yet
                  </h3>
                  <p className="text-sm text-slate-400 max-w-sm mx-auto">
                    Start building your professional profile by adding your work
                    experience, internships, and projects.
                  </p>
                  <Button
                    onClick={() => {
                      resetForm();
                      setModalOpen(true);
                    }}
                    variant="outline"
                    className="border-slate-600 text-[#639922] hover:bg-[#639922]/10 mt-4"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Your First Experience
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {experiences.map((exp, index) => {
                  const months = calculateMonths(exp.start_date, exp.end_date);
                  const durationText =
                    months >= 12
                      ? `${Math.floor(months / 12)}y ${months % 12}m`
                      : `${months}m`;

                  return (
                    <div
                      key={exp.id}
                      className="group relative animate-in fade-in slide-in-from-bottom-4 duration-500"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Timeline dot */}
                      <div className="absolute -left-6 top-6 flex items-center justify-center">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-[#639922] to-emerald-500 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="relative w-3 h-3 rounded-full bg-gradient-to-r from-[#639922] to-emerald-500 border-2 border-slate-900" />
                        </div>
                      </div>

                      <Card className="border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/30 backdrop-blur-sm hover:border-[#639922]/30 hover:shadow-xl transition-all duration-300 hover:bg-gradient-to-br hover:from-slate-800/80 hover:to-slate-900/50 overflow-hidden">
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row justify-between gap-6">
                            {/* Left: Experience Details */}
                            <div className="flex-1 space-y-3">
                              <div className="flex items-start gap-3 flex-wrap">
                                <h3 className="text-xl font-semibold text-white">
                                  {exp.title}
                                </h3>
                                {exp.current && (
                                  <Badge className="bg-gradient-to-r from-[#639922] to-emerald-500 text-black text-xs">
                                    Current Role
                                  </Badge>
                                )}
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                {exp.company && (
                                  <div className="flex items-center gap-2 text-slate-300">
                                    <Building2 className="h-4 w-4 text-[#639922] flex-shrink-0" />
                                    <span>{exp.company}</span>
                                  </div>
                                )}
                                {exp.location && (
                                  <div className="flex items-center gap-2 text-slate-300">
                                    <MapPin className="h-4 w-4 text-[#639922] flex-shrink-0" />
                                    <span>{exp.location}</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-2 text-slate-300">
                                  <CalendarDays className="h-4 w-4 text-[#639922] flex-shrink-0" />
                                  <span>
                                    {formatDate(exp.start_date)} –{" "}
                                    {exp.current
                                      ? "Present"
                                      : formatDate(exp.end_date)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-300">
                                  <Clock className="h-4 w-4 text-[#639922] flex-shrink-0" />
                                  <span className="font-medium">
                                    {durationText}
                                  </span>
                                </div>
                              </div>

                              <Badge
                                variant="secondary"
                                className="w-fit bg-slate-700/50 text-slate-300 text-xs"
                              >
                                {
                                  EXPERIENCE_TYPES.find(
                                    (t) => t.value === exp.type
                                  )?.label
                                }
                              </Badge>

                              {exp.description && (
                                <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-wrap mt-4 p-3 rounded-lg bg-slate-900/40 border border-slate-700/30">
                                  {exp.description}
                                </p>
                              )}
                            </div>

                            {/* Right: Actions */}
                            <div className="flex md:flex-col gap-2 md:items-end">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEdit(exp)}
                                className="text-slate-400 hover:text-[#639922] hover:bg-[#639922]/10"
                              >
                                <Pencil className="h-4 w-4" />
                                <span className="hidden md:inline ml-2">
                                  Edit
                                </span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-400/60 hover:text-red-400 hover:bg-red-500/10"
                                onClick={() => deleteExperience(exp.id)}
                              >
                                {deleting === exp.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                                <span className="hidden md:inline ml-2">
                                  Delete
                                </span>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* APPLICATIONS TAB */}
          <TabsContent value="applications" className="space-y-8">
            {/* Application Stats */}
            {!isPremium && (
            <Card className="border-yellow-500/30 bg-yellow-500/5">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-yellow-400 font-semibold">Free Plan</h3>

                  <p className="text-sm text-slate-400">
                    {monthlyApplicationsCount}/5 applications used this month
                  </p>
                </div>

                <Button className="bg-gradient-to-r from-[#639922] to-emerald-500 text-black">
                  <Link to="/pricing">
                  Upgrade to Premium
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
            {applications.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  {
                    icon: Target,
                    label: "Total Apps",
                    value: appStats.total,
                    color: "from-slate-500/20 to-slate-600/20",
                    textColor: "text-slate-400",
                  },
                  {
                    icon: Star,
                    label: "Shortlisted",
                    value: appStats.shortlisted,
                    color: "from-yellow-500/20 to-yellow-600/20",
                    textColor: "text-yellow-400",
                  },
                  {
                    icon: Zap,
                    label: "Interviewing",
                    value: appStats.interviewing,
                    color: "from-blue-500/20 to-blue-600/20",
                    textColor: "text-blue-400",
                  },
                  {
                    icon: CheckCircle2,
                    label: "Accepted",
                    value: appStats.accepted,
                    color: "from-emerald-500/20 to-emerald-600/20",
                    textColor: "text-emerald-400",
                  },
                ].map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <Card
                      key={stat.label}
                      className={`border-0 bg-gradient-to-br ${stat.color} backdrop-blur-sm`}
                    >
                      <CardContent className="p-4">
                        <Icon className={`h-5 w-5 ${stat.textColor} mb-2`} />
                        <p className="text-xs text-slate-400 mb-1">
                          {stat.label}
                        </p>
                        <p className={`text-2xl font-bold ${stat.textColor}`}>
                          {stat.value}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {applications.length === 0 ? (
              <Card className="border-slate-700/50 bg-slate-800/30 backdrop-blur-sm p-12">
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-600/20">
                    <Target className="h-8 w-8 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-300">
                    No applications yet
                  </h3>
                  <p className="text-sm text-slate-400 max-w-sm mx-auto">
                    Start applying to jobs and your applications will appear
                    here. Track your progress through every stage.
                  </p>
                </div>
              </Card>
            ) : (
              <div className="grid gap-4">
                {applications.map((app, index) => {
                  const status = app.status;
                  const config = statusConfig[status] || {
                    label: status,
                    color: "bg-slate-600/20 text-slate-400",
                    icon: AlertCircle,
                  };

                  const interview = Array.isArray(app.interview)
                    ? app.interview[0]
                    : app.interview;

                  const hasInterview =
                    (status === "interview_scheduled" ||
                      status === "interview") &&
                    interview;

                  const formatInterviewDate = (dateStr: string) => {
                    if (!dateStr) return "Date not set";
                    try {
                      const date = new Date(dateStr);
                      if (isNaN(date.getTime())) return "Invalid date format";
                      return date.toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      });
                    } catch {
                      return "Invalid date";
                    }
                  };

                  const StatusIcon = config.icon || AlertCircle;

                  return (
                    <Card
                      key={app.id}
                      className="border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/30 backdrop-blur-sm hover:border-blue-500/30 hover:shadow-xl transition-all duration-300 overflow-hidden group"
                      style={{
                        animation: `fadeInUp 0.5s ease-out ${
                          index * 100
                        }ms both`,
                      }}
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row justify-between gap-6">
                          {/* Application Details */}
                          <div className="flex-1 space-y-4">
                            <div className="space-y-2">
                              <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">
                                {app.job?.title || "Job Title"}
                              </h3>
                              <div className="flex items-center gap-2 text-sm text-slate-400">
                                <Building2 className="h-4 w-4 text-blue-400" />
                                <span>
                                  {app.job?.company?.company_name ||
                                    "Company Name"}
                                </span>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                              {app.job?.location && (
                                <div className="flex items-center gap-2 text-slate-400">
                                  <MapPin className="h-4 w-4 text-blue-400 flex-shrink-0" />
                                  {app.job.location}
                                </div>
                              )}
                              <div className="flex items-center gap-2 text-slate-400">
                                <Clock className="h-4 w-4 text-blue-400 flex-shrink-0" />
                                Applied {formatDate(app.created_at)}
                              </div>
                            </div>

                            {/* Interview Details */}
                            {hasInterview && interview && (
                              <div className="mt-4 p-4 rounded-lg border border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-blue-600/5 space-y-3">
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500/20">
                                    <Zap className="h-3 w-3 text-blue-400" />
                                  </div>
                                  <p className="text-sm font-semibold text-blue-300">
                                    Interview Scheduled
                                  </p>
                                </div>

                                <div className="space-y-2 text-sm">
                                  <div className="flex items-start gap-2">
                                    <CalendarDays className="h-4 w-4 text-blue-400/60 flex-shrink-0 mt-0.5" />
                                    <div>
                                      <p className="text-xs text-slate-400">
                                        When
                                      </p>
                                      <p className="text-slate-300">
                                        {formatInterviewDate(
                                          interview.interview_date
                                        )}
                                      </p>
                                    </div>
                                  </div>

                                  {interview.location && (
                                    <div className="flex items-start gap-2">
                                      <MapPin className="h-4 w-4 text-blue-400/60 flex-shrink-0 mt-0.5" />
                                      <div>
                                        <p className="text-xs text-slate-400">
                                          Location
                                        </p>
                                        <p className="text-slate-300">
                                          {interview.location}
                                        </p>
                                      </div>
                                    </div>
                                  )}

                                  {interview.meeting_link && (
                                    <div className="flex items-start gap-2 pt-2 border-t border-blue-500/20">
                                      <LinkIcon className="h-4 w-4 text-blue-400/60 flex-shrink-0 mt-0.5" />
                                      <a
                                        href={interview.meeting_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-400 hover:text-blue-300 underline font-medium transition-colors"
                                      >
                                        Join Meeting
                                      </a>
                                    </div>
                                  )}

                                  {interview.notes && (
                                    <div className="flex items-start gap-2 pt-2 border-t border-blue-500/20">
                                      <MessageSquare className="h-4 w-4 text-blue-400/60 flex-shrink-0 mt-0.5" />
                                      <div>
                                        <p className="text-xs text-slate-400">
                                          Notes
                                        </p>
                                        <p className="text-slate-300 text-sm">
                                          {interview.notes}
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Status Badge */}
                          <div className="flex flex-col items-start lg:items-end gap-4">
                            <Badge
                              className={`${config.color} text-xs font-semibold flex items-center gap-2 px-3 py-1.5`}
                            >
                              <StatusIcon className="h-3 w-3" />
                              {config.label}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            <Card className="relative overflow-hidden border-slate-700/50 bg-slate-800/40">
              {!isPremium && (
                <>
                  <div className="absolute inset-0 z-20 backdrop-blur-md bg-black/40 flex flex-col items-center justify-center">
                    <Crown className="h-10 w-10 text-yellow-400 mb-3" />

                    <h3 className="text-lg font-bold text-white">
                      Premium Feature
                    </h3>

                    <p className="text-sm text-slate-300 mb-4">
                      Unlock AI Job Matching
                    </p>

                    <Button className="bg-gradient-to-r from-[#639922] to-emerald-500 text-black">
                      Upgrade Now
                    </Button>
                  </div>
                </>
              )}

              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Brain className="h-6 w-6 text-[#639922]" />

                  <div>
                    <h3 className="text-lg font-bold text-white">
                      AI Skill Matching
                    </h3>

                    <p className="text-sm text-slate-400">
                      Jobs matching your profile skills
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
  {recommendedJobs.map((job) => (
    <Link
      key={job.id}
      to={`/experience/${job.id}`}
      className="block group"
    >
      <div className="relative overflow-hidden rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 p-5 transition-all duration-300 hover:border-[#639922] hover:shadow-lg hover:shadow-[#639922]/10 hover:-translate-y-1">
        
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-[#639922]/0 group-hover:bg-[#639922]/5 transition-all duration-300" />

        <div className="relative z-10">
          
          {/* Top Section */}
          <div className="flex items-start justify-between gap-4">
            
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-white group-hover:text-[#8bc34a] transition-colors">
                {job.title}
              </h4>

              <p className="text-sm text-slate-400 mt-1">
                {job.company?.company_name || "Company"}
              </p>

              <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                <span>{job.location || "Remote"}</span>

                {job.job_type && (
                  <>
                    <span>•</span>
                    <span className="capitalize">
                      {job.job_type}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Match Badge */}
            <div className="flex flex-col items-end">
              <Badge className="bg-[#639922]/20 text-[#8bc34a] border border-[#639922]/30 px-3 py-1 text-sm font-semibold">
                {job.matchScore}% Match
              </Badge>
            </div>
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-2 mt-4">
            {job.skills?.slice(0, 5).map((skill: string) => (
              <Badge
                key={skill}
                className="bg-slate-700/60 text-slate-200 border border-slate-600 hover:bg-[#639922]/20 transition-colors"
              >
                {skill}
              </Badge>
            ))}

            {job.skills?.length > 5 && (
              <Badge className="bg-slate-700/40 text-slate-400 border border-slate-600">
                +{job.skills.length - 5}
              </Badge>
            )}
          </div>

          {/* Bottom CTA */}
          <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-700/60">
            <span className="text-sm text-slate-400">
              AI recommended for you
            </span>

            <div className="flex items-center gap-2 text-[#8bc34a] text-sm font-medium group-hover:translate-x-1 transition-transform">
              View Details
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  ))}
</div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog
        open={modalOpen}
        onOpenChange={(v) => {
          if (!v) resetForm();
          setModalOpen(v);
        }}
      >
        <DialogContent className="max-w-2xl bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700/50 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-[#639922] to-emerald-400 bg-clip-text text-transparent">
              {editingId ? "✏️ Edit Experience" : "➕ Add Experience"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            {/* Title */}
            <div className="space-y-2">
              <Label className="text-slate-300 font-medium">
                Position Title <span className="text-red-400">*</span>
              </Label>
              <Input
                value={form.title}
                onChange={(e) => {
                  setForm({ ...form, title: e.target.value });
                  if (formErrors.title) {
                    setFormErrors({ ...formErrors, title: "" });
                  }
                }}
                placeholder="e.g., Senior Software Engineer"
                className="bg-slate-700/30 border-slate-600 focus:border-[#639922] focus:ring-[#639922]/20 text-white placeholder:text-slate-500"
              />
              {formErrors.title && (
                <p className="text-xs text-red-400">{formErrors.title}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Company */}
              <div className="space-y-2">
                <Label className="text-slate-300 font-medium">
                  Company / Organization
                </Label>
                <Input
                  value={form.company}
                  onChange={(e) =>
                    setForm({ ...form, company: e.target.value })
                  }
                  placeholder="e.g., Google"
                  className="bg-slate-700/30 border-slate-600 focus:border-[#639922] focus:ring-[#639922]/20 text-white placeholder:text-slate-500"
                />
              </div>

              {/* Type */}
              <div className="space-y-2">
                <Label className="text-slate-300 font-medium">Type</Label>
                <Select
                  value={form.type}
                  onValueChange={(v: any) => setForm({ ...form, type: v })}
                >
                  <SelectTrigger className="bg-slate-700/30 border-slate-600 focus:border-[#639922] focus:ring-[#639922]/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {EXPERIENCE_TYPES.map((t) => (
                      <SelectItem
                        key={t.value}
                        value={t.value}
                        className="text-slate-300"
                      >
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Start Date */}
              <div className="space-y-2">
                <Label className="text-slate-300 font-medium">Start Date</Label>
                <Input
                  type="date"
                  value={form.start_date}
                  onChange={(e) =>
                    setForm({ ...form, start_date: e.target.value })
                  }
                  className="bg-slate-700/30 border-slate-600 focus:border-[#639922] focus:ring-[#639922]/20 text-white"
                />
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <Label className="text-slate-300 font-medium">End Date</Label>
                <Input
                  type="date"
                  value={form.end_date}
                  onChange={(e) =>
                    setForm({ ...form, end_date: e.target.value })
                  }
                  disabled={form.current}
                  className="bg-slate-700/30 border-slate-600 focus:border-[#639922] focus:ring-[#639922]/20 text-white disabled:opacity-50"
                />
                {formErrors.end_date && (
                  <p className="text-xs text-red-400">{formErrors.end_date}</p>
                )}
              </div>
            </div>

            {/* Current Role Checkbox */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-700/20 border border-slate-600/50">
              <input
                type="checkbox"
                id="current"
                checked={form.current}
                onChange={(e) =>
                  setForm({
                    ...form,
                    current: e.target.checked,
                    end_date: e.target.checked ? "" : form.end_date,
                  })
                }
                className="w-4 h-4 rounded border-slate-500 bg-slate-700 accent-[#639922] cursor-pointer"
              />
              <Label
                htmlFor="current"
                className="text-sm text-slate-300 cursor-pointer"
              >
                I currently work here
              </Label>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label className="text-slate-300 font-medium">Location</Label>
              <Input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="e.g., San Francisco, CA or Remote"
                className="bg-slate-700/30 border-slate-600 focus:border-[#639922] focus:ring-[#639922]/20 text-white placeholder:text-slate-500"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-slate-300 font-medium">
                Description{" "}
                <span className="text-xs text-slate-500">(optional)</span>
              </Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Describe your responsibilities and achievements..."
                rows={4}
                className="bg-slate-700/30 border-slate-600 focus:border-[#639922] focus:ring-[#639922]/20 text-white placeholder:text-slate-500 resize-none"
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-700/50">
              <Button
                variant="outline"
                type="button"
                onClick={() => setModalOpen(false)}
                className="border-slate-600 text-slate-300 hover:bg-slate-700/50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={adding || updating}
                className="bg-gradient-to-r from-[#639922] to-emerald-500 hover:from-[#5a8a1f] hover:to-emerald-600 text-black font-semibold shadow-lg"
              >
                {adding || updating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : editingId ? (
                  <>
                    <Pencil className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Experience
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
