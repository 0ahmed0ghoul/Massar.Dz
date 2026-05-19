// pages/student/dashboard/SkillsPage.tsx
import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Loader2, Plus, Pencil, Trash2, Search, Zap,
  ChevronDown, Sparkles, BarChart2, Star, Trophy,
} from 'lucide-react';
import { useStudentSkills } from '@/features/department/hooks/useSkills';

// ─── Constants ────────────────────────────────────────────────────────────────

const PROFICIENCY_LEVELS = [
  {
    value: 'beginner',
    label: 'Beginner',
    sub: '0 – 1 year',
    color: 'text-sky-400',
    border: 'border-sky-500/20',
    bg: 'bg-sky-500/10',
    bar: 'bg-sky-400',
    barW: 'w-1/4',
    dot: 'bg-sky-400',
  },
  {
    value: 'intermediate',
    label: 'Intermediate',
    sub: '1 – 3 years',
    color: 'text-cyan-400',
    border: 'border-cyan-500/20',
    bg: 'bg-cyan-500/10',
    bar: 'bg-cyan-400',
    barW: 'w-2/4',
    dot: 'bg-cyan-400',
  },
  {
    value: 'advanced',
    label: 'Advanced',
    sub: '3 – 5 years',
    color: 'text-violet-400',
    border: 'border-violet-500/20',
    bg: 'bg-violet-500/10',
    bar: 'bg-violet-400',
    barW: 'w-3/4',
    dot: 'bg-violet-400',
  },
  {
    value: 'expert',
    label: 'Expert',
    sub: '5+ years',
    color: 'text-[#639922]',
    border: 'border-[#639922]/20',
    bg: 'bg-[#639922]/10',
    bar: 'bg-[#639922]',
    barW: 'w-full',
    dot: 'bg-[#639922]',
  },
] as const;

type Proficiency = typeof PROFICIENCY_LEVELS[number]['value'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getLevel(proficiency: string) {
  return PROFICIENCY_LEVELS.find(l => l.value === proficiency) ?? PROFICIENCY_LEVELS[0];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Inline proficiency badge */
function ProficiencyBadge({ proficiency }: { proficiency: string }) {
  const lvl = getLevel(proficiency);
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${lvl.bg} ${lvl.border} ${lvl.color}`}>
      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${lvl.dot}`} />
      {lvl.label}
    </span>
  );
}

/** Horizontal proficiency mini-bar inside each card */
function ProficiencyBar({ proficiency }: { proficiency: string }) {
  const lvl = getLevel(proficiency);
  return (
    <div className="h-1 w-full rounded-full bg-white/[0.06] overflow-hidden">
      <div className={`h-full rounded-full transition-all duration-700 ${lvl.bar} ${lvl.barW}`} />
    </div>
  );
}

/** Stat summary card */
function StatChip({ icon: Icon, label, value, color }: {
  icon: React.ElementType; label: string; value: number | string; color: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.02] px-5 py-4">
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${color}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-white/25">{label}</p>
        <p className="text-xl font-bold text-white/85 leading-tight">{value}</p>
      </div>
    </div>
  );
}

