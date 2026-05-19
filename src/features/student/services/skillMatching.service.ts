import { StudentSkill } from "@/features/student/services/studentSkills.service";

const weightMap = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
  expert: 4,
};

export type JobMatchResult = {
  score: number;
  matched: string[];
  missing: string[];
};

export function calculateJobMatch(
  studentSkills: StudentSkill[],
  jobSkills: string[] = []
): JobMatchResult {
  if (!jobSkills.length) {
    return { score: 0, matched: [], missing: [] };
  }

  const studentNames = studentSkills.map((s) =>
    s.skill?.name?.toLowerCase().trim()
  );

  const jobNormalized = jobSkills.map((s) => s.toLowerCase().trim());

  const matched: string[] = [];
  const missing: string[] = [];

  let totalWeight = jobNormalized.length * 4;
  let earnedWeight = 0;

  for (const jobSkill of jobNormalized) {
    const student = studentSkills.find(
      (s) =>
        s.skill?.name?.toLowerCase().trim() === jobSkill
    );

    if (student) {
      matched.push(jobSkill);
      earnedWeight += weightMap[student.proficiency];
    } else {
      missing.push(jobSkill);
    }
  }

  const score = Math.round((earnedWeight / totalWeight) * 100);

  return { score, matched, missing };
}