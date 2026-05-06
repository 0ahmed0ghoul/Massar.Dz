// features/admin/components/AdminFilters.tsx
import { Search, X, ChevronDown, GraduationCap, Building2, Briefcase, Users, CheckCircle2, Clock, XCircle, SlidersHorizontal } from "lucide-react";
import { RoleFilter, StatusFilter } from "../../../constants/admin.constants";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AdminFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  roleFilter: RoleFilter;
  onRoleChange: (val: RoleFilter) => void;
  statusFilter: StatusFilter;
  onStatusChange: (val: StatusFilter) => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ROLE_OPTIONS: {
  value: RoleFilter;
  label: string;
  icon: React.ElementType;
  color: string;
  dot: string;
}[] = [
  { value: "all",              label: "All Roles",    icon: Users,          color: "text-white/50",   dot: "bg-white/20" },
  { value: "student",          label: "Students",     icon: GraduationCap,  color: "text-sky-400",    dot: "bg-sky-400" },
  { value: "company_admin",    label: "Companies",    icon: Building2,      color: "text-orange-400", dot: "bg-orange-400" },
  { value: "university_admin", label: "Universities", icon: Building2,      color: "text-indigo-400", dot: "bg-indigo-400" },
  { value: "professional",     label: "Professionals",icon: Briefcase,      color: "text-amber-400",  dot: "bg-amber-400" },
];

const STATUS_OPTIONS: {
  value: StatusFilter;
  label: string;
  icon: React.ElementType;
  color: string;
  dot: string;
}[] = [
  { value: "all",      label: "All Statuses", icon: SlidersHorizontal, color: "text-white/50",    dot: "bg-white/20" },
  { value: "active",   label: "Active",       icon: CheckCircle2,      color: "text-emerald-400", dot: "bg-emerald-400" },
  { value: "pending",  label: "Pending",      icon: Clock,             color: "text-amber-400",   dot: "bg-amber-400" },
  { value: "rejected", label: "Rejected",     icon: XCircle,           color: "text-red-400",     dot: "bg-red-400" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Pill-style filter group — renders role or status chips */
function FilterPills<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string; icon: React.ElementType; color: string; dot: string }[];
  value: T;
  onChange: (val: T) => void;
}) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {options.map((opt) => {
        const Icon = opt.icon;
        const isActive = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`
              inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5
              text-[11px] font-medium transition-all duration-150 whitespace-nowrap
              ${isActive
                ? `border-[#639922]/40 bg-[#639922]/10 text-[#639922]`
                : `border-white/[0.07] bg-white/[0.03] text-white/40
                   hover:border-white/[0.12] hover:bg-white/[0.06] hover:text-white/70`
              }
            `}
          >
            {/* Active: colored dot. Inactive: icon */}
            {isActive ? (
              <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${opt.dot}`} />
            ) : (
              <Icon className="h-3 w-3 shrink-0" />
            )}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

/**
 * AdminFilters — Search input + role and status pill-filter rows.
 * Fully responsive: pills wrap naturally on small screens.
 */
export const AdminFilters = ({
  search,
  onSearchChange,
  roleFilter,
  onRoleChange,
  statusFilter,
  onStatusChange,
}: AdminFiltersProps) => {
  const hasActiveFilters =
    search.trim() !== "" || roleFilter !== "all" || statusFilter !== "all";

  return (
    <div className="space-y-3">
      {/* ── Search ── */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
        <input
          type="text"
          placeholder="Search by name, email or organisation…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="
            w-full rounded-xl border border-white/[0.07] bg-white/[0.03]
            pl-10 pr-10 py-2.5 text-sm text-white/80
            placeholder:text-white/25
            focus:border-[#639922]/40 focus:bg-[#639922]/[0.03]
            focus:outline-none focus:ring-[3px] focus:ring-[#639922]/10
            transition-all duration-150
          "
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center
                       justify-center rounded-md text-white/30 hover:text-white/70
                       hover:bg-white/5 transition-all"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* ── Filters row ── */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-3">
        {/* Role pills */}
        <div className="flex-1 space-y-1.5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/25 px-0.5">
            Role
          </p>
          <FilterPills
            options={ROLE_OPTIONS}
            value={roleFilter}
            onChange={onRoleChange}
          />
        </div>

        {/* Separator */}
        <div className="hidden sm:block w-px self-stretch bg-white/[0.05] mt-6" />

        {/* Status pills */}
        <div className="flex-1 space-y-1.5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/25 px-0.5">
            Status
          </p>
          <FilterPills
            options={STATUS_OPTIONS}
            value={statusFilter}
            onChange={onStatusChange}
          />
        </div>

        {/* Clear all — only when filters are active */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => {
              onSearchChange("");
              onRoleChange("all" as RoleFilter);
              onStatusChange("all" as StatusFilter);
            }}
            className="self-end sm:self-start sm:mt-6 inline-flex items-center gap-1.5
                       rounded-lg border border-red-500/15 bg-red-500/5
                       px-3 py-1.5 text-[11px] font-medium text-red-400/70
                       hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400
                       transition-all duration-150 whitespace-nowrap shrink-0"
          >
            <X className="h-3 w-3" />
            Clear all
          </button>
        )}
      </div>
    </div>
  );
};