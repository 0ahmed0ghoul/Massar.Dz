// pages/student/ExperiencePage.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CalendarDays, Plus, Pencil, Trash2, Loader2, Briefcase, FileText, Building2, MapPin, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useStudentExperiences } from "../hooks/useStudentExperiences";
import { EXPERIENCE_TYPES, statusConfig } from "@/constants/experience.constants";



export default function ExperiencePage() {
  const { experiences, applications, loading, adding, updating, deleting, addExperience, updateExperience, deleteExperience } = useStudentExperiences();
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
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-[#639922]" /></div>;
  }

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-[0.035]" />
      <div className="relative z-10 mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">My Experience</h1>
          <p className="text-sm text-foreground/40">Manage your work history and track job applications.</p>
        </div>

        <Tabs defaultValue="experience" className="space-y-6">
          <TabsList className="bg-white/5 border border-white/10 rounded-full p-1">
            <TabsTrigger value="experience" className="rounded-full data-[state=active]:bg-[#639922] data-[state=active]:text-black">Work Experience</TabsTrigger>
            <TabsTrigger value="applications" className="rounded-full data-[state=active]:bg-[#639922] data-[state=active]:text-black">Job Applications</TabsTrigger>
          </TabsList>

          {/* Experience Tab */}
          <TabsContent value="experience">
            <div className="space-y-5">
              <div className="flex justify-end">
                <Button onClick={() => { resetForm(); setModalOpen(true); }} className="bg-[#639922] text-black">
                  <Plus className="mr-2 h-4 w-4" /> Add Experience
                </Button>
              </div>
              {experiences.length === 0 ? (
                <Card className="border-white/10 bg-white/[0.02] p-8 text-center text-foreground/40">
                  No experience added yet. Click "Add Experience" to get started.
                </Card>
              ) : (
                <div className="grid gap-4">
                  {experiences.map((exp) => (
                    <Card key={exp.id} className="border-white/[0.08] bg-white/[0.02] transition-all hover:border-[#639922]/30">
                      <CardContent className="p-5">
                        <div className="flex flex-wrap justify-between gap-3">
                          <div className="space-y-1">
                            <h3 className="text-lg font-semibold text-foreground">{exp.title}</h3>
                            <div className="flex flex-wrap gap-3 text-sm text-foreground/60">
                              {exp.company && <span className="flex items-center gap-1"><Building2 className="h-3 w-3" /> {exp.company}</span>}
                              {exp.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {exp.location}</span>}
                              <Badge variant="outline" className="text-xs">{EXPERIENCE_TYPES.find(t => t.value === exp.type)?.label}</Badge>
                              <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" /> {formatDate(exp.start_date)} – {exp.current ? "Present" : formatDate(exp.end_date)}</span>
                            </div>
                            {exp.description && <p className="mt-2 text-sm text-foreground/60 whitespace-pre-wrap">{exp.description}</p>}
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={() => openEdit(exp)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-500" onClick={() => deleteExperience(exp.id)}>
                              {deleting === exp.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications">
            <div>
              {applications.length === 0 ? (
                <Card className="border-white/10 bg-white/[0.02] p-8 text-center text-foreground/40">
                  You haven't applied to any jobs yet.
                </Card>
              ) : (
                <div className="grid gap-4">
                  {applications.map((app) => {
                    const status = app.status;
                    const config = statusConfig[status] || { label: status, color: "bg-yellow-600" };
                    return (
                      <Card key={app.id} className="border-white/[0.08] bg-white/[0.02] transition-all hover:border-[#639922]/30">
                        <CardContent className="p-5">
                          <div className="flex flex-wrap gap-3 justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-foreground">{app.job?.title}</h3>
                              <div className="flex flex-wrap gap-3 text-sm text-foreground/60">
                                <span className="flex items-center gap-1"><Building2 className="h-3 w-3" /> {app.job?.company?.company_name || "Company"}</span>
                                {app.job?.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {app.job.location}</span>}
                                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Applied {formatDate(app.created_at)}</span>
                              </div>
                              {app.ai_match_score && (
                                <div className="mt-2 flex items-center gap-1">
                                  <span className="text-xs text-foreground/40">AI Match</span>
                                  <span className="text-sm font-semibold text-[#639922]">{Math.round(app.ai_match_score)}%</span>
                                </div>
                              )}
                            </div>
                            <Badge className={config.color}>{config.label}</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add/Edit Experience Modal */}
      <Dialog open={modalOpen} onOpenChange={(v) => { if (!v) resetForm(); setModalOpen(v); }}>
        <DialogContent className="max-w-lg bg-[#0f1117] border-white/10">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Experience" : "Add Experience"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Title *</Label>
              <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required className="bg-white/[0.03] border-white/10" />
            </div>
            <div>
              <Label>Company / Organization</Label>
              <Input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} className="bg-white/[0.03] border-white/10" />
            </div>
            <div>
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(v: any) => setForm({ ...form, type: v })}>
                <SelectTrigger className="bg-white/[0.03] border-white/10"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {EXPERIENCE_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Start date</Label>
                <Input type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} className="bg-white/[0.03] border-white/10" />
              </div>
              <div>
                <Label>End date</Label>
                <Input type="date" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} disabled={form.current} className="bg-white/[0.03] border-white/10" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="current" checked={form.current} onChange={e => setForm({ ...form, current: e.target.checked, end_date: e.target.checked ? "" : form.end_date })} className="rounded border-white/10 bg-white/5" />
              <Label htmlFor="current" className="text-sm">I currently work here</Label>
            </div>
            <div>
              <Label>Location</Label>
              <Input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Algiers, Remote, etc." className="bg-white/[0.03] border-white/10" />
            </div>
            <div>
              <Label>Description (optional)</Label>
              <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="bg-white/[0.03] border-white/10" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={adding || updating}>
                {adding || updating ? <Loader2 className="h-4 w-4 animate-spin" /> : (editingId ? "Save" : "Add")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}