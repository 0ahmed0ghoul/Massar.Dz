// features/university/hooks/useUploadStudents.ts
import { useState } from "react";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { universityStudentsService } from "../services/universityStudents.service";
import { useToast } from "@/components/ui/use-toast";

export function useUploadStudents() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const uploadFile = async (file: File) => {
    if (!profile?.id) {
      toast({
        title: "Error",
        description: "University ID missing",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Use the new unified upload method that parses Excel and inserts directly
      await universityStudentsService.uploadOfficialStudents(profile.id, file);
      toast({
        title: "Success",
        description: "Official student database uploaded successfully",
      });
    } catch (err: any) {
      toast({
        title: "Upload failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { uploadFile, loading };
}