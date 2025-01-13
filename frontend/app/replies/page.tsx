import { MessageCard } from "@/components/message-card";
import { ACCESS_TOKEN, INSTAGRAM_ACCOUNT_ID } from "@/constants/constants";

async function getDirectMessages() {
  // First, get the thread IDs
  const response = await fetch(
    `https://graph.facebook.com/v17.0/${INSTAGRAM_ACCOUNT_ID}/conversations?platform=instagram&access_token=${ACCESS_TOKEN}`,
    {
      cache: "no-store",
    }
  );

  return response.json();
}

export default async function RepliesPage() {
  try {
    const data = await getDirectMessages();
    console.log(data);
  } catch (error) {
    console.error(error);
  }

  return (
    <div className="p-6 space-y-6">
      <div className="mb-2 pb-6 border-b border-neutral-200">
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
