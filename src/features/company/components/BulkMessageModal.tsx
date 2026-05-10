// features/company/components/BulkMessageModal.tsx
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Mail } from "lucide-react";
import { sendBulkMessages } from "../service/message.service";

interface BulkMessageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applications: any[];
  onSuccess: () => void;
}

export function BulkMessageModal({ open, onOpenChange, applications, onSuccess }: BulkMessageModalProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!selectedIds.length || !message.trim()) return;
    setSending(true);
    setError(null);
    try {
      await sendBulkMessages(selectedIds, message);
      onSuccess();
      onOpenChange(false);
      setSelectedIds([]);
      setMessage("");
    } catch (err: any) {
      setError(err.message || "Failed to send messages");
    } finally {
      setSending(false);
    }
  };

  const toggleAll = () => {
    if (selectedIds.length === applications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(applications.map((app) => app.id));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg border-white/10 bg-[#0f1117] text-foreground">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-[#639922]" />
            Bulk Messaging (Premium)
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="max-h-60 overflow-y-auto rounded border border-white/10 p-2 space-y-1">
            <label className="flex items-center gap-2 text-sm text-white/80 cursor-pointer mb-2">
              <Checkbox checked={selectedIds.length === applications.length} onCheckedChange={toggleAll} />
              Select all
            </label>
            {applications.map((app) => (
              <label key={app.id} className="flex items-center gap-2 text-sm text-white/80 cursor-pointer">
                <Checkbox
                  checked={selectedIds.includes(app.id)}
                  onCheckedChange={() => {
                    if (selectedIds.includes(app.id)) {
                      setSelectedIds(selectedIds.filter((id) => id !== app.id));
                    } else {
                      setSelectedIds([...selectedIds, app.id]);
                    }
                  }}
                />
                <span>{app.student?.first_name} {app.student?.last_name}</span>
              </label>
            ))}
          </div>
          <Textarea
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="bg-white/5 border-white/10"
            rows={4}
          />
          {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedIds.length || !message.trim() || sending}
            className="bg-[#639922] text-black"
          >
            {sending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Mail className="h-4 w-4 mr-2" />}
            Send to {selectedIds.length} candidate(s)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}