import { PostGridSkeleton } from "@/components/posts/post-grid";

export default function Loading() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Posts</h1>
        <p className="text-muted-foreground mt-2">
          View and manage your Instagram posts
        </p>
      </div>
      <PostGridSkeleton />
    </div>
  );
}
