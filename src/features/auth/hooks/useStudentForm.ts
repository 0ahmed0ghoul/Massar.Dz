// features/auth/hooks/useStudentForm.ts
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StudentFields, studentSchema } from "../schemas/auth.schemas";
import { authService } from "../service/auth.service";


export function useStudentForm(onSubmitCallback: (data: StudentFields) => void) {
  const [status, setStatus] = useState<"studying" | "graduated" | "self_taught">("studying");
  const [skills, setSkills] = useState<string[]>([]);
  const [universities, setUniversities] = useState<{ id: string; name: string }[]>([]);
  const [loadingUnis, setLoadingUnis] = useState(false);
  const [availableDepartments, setAvailableDepartments] = useState<string[]>([]);
  const [loadingDepts, setLoadingDepts] = useState(false);

  const form = useForm<StudentFields>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      degreeLevel: undefined,
      university: "",
      department: "",
      degree: "",
      graduationYear: "",
      speciality: "",
      skills: [],
      candidateType: "studying",
    },
  });

  const { watch, setValue, clearErrors } = form;
  const selectedUniversity = watch("university");

  useEffect(() => {
    const fetchUniversities = async () => {
      setLoadingUnis(true);
      try {
        const data = await authService.getVerifiedUniversities();
        setUniversities(data);
      } catch (err) {
        console.error("Failed to load universities:", err);
      } finally {
        setLoadingUnis(false);
      }
    };
    fetchUniversities();
  }, []);

  useEffect(() => {
    const fetchDepartments = async () => {
      if (!selectedUniversity) {
        setAvailableDepartments([]);
        return;
      }
      setLoadingDepts(true);
      try {
        const depts = await authService.getUniversityDepartments(selectedUniversity);
        setAvailableDepartments(depts);
      } catch (err) {
        console.error("Failed to load departments:", err);
      } finally {
        setLoadingDepts(false);
      }
    };
    fetchDepartments();
  }, [selectedUniversity]);

  const handleStatusChange = (newStatus: "studying" | "graduated" | "self_taught") => {
    setStatus(newStatus);
    setValue("candidateType", newStatus);
    if (newStatus === "studying") {
      setValue("university", "");
      setValue("degree", "");
      setValue("graduationYear", "");
      setValue("speciality", "");
      setSkills([]);
      setValue("skills", []);
      clearErrors(["university", "degree", "graduationYear", "skills", "speciality"]);
    } else if (newStatus === "graduated") {
      setValue("university", "");
      setValue("department", "");
      setValue("degree", "");
      setValue("speciality", "");
      setSkills([]);
      setValue("skills", []);
      clearErrors(["university", "department", "degree", "speciality", "skills"]);
    } else {
      setValue("university", "");
      setValue("department", "");
      setValue("degree", "");
      setValue("graduationYear", "");
      setValue("speciality", "");
      setSkills([]);
      setValue("skills", []);
      clearErrors(["university", "department", "degree", "graduationYear", "speciality"]);
    }
  };

  const handleSubmit = form.handleSubmit((data) => {
    onSubmitCallback(data);
  });

  return {
    form,
    status,
    skills,
    setSkills,
    universities,
    loadingUnis,
    availableDepartments,
    loadingDepts,
    selectedUniversity,
    handleStatusChange,
    handleSubmit,
    register: form.register,
    control: form.control,
    errors: form.formState.errors,
    setValue,
    watch
  };
}