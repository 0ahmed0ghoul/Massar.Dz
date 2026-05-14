// features/university/services/university.service.ts
import { ADMIN_QUESTIONS } from "@/constants/admin.constants";
import { supabase } from "@/lib/supabaseClient";

// ==========================================
// TYPES
// ==========================================
export interface UniversityStats {
  universityName: string;
  totalGraduates: number;
  totalStudying: number;  // ✅ Add this
  totalStudents: number;   // ✅ Add this (totalGraduates + totalStudying)
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
  totalStudying: number;   // ✅ Add this
  totalStudents: number;    // ✅ Add this
  totalRespondents: number;
  responseRate: number;
  employedCount: number;
  averageSalary: number;
}

export interface DepartmentOverview {
  totalStudents: number;
  totalConnected: number;   // ✅ Rename for clarity
  totalGraduates: number;   // ✅ Add this
  totalStudying: number;    // ✅ Add this
}

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

const QUESTION_IDS = {
  SITUATION: "q1_professional_status",
  SECTOR: "q2_sector",
  FUNCTION: "q3_function",
  SALARY: "q5_salary"
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

  async getStudentIdsByUniversity(universityName: string, candidateType?: string): Promise<string[]> {
    let query = supabase
      .from('profiles')
      .select('id')
      .eq('university_name', universityName)
      .eq('role', 'student');
    
    if (candidateType) {
      query = query.eq('candidate_type', candidateType);
    } else {
      query = query.in('candidate_type', ['graduated', 'studying']);
    }
    
    const { data: profiles, error } = await query;
    
    if (error) throw error;
    return profiles?.map(p => p.id) || [];
  },
  
  async getStudentIdsByUniversityAndSpeciality(
    universityName: string, 
    speciality: string,
    candidateType?: string
  ): Promise<string[]> {
    let query = supabase
      .from('profiles')
      .select('id')
      .eq('university_name', universityName)
      .eq('speciality', speciality)
      .eq('role', 'student');
    
    if (candidateType) {
      query = query.eq('candidate_type', candidateType);
    } else {
      query = query.in('candidate_type', ['graduated', 'studying']);
    }
    
    const { data: profiles, error } = await query;
    
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
    // Count all students with 'connected' status across all departments
    const { count, error } = await supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("university_name", university_name)
      .eq("role", "student")
      .eq("university_connection_status", "connected");
    
    if (error) {
      console.error("Error getting connected students:", error);
      return 0;
    }
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

// features/university/services/university.service.ts

async getAllDepartmentsWithStats(universityId: string): Promise<DepartmentWithStats[]> {
  const universityName = await this.getUniversityName(universityId);
  if (!universityName) return [];

  // ✅ Get departments from department head profiles (not from student specialities)
  const { data: departmentHeads, error: deptError } = await supabase
    .from("profiles")
    .select("department")
    .eq("role", "university_admin")
    .eq("univ_admin_type", "head_of_department")
    .eq("university_name", universityName)
    .not("department", "is", null);

  if (deptError) throw deptError;

  // Get unique departments
  const departments = [...new Set(departmentHeads?.map(d => d.department?.trim()).filter(Boolean) || [])];
  
  console.log("📋 Found departments from head_of_department profiles:", departments);

  // For each department, get stats from students with matching speciality
  const departmentsWithStats: DepartmentWithStats[] = [];
  
  for (const department of departments) {
    // Count students in this department (by speciality field)
    const { count: studentCount, error: countError } = await supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("university_name", universityName)
      .eq("speciality", department)  // Students use 'speciality' field
      .eq("role", "student");

    if (countError) {
      console.error(`Error counting students for ${department}:`, countError);
    }

    // Get additional stats for this department
    const specialityStats = await this.getUniversitySpecialitiesStats(universityName);
    const deptStats = specialityStats.find(s => s.speciality === department);
    
    departmentsWithStats.push({
      department,
      count: studentCount || 0,
      hasConnection: true, // Has a department head assigned
      employedCount: deptStats?.employedCount || 0,
      averageSalary: deptStats?.averageSalary || 0,
      responseRate: deptStats?.responseRate || 0
    });
  }

  return departmentsWithStats.sort((a, b) => b.count - a.count);
},

async getDepartmentOverview(universityId: string, department: string): Promise<DepartmentOverview> {
  const universityName = await this.getUniversityName(universityId);
  if (!universityName) {
    console.log("⚠️ No university name found for ID:", universityId);
    return { totalStudents: 0, totalConnected: 0, totalGraduates: 0, totalStudying: 0 };
  }

  console.log("🔍 getDepartmentOverview:", { universityName, department });

  // Get counts by candidate type
  const graduatedIds = await this.getStudentIdsByUniversityAndSpeciality(universityName, department, 'graduated');
  const studyingIds = await this.getStudentIdsByUniversityAndSpeciality(universityName, department, 'studying');
  const totalStudents = graduatedIds.length + studyingIds.length;
  
  // Get connected students
  const { count: totalConnected, error: studentError } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("university_name", universityName)
    .eq("speciality", department)
    .eq("role", "student")
    .eq("university_connection_status", "connected");
  
  if (studentError) {
    console.error("❌ Error fetching connected students:", studentError);
  }
  
  console.log("  Department counts:", {
    graduated: graduatedIds.length,
    studying: studyingIds.length,
    total: totalStudents,
    connected: totalConnected || 0
  });

  return {
    totalStudents: totalStudents,
    totalConnected: totalConnected || 0,
    totalGraduates: graduatedIds.length,
    totalStudying: studyingIds.length
  };
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
    console.log(`📊 getDepartmentCharts for ${speciality}: ${studentIds.length} students`);
    
    if (!studentIds.length) {
      return { situation: [], sectors: [], functions: [], salaryDistribution: [] };
    }
    
    const responses = await this.getStudentResponses(studentIds);
    console.log(`📊 Got ${responses.length} responses for ${speciality}`);
    
    // Log response distribution by question
    const responseCounts: Record<string, number> = {};
    responses.forEach(r => {
      responseCounts[r.questionId] = (responseCounts[r.questionId] || 0) + 1;
    });
    console.log("📊 Response counts by question:", responseCounts);
    
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
    console.log("📊 getUniversitySpecialitiesStats for:", universityName);
    
    // Get departments from head_of_department profiles
    const { data: departmentHeads, error: deptError } = await supabase
      .from("profiles")
      .select("department")
      .eq("role", "university_admin")
      .eq("univ_admin_type", "head_of_department")
      .eq("university_name", universityName)
      .not("department", "is", null);
  
    if (deptError) {
      console.error("Error fetching department heads:", deptError);
      return [];
    }
  
    const departments = [...new Set(departmentHeads?.map(d => d.department?.trim()).filter(Boolean) || [])];
    console.log("📊 Departments found:", departments);
    
    const specialityStats = await Promise.all(
      departments.map(async (department) => {
        // Get students for this department/speciality
        const graduatedIds = await this.getStudentIdsByUniversityAndSpeciality(universityName, department, 'graduated');
        const studyingIds = await this.getStudentIdsByUniversityAndSpeciality(universityName, department, 'studying');
        const allIds = [...graduatedIds, ...studyingIds];
        
        console.log(`📊 ${department}:`, {
          graduated: graduatedIds.length,
          studying: studyingIds.length,
          total: allIds.length
        });
        
        if (!allIds.length) {
          return { 
            speciality: department, 
            totalGraduates: 0,
            totalStudying: 0,
            totalStudents: 0,
            totalRespondents: 0, 
            responseRate: 0, 
            employedCount: 0, 
            averageSalary: 0 
          };
        }
        
        const responses = await this.getStudentResponses(allIds);
        const detailedStats = this.calculateDetailedStats(responses, allIds.length);
        
        return {
          speciality: department,
          totalGraduates: graduatedIds.length,
          totalStudying: studyingIds.length,
          totalStudents: allIds.length,
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
    console.log("📊 getUniversityStats called for:", universityName);
    
    // Get graduated students
    const graduatedIds = await this.getStudentIdsByUniversity(universityName, 'graduated');
    // Get studying students
    const studyingIds = await this.getStudentIdsByUniversity(universityName, 'studying');
    // Get all students
    const allStudentIds = [...graduatedIds, ...studyingIds];
    
    console.log("📊 Student counts:", {
      graduated: graduatedIds.length,
      studying: studyingIds.length,
      total: allStudentIds.length
    });
    
    if (!allStudentIds.length) {
      return {
        universityName, 
        totalGraduates: 0,
        totalStudying: 0,
        totalStudents: 0,
        totalRespondents: 0,
        overallResponseRate: 0, 
        specialitiesCount: 0, 
        specialities: [],
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
      totalGraduates: graduatedIds.length,
      totalStudying: studyingIds.length,
      totalStudents: allStudentIds.length,
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



// Then update your calculateStats method:
calculateStats(responses: { questionId: string; answer: string; studentId: string }[]): DepartmentStats {
  console.log("🧮 calculateStats: Processing", responses.length, "responses");
  
  // Debug: Log all responses
  responses.forEach(r => {
    console.log(`  Response: ${r.questionId} = "${r.answer}"`);
  });
  
  const getCountsByQuestionId = (questionId: string): Record<string, number> => {
    const counts: Record<string, number> = {};
    const matching = responses.filter(r => r.questionId === questionId);
    console.log(`  Question "${questionId}": ${matching.length} matching responses`);
    
    matching.forEach(r => {
      counts[r.answer] = (counts[r.answer] || 0) + 1;
    });
    return counts;
  };
  
  // Professional Situation - using the correct ID
  const situationCounts = getCountsByQuestionId(QUESTION_IDS.SITUATION);
  const situation = Object.entries(situationCounts)
    .map(([answer, count]) => ({ answer, count }))
    .sort((a, b) => b.count - a.count);
  
  // Sectors - using the correct ID
  const sectorCounts = getCountsByQuestionId(QUESTION_IDS.SECTOR);
  const sectors = Object.entries(sectorCounts)
    .map(([answer, count]) => ({ answer, count }))
    .sort((a, b) => b.count - a.count);
  
  // Functions - using the correct ID
  const functionCounts = getCountsByQuestionId(QUESTION_IDS.FUNCTION);
  const functions = Object.entries(functionCounts)
    .map(([answer, count]) => ({ answer, count }))
    .sort((a, b) => b.count - a.count);
  
  // Salary Distribution - using the correct ID
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
        if (r.questionId !== QUESTION_IDS.SALARY) return false;
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
    situation: situation.length,
    sectors: sectors.length,
    functions: functions.length,
    salaryDistribution: salaryDistribution.length
  });
  
  return { situation, sectors, functions, salaryDistribution };
},
  
calculateDetailedStats(
  responses: { questionId: string; answer: string; studentId: string }[], 
  totalStudents: number
): DetailedStats {
  console.log("🧮 calculateDetailedStats: Processing", responses.length, "responses for", totalStudents, "students");
  
  // Count unique respondents
  const uniqueRespondents = new Set(responses.map(r => r.studentId)).size;
  console.log("  Unique respondents:", uniqueRespondents);
  
  // Filter responses for the situation question
  const situationResponses = responses.filter(r => r.questionId === QUESTION_IDS.SITUATION);
  console.log("  Situation responses:", situationResponses.length);
  
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
  const salaryValues = responses
    .filter(r => r.questionId === QUESTION_IDS.SALARY)
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
}

};