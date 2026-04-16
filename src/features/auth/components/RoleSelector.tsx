import { GraduationCap, Building2, School } from "lucide-react";
import { UserRole } from "../services/authService";

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
    title: "Student",
    description: "Find internships, jobs & build your career",
  },
  {
    role: "company_admin",
    icon: <Building2 className="h-7 w-7" />,
    title: "Company",
    description: "Post jobs and hire top talent",
  },
  {
    role: "pending_university",
    icon: <School className="h-7 w-7" />,
    title: "University",
    description: "Connect your students with employers",
    badge: "Requires Approval",
    badgeColor: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  },
];

interface RoleSelectorProps {
  selected: UserRole | null;
  onSelect: (role: UserRole) => void;
}

export function RoleSelector({ selected, onSelect }: RoleSelectorProps) {
  return (
    <div className="space-y-3">
      {ROLES.map(({ role, icon, title, description, badge, badgeColor }) => {
        const isSelected = selected === role;
        return (
          <button
            key={role}
            type="button"
            onClick={() => onSelect(role)}
            className={`w-full flex items-center gap-4 rounded-xl border p-4 text-left transition-all duration-200
              ${
                isSelected
                  ? "border-white/30 bg-white/10"
                  : "border-white/10 bg-white/[0.03] hover:bg-white/5 hover:border-white/20"
              }`}
          >
            {/* Icon bubble */}
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border transition-colors
                ${isSelected ? "border-white/30 bg-white/10 text-white" : "border-white/10 bg-white/5 text-white/50"}`}
            >
              {icon}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-white">{title}</span>
                {badge && (
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${badgeColor}`}
                  >
                    {badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-white/40 mt-0.5">{description}</p>
            </div>

            {/* Radio dot */}
            <div
              className={`h-4 w-4 shrink-0 rounded-full border-2 transition-colors
                ${isSelected ? "border-white bg-white" : "border-white/20 bg-transparent"}`}
            />
          </button>
        );
      })}
    </div>
  );
}
