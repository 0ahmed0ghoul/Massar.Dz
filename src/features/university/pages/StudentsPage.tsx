import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, Award } from "lucide-react";
import { useUniversityData } from "../hooks/useUniversityData";
import { importStudentsFromXLSX } from "../services/studentImport";
import { GraduationCertificateModal } from "../components/GraduationCertificateModal";


export default function StudentsPage() {
  const { students, addStudents, claimCertificate } = useUniversityData();
  const [selectedStudent, setSelectedStudent] = useState<{ id: string; name: string } | null>(null);
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const imported = await importStudentsFromXLSX(file);
    addStudents(imported);
    e.target.value = ""; // reset input
  };

  const handleClaimCertificate = (studentId: string, studentName: string) => {
    const token = claimCertificate(studentId);
    setGeneratedToken(token);
    setSelectedStudent({ id: studentId, name: studentName });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Students</h1>
          <p className="text-muted-foreground">Manage student records and graduation certificates.</p>
        </div>
        <div>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            className="hidden"
            id="excel-upload"
          />
          <label htmlFor="excel-upload">
            <Button variant="outline" asChild>
              <span>
                <Upload className="mr-2 h-4 w-4" /> Import XLSX
              </span>
            </Button>
          </label>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Field</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Certificate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.field}</TableCell>
                  <TableCell>{student.status}</TableCell>
                  <TableCell>
                    {student.graduationEligible && student.status !== "graduated" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleClaimCertificate(student.id, student.name)}
                      >
                        <Award className="mr-2 h-3 w-3" /> Claim Certificate
                      </Button>
                    ) : student.status === "graduated" ? (
                      <span className="text-xs text-green-600">Graduated</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Not eligible</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {students.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No students yet. Import an XLSX file to begin.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedStudent && generatedToken && (
        <GraduationCertificateModal
          open={!!selectedStudent}
          onOpenChange={() => {
            setSelectedStudent(null);
            setGeneratedToken(null);
          }}
          token={generatedToken}
          studentName={selectedStudent.name}
        />
      )}
    </div>
  );
}