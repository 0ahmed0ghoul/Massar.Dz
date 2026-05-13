// features/university/services/university.service.ts
import { ADMIN_QUESTIONS } from "@/constants/admin.constants";
import { supabase } from "@/lib/supabaseClient";

// ==========================================
// TYPES
// ==========================================

export interface DepartmentStats {
  situation: { answer: string; count: number }[];
  sectors: { answer: string; count: number }[];
  functions: { answer: string; count: number }[];
  salaryDistribution: { range: string; count: number; avgSalary: number }[];
}

export interface DetailedStats {
  totalRespondents: number;
  totalStudents: number;
  responseRate: number;
  averageSalary: number;
  medianSalary: number;
  employedCount: number;
  studyingCount: number;
  jobSearchingCount: number;
  otherCount: number;
}

export interface UniversityStats {
  universityName: string;
  totalGraduates: number;
  totalRespondents: number;
  overallResponseRate: number;
  specialitiesCount: number;
  specialities: SpecialitySummary[];
  aggregatedStats: DepartmentStats;
  aggregatedDetails: DetailedStats;
}

export interface SpecialitySummary {
  speciality: string;
  totalGraduates: number;
  totalRespondents: number;
  responseRate: number;
  employedCount: number;
  averageSalary: number;
}

export interface DepartmentOverview {
  totalStudents: number;
  totalGraduates: number;
}

export interface DepartmentWithStats {
  department: string;
  count: number;
  hasConnection: boolean;
  employedCount?: number;
  averageSalary?: number;
  responseRate?: number;
}

export interface GraduateStatistics {
  totalGraduates: number;
  employed: number;
  employmentRate: number;
  avgExperience: number;
  topCompanies: { company: string; count: number }[];
}

export interface UniversityDashboardSummary {
  totalStudents: number;
  totalGraduates: number;
  totalDepartments: number;
  totalSpecialities: number;
  averageEmploymentRate: number;
  totalResponses: number;
}

// ==========================================
// CONSTANTS
// ==========================================

const QUESTION_TEXTS = {
  SITUATION: "Which of the following best describes your current professional situation?",
  SECTOR: "In which sector of activity is your current employer?",
  FUNCTION: "What is the primary function of your current role?",
  SALARY: "What is your total annual gross salary (including all bonuses and premiums)?"
};

// ==========================================
// UNIVERSITY STATISTICS SERVICE
// ==========================================

