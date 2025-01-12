"use client";

import { InstagramPost } from "@/types/post";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import Link from "next/link";

interface PostGridProps {
  posts: InstagramPost[];
}

export const PostGrid = ({ posts }: PostGridProps) => {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {posts.map((post) => (
        <Card key={post.id} className="flex flex-col">
          <CardHeader className="relative aspect-square p-0">
            <Image
              src={post.media_url}
              alt={post.caption}
              fill
              className="object-cover rounded-t-lg"
            />
          </CardHeader>
          <CardContent className="p-3">
            <p className="line-clamp-1 text-sm mb-1">{post.caption}</p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(post.timestamp), {
                addSuffix: true,
              })}
            </p>
          </CardContent>
          <CardFooter className="flex gap-2 p-3 pt-0">
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <Link
                href={post.media_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                View
              </Link>
            </Button>
            <Button
              size="sm"
              className="flex-1 bg-purple-500 hover:bg-purple-600"
              asChild
            >
              <Link href={`/analytics/${post.id}`}>Analytics</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export function PostGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <CardContent className="p-0">
            <Skeleton className="aspect-square" />
            <div className="p-4 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-24" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
