// features/auth/components/skills-input.tsx
import { useState, KeyboardEvent, forwardRef } from "react";
import { X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface SkillsInputProps {
  value: string[];
  onChange: (skills: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const SkillsInput = forwardRef<HTMLDivElement, SkillsInputProps>(
  ({ value = [], onChange, placeholder = "Add skill...", className, disabled }, ref) => {
    // ✅ Ensure value is always an array (fallback to empty array)
    const safeValue = Array.isArray(value) ? value : [];
    const [inputValue, setInputValue] = useState("");

    const addSkill = () => {
      const skill = inputValue.trim();
      if (skill && !safeValue.includes(skill)) {
        onChange([...safeValue, skill]);
        setInputValue("");
      }
    };

    const removeSkill = (skillToRemove: string) => {
      onChange(safeValue.filter((s) => s !== skillToRemove));
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        addSkill();
      } else if (e.key === "Backspace" && inputValue === "" && safeValue.length > 0) {
        removeSkill(safeValue[safeValue.length - 1]);
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-wrap items-center gap-2 rounded-md border border-border bg-card/30 p-2 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20",
          className
        )}
      >
        {safeValue.map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-medium text-primary"
          >
            {skill}
            {!disabled && (
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="rounded-full p-0.5 hover:bg-primary/25 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addSkill}
          placeholder={safeValue.length === 0 ? placeholder : ""}
          disabled={disabled}
          className="flex-1 min-w-[100px] bg-transparent px-1 py-0.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none"
        />
        <button
          type="button"
          onClick={addSkill}
          disabled={disabled}
          className="rounded-md p-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    );
  }
);

SkillsInput.displayName = "SkillsInput";