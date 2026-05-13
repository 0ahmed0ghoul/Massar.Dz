// features/university/pages/UploadStudentsPage.tsx
import { Button } from "@/components/ui/button";
import { useUploadStudents } from "@/features/university/hooks/useUploadStudents";
import { useState } from "react";

export default function UploadStudentsPage() {
  const { uploadFile, loading } = useUploadStudents();
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Upload Students Excel</h1>

      <input
        type="file"
        accept=".xlsx"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <Button
        className="mt-4"
        disabled={!file || loading}
        onClick={() => file && uploadFile(file)}
      >
        {loading ? "Uploading..." : "Upload"}
      </Button>
    </div>
  );
}