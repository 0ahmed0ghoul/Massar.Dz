import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { MatchResult } from "@/types/university";
import { PlatformStudent, UniversityStudent, universityStudentsService } from "@/features/university/services/universityStudents.service";


export function useUniversityStudentConnection(profile: any) {
  const [officialStudents, setOfficialStudents] = useState<UniversityStudent[]>(
    []
  );
  const [registeredStudents, setRegisteredStudents] = useState<
    PlatformStudent[]
  >([]);
  const [matchResults, setMatchResults] = useState<Map<string, MatchResult>>(
    new Map()
  );

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const { toast } = useToast();

  // ─────────────────────────────────────────────
  // Safe profile values
  // ─────────────────────────────────────────────
  const universityId = profile?.id;
  const universityName = profile?.university_name;

  // ─────────────────────────────────────────────
  // Fetch all data
  // ─────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    if (!universityId || !universityName) return;

    setLoading(true);

    try {
      const [official, registered] = await Promise.all([
        universityStudentsService.getOfficialStudents(universityId),

        // NEW:
        // fetch by university name + pending/connected status
        universityStudentsService.getRegisteredStudents(universityName),
      ]);

      setOfficialStudents(official);
      setRegisteredStudents(registered);

      // Generate matching results
      const matches = new Map<string, MatchResult>();

      registered.forEach((student) => {
        const match = universityStudentsService.compareWithOfficial(
          student,
          official
        );

        matches.set(student.id, match);
      });

      setMatchResults(matches);
    } catch (error: any) {
      toast({
        title: "Error loading data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [universityId, universityName, toast]);

  // ─────────────────────────────────────────────
  // Initial fetch
  // ─────────────────────────────────────────────
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ─────────────────────────────────────────────
  // Upload official roster
  // ─────────────────────────────────────────────
  const uploadOfficialData = async (file: File) => {
    if (!universityId) return;

    setUploading(true);

    try {
      await universityStudentsService.uploadOfficialStudents(
        universityId,
        file
      );

      toast({
        title: "Success",
        description: "Official student database uploaded successfully",
      });

      await fetchData();
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });

      throw error;
    } finally {
      setUploading(false);
    }
  };

  // ─────────────────────────────────────────────
  // Accept student
  // ─────────────────────────────────────────────

const acceptStudent = async (student: PlatformStudent) => {
  console.log("🚀 [acceptStudent] clicked student:", student);

  try {
    console.log("🧠 Step 1 - updating UI optimistically");

    // Update local state immediately
    setRegisteredStudents((prev) =>
      prev.map((s) =>
        s.id === student.id
          ? {
              ...s,
              connection_status: "connected",
            }
          : s
      )
    );

    console.log("🔥 Step 2 - calling Supabase update function");

    await universityStudentsService.approveStudentConnection(
      student.id,
      universityName
    );

    console.log("✅ Step 3 - DB update success");

    toast({
      title: "Success",
      description: `${student.first_name} ${student.last_name} connected successfully`,
    });

    // Refresh data to get latest state
    await fetchData();

    console.log("🎉 acceptStudent completed successfully");
    return true;
  } catch (error: any) {
    console.error("❌ acceptStudent ERROR:", error);
    
    // Revert the optimistic update on failure
    setRegisteredStudents((prev) =>
      prev.map((s) =>
        s.id === student.id
          ? {
              ...s,
              connection_status: student.connection_status, // Revert to original
            }
          : s
      )
    );

    toast({
      title: "Failed",
      description: error.message,
      variant: "destructive",
    });

    return false;
  }
};
  // ─────────────────────────────────────────────
  // Reject student
  // ─────────────────────────────────────────────
  const rejectStudent = async (student: PlatformStudent, reason: string) => {
    try {
      await universityStudentsService.rejectStudent({
        studentId: student.id,
        reason,
        email: student.email,
        studentName: `${student.first_name} ${student.last_name}`,
        universityId: universityId,
      });

      // instant UI update
      setRegisteredStudents((prev) =>
        prev.map((s) =>
          s.id === student.id
            ? {
                ...s,
                connection_status: "rejected",
                rejection_reason: reason,
              }
            : s
        )
      );

      toast({
        title: "Rejected",
        description: `Rejection email sent to ${student.first_name} ${student.last_name}`,
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Rejection failed",
        description: error.message,
        variant: "destructive",
      });

      return false;
    }
  };

  // ─────────────────────────────────────────────
  // Search official roster
  // ─────────────────────────────────────────────
  const searchInOfficial = (query: string): UniversityStudent[] => {
    const lower = query.toLowerCase();

    return officialStudents.filter(
      (s) =>
        s.student_id.toLowerCase().includes(lower) ||
        `${s.first_name} ${s.last_name}`.toLowerCase().includes(lower)
    );
  };

  // ─────────────────────────────────────────────
  // Preview upload
  // ─────────────────────────────────────────────
  const previewUpload = async (file: File) => {
    try {
      const previewData = await universityStudentsService.previewExcelFile(
        file
      );

      return previewData;
    } catch (error: any) {
      toast({
        title: "Preview failed",
        description: error.message,
        variant: "destructive",
      });

      throw error;
    }
  };

  // ─────────────────────────────────────────────
  // Confirm upload
  // ─────────────────────────────────────────────
  const confirmUpload = async (studentsData: any[]) => {
    if (!universityId) return;

    setUploading(true);

    try {
      const { inserted, updated } =
        await universityStudentsService.upsertOfficialStudents(
          universityId,
          studentsData
        );

      toast({
        title: "Success",
        description: `Added ${inserted} new, updated ${updated} existing records.`,
      });

      await fetchData();

      return { inserted, updated };
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });

      throw error;
    } finally {
      setUploading(false);
    }
  };

  return {
    officialStudents,
    registeredStudents,
    matchResults,

    loading,
    uploading,

    uploadOfficialData,

    acceptStudent,
    rejectStudent,

    searchInOfficial,

    refreshData: fetchData,

    previewUpload,
    confirmUpload,
  };
}

export const useUniversityConnection = useUniversityStudentConnection;
