// components/ResumeParser.tsx
import { useState, useEffect } from "react";
import { Loader2, User, Mail, Phone, Code, Briefcase, GraduationCap, AlertCircle, FileText } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export function ResumeParser({ resumeUrl }: { resumeUrl: string }) {
  const [parsedData, setParsedData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function parse() {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase.functions.invoke("parse-resume", {
          body: { resumeUrl },
        });
        if (error) throw new Error(error.message);
        if (data?.error) throw new Error(data.error);
        setParsedData(data);
      } catch (err: any) {
        console.error("Resume parsing failed:", err);
        setError(err.message || "Failed to parse resume");
      } finally {
        setLoading(false);
      }
    }
    parse();
  }, [resumeUrl]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-4">
        <Loader2 className="h-4 w-4 animate-spin text-[#639922]" />
        <span className="text-sm text-foreground/60">AI is analyzing the resume...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-400 text-sm flex items-start gap-2">
        <AlertCircle className="h-4 w-4 mt-0.5" />
        {error}
      </div>
    );
  }

  if (!parsedData) return null;

  return (
    <div className="space-y-4">
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {parsedData.name && (
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-[#639922]" />
            <span><strong>Name:</strong> {parsedData.name}</span>
          </div>
        )}
        {parsedData.email && (
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-[#639922]" />
            <span><strong>Email:</strong> {parsedData.email}</span>
          </div>
        )}
        {parsedData.phone && (
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-[#639922]" />
            <span><strong>Phone:</strong> {parsedData.phone}</span>
          </div>
        )}
      </div>

      {/* Skills */}
      {parsedData.skills && parsedData.skills.length > 0 && (
        <div>
          <p className="text-sm font-medium text-foreground/70 mb-2 flex items-center gap-2">
            <Code className="h-4 w-4 text-[#639922]" /> Skills
          </p>
          <div className="flex flex-wrap gap-2">
            {parsedData.skills.map((skill: string, idx: number) => (
              <span key={idx} className="rounded-full bg-[#639922]/10 px-2.5 py-1 text-xs text-[#639922]">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {parsedData.experience && parsedData.experience.length > 0 && (
        <div>
          <p className="text-sm font-medium text-foreground/70 mb-2 flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-[#639922]" /> Experience
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-foreground/70">
            {parsedData.experience.map((exp: string, idx: number) => (
              <li key={idx}>{exp}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Education */}
      {parsedData.education && parsedData.education.length > 0 && (
        <div>
          <p className="text-sm font-medium text-foreground/70 mb-2 flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-[#639922]" /> Education
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-foreground/70">
            {parsedData.education.map((edu: string, idx: number) => (
              <li key={idx}>{edu}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}