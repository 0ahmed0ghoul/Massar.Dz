import { useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { authService } from '../service/auth.service';

export function useStudentType() {
  const { user } = useAuth();
  const [type, setType] = useState<'studying' | 'graduated' | 'self_taught' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchType() {
      if (!user) {
        setType(null);
        setLoading(false);
        return;
      }
      const studentType = await authService.getCurrentStudentType(user.id);
      setType(studentType);
      setLoading(false);
    }
    fetchType();
  }, [user]);

  return { type, loading };
}