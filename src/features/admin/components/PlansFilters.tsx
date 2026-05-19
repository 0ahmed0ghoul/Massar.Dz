// features/admin/components/PlansFilters.tsx
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PlansFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  roleFilter: string;
  onRoleChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  paymentStatusFilter: string;
  onPaymentStatusChange: (value: string) => void;
}

export function PlansFilters({ 
  search, 
  onSearchChange, 
  roleFilter, 
  onRoleChange,
  statusFilter,
  onStatusChange,
  paymentStatusFilter,
  onPaymentStatusChange
}: PlansFiltersProps) {
  return (
    <div className="flex gap-3 flex-wrap items-center">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/40" />
        <Input
          placeholder="Search by name, email, or company..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 bg-white/5 border-white/10 text-foreground placeholder:text-foreground/30"
        />
      </div>
      
      <Select value={roleFilter} onValueChange={onRoleChange}>
        <SelectTrigger className="w-[160px] bg-white/5 border-white/10 text-foreground">
          <SelectValue placeholder="All Roles" />
        </SelectTrigger>
        <SelectContent className="border-white/10 bg-slate-800">
          <SelectItem value="all">All Roles</SelectItem>
          <SelectItem value="student">Students</SelectItem>
          <SelectItem value="company_admin">Companies</SelectItem>
        </SelectContent>
      </Select>

      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[160px] bg-white/5 border-white/10 text-foreground">
          <SelectValue placeholder="Plan Status" />
        </SelectTrigger>
        <SelectContent className="border-white/10 bg-slate-800">
          <SelectItem value="all">All Plans</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="expiring_soon">Expiring Soon</SelectItem>
          <SelectItem value="expired">Expired</SelectItem>
        </SelectContent>
      </Select>

      <Select value={paymentStatusFilter} onValueChange={onPaymentStatusChange}>
        <SelectTrigger className="w-[160px] bg-white/5 border-white/10 text-foreground">
          <SelectValue placeholder="Payment Status" />
        </SelectTrigger>
        <SelectContent className="border-white/10 bg-slate-800">
          <SelectItem value="all">All Payments</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="approved">Approved</SelectItem>
          <SelectItem value="rejected">Rejected</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}