import { GraduationCap, Building2, School } from "lucide-react";
import { UserRole } from "@/types/profile.types";

interface RoleOption {
  role: UserRole;
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
  badgeColor?: string;
}

const ROLES: RoleOption[] = [
  {
    role: "student",
    icon: <GraduationCap className="h-7 w-7" />,
    title: "Candidate",
    description: "Find internships, jobs & build your career",
  },
  {
    role: "company_admin",
    icon: <Building2 className="h-7 w-7" />,
    badge: "Requires Approval",
    badgeColor: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    title: "Company",
    description: "Post jobs and hire top talent",
  },
  {
    role: "university_admin",
    icon: <School className="h-7 w-7" />,
    title: "University",
    description: "Connect your students with employers",
    badge: "Requires Approval",
    badgeColor: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  },
];

interface RoleSelectorProps {
  selectedRole: UserRole | null;
  onRoleSelect: (role: UserRole) => void;
}

export function RoleSelector({ selectedRole, onRoleSelect }: RoleSelectorProps) {
  return (
    <div className="space-y-3">
      {ROLES.map(({ role, icon, title, description, badge, badgeColor }) => {
        const isSelected = selectedRole === role;
        return (
          <button
            key={role}
            type="button"
            onClick={() => onRoleSelect(role)}
            className={`w-full flex items-center gap-4 rounded-xl border p-4 text-left transition-all duration-200
              ${
                isSelected
                  ? "border-border/80 bg-card/50"
                  : "border-border bg-card/30 hover:bg-card/50 hover:border-border/70"
              }`}
          >
            {/* Icon bubble */}
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border transition-colors
                ${isSelected ? "border-border/80 bg-card/60 text-foreground" : "border-border bg-card/40 text-muted-foreground"}`}
            >
              {icon}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-foreground">{title}</span>
                {badge && (
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${badgeColor}`}
                  >
                    {badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
            </div>

            {/* Radio dot */}
            <div
              className={`h-4 w-4 shrink-0 rounded-full border-2 transition-colors
                ${isSelected ? "border-primary bg-primary" : "border-border bg-transparent"}`}
            />
          </button>
        );
      })}
    </div>
  );
}