export const universityService = {
  
  // ==========================================
  // CORE DATA FETCHING
  // ==========================================

  async getUniversityName(universityId: string): Promise<string | null> {
    const { data, error } = await supabase
      .from("profiles")
      .select("university_name")
      .eq("id", universityId)
      .single();

    if (error || !data?.university_name) return null;
    return data.university_name;
  },

  async getStudentIdsByUniversity(universityName: string): Promise<string[]> {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('university_name', universityName)
      .eq('candidate_type', 'graduated');

    if (error) throw error;
    return profiles?.map(p => p.id) || [];
  },

  async getStudentIdsByUniversityAndSpeciality(
    universityName: string, 
    speciality: string
  ): Promise<string[]> {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, email, candidate_type, speciality, university_name')
      .eq('university_name', universityName)
      .eq('speciality', speciality)
      .eq('candidate_type', 'graduated');

    if (error) throw error;
    return profiles?.map(p => p.id) || [];
  },

  async getStudentResponses(studentIds: string[]): Promise<{
    questionId: string;
    answer: string;
    studentId: string;
  }[]> {
    if (!studentIds.length) return [];

    const { data: responses, error } = await supabase
      .from('student_responses')
      .select('student_id, question_id, answer')
      .in('student_id', studentIds);
    
    if (error) throw error;
    return (responses || []).map(r => ({
      questionId: r.question_id,
      answer: r.answer,
      studentId: r.student_id
    }));
  },

  // ==========================================
  // RECTORATE - UNIVERSITY WIDE STATS
  // ==========================================

  async getTotalConnectedStudents(university_name: string): Promise<number> {
    const { count, error } = await supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("university_name", university_name)
      .eq("university_connection_status", "accepted");
    
    if (error) throw error;
    return count || 0;
  },

  async getTotalGraduates(universityId: string): Promise<number> {
    const universityName = await this.getUniversityName(universityId);
    if (!universityName) return 0;

    const { count, error } = await supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("university_name", universityName)
      .eq("candidate_type", "graduated");

    if (error) throw error;
    return count || 0;
  },

  async getAllDepartmentsWithStats(universityId: string): Promise<DepartmentWithStats[]> {
    const universityName = await this.getUniversityName(universityId);
    if (!universityName) return [];

    const { data: specialities, error: specError } = await supabase
      .from("profiles")
      .select("speciality")
      .eq("university_name", universityName)
      .eq("candidate_type", "graduated")
      .not("speciality", "is", null);

    if (specError) throw specError;

    const { data: connectedDepts, error: connError } = await supabase
      .from("profiles")
      .select("department")
      .eq("role", "university_admin")
      .eq("univ_admin_type", "head_of_department")
      .eq("university_name", universityName)
      .not("department", "is", null);

    if (connError) throw connError;

    const connectedSet = new Set(
      connectedDepts?.map(d => d.department?.trim()).filter(Boolean) || []
    );

    const counts: Record<string, number> = {};
    specialities?.forEach(item => {
      const spec = item.speciality?.trim();
      if (spec) counts[spec] = (counts[spec] || 0) + 1;
    });

    const specialityStats = await this.getUniversitySpecialitiesStats(universityName);
    const statsMap = new Map(specialityStats.map(s => [s.speciality, s]));

    const departments = Object.entries(counts).map(([department, count]) => {
      const stats = statsMap.get(department);
      return {
        department,
        count,
        hasConnection: connectedSet.has(department),
        employedCount: stats?.employedCount || 0,
        averageSalary: stats?.averageSalary || 0,
        responseRate: stats?.responseRate || 0
      };
    });

    return departments.sort((a, b) => b.count - a.count);
  },

  async getUniversityDashboardSummary(universityId: string): Promise<UniversityDashboardSummary> {
    const universityName = await this.getUniversityName(universityId);
    if (!universityName) {
      return {
        totalStudents: 0, totalGraduates: 0, totalDepartments: 0,
        totalSpecialities: 0, averageEmploymentRate: 0, totalResponses: 0
      };
    }

    const [connectedStudents, graduates, departments] = await Promise.all([
      this.getTotalConnectedStudents(universityName),
      this.getTotalGraduates(universityId),
      this.getAllDepartmentsWithStats(universityId)
    ]);

    const gradStudents = await this.getStudentIdsByUniversity(universityName);
    let totalResponses = 0;
    if (gradStudents.length) {
      const { count, error } = await supabase
        .from("student_responses")
        .select("student_id", { count: "exact", head: true })
        .in("student_id", gradStudents);
      if (!error) totalResponses = count || 0;
    }

    const departmentsWithRate = departments.filter(d => d.responseRate > 0);
    const averageEmploymentRate = departmentsWithRate.length > 0
      ? departmentsWithRate.reduce((sum, d) => sum + (d.employedCount / d.count) * 100, 0) / departmentsWithRate.length
      : 0;

    return {
      totalStudents: connectedStudents,
      totalGraduates: graduates,
      totalDepartments: departments.length,
      totalSpecialities: departments.length,
      averageEmploymentRate: Math.round(averageEmploymentRate * 10) / 10,
      totalResponses
    };
  },

  // ==========================================
  // DEPARTMENT HEAD - DEPARTMENT STATS
  // ==========================================

  async getDepartmentOverview(universityId: string, department: string): Promise<DepartmentOverview> {
    const universityName = await this.getUniversityName(universityId);
    if (!universityName) {
      console.log("⚠️ No university name found for ID:", universityId);
      return { totalStudents: 0, totalGraduates: 0 };
    }
  
    console.log("🔍 getDepartmentOverview:", { universityName, department });
  
    // Total graduated students in this department
    const { count: totalGraduates, error: gradError } = await supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("university_name", universityName)
      .eq("department", department)
      .eq("candidate_type", "graduated");
    
    if (gradError) {
      console.error("❌ Error fetching graduates:", gradError);
      throw gradError;
    }
    console.log("  Graduates count:", totalGraduates);
  
    // Total connected students - try multiple statuses
    const { count: totalStudents, error: studentError } = await supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("university_name", universityName)
      .eq("department", department)
      .eq("role", "student")
      .in("university_connection_status", ["accepted", "connected"]);
    
    if (studentError) {
      console.error("❌ Error fetching connected students:", studentError);
    }
    console.log("  Connected students count:", totalStudents);
  
    // If still 0, check what statuses exist for students in this department
    if (!totalStudents || totalStudents === 0) {
      console.log("🔍 Checking all students in department...");
      const { data: allStudents } = await supabase
        .from("profiles")
        .select("id, university_connection_status, role, candidate_type")
        .eq("university_name", universityName)
        .eq("department", department)
        .eq("role", "student")
        .limit(5);
      
      console.log("  Sample students:", allStudents);
      
      // Count by status
      const statusCounts: Record<string, number> = {};
      const { data: allDeptStudents } = await supabase
        .from("profiles")
        .select("university_connection_status")
        .eq("university_name", universityName)
        .eq("department", department)
        .eq("role", "student");
      
      allDeptStudents?.forEach(s => {
        const status = s.university_connection_status || "null";
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });
      console.log("  Status distribution:", statusCounts);
    }
  
    return {
      totalStudents: totalStudents || 0,
      totalGraduates: totalGraduates || 0
    };
  },

  async getSpecialitiesByDepartment(universityId: string, department: string): Promise<{ speciality: string; count: number }[]> {
    const universityName = await this.getUniversityName(universityId);
    if (!universityName) return [];

    const { data, error } = await supabase
      .from("profiles")
      .select("speciality")
      .eq("university_name", universityName)
      .eq("department", department)
      .eq("candidate_type", "graduated")
      .not("speciality", "is", null);

    if (error) throw error;

    const counts: Record<string, number> = {};
    data?.forEach(item => {
      const spec = item.speciality?.trim();
      if (spec) counts[spec] = (counts[spec] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([speciality, count]) => ({ speciality, count }))
      .sort((a, b) => b.count - a.count);
  },

  // ==========================================
  // SPECIALITY STATISTICS
  // ==========================================

  async getDepartmentCharts(universityName: string, speciality: string): Promise<DepartmentStats> {
    const studentIds = await this.getStudentIdsByUniversityAndSpeciality(universityName, speciality);
    if (!studentIds.length) {
      return { situation: [], sectors: [], functions: [], salaryDistribution: [] };
    }
    const responses = await this.getStudentResponses(studentIds);
    return this.calculateStats(responses);
  },

  async getDetailedStatistics(universityName: string, speciality: string): Promise<DetailedStats> {
    const studentIds = await this.getStudentIdsByUniversityAndSpeciality(universityName, speciality);
    if (!studentIds.length) {
      return {
        totalRespondents: 0, totalStudents: 0, responseRate: 0,
        averageSalary: 0, medianSalary: 0, employedCount: 0,
        studyingCount: 0, jobSearchingCount: 0, otherCount: 0
      };
    }
    const responses = await this.getStudentResponses(studentIds);
    return this.calculateDetailedStats(responses, studentIds.length);
  },

  // ==========================================
  // UNIVERSITY LEVEL AGGREGATION
  // ==========================================

  async getUniversitySpecialitiesStats(universityName: string): Promise<SpecialitySummary[]> {
    const specialities = await this.getUniversitySpecialities(universityName);
    const specialityStats = await Promise.all(
      specialities.map(async (speciality) => {
        const studentIds = await this.getStudentIdsByUniversityAndSpeciality(universityName, speciality);
        if (!studentIds.length) {
          return { speciality, totalGraduates: 0, totalRespondents: 0, responseRate: 0, employedCount: 0, averageSalary: 0 };
        }
        const responses = await this.getStudentResponses(studentIds);
        const detailedStats = this.calculateDetailedStats(responses, studentIds.length);
        return {
          speciality,
          totalGraduates: studentIds.length,
          totalRespondents: detailedStats.totalRespondents,
          responseRate: detailedStats.responseRate,
          employedCount: detailedStats.employedCount,
          averageSalary: detailedStats.averageSalary
        };
      })
    );
    return specialityStats;
  },

  async getUniversityStats(universityName: string): Promise<UniversityStats> {
    const allStudentIds = await this.getStudentIdsByUniversity(universityName);
    if (!allStudentIds.length) {
      return {
        universityName, totalGraduates: 0, totalRespondents: 0,
        overallResponseRate: 0, specialitiesCount: 0, specialities: [],
        aggregatedStats: { situation: [], sectors: [], functions: [], salaryDistribution: [] },
        aggregatedDetails: {
          totalRespondents: 0, totalStudents: 0, responseRate: 0,
          averageSalary: 0, medianSalary: 0, employedCount: 0,
          studyingCount: 0, jobSearchingCount: 0, otherCount: 0
        }
      };
    }
    const allResponses = await this.getStudentResponses(allStudentIds);
    const specialities = await this.getUniversitySpecialitiesStats(universityName);
    const aggregatedStats = this.calculateStats(allResponses);
    const aggregatedDetails = this.calculateDetailedStats(allResponses, allStudentIds.length);
    return {
      universityName,
      totalGraduates: allStudentIds.length,
      totalRespondents: aggregatedDetails.totalRespondents,
      overallResponseRate: aggregatedDetails.responseRate,
      specialitiesCount: specialities.length,
      specialities,
      aggregatedStats,
      aggregatedDetails
    };
  },

  async getUniversitySpecialities(universityName: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('speciality')
      .eq('university_name', universityName)
      .eq('candidate_type', 'graduated')
      .not('speciality', 'is', null);
    if (error) throw error;
    return [...new Set(data.map(d => d.speciality).filter(Boolean))];
  },

  async getUniversitiesWithGraduates(): Promise<string[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('university_name')
      .eq('candidate_type', 'graduated')
      .not('university_name', 'is', null);
    if (error) throw error;
    return [...new Set(data.map(d => d.university_name).filter(Boolean))];
  },

  // ==========================================
  // CALCULATION HELPERS
  // ==========================================

  calculateStats(responses: { questionId: string; answer: string; studentId: string }[]): DepartmentStats {
    console.log("🧮 calculateStats: Processing", responses.length, "responses");
    
    // Debug: Show what question IDs are in responses vs what we expect
    const responseQuestionIds = [...new Set(responses.map(r => r.questionId))];
    console.log("📋 Response question_ids:", responseQuestionIds);
    console.log("📋 Expected question IDs:", ADMIN_QUESTIONS.map(q => q.id));
    
    // Debug: Check if ADMIN_QUESTIONS find works
    const sq = ADMIN_QUESTIONS.find(q => q.text === QUESTION_TEXTS.SITUATION);
    const secq = ADMIN_QUESTIONS.find(q => q.text === QUESTION_TEXTS.SECTOR);
    const fq = ADMIN_QUESTIONS.find(q => q.text === QUESTION_TEXTS.FUNCTION);
    const salq = ADMIN_QUESTIONS.find(q => q.text === QUESTION_TEXTS.SALARY);
    
    console.log("🔍 Found questions:", {
      situation: sq?.id || "NOT FOUND",
      sector: secq?.id || "NOT FOUND", 
      function: fq?.id || "NOT FOUND",
      salary: salq?.id || "NOT FOUND"
    });
  
    const getCountsByQuestionId = (questionId: string | undefined): Record<string, number> => {
      const counts: Record<string, number> = {};
      if (!questionId) {
        console.warn("  ⚠️ No questionId provided, returning empty");
        return counts;
      }
      const matching = responses.filter(r => r.questionId === questionId);
      console.log(`  Question "${questionId}": ${matching.length} matching responses`);
      matching.forEach(r => {
        counts[r.answer] = (counts[r.answer] || 0) + 1;
      });
      return counts;
    };
  
    // Professional Situation
    const situationCounts = getCountsByQuestionId(sq?.id);
    const situation = Object.entries(situationCounts)
      .map(([answer, count]) => ({ answer, count }))
      .sort((a, b) => b.count - a.count);
  
    // Sectors
    const sectorCounts = getCountsByQuestionId(secq?.id);
    const sectors = Object.entries(sectorCounts)
      .map(([answer, count]) => ({ answer, count }))
      .sort((a, b) => b.count - a.count);
  
    // Functions
    const functionCounts = getCountsByQuestionId(fq?.id);
    const functions = Object.entries(functionCounts)
      .map(([answer, count]) => ({ answer, count }))
      .sort((a, b) => b.count - a.count);
  
    // Salary Distribution
    const salaryRanges = [
      { range: '0 - 20kDZ', min: 0, max: 20000 },
      { range: '20k - 40kDZ', min: 20000, max: 40000 },
      { range: '40k - 60kDZ', min: 40000, max: 60000 },
      { range: '60k - 80kDZ', min: 60000, max: 80000 },
      { range: '80k - 100kDZ', min: 80000, max: 100000 },
      { range: '100kDZ+', min: 100000, max: Infinity }
    ];
  
    const salaryDistribution = salaryRanges.map(range => {
      const salariesInRange = responses
        .filter(r => {
          if (r.questionId !== salq?.id) return false;
          const salary = parseFloat(r.answer);
          return !isNaN(salary) && salary >= range.min && salary < range.max;
        })
        .map(r => parseFloat(r.answer));
  
      return {
        range: range.range,
        count: salariesInRange.length,
        avgSalary: salariesInRange.length > 0 
          ? Math.round(salariesInRange.reduce((a, b) => a + b, 0) / salariesInRange.length)
          : 0
      };
    }).filter(range => range.count > 0);
  
    console.log("✅ Final stats:", {
      situation: situation.length > 0 ? situation : "EMPTY",
      sectors: sectors.length > 0 ? sectors : "EMPTY",
      functions: functions.length > 0 ? functions : "EMPTY", 
      salaryDistribution: salaryDistribution.length > 0 ? salaryDistribution : "EMPTY"
    });
  
    return { situation, sectors, functions, salaryDistribution };
  },
  
  calculateDetailedStats(
    responses: { questionId: string; answer: string; studentId: string }[], 
    totalStudents: number
  ): DetailedStats {
    console.log("🧮 calculateDetailedStats: Processing", responses.length, "responses for", totalStudents, "students");
    
    // Count unique respondents (students who answered at least one question)
    const uniqueRespondents = new Set(responses.map(r => r.studentId)).size;
    console.log("  Unique respondents:", uniqueRespondents);
  
    // Find situation question ID
    const sq = ADMIN_QUESTIONS.find(q => q.text === QUESTION_TEXTS.SITUATION);
    
    // Filter responses for the situation question
    const situationResponses = sq 
      ? responses.filter(r => r.questionId === sq.id)
      : [];
    
    console.log("  Situation responses:", situationResponses.length, situationResponses.map(r => r.answer));
  
    const employedCount = situationResponses.filter(r => 
      r.answer.includes("In professional activity")
    ).length;
    
    const studyingCount = situationResponses.filter(r => 
      r.answer.includes("Continuing studies")
    ).length;
    
    const jobSearchingCount = situationResponses.filter(r => 
      r.answer.includes("Actively looking")
    ).length;
  
    const otherCount = situationResponses.filter(r => 
      r.answer.includes("Other")
    ).length;
  
    console.log("  Counts:", { employedCount, studyingCount, jobSearchingCount, otherCount });
  
    // Salary calculations
    const salq = ADMIN_QUESTIONS.find(q => q.text === QUESTION_TEXTS.SALARY);
    const salaryValues = responses
      .filter(r => r.questionId === salq?.id)
      .map(r => parseFloat(r.answer))
      .filter(s => !isNaN(s) && s > 0)
      .sort((a, b) => a - b);
  
    console.log("  Salary values:", salaryValues);
  
    const averageSalary = salaryValues.length > 0
      ? Math.round(salaryValues.reduce((sum, s) => sum + s, 0) / salaryValues.length)
      : 0;
  
    const medianSalary = salaryValues.length > 0
      ? salaryValues.length % 2 === 0
        ? Math.round((salaryValues[salaryValues.length / 2 - 1] + salaryValues[salaryValues.length / 2]) / 2)
        : salaryValues[Math.floor(salaryValues.length / 2)]
      : 0;
  
    const result = {
      totalRespondents: uniqueRespondents,
      totalStudents,
      responseRate: totalStudents > 0 ? (uniqueRespondents / totalStudents) * 100 : 0,
      averageSalary,
      medianSalary,
      employedCount,
      studyingCount,
      jobSearchingCount,
      otherCount
    };
  
    console.log("✅ DetailedStats:", result);
    return result;
  },
};