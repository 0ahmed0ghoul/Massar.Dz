// pages/company/dashboard/JobsPage.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SkillsInput } from '@/features/auth/components/skills-input';
import { Briefcase, MapPin, Clock, DollarSign, Plus, Edit, Trash2, Eye, Loader2 } from 'lucide-react';
import { useCompanyJobs } from '../hooks/useCompanyJobs';

const JOB_TYPES = [
  { value: 'full-time', label: 'Full Time' },
  { value: 'part-time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
];

const EXPERIENCE_LEVELS = [
  { value: 'entry', label: 'Entry Level' },
  { value: 'mid', label: 'Mid Level' },
  { value: 'senior', label: 'Senior Level' },
  { value: 'lead', label: 'Lead / Manager' },
];

export default function JobsPage() {
  const { jobs, loading, creating, updating, deleting, createJob, updateJob, deleteJob } = useCompanyJobs();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    job_type: 'full-time' as const,
    experience_level: 'entry' as const,
    salary_min: '',
    salary_max: '',
    salary_currency: 'DZD',
    skills: [] as string[],
    status: 'active' as const,
  });

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      requirements: '',
      location: '',
      job_type: 'full-time',
      experience_level: 'entry',
      salary_min: '',
      salary_max: '',
      salary_currency: 'DZD',
      skills: [],
      status: 'active',
    });
    setEditingId(null);
  };

  const openEdit = (job: any) => {
    setEditingId(job.id);
    setForm({
      title: job.title,
      description: job.description,
      requirements: job.requirements || '',
      location: job.location || '',
      job_type: job.job_type,
      experience_level: job.experience_level,
      salary_min: job.salary_min?.toString() || '',
      salary_max: job.salary_max?.toString() || '',
      salary_currency: job.salary_currency,
      skills: job.skills || [],
      status: job.status,
    });
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...form,
      salary_min: form.salary_min ? parseFloat(form.salary_min) : null,
      salary_max: form.salary_max ? parseFloat(form.salary_max) : null,
    };
    if (editingId) {
      await updateJob(editingId, data);
    } else {
      await createJob(data);
    }
    setOpen(false);
    resetForm();
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-[#639922]" /></div>;
  }

  return (
    <div className="relative min-h-screen bg-background">
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Job Postings</h1>
              <p className="text-sm text-foreground/40">Manage your job listings and find top talent</p>
            </div>
            <Button onClick={() => { resetForm(); setOpen(true); }} className="bg-[#639922] text-black">
              <Plus className="mr-2 h-4 w-4" /> Post New Job
            </Button>
          </div>

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="border-white/[0.07] bg-white/[0.02]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-foreground/60">Total Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{jobs.length}</div>
              </CardContent>
            </Card>
            <Card className="border-white/[0.07] bg-white/[0.02]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-foreground/60">Active</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#639922]">{jobs.filter(j => j.status === 'active').length}</div>
              </CardContent>
            </Card>
            <Card className="border-white/[0.07] bg-white/[0.02]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-foreground/60">Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{jobs.reduce((sum, j) => sum + (j.applications_count || 0), 0)}</div>
              </CardContent>
            </Card>
          </div>

          {/* Jobs List */}
          {jobs.length === 0 ? (
            <Card className="border-white/[0.07] bg-white/[0.02] p-8 text-center">
              <Briefcase className="mx-auto h-12 w-12 text-foreground/20" />
              <h3 className="mt-3 text-lg font-medium text-foreground/60">No jobs posted yet</h3>
              <p className="mt-1 text-sm text-foreground/40">Click "Post New Job" to create your first listing.</p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {jobs.map((job) => (
                <Card key={job.id} className="border-white/[0.07] bg-white/[0.02] transition-all hover:border-[#639922]/30">
                  <CardHeader className="pb-2">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <CardTitle className="text-lg text-foreground">{job.title}</CardTitle>
                        <CardDescription className="mt-1 flex flex-wrap gap-3 text-xs">
                          <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" /> {job.job_type.replace('-', ' ')}</span>
                          {job.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {job.location}</span>}
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {job.experience_level}</span>
                          {job.salary_min && <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" /> {job.salary_min}{job.salary_max ? ` - ${job.salary_max}` : ''} {job.salary_currency}</span>}
                        </CardDescription>
                      </div>
                      <Badge variant={job.status === 'active' ? 'default' : 'secondary'} className={job.status === 'active' ? 'bg-[#639922]/20 text-[#639922]' : ''}>
                        {job.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-foreground/60 line-clamp-2">{job.description}</p>
                    {job.skills.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {job.skills.slice(0, 5).map(skill => (
                          <span key={skill} className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-foreground/40">{skill}</span>
                        ))}
                        {job.skills.length > 5 && <span className="text-xs text-foreground/40">+{job.skills.length - 5}</span>}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEdit(job)} disabled={updating === job.id}>
                      <Edit className="mr-1 h-3 w-3" /> Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-400 hover:text-red-300" onClick={() => deleteJob(job.id)} disabled={deleting === job.id}>
                      {deleting === job.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="mr-1 h-3 w-3" />}
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Dialog open={open} onOpenChange={(v) => { if (!v) resetForm(); setOpen(v); }}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-[#0f1117] border-white/10">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Job' : 'Post New Job'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Job Title *</Label>
              <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required className="bg-white/[0.03] border-white/10" />
            </div>
            <div>
              <Label>Job Description *</Label>
              <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={4} required className="bg-white/[0.03] border-white/10" />
            </div>
            <div>
              <Label>Requirements (optional)</Label>
              <Textarea value={form.requirements} onChange={e => setForm({ ...form, requirements: e.target.value })} rows={3} className="bg-white/[0.03] border-white/10" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label>Job Type</Label>
                <Select value={form.job_type} onValueChange={(v: any) => setForm({ ...form, job_type: v })}>
                  <SelectTrigger className="bg-white/[0.03] border-white/10"><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent className="bg-[#1a1c22] border-white/10">
                    {JOB_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Experience Level</Label>
                <Select value={form.experience_level} onValueChange={(v: any) => setForm({ ...form, experience_level: v })}>
                  <SelectTrigger className="bg-white/[0.03] border-white/10"><SelectValue placeholder="Select level" /></SelectTrigger>
                  <SelectContent className="bg-[#1a1c22] border-white/10">
                    {EXPERIENCE_LEVELS.map(l => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label>Location</Label>
                <Input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Algiers, Algeria" className="bg-white/[0.03] border-white/10" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Min Salary</Label>
                  <Input type="number" value={form.salary_min} onChange={e => setForm({ ...form, salary_min: e.target.value })} placeholder="0" className="bg-white/[0.03] border-white/10" />
                </div>
                <div>
                  <Label>Max Salary</Label>
                  <Input type="number" value={form.salary_max} onChange={e => setForm({ ...form, salary_max: e.target.value })} placeholder="0" className="bg-white/[0.03] border-white/10" />
                </div>
              </div>
            </div>
            <div>
              <Label>Skills (press Enter or comma to add)</Label>
              <SkillsInput
                value={form.skills}
                onChange={(skills) => setForm({ ...form, skills })}
                placeholder="e.g., React, Python, SQL"
              />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v: any) => setForm({ ...form, status: v })}>
                <SelectTrigger className="bg-white/[0.03] border-white/10"><SelectValue placeholder="Select status" /></SelectTrigger>
                <SelectContent className="bg-[#1a1c22] border-white/10">
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={creating || updating} className="bg-[#639922] text-black">
                {creating || updating ? <Loader2 className="h-4 w-4 animate-spin" /> : (editingId ? 'Update Job' : 'Post Job')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}