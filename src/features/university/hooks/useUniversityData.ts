// hooks/useUniversityData.ts
import { useState, useEffect } from "react";

export interface Student {
  id: string;
  name: string;
  email: string;
  field: string;
  status: "studying" | "graduated";
  graduationEligible: boolean;
  outcome?: {
    outcome: string;
    company: string;
    date: string;
  };
}

export interface GraduationClaim {
  studentId: string;
  token: string;
  claimedAt: string;
  scannedAt?: string;
}

export function useUniversityData() {
  const [students, setStudents] = useState<Student[]>([]);
  const [claims, setClaims] = useState<GraduationClaim[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const storedStudents = localStorage.getItem("university_students");
    if (storedStudents) setStudents(JSON.parse(storedStudents));
    const storedClaims = localStorage.getItem("graduation_claims");
    if (storedClaims) setClaims(JSON.parse(storedClaims));
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("university_students", JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem("graduation_claims", JSON.stringify(claims));
  }, [claims]);

  const addStudents = (newStudents: Student[]) => {
    setStudents((prev) => [...prev, ...newStudents]);
  };

  const claimCertificate = (studentId: string) => {
    const token = `${studentId}-${Date.now()}`;
    const newClaim: GraduationClaim = {
      studentId,
      token,
      claimedAt: new Date().toISOString(),
    };
    setClaims((prev) => [...prev, newClaim]);
    return token;
  };

  const scanCertificate = (token: string) => {
    const claim = claims.find((c) => c.token === token);
    if (claim && !claim.scannedAt) {
      setClaims((prev) =>
        prev.map((c) =>
          c.token === token ? { ...c, scannedAt: new Date().toISOString() } : c
        )
      );
      // Also update student status to graduated
      setStudents((prev) =>
        prev.map((s) =>
          s.id === claim.studentId ? { ...s, status: "graduated" } : s
        )
      );
      return true;
    }
    return false;
  };

  const getClaimByToken = (token: string) => claims.find((c) => c.token === token);

  return {
    students,
    claims,
    addStudents,
    claimCertificate,
    scanCertificate,
    getClaimByToken,
  };
}