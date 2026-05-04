// features/university/hooks/useUniversityConnectionMerged.ts
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  universityStudentsService,
  UniversityStudent,
  PlatformStudent,
  MatchResult,
} from "../services/universityStudents.service";

/* --------------------------------------------------------------
   Hook: useUniversityStudentConnection
   Unified hook using the single service.
-------------------------------------------------------------- */
export function useUniversityStudentConnection(universityId: string) {
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

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [official, registered] = await Promise.all([
        universityStudentsService.getOfficialStudents(universityId),
        universityStudentsService.getRegisteredStudents(universityId),
      ]);
      setOfficialStudents(official);
      setRegisteredStudents(registered);

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
  }, [universityId, toast]);

  useEffect(() => {
    if (universityId) fetchData();
  }, [universityId, fetchData]);

  const uploadOfficialData = async (file: File) => {
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
      await fetchData(); // refresh all data
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

  const acceptStudent = async (
    student: PlatformStudent,
    matchResult: MatchResult
  ) => {
    if (!matchResult.officialRecord) {
      toast({
        title: "Cannot accept",
        description: "No matching official record found",
        variant: "destructive",
      });
      return false;
    }
    try {
      // Inside acceptStudent:
      await universityStudentsService.sendInvitation({
        studentId: student.id,
        officialStudentId: matchResult.officialRecord.id,
        departmentId: universityId, // university profile id
        invitedBy: universityId, // assuming the admin is the one inviting
      });
      // Update local state
      setRegisteredStudents((prev) =>
        prev.map((s) =>
          s.id === student.id ? { ...s, connection_status: "pending" } : s
        )
      );
      toast({
        title: "Invitation sent",
        description: `Connection invitation sent to ${student.first_name} ${student.last_name}`,
      });
      return true;
    } catch (error: any) {
      toast({
        title: "Failed",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const rejectStudent = async (student: PlatformStudent, reason: string) => {
    try {
      await universityStudentsService.rejectStudent({
        studentId: student.id,
        reason,
        email: student.email,
        studentName: `${student.first_name} ${student.last_name}`,
        universityId: universityId,
      });
      setRegisteredStudents((prev) =>
        prev.map((s) =>
          s.id === student.id
            ? { ...s, connection_status: "rejected", rejection_reason: reason }
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

  const searchInOfficial = (query: string): UniversityStudent[] => {
    const lower = query.toLowerCase();
    return officialStudents.filter(
      (s) =>
        s.student_id.toLowerCase().includes(lower) ||
        s.first_name.toLowerCase().includes(lower)  && s.last_name.toLowerCase().includes(lower)
    );
  };
  
  const previewUpload = async (file: File) => {
    try {
      const previewData = await universityStudentsService.previewExcelFile(file);
      return previewData;
    } catch (error: any) {
      toast({ title: 'Preview failed', description: error.message, variant: 'destructive' });
      throw error;
    }
  };

  const confirmUpload = async (studentsData: any[]) => {
    setUploading(true);
    try {
      const { inserted, updated } = await universityStudentsService.upsertOfficialStudents(universityId, studentsData);
      toast({
        title: 'Success',
        description: `Added ${inserted} new, updated ${updated} existing records.`,
      });
      await fetchData(); // refresh all data
      return { inserted, updated };
    } catch (error: any) {
      toast({ title: 'Upload failed', description: error.message, variant: 'destructive' });
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
    confirmUpload
  };
}

/* --------------------------------------------------------------
   Legacy alias for backward compatibility
   (if you previously used useUniversityConnection, this mimics it)
-------------------------------------------------------------- */
export const useUniversityConnection = useUniversityStudentConnection;
