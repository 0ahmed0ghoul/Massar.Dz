// services/studentImport.ts
import * as XLSX from "xlsx";
import { Student } from "../hooks/useUniversityData";

export const importStudentsFromXLSX = (file: File): Promise<Student[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(sheet);

      const students: Student[] = rows.map((row: any, index) => ({
        id: `student_${Date.now()}_${index}`,
        name: row["Name"] || row["name"] || "",
        email: row["Email"] || row["email"] || "",
        field: row["Field"] || row["field"] || "",
        status: "studying",
        graduationEligible: true, // you can add logic based on a column if needed
        outcome: row["Outcome"] ? { outcome: row["Outcome"], company: row["Company"] || "", date: row["Date"] || "" } : undefined,
      }));
      resolve(students);
    };
    reader.onerror = reject;
    reader.readAsBinaryString(file);
  });
};