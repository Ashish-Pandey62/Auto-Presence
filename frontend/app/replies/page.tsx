import { MessageCard } from "@/components/message-card";

export default function RepliesPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="mb-6 pb-4 border-b border-neutral-200">
        <h1 className="text-2xl font-bold text-neutral-800">Replies</h1>
      </div>
      <div className="space-y-4">
        <MessageCard />
        <MessageCard />
        <MessageCard />
        <MessageCard />
      </div>
    </div>
  );
}