/** Empty state */
function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 rounded-2xl border border-dashed
                    border-white/[0.08] bg-white/[0.01] py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#639922]/15 bg-[#639922]/[0.06]">
        <Zap className="h-6 w-6 text-[#639922]/60" />
      </div>
      <div>
        <p className="text-sm font-semibold text-white/50">No skills added yet</p>
        <p className="mt-1 text-[12px] text-white/25 max-w-xs">
          Showcase your expertise by adding skills with proficiency levels and experience.
        </p>
      </div>
      <button
        onClick={onAdd}
        className="inline-flex items-center gap-2 rounded-xl border border-[#639922]/30
                   bg-[#639922]/12 px-4 py-2 text-[13px] font-semibold text-[#639922]
                   hover:bg-[#639922]/22 hover:border-[#639922]/50 transition-all duration-150"
      >
        <Plus className="h-4 w-4" /> Add your first skill
      </button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SkillsPage() {
  const {
    skills, allSkills, loading, adding, updating, deleting,
    addSkill, updateSkill, deleteSkill,
  } = useStudentSkills();

  const [open,           setOpen]           = useState(false);
  const [editingId,      setEditingId]      = useState<string | null>(null);
  const [skillSearchOpen,setSkillSearchOpen]= useState(false);
  const [formData, setFormData] = useState({
    skill_id: '',
    proficiency: 'beginner' as Proficiency,
    years_of_experience: 0,
  });

  // Group skills by category for the combobox
  const categories = useMemo(() => {
    const cats = new Map<string, { id: string; name: string }[]>();
    allSkills.forEach(skill => {
      const cat = skill.category || 'Other';
      if (!cats.has(cat)) cats.set(cat, []);
      cats.get(cat)!.push(skill);
    });
    return Array.from(cats.entries()).map(([name, items]) => ({ name, items }));
  }, [allSkills]);

  // Group added skills by category for display
  const groupedSkills = useMemo(() => {
    const cats = new Map<string, any[]>();
    skills.forEach(s => {
      const cat = s.skill?.category || 'Other';
      if (!cats.has(cat)) cats.set(cat, []);
      cats.get(cat)!.push(s);
    });
    return Array.from(cats.entries()).map(([name, items]) => ({ name, items }));
  }, [skills]);

  const selectedSkill = allSkills.find(s => s.id === formData.skill_id);

  // ── Derived stats ─────────────────────────────────────────────────────────

  const expertCount  = skills.filter(s => s.proficiency === 'expert').length;
  const totalYears   = skills.reduce((a, s) => a + (s.years_of_experience ?? 0), 0);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const resetForm = () => {
    setFormData({ skill_id: '', proficiency: 'beginner', years_of_experience: 0 });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.skill_id) return;
    const success = editingId
      ? await updateSkill(editingId, { proficiency: formData.proficiency, years_of_experience: formData.years_of_experience })
      : await addSkill(formData.skill_id, formData.proficiency, formData.years_of_experience);
    if (success) { setOpen(false); resetForm(); }
  };

  const openEdit = (skill: any) => {
    setFormData({
      skill_id: skill.skill_id,
      proficiency: skill.proficiency,
      years_of_experience: skill.years_of_experience,
    });
    setEditingId(skill.id);
    setOpen(true);
  };

  // ── Loading ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-[#639922]" />
          <p className="text-sm text-white/30">Loading skills…</p>
        </div>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">

      {/* Background */}
      <div className="pointer-events-none fixed inset-0 bg-grid-pattern opacity-[0.035]" />
      <div className="pointer-events-none fixed -top-48 left-1/2 h-[500px] w-[700px]
                      -translate-x-1/3 rounded-full bg-[#639922]/[0.07] blur-[130px]" />
      <div className="pointer-events-none fixed bottom-0 right-0 h-64 w-64
                      rounded-full bg-[#639922]/[0.04] blur-[90px] translate-x-1/3 translate-y-1/3" />
      <div className="pointer-events-none fixed top-0 left-0 right-0 h-px
                      bg-gradient-to-r from-transparent via-[#639922]/35 to-transparent" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">

        {/* ── Header ── */}
        <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#639922]/20
                               bg-[#639922]/8 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#639922]">
                <Sparkles className="h-3 w-3" />
                Student Profile
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white/90">My Skills</h1>
            <p className="text-sm text-white/35 max-w-md">
              Showcase your expertise with proficiency levels and years of experience.
            </p>
          </div>

          <Dialog open={open} onOpenChange={v => { if (!v) resetForm(); setOpen(v); }}>
            <DialogTrigger asChild>
              <button className="self-start inline-flex items-center gap-2 rounded-xl border border-[#639922]/30
                                 bg-[#639922]/12 px-4 py-2.5 text-sm font-semibold text-[#639922]
                                 hover:bg-[#639922]/22 hover:border-[#639922]/50
                                 hover:shadow-[0_4px_14px_rgba(99,153,34,0.2)] transition-all duration-150">
                <Plus className="h-4 w-4" />
                Add Skill
              </button>
            </DialogTrigger>

            {/* ── Dialog ── */}
            <DialogContent className="max-w-md border-white/[0.09] bg-[#0f1117] p-0 gap-0">

              {/* Dialog header */}
              <div className="flex items-start gap-4 border-b border-white/[0.07] px-6 py-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#639922]/20 bg-[#639922]/10 shrink-0">
                  <Zap className="h-5 w-5 text-[#639922]" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-white/90">
                    {editingId ? 'Edit Skill' : 'Add New Skill'}
                  </h2>
                  <p className="text-[12px] text-white/35 mt-0.5">
                    {editingId ? 'Update your proficiency and experience' : 'Select a skill and set your level'}
                  </p>
                </div>
              </div>

              {/* Dialog form */}
              <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">

                {/* Skill search */}
                <div className="space-y-1.5">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-white/25">
                    Skill <span className="text-red-400">*</span>
                  </p>
                  <Popover open={skillSearchOpen} onOpenChange={setSkillSearchOpen}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="w-full flex items-center justify-between rounded-xl border border-white/[0.08]
                                   bg-white/[0.03] px-4 py-2.5 text-[13px] text-left
                                   hover:border-white/[0.14] focus:border-[#639922]/40 focus:outline-none
                                   focus:ring-2 focus:ring-[#639922]/10 transition-all"
                      >
                        <span className={selectedSkill ? 'text-white/80 font-medium' : 'text-white/25'}>
                          {selectedSkill ? selectedSkill.name : 'Search or select a skill…'}
                        </span>
                        <Search className="h-3.5 w-3.5 text-white/25 shrink-0" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[320px] p-0 border-white/[0.09] bg-[#131518] shadow-xl">
                      <Command>
                        <div className="border-b border-white/[0.07]">
                          <CommandInput
                            placeholder="Search skills…"
                            className="border-0 bg-transparent text-[13px] text-white/70
                                       placeholder:text-white/25 focus:ring-0 h-10"
                          />
                        </div>
                        <CommandList className="max-h-60 overflow-y-auto
                                               scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
                          <CommandEmpty>
                            <p className="text-[12px] text-white/30 text-center py-4">No skill found</p>
                          </CommandEmpty>
                          {categories.map(cat => (
                            <CommandGroup key={cat.name} heading={cat.name}
                              className="[&_[cmdk-group-heading]]:text-[10px]
                                         [&_[cmdk-group-heading]]:font-semibold
                                         [&_[cmdk-group-heading]]:uppercase
                                         [&_[cmdk-group-heading]]:tracking-widest
                                         [&_[cmdk-group-heading]]:text-white/20
                                         [&_[cmdk-group-heading]]:px-3
                                         [&_[cmdk-group-heading]]:py-2">
                              {cat.items.map(skill => (
                                <CommandItem
                                  key={skill.id}
                                  value={skill.name}
                                  onSelect={() => {
                                    setFormData(p => ({ ...p, skill_id: skill.id }));
                                    setSkillSearchOpen(false);
                                  }}
                                  className="text-[13px] text-white/65 data-[selected=true]:bg-[#639922]/10
                                             data-[selected=true]:text-[#639922] rounded-lg mx-1 px-3 py-2 cursor-pointer"
                                >
                                  {skill.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          ))}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Proficiency — pill selector */}
                <div className="space-y-1.5">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-white/25">Proficiency Level</p>
                  <div className="grid grid-cols-2 gap-2">
                    {PROFICIENCY_LEVELS.map(lvl => {
                      const active = formData.proficiency === lvl.value;
                      return (
                        <button
                          key={lvl.value}
                          type="button"
                          onClick={() => setFormData(p => ({ ...p, proficiency: lvl.value }))}
                          className={`flex flex-col items-start rounded-xl border px-3 py-2.5 text-left transition-all duration-150
                            ${active
                              ? `${lvl.bg} ${lvl.border} ${lvl.color}`
                              : 'border-white/[0.07] bg-white/[0.02] text-white/40 hover:border-white/[0.12] hover:bg-white/[0.05]'
                            }`}
                        >
                          <span className="text-[12px] font-semibold leading-tight">{lvl.label}</span>
                          <span className={`text-[10px] mt-0.5 ${active ? 'opacity-70' : 'text-white/25'}`}>{lvl.sub}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>


                {/* Actions */}
                <div className="flex justify-end gap-2 pt-1 border-t border-white/[0.06]">
                  <button
                    type="button"
                    onClick={() => { setOpen(false); resetForm(); }}
                    className="rounded-xl border border-white/[0.09] bg-white/[0.03] px-4 py-2
                               text-[13px] font-medium text-white/45 hover:text-white/70 hover:border-white/[0.14] transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={(adding || !!updating) || !formData.skill_id}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#639922]/30
                               bg-[#639922]/15 px-4 py-2 text-[13px] font-semibold text-[#639922]
                               hover:bg-[#639922]/25 hover:border-[#639922]/50
                               hover:shadow-[0_4px_14px_rgba(99,153,34,0.2)]
                               transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none"
                  >
                    {adding || updating
                      ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…</>
                      : editingId ? 'Save Changes' : <><Plus className="h-3.5 w-3.5" /> Add Skill</>
                    }
                  </button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </header>

        {/* ── Stats row ── */}
        {skills.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <StatChip icon={Zap}      label="Skills"       value={skills.length} color="border-[#639922]/20 bg-[#639922]/10 text-[#639922]" />
            <StatChip icon={Trophy}   label="Expert Level" value={expertCount}   color="border-amber-500/20 bg-amber-500/10 text-amber-400" />
          </div>
        )}

        {/* ── Skills grid ── */}
        {skills.length === 0 ? (
          <EmptyState onAdd={() => setOpen(true)} />
        ) : (
          <div className="space-y-6">
            {groupedSkills.map(({ name, items }) => (
              <div key={name}>
                {/* Category label */}
                <div className="flex items-center gap-3 mb-3">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-white/25">{name}</p>
                  <div className="flex-1 h-px bg-white/[0.05]" />
                  <span className="text-[10px] text-white/20">{items.length}</span>
                </div>

                {/* Skill cards */}
                <div className="grid gap-2 sm:grid-cols-2">
                  {items.map(skill => {
                    const lvl       = getLevel(skill.proficiency);
                    const isUpdating= updating === skill.id;
                    const isDeleting= deleting === skill.id;

                    return (
                      <div
                        key={skill.id}
                        className="group relative rounded-2xl border border-white/[0.07] bg-white/[0.025]
                                   p-4 transition-all duration-200
                                   hover:border-white/[0.12] hover:bg-white/[0.04]"
                      >
                        {/* Top row */}
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border ${lvl.bg} ${lvl.border}`}>
                              <Star className={`h-3 w-3 ${lvl.color}`} />
                            </div>
                            <p className="font-semibold text-[14px] text-white/85 truncate">
                              {skill.skill?.name}
                            </p>
                          </div>

                          {/* Action buttons — visible on hover */}
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 shrink-0">
                            <button
                              onClick={() => openEdit(skill)}
                              disabled={isUpdating}
                              title="Edit"
                              className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.07]
                                         bg-white/[0.04] text-white/35 hover:text-white/70 hover:bg-white/[0.08]
                                         transition-all disabled:opacity-30"
                            >
                              {isUpdating
                                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                : <Pencil className="h-3.5 w-3.5" />
                              }
                            </button>
                            <button
                              onClick={() => deleteSkill(skill.id)}
                              disabled={isDeleting}
                              title="Delete"
                              className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-500/10
                                         bg-red-500/[0.04] text-red-400/50 hover:bg-red-500/10 hover:text-red-400
                                         transition-all disabled:opacity-30"
                            >
                              {isDeleting
                                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                : <Trash2 className="h-3.5 w-3.5" />
                              }
                            </button>
                          </div>
                        </div>

                        {/* Proficiency bar */}
                        <ProficiencyBar proficiency={skill.proficiency} />

                        {/* Bottom row */}
                        <div className="flex items-center justify-between mt-2.5">
                          <ProficiencyBadge proficiency={skill.proficiency} />
                          {skill.years_of_experience > 0 && (
                            <span className="text-[11px] font-mono text-white/25">
                              {skill.years_of_experience} yr{skill.years_of_experience !== 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom spacer */}
        <div className="flex items-center justify-center mt-8">
          <div className="h-px w-48 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
        </div>

      </div>
    </div>
  );
}