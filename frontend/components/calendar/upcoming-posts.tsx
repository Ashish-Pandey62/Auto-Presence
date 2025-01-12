"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Post } from "@/app/calendar/posts";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface UpcomingPostsProps {
  posts: Post[];
  onEdit: (post: Post) => void;
  onDelete: (postId: string) => void;
}

export function UpcomingPosts({ posts, onEdit, onDelete }: UpcomingPostsProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Upcoming Posts</h2>
      <div className="space-y-2">
        {posts.map((post) => (
          <div
            key={post.name}
            className="flex items-center justify-between p-4 rounded-lg border bg-card"
          >
            <div className="flex items-center space-x-4">
              {/* <div className="w-12 h-12 bg-gray-100 rounded" /> */}
              {/* <Image
                src={post.posts[0].url}
                alt={`${post.name}_image`}
                width={12}
                height={12}
              /> */}
              <Avatar className="w-14 h-14 rounded-full">
                <AvatarImage
                  src={post.posts[0].url}
                  className="object-cover w-full h-full rounded-full"
                />
                <AvatarFallback>{post.name}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{post.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Scheduled for{" "}
                  {new Date(post.scheduledFor).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" onClick={() => onEdit(post)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(post.name)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
