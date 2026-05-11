import { UNIVERSITY_DEPARTMENTS } from "@/constants/university.constants";
import { supabase } from "@/lib/supabaseClient";

// services/university.service.ts (additional methods)
export const universityAnalyticsService = {
  async getTotalConnectedStudents(universityId: string): Promise<number> {
    const { count, error } = await supabase
      .from("department_connections")
      .select("student_id", { count: "exact", head: true })
      .eq("university_id", universityId)
      .eq("status", "accepted");
    if (error) throw error;
    return count || 0;
  },

  async getTotalGraduates(universityId: string): Promise<number> {
    const { data, error } = await supabase
      .from("department_connections")
      .select(
        `
          student:profiles!student_id (candidate_type)
        `
      )
      .eq("university_id", universityId)
      .eq("status", "accepted")
      .eq("student.candidate_type", "graduated");
    if (error) throw error;
    return data?.length || 0;
  },

  async getDepartmentStats(
    universityId: string
  ): Promise<{ department: string; count: number }[]> {
    const { data, error } = await supabase
      .from("department_connections")
      .select(
        `
          student:profiles!student_id (department)
        `
      )
      .eq("university_id", universityId)
      .eq("status", "accepted")
      .not("student.department", "is", null);
    if (error) throw error;
    const counts: Record<string, number> = {};
    data.forEach((item) => {
      const dept = item.student?.department;
      if (dept) counts[dept] = (counts[dept] || 0) + 1;
    });
    return Object.entries(counts).map(([department, count]) => ({
      department,
      count,
    }));
  },

  async getSpecialitiesByDepartment(
    universityId: string,
    department: string
  ): Promise<{ speciality: string; count: number }[]> {
    const { data, error } = await supabase
      .from("department_connections")
      .select(
        `
          student:profiles!student_id (speciality)
        `
      )
      .eq("university_id", universityId)
      .eq("status", "accepted")
      .eq("student.department", department)
      .not("student.speciality", "is", null);
    if (error) throw error;
    const counts: Record<string, number> = {};
    data.forEach((item) => {
      const spec = item.student?.speciality;
      if (spec) counts[spec] = (counts[spec] || 0) + 1;
    });
    return Object.entries(counts).map(([speciality, count]) => ({
      speciality,
      count,
    }));
  },

  async getAllDepartmentsWithStats(universityId: string): Promise<
    {
      department: string;
      count: number;
      hasConnection: boolean;
    }[]
  > {
    /*
          STEP 1:
          Get all connected departments
          from university_admin profiles
        */

    const { data: connectedDepartments, error: connectionError } =
      await supabase
        .from("profiles")
        .select("department")
        .eq("role", "university_admin")
        .not("department", "is", null);

    if (connectionError) throw connectionError;

    /*
          STEP 2:
          Create a Set of connected department names
        */

    const connectedSet = new Set(
      connectedDepartments
        ?.map((item) => item.department?.trim())
        .filter(Boolean)
    );

    /*
          STEP 3:
          Get student counts per department
        */

    const { data: studentConnections, error: studentError } = await supabase
      .from("department_connections")
      .select(
        `
              student:profiles!student_id (
                department
              )
            `
      )
      .eq("university_id", universityId)
      .eq("status", "accepted")
      .not("student.department", "is", null);

    if (studentError) throw studentError;

    /*
          STEP 4:
          Count students
        */

    const counts: Record<string, number> = {};

    studentConnections?.forEach((item) => {
      const dept = item.student?.department?.trim();

      if (!dept) return;

      counts[dept] = (counts[dept] || 0) + 1;
    });

    /*
          STEP 5:
          Merge with constants
        */

    return UNIVERSITY_DEPARTMENTS.map((department) => ({
      department,
      count: counts[department] || 0,

      /*
            Connected means:
            university_admin exists for this department
          */

      hasConnection: connectedSet.has(department),
    }));
  },
  async getGraduateStatistics(
    universityId: string,
    department: string,
    speciality: string
  ): Promise<any> {
    // Fetch students in that department & speciality
    const { data: students, error } = await supabase
      .from("department_connections")
      .select(
        `
          student:profiles!student_id (
            id,
            candidate_type,
            years_of_experience,
            role,
            current_company
          )
        `
      )
      .eq("university_id", universityId)
      .eq("status", "accepted")
      .eq("student.department", department)
      .eq("student.speciality", speciality);
    if (error) throw error;

    const graduated = students.filter(
      (s) => s.student?.candidate_type === "graduated"
    );
    const total = graduated.length;
    const ids = graduated.map((s) => s.student!.id);

    // Employment (from experiences)
    let employedIds = new Set<string>();
    if (ids.length) {
      const { data: experiences } = await supabase
        .from("experiences")
        .select("student_id")
        .in("student_id", ids)
        .eq("type", "job")
        .or("current.eq.true,end_date.is.null");
      if (experiences)
        employedIds = new Set(experiences.map((e) => e.student_id));
    }
    // Also role not null
    graduated.forEach((s) => {
      if (s.student?.role) employedIds.add(s.student.id);
    });
    const employed = employedIds.size;
    const employmentRate = total ? (employed / total) * 100 : 0;

    // Average experience
    let totalYears = 0,
      countYears = 0;
    graduated.forEach((s) => {
      const y = s.student?.years_of_experience;
      if (y && !isNaN(Number(y))) {
        totalYears += Number(y);
        countYears++;
      }
    });
    const avgExperience = countYears ? totalYears / countYears : 0;

    // Top companies
    let companyCounts: Record<string, number> = {};
    if (ids.length) {
      const { data: jobs } = await supabase
        .from("experiences")
        .select("company")
        .in("student_id", ids)
        .eq("type", "job")
        .not("company", "is", null);
      if (jobs) {
        jobs.forEach((j) => {
          if (j.company)
            companyCounts[j.company] = (companyCounts[j.company] || 0) + 1;
        });
      }
    }
    const topCompanies = Object.entries(companyCounts)
      .map(([company, count]) => ({ company, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalGraduates: total,
      employed,
      employmentRate,
      avgExperience,
      topCompanies,
    };
  },
};
