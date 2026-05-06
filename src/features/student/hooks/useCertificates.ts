import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { Certificate, CertificateType } from "@/types/certificate";
import { certificateService } from "../services/certificate.service";

export function useCertificates() {
    const { user } = useAuth();
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [scanning, setScanning] = useState(false);

    const loadCertificates = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const data = await certificateService.getUserCertificates(user.id);
            setCertificates(data);
        } catch (err) {
            console.error("Failed to load certificates:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCertificates();
    }, [user]);

    const addCertificate = async (
        type: CertificateType,
        title: string,
        issuer: string,
        issueDate: string,
        expiryDate?: string,
        credentialId?: string,
        file?: File
    ) => {
        if (!user) throw new Error("Not authenticated");
        setAdding(true);
        try {
            let fileUrl: string | undefined;
            if (file) {
                fileUrl = await certificateService.uploadCertificateFile(user.id, file);
            }
            const newCert = await certificateService.addCertificate(user.id, {
                type,
                title,
                issuer,
                issue_date: issueDate,
                expiry_date: expiryDate,
                credential_id: credentialId,
                file_url: fileUrl,
                status: "claimed",
            });
            setCertificates(prev => [newCert, ...prev]);
            return newCert;
        } finally {
            setAdding(false);
        }
    };

    const deleteCertificate = async (certificateId: string) => {
        if (!user) return;
        await certificateService.deleteCertificate(certificateId);
        setCertificates(prev => prev.filter(c => c.id !== certificateId));
    };

    const claimGraduationCertificate = async (token: string) => {
        if (!user) throw new Error("Not authenticated");
        setScanning(true);
        try {
            const newCert = await certificateService.claimGraduationCertificate(token, user.id);
            setCertificates(prev => [newCert, ...prev]);
            return newCert;
        } finally {
            setScanning(false);
        }
    };

    return {
        certificates,
        loading,
        adding,
        scanning,
        addCertificate,
        deleteCertificate,
        claimGraduationCertificate,
        refresh: loadCertificates,
    };
}