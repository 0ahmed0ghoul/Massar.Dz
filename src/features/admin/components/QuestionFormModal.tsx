// features/admin/components/QuestionFormModal.tsx
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus } from 'lucide-react';
import { Question } from '../services/question.service';

interface QuestionFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Question | null;
  onSave: (data: Omit<Question, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
}

export function QuestionFormModal({ open, onOpenChange, initialData, onSave }: QuestionFormModalProps) {
  const [text, setText] = useState('');
  const [type, setType] = useState<'true_false' | 'multiple_choice'>('true_false');
  const [options, setOptions] = useState<string[]>(['']);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setText(initialData.text);
      setType(initialData.type);
      setOptions(initialData.options.length ? initialData.options : ['']);
    } else {
      setText('');
      setType('true_false');
      setOptions(['']);
    }
  }, [initialData, open]);

  const handleAddOption = () => setOptions([...options, '']);
  const handleRemoveOption = (index: number) => setOptions(options.filter((_, i) => i !== index));
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSaving(true);
    const payload: any = { text: text.trim(), type };
    if (type === 'multiple_choice') {
      const validOptions = options.filter(opt => opt.trim().length > 0);
      if (validOptions.length < 2) {
        alert('Multiple choice questions need at least two options.');
        setSaving(false);
        return;
      }
      payload.options = validOptions;
    } else {
      payload.options = [];
    }
    await onSave(payload);
    setSaving(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg border-white/10 bg-[#0f1117] text-foreground">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Question' : 'Add New Question'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Question Text *</Label>
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g., Do you have a bachelor's degree?"
              className="bg-white/5 border-white/10"
              required
            />
          </div>
          <div>
            <Label>Question Type</Label>
            <Select value={type} onValueChange={(v: any) => setType(v)}>
              <SelectTrigger className="bg-white/5 border-white/10">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true_false">True / False</SelectItem>
                <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {type === 'multiple_choice' && (
            <div className="space-y-2">
              <Label>Options (at least 2)</Label>
              {options.map((opt, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <Input
                    value={opt}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    placeholder={`Option ${idx + 1}`}
                    className="bg-white/5 border-white/10 flex-1"
                  />
                  {options.length > 1 && (
                    <button type="button" onClick={() => handleRemoveOption(idx)} className="text-red-400">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={handleAddOption} className="mt-1">
                <Plus className="h-3 w-3 mr-1" /> Add option
              </Button>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={saving} className="bg-[#639922] text-black">
              {saving ? 'Saving...' : (initialData ? 'Update' : 'Create')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}