// hooks/useUniversityData.ts
import { useState, useEffect } from 'react';
import { Student, Invitation, StudentProfile } from '../types/university';
import { importStudentsFromXLSX } from '../services/studentImport';

const STORAGE_KEYS = {
  STUDENTS: 'university_students',
  INVITATIONS: 'university_invitations',
  CURRENT_UNIVERSITY_ID: 'current_university_id',
};

const MOCK_STUDENTS: Student[] = [
  {
    id: '1',
    firstName: 'Ahmed',
    lastName: 'Ghoul',
    studentId: '34135903',
    email: 'ghoul.ahmed@univ-guelma.dz',
    speciality: 'Computer Science',
    wilaya: 'Tebessa',
    specialityType: 'PRO',
    academicYears: '2023-2026',
    degreeLevel: 'Bachelor',
    status: 'studying',
    graduationEligible: true,
    isProfileVerified: false,
    connectionStatus: 'none',
    outcome: undefined,
  },
  {
    id: '2',
    firstName: 'Islam',
    lastName: 'Abdelelmoumen',
    studentId: '34135904',
    email: 'abdelelmoumen.islam@univ-guelma.dz',
    speciality: 'Computer Science',
    wilaya: 'Tebessa',
    specialityType: 'LMD',
    academicYears: '2023-2026',
    degreeLevel: 'Bachelor',
    status: 'studying',
    graduationEligible: false,
    isProfileVerified: false,
    connectionStatus: 'none',
    outcome: undefined,
  },
];

const mockConversations = [
  { id: "conv1", studentId: "student_123", universityId: "uni_456", lastMessage: "Hello, I have a question about admission.", lastMessageAt: new Date().toISOString() }
];
const mockMessages = [
  { id: "msg1", conversationId: "conv1", senderId: "student_123", receiverId: "uni_456", content: "Hello, I have a question about admission.", isRead: false, createdAt: new Date().toISOString() }
];


const MOCK_INVITATIONS: Invitation[] = [];

export function useUniversityData() {
  const [students, setStudents] = useState<Student[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const universityId = 'uni_001';

  useEffect(() => {
    const storedStudents = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    const storedInvitations = localStorage.getItem(STORAGE_KEYS.INVITATIONS);
    localStorage.setItem("messaging_conversations", JSON.stringify(mockConversations));
    localStorage.setItem("messaging_messages", JSON.stringify(mockMessages));
    if (storedStudents) {
      setStudents(JSON.parse(storedStudents));
    } else {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(MOCK_STUDENTS));
      setStudents(MOCK_STUDENTS);
    }

    if (storedInvitations) {
      setInvitations(JSON.parse(storedInvitations));
    } else {
      localStorage.setItem(STORAGE_KEYS.INVITATIONS, JSON.stringify(MOCK_INVITATIONS));
      setInvitations(MOCK_INVITATIONS);
    }
  }, []);

  const persistStudents = (newStudents: Student[]) => {
    setStudents(newStudents);
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(newStudents));
  };

  const persistInvitations = (newInvitations: Invitation[]) => {
    setInvitations(newInvitations);
    localStorage.setItem(STORAGE_KEYS.INVITATIONS, JSON.stringify(newInvitations));
  };

  const addStudents = async (file: File) => {
    const imported = await importStudentsFromXLSX(file);
    const newStudents: Student[] = imported.map((s: any) => ({
      id: crypto.randomUUID(),
      firstName: s.firstName || s.name?.split(' ')[0] || '',
      lastName: s.lastName || s.name?.split(' ')[1] || '',
      studentId: s.studentId || `S${Date.now()}`,
      studentIdCardImage: '',
      email: s.email,
      speciality: s.field || s.speciality,
      wilaya: s.wilaya,
      specialityType: s.specialityType,
      academicYears: s.academicYears,
      degreeLevel: s.degreeLevel,
      status: 'studying',
      graduationEligible: false,
      isProfileVerified: false,
      connectionStatus: 'none',
      outcome: undefined,
    }));
    persistStudents([...students, ...newStudents]);
  };

  const verifyStudentProfile = (studentId: string) => {
    const updated = students.map(s =>
      s.id === studentId ? { ...s, isProfileVerified: true } : s
    );
    persistStudents(updated);
  };

  // Send invitation – expects a StudentProfile object (the data the student filled)
  const sendInvitation = (studentId: string, profileData: StudentProfile) => {
    const student = students.find(s => s.id === studentId);
    if (!student) throw new Error('Student not found');
    if (!student.isProfileVerified) throw new Error('Profile not verified by admin yet');

    const newInvitation: Invitation = {
      id: crypto.randomUUID(),
      studentId,
      universityId,
      profileData,          // contains firstName, lastName, studentId, email, etc.
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    const updatedStudents = students.map(s =>
      s.id === studentId ? { ...s, connectionStatus: 'pending' } : s
    );
    persistStudents(updatedStudents);
    persistInvitations([...invitations, newInvitation]);
  };

  const acceptInvitation = (invitationId: string, studentId: string) => {
    const updatedInvitations = invitations.map(inv =>
      inv.id === invitationId ? { ...inv, status: 'accepted' } : inv
    );
    persistInvitations(updatedInvitations);

    const updatedStudents = students.map(s =>
      s.id === studentId ? { ...s, connectionStatus: 'connected' } : s
    );
    persistStudents(updatedStudents);
  };

  const rejectInvitation = (invitationId: string, studentId: string) => {
    const updatedInvitations = invitations.map(inv =>
      inv.id === invitationId ? { ...inv, status: 'rejected' } : inv
    );
    persistInvitations(updatedInvitations);

    const updatedStudents = students.map(s =>
      s.id === studentId ? { ...s, connectionStatus: 'none' } : s
    );
    persistStudents(updatedStudents);
  };

  const getPendingInvitations = () => {
    return invitations.filter(inv => inv.universityId === universityId && inv.status === 'pending');
  };

  const claimCertificate = (studentId: string) => {
    const token = `cert_${studentId}_${Date.now()}`;
    const updated = students.map(s =>
      s.id === studentId ? { ...s, status: 'graduated' as const, graduationEligible: false } : s
    );
    persistStudents(updated);
    return token;
  };

  // Mock invitation – simulates student sending their filled profile
  const mockSendInvitation = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    if (!student.isProfileVerified) {
      alert('Student profile not verified yet. Please verify first.');
      return;
    }
    if (student.connectionStatus !== 'none') {
      alert(`Connection already ${student.connectionStatus}. Cannot send another invitation.`);
      return;
    }
    const mockProfileData: StudentProfile = {
      firstName: student.firstName,
      lastName: student.lastName,
      studentId: student.studentId,
      studentIdCardImage: 'https://example.com/id-card-emma.jpg',
      wilaya: student.wilaya || 'Algiers',
      speciality: student.speciality,
      specialityType: student.specialityType || 'LMD',
      academicYears: student.academicYears || '2020-2024',
      degreeLevel: student.degreeLevel || 'Master',
      email: student.email,
      phone: '+213 555 123456',
    };
    sendInvitation(studentId, mockProfileData);
    alert(`Mock invitation sent for ${student.firstName} ${student.lastName}`);
  };

  return {
    students,
    invitations,
    addStudents,
    verifyStudentProfile,
    sendInvitation,
    acceptInvitation,
    rejectInvitation,
    getPendingInvitations,
    claimCertificate,
    mockSendInvitation,
  };
}