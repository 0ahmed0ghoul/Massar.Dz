// features/admin/components/AdminFilters.tsx
import { Search, ChevronDown } from "lucide-react";
import { RoleFilter, StatusFilter } from "../constants/admin.constants";

interface AdminFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  roleFilter: RoleFilter;
  onRoleChange: (val: RoleFilter) => void;
  statusFilter: StatusFilter;
  onStatusChange: (val: StatusFilter) => void;
}

export const AdminFilters = ({
  search,
  onSearchChange,
  roleFilter,
  onRoleChange,
  statusFilter,
  onStatusChange,
}: AdminFiltersProps) => (
  <div className="flex flex-col sm:flex-row gap-3">
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
      <input
        type="text"
        placeholder="Search by name, email or organisation..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full rounded-lg border border-white/10 bg-white/5 pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/10"
      />
    </div>

    <div className="relative">
      <select
        value={roleFilter}
        onChange={(e) => onRoleChange(e.target.value as RoleFilter)}
        className="appearance-none rounded-lg border border-white/10 bg-white/5 pl-3 pr-8 py-2.5 text-sm text-white focus:border-white/20 focus:outline-none cursor-pointer"
      >
        <option value="all">All roles</option>
        <option value="student">Students</option>
        <option value="company_admin">Companies</option>
        <option value="university_admin">Universities</option>
        <option value="pending_university">Pending Uni</option>
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40" />
    </div>

    <div className="relative">
      <select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value as StatusFilter)}
        className="appearance-none rounded-lg border border-white/10 bg-white/5 pl-3 pr-8 py-2.5 text-sm text-white focus:border-white/20 focus:outline-none cursor-pointer"
      >
        <option value="all">All statuses</option>
        <option value="active">Active</option>
        <option value="pending">Pending</option>
        <option value="rejected">Rejected</option>
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40" />
    </div>
  </div>
);