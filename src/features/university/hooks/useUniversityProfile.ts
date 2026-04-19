// hooks/useUniversityProfile.ts
import { useState, useEffect } from 'react';
import { University, Student, Invitation } from '../types/university';

const STORAGE_KEYS = {
  UNIVERSITY_PROFILE: 'university_profile',
  STUDENTS: 'university_students',
  INVITATIONS: 'university_invitations',
};

const DEFAULT_UNIVERSITY: University = {
  id: 'uni_001',
  name: 'University of Guelma',
  logo: 'src/assets/univ-guelma.png',
  address: '123 University Blvd',
  wilaya: 'Guelma',
  phone: '+213 21 123456',
  email: 'contact@univ-guelma.dz',
  website: 'https://www.univ-guelma.dz',
  establishedYear: 1990,
  description: 'Leading institution for higher education and research.',
};

export function useUniversityProfile() {
  const [university, setUniversity] = useState<University | null>(null);
  const [connectedStudents, setConnectedStudents] = useState<Student[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // Load data on mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = () => {
    setLoading(true);
    // Load university profile
    const storedUni = localStorage.getItem(STORAGE_KEYS.UNIVERSITY_PROFILE);
    if (storedUni) {
      setUniversity(JSON.parse(storedUni));
    } else {
      // Seed default university
      localStorage.setItem(STORAGE_KEYS.UNIVERSITY_PROFILE, JSON.stringify(DEFAULT_UNIVERSITY));
      setUniversity(DEFAULT_UNIVERSITY);
    }

    // Load students and invitations
    const students: Student[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDENTS) || '[]');
    const invitations: Invitation[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.INVITATIONS) || '[]');

    // Filter connected students (connectionStatus === 'connected')
    const connected = students.filter(s => s.connectionStatus === 'connected');
    setConnectedStudents(connected);

    // Filter pending invitations for this university
    const pending = invitations.filter(inv => inv.universityId === university?.id && inv.status === 'pending');
    setPendingRequests(pending);

    setLoading(false);
  };

  // Update university details
  const updateUniversity = async (updates: Partial<University>) => {
    if (!university) return;
    setSaving(true);
    const updated = { ...university, ...updates };
    localStorage.setItem(STORAGE_KEYS.UNIVERSITY_PROFILE, JSON.stringify(updated));
    setUniversity(updated);
    setSaving(false);
  };

  // Upload logo (converts to base64)
  const uploadLogo = async (file: File) => {
    if (!university) return;
    setUploadingLogo(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const logoBase64 = reader.result as string;
      const updated = { ...university, logo: logoBase64 };
      localStorage.setItem(STORAGE_KEYS.UNIVERSITY_PROFILE, JSON.stringify(updated));
      setUniversity(updated);
      setUploadingLogo(false);
    };
    reader.readAsDataURL(file);
  };

  const deleteLogo = () => {
    if (!university) return;
    const updated = { ...university, logo: undefined };
    localStorage.setItem(STORAGE_KEYS.UNIVERSITY_PROFILE, JSON.stringify(updated));
    setUniversity(updated);
  };

  // Accept a connection request (reuse logic from useUniversityData)
  const acceptRequest = (invitationId: string, studentId: string) => {
    // Update invitation status
    const invitations: Invitation[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.INVITATIONS) || '[]');
    const updatedInvitations = invitations.map(inv =>
      inv.id === invitationId ? { ...inv, status: 'accepted' } : inv
    );
    localStorage.setItem(STORAGE_KEYS.INVITATIONS, JSON.stringify(updatedInvitations));

    // Update student connection status
    const students: Student[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDENTS) || '[]');
    const updatedStudents = students.map(s =>
      s.id === studentId ? { ...s, connectionStatus: 'connected' } : s
    );
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(updatedStudents));

    // Reload data
    loadAllData();
  };

  const rejectRequest = (invitationId: string, studentId: string) => {
    const invitations: Invitation[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.INVITATIONS) || '[]');
    const updatedInvitations = invitations.map(inv =>
      inv.id === invitationId ? { ...inv, status: 'rejected' } : inv
    );
    localStorage.setItem(STORAGE_KEYS.INVITATIONS, JSON.stringify(updatedInvitations));

    const students: Student[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDENTS) || '[]');
    const updatedStudents = students.map(s =>
      s.id === studentId ? { ...s, connectionStatus: 'none' } : s
    );
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(updatedStudents));

    loadAllData();
  };

  return {
    university,
    loading,
    saving,
    uploadingLogo,
    updateUniversity,
    uploadLogo,
    deleteLogo,
    connectedStudents,
    pendingRequests,
    acceptRequest,
    rejectRequest,
  };
}