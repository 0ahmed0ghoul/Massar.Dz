import { Message } from "../types/messaging";

interface Props {
  message: Message;
  isOwn: boolean;
}

export const MessageBubble = ({ message, isOwn }: Props) => {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${isOwn ? "bg-[#639922] text-white" : "bg-white/10 text-white"}`}>
        <p className="text-sm break-words">{message.content}</p>
        <p className="text-[10px] mt-1 opacity-60">{new Date(message.createdAt).toLocaleTimeString()}</p>
      </div>
    </div>
  );
};