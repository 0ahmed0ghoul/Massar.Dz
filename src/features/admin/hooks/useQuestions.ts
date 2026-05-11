// features/admin/hooks/useQuestions.ts
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { questionService, Question } from '../services/question.service';

export function useQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await questionService.getQuestions();
      setQuestions(data);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const addQuestion = async (data: Omit<Question, 'id' | 'created_at' | 'updated_at' | 'status'>) => {
    try {
      const newQuestion = await questionService.createQuestion(data);
      setQuestions(prev => [newQuestion, ...prev]);
      toast({ title: 'Success', description: 'Question created as draft.' });
      return newQuestion;
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return null;
    }
  };

  const publishQuestion = async (id: string) => {
    try {
      const updated = await questionService.publishQuestion(id);
      setQuestions(prev => prev.map(q => q.id === id ? updated : q));
      toast({ title: 'Success', description: 'Question published. Students can now see it.' });
      return updated;
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return null;
    }
  };

  const editQuestion = async (id: string, updates: Partial<Omit<Question, 'id' | 'created_at' | 'updated_at' | 'status'>>) => {
    try {
      const updated = await questionService.updateQuestion(id, updates);
      setQuestions(prev => prev.map(q => q.id === id ? updated : q));
      toast({ title: 'Success', description: 'Question updated.' });
      return updated;
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return null;
    }
  };

  const removeQuestion = async (id: string) => {
    try {
      await questionService.deleteQuestion(id);
      setQuestions(prev => prev.filter(q => q.id !== id));
      toast({ title: 'Deleted', description: 'Question removed.' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  return { questions, loading, addQuestion, publishQuestion, editQuestion, removeQuestion, refresh: fetchQuestions };
}