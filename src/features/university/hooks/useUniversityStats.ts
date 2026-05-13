// features/university/hooks/useUniversityHooks.ts
import { useEffect, useState } from 'react';
import { 
  universityService,
  DepartmentStats, 
  DetailedStats, 
  UniversityStats, 
  SpecialitySummary,
  DepartmentWithStats,
  GraduateStatistics,
  DepartmentOverview,
  UniversityDashboardSummary
} from '../services/university.analysis.service';

// ==========================================
// SPECIALITY-LEVEL STATISTICS
// ==========================================

export function useSpecialityStatistics(universityName: string, speciality: string) {
  const [stats, setStats] = useState<DepartmentStats | null>(null);
  const [details, setDetails] = useState<DetailedStats | null>(null);
  const [graduateStats, setGraduateStats] = useState<GraduateStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!universityName || !speciality) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const [chartsData, detailedData] = await Promise.all([
          universityService.getDepartmentCharts(universityName, speciality),
          universityService.getDetailedStatistics(universityName, speciality)
        ]);
        
        setStats(chartsData);
        setDetails(detailedData);
      } catch (err: any) {
        console.error('Error fetching speciality statistics:', err);
        setError(err.message || 'Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [universityName, speciality]);

  const hasData = stats && (
    stats.situation.length > 0 ||
    stats.sectors.length > 0 ||
    stats.functions.length > 0 ||
    stats.salaryDistribution.length > 0
  );

  const refresh = async () => {
    if (!universityName || !speciality) return;
    setLoading(true);
    try {
      const [chartsData, detailedData] = await Promise.all([
        universityService.getDepartmentCharts(universityName, speciality),
        universityService.getDetailedStatistics(universityName, speciality)
      ]);
      setStats(chartsData);
      setDetails(detailedData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { stats, details, graduateStats, loading, error, hasData, refresh };
}

// ==========================================
// UNIVERSITY-LEVEL STATISTICS
// ==========================================

export function useUniversityStatistics(universityName: string) {
  const [stats, setStats] = useState<UniversityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!universityName) {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const universityStats = await universityService.getUniversityStats(universityName);
        setStats(universityStats);
      } catch (err: any) {
        console.error('Error fetching university statistics:', err);
        setError(err.message || 'Failed to load university statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [universityName]);

  const refresh = async () => {
    if (!universityName) return;
    setLoading(true);
    try {
      const universityStats = await universityService.getUniversityStats(universityName);
      setStats(universityStats);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, error, refresh };
}

// ==========================================
// UNIVERSITY SPECIALITIES
// ==========================================

export function useUniversitySpecialities(universityName: string) {
  const [specialities, setSpecialities] = useState<SpecialitySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!universityName) {
      setLoading(false);
      return;
    }

    const fetchSpecialities = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await universityService.getUniversitySpecialitiesStats(universityName);
        setSpecialities(data);
      } catch (err: any) {
        console.error('Error fetching specialities:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecialities();
  }, [universityName]);

  const refresh = async () => {
    if (!universityName) return;
    setLoading(true);
    try {
      const data = await universityService.getUniversitySpecialitiesStats(universityName);
      setSpecialities(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { specialities, loading, error, refresh };
}

// ==========================================
// UNIVERSITIES WITH GRADUATES
// ==========================================

export function useUniversitiesWithGraduates() {
  const [universities, setUniversities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUniversities = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await universityService.getUniversitiesWithGraduates();
        setUniversities(data);
      } catch (err: any) {
        console.error('Error fetching universities:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversities();
  }, []);

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await universityService.getUniversitiesWithGraduates();
      setUniversities(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { universities, loading, error, refresh };
}

// ==========================================
// DEPARTMENT OVERVIEW (for department head)
// ==========================================

export function useDepartmentOverview(universityId: string, department: string) {
  const [overview, setOverview] = useState<DepartmentOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!universityId || !department) {
      setLoading(false);
      return;
    }

    const fetchOverview = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await universityService.getDepartmentOverview(universityId, department);
        setOverview(data);
      } catch (err: any) {
        console.error('Error fetching department overview:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, [universityId, department]);

  return { overview, loading, error };
}

// ==========================================
// ALL DEPARTMENTS WITH STATS (for rectorate)
// ==========================================

export function useAllDepartmentsWithStats(universityId: string) {
  const [departments, setDepartments] = useState<DepartmentWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!universityId) {
      setLoading(false);
      return;
    }

    const fetchDepartments = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await universityService.getAllDepartmentsWithStats(universityId);
        setDepartments(data);
      } catch (err: any) {
        console.error('Error fetching departments:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, [universityId]);

  const refresh = async () => {
    if (!universityId) return;
    setLoading(true);
    try {
      const data = await universityService.getAllDepartmentsWithStats(universityId);
      setDepartments(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { departments, loading, error, refresh };
}

// ==========================================
// UNIVERSITY DASHBOARD SUMMARY
// ==========================================

export function useUniversityDashboardSummary(universityId: string) {
  const [summary, setSummary] = useState<UniversityDashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!universityId) {
      setLoading(false);
      return;
    }

    const fetchSummary = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await universityService.getUniversityDashboardSummary(universityId);
        setSummary(data);
      } catch (err: any) {
        console.error('Error fetching dashboard summary:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [universityId]);

  return { summary, loading, error };
}

// ==========================================
// GRADUATE STATISTICS
// ==========================================

export function useGraduateStatistics(
  universityId: string, 
  department: string, 
  speciality: string
) {
  const [graduateStats, setGraduateStats] = useState<GraduateStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!universityId || !department || !speciality) {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await universityService.getGraduateStatistics(
          universityId, 
          department, 
          speciality
        );
        setGraduateStats(data);
      } catch (err: any) {
        console.error('Error fetching graduate statistics:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [universityId, department, speciality]);

  return { graduateStats, loading, error };
}

// ==========================================
// COMBINED HOOK FOR UNIFIED ANALYTICS PAGE
// ==========================================

export function useUnifiedAnalytics(universityId: string, universityName?: string, speciality?: string) {
  // Rectorate hooks
  const { 
    summary, 
    loading: summaryLoading 
  } = useUniversityDashboardSummary(universityId);
  
  const { 
    departments, 
    loading: deptsLoading 
  } = useAllDepartmentsWithStats(universityId);

  // Speciality hooks (when viewing specific speciality)
  const { 
    stats: specialityStats, 
    details: specialityDetails, 
    loading: specialityLoading,
    error: specialityError 
  } = useSpecialityStatistics(universityName || '', speciality || '');

  // University stats
  const { 
    stats: universityStats, 
    loading: uniStatsLoading 
  } = useUniversityStatistics(universityName || '');

  // Determine loading states
  const isLoading = summaryLoading || deptsLoading || specialityLoading || uniStatsLoading;

  return {
    // Rectorate data
    summary,
    departments,
    
    // Speciality data
    specialityStats,
    specialityDetails,
    specialityError,
    
    // University data
    universityStats,
    
    // State
    isLoading,
    hasSpeciality: !!speciality,
  };
}