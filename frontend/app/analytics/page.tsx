import { PostGrid } from "@/components/posts/post-grid";
import { ACCESS_TOKEN, INSTAGRAM_ACCOUNT_ID } from "@/constants/constants";

async function getPosts() {
  const response = await fetch(
    `https://graph.facebook.com/v17.0/${INSTAGRAM_ACCOUNT_ID}/media?fields=id,caption,media_type,media_url,timestamp,permalink&access_token=${ACCESS_TOKEN}`,
    {
      cache: "no-store",
    }
  );

  return response.json();
}

export default async function AnalyticsPage() {
  const data = await getPosts();
  console.log(data);

  return (
    <div className="space-y-6 py-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Posts</h1>
        <p className="text-muted-foreground mt-2">
          View and manage your Instagram posts
        </p>
      </div>
      <PostGrid posts={data.data} />
    </div>
  );
}
