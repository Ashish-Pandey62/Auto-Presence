import { PostGrid } from "@/components/posts/post-grid";
import { ACCESS_TOKEN, INSTAGRAM_ACCOUNT_ID } from "@/constants/constants";

async function getPosts() {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v17.0/${INSTAGRAM_ACCOUNT_ID}/media?fields=id,caption,media_type,media_url,timestamp,permalink&access_token=${ACCESS_TOKEN}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch posts from Instagram API");
    }

    return response.json();
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred while fetching posts");
  }
}

export default async function AnalyticsPage() {
  try {
    const data = await getPosts();

    return (
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Posts</h1>
          <p className="text-muted-foreground mt-2">
            View and manage your Instagram posts
          </p>
        </div>
        {data?.data?.length > 0 ? (
          <PostGrid posts={data.data} />
        ) : (
          <div className="text-center text-gray-500">
            No posts available to display.
          </div>
        )}
      </div>
    );
  } catch (error) {
    return (
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Posts</h1>
          <p className="text-muted-foreground mt-2">
            View and manage your Instagram posts
          </p>
        </div>
        <div className="text-center text-red-500">
          An error occurred while fetching posts. Please try again later.
        </div>
      </div>
    );
  }
}
