// features/company/hooks/useApplicationDetail.ts

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { useToast } from "@/components/ui/use-toast";

import {
  applicationService,
  ApplicationWithDetails,
} from "../service/application.service";

// Interview form data type (matches the one used in the component)
export interface InterviewFormData {
  interview_date: string; // datetime-local format "YYYY-MM-DDThh:mm"
  location: string;
  meeting_link: string;
  notes: string;
}

export function useApplicationDetail() {
  const [searchParams] = useSearchParams();

  const jobId = searchParams.get("job");
  const candidateId = searchParams.get("candidate");

  const [application, setApplication] =
    useState<ApplicationWithDetails | null>(null);

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [scheduling, setScheduling] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    setApplication(null);
    setLoading(true);

    if (!jobId || !candidateId) {
      setLoading(false);

      toast({
        title: "Invalid URL",
        description: "Missing application identifiers",
        variant: "destructive",
      });

      return;
    }

    const fetchData = async () => {
      try {
        const data =
          await applicationService.getApplicationByJobAndCandidate(
            jobId,
            candidateId
          );

        setApplication(data);
      } catch (err: any) {
        console.error("Failed to fetch application:", err);

        toast({
          title: "Error",
          description:
            err.message ||
            "Failed to load application details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jobId, candidateId, toast]);

  const updateStatus = async (
    applicationId: string,
    newStatus: string
  ) => {
    setUpdating(true);

    try {
      await applicationService.updateApplicationStatus(
        applicationId,
        newStatus
      );

      setApplication((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus,
            }
          : null
      );

      toast({
        title: "Success",
        description: `Application marked as ${newStatus}`,
      });
    } catch (err: any) {
      console.error("Failed to update status:", err);

      toast({
        title: "Error",
        description:
          err.message ||
          "Failed to update application status",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const scheduleInterview = async (
    applicationId: string,
    interviewData: InterviewFormData
  ) => {
    setScheduling(true);

    try {
      // Call service to schedule interview (replaces any old interview records)
      await applicationService.scheduleInterview(applicationId, interviewData);

      toast({
        title: "Interview Scheduled",
        description: "Interview details have been sent and saved.",
      });

      // Optionally refresh application data to reflect any backend changes
      if (jobId && candidateId) {
        const refreshed = await applicationService.getApplicationByJobAndCandidate(
          jobId,
          candidateId
        );
        setApplication(refreshed);
      }

      return true;
    } catch (err: any) {
      console.error("Failed to schedule interview:", err);

      toast({
        title: "Error",
        description:
          err.message || "Failed to schedule interview. Please try again.",
        variant: "destructive",
      });

      throw err;
    } finally {
      setScheduling(false);
    }
  };

  return {
    application,
    loading,
    updating,
    scheduling, // optional, to disable button while scheduling
    updateStatus,
    scheduleInterview,
  };
}