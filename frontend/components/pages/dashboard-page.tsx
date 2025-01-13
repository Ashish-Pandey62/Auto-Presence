"use client";

import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { POSTS } from "@/app/calendar/posts";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {/* <Button className="bg-[#3B82F6] hover:bg-[#2563EB]"> */}
        {/* <Button className="bg-purple-600 hover:bg-purple-700 text-white">
          <span className="mr-2">+</span> New Post
        </Button> */}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Engagement
            </CardTitle>
            <span className="text-xs font-medium text-green-500 bg-green-50 px-2 py-1 rounded">
              +12%
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">37</div>
            <div className="mt-4 h-2 w-full bg-gray-100 rounded">
              {/* <div className="h-2 w-3/4 bg-[#3B82F6] rounded" /> */}
              {/* <div className="h-2 w-3/4 bg-[#A855F7] rounded"></div> */}
              <div className="h-2 w-3/4 bg-green-500 rounded"></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Scheduled Posts
            </CardTitle>
            <span className="text-xs font-medium text-blue-500 bg-blue-50 px-2 py-1 rounded">
              Next 7 days
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{POSTS.length}</div>
            <div className="mt-4 h-2 w-full bg-gray-100 rounded">
              {/* <div className="h-2 w-1/2 bg-green-500 rounded" /> */}
              {/* <div className="h-2 w-1/2 bg-[#A855F7] rounded" /> */}
              <div className="h-2 w-1/2 bg-blue-500 rounded" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              AI credits left
            </CardTitle>
            <span className="text-xs font-medium text-yellow-500 bg-yellow-50 px-2 py-1 rounded">
              Needs Response
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">320</div>
            <div className="mt-4 h-2 w-full bg-gray-100 rounded">
              {/* <div className="h-2 w-4/5 bg-yellow-500 rounded" /> */}
              {/* <div className="h-2 w-2/3 bg-[#A855F7] rounded"></div> */}
              <div className="h-2 w-2/3 bg-yellow-500 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {POSTS.map((post) => (
                <div key={post.id} className="flex items-center space-x-4">
                  {/* <div className="w-[100px] h-[100px] bg-gray-200 rounded" /> */}
                  <Avatar className="w-14 h-14 rounded-full">
                    <AvatarImage
                      src={post.posts[0].url}
                      className="object-cover w-full h-full rounded-full"
                    />
                    <AvatarFallback>{post.name}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h3 className="font-medium">{post.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(post.scheduledFor).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push(`/post/scheduled/${post.id}`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center bg-gray-50 rounded">
              Performance Chart
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm">
                  New comment on your post "Launch Update"
                </p>
                <p className="text-xs text-muted-foreground">5 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm">Post scheduled "Weekly Newsletter"</p>
                <p className="text-xs text-muted-foreground">1 hour ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
