"use client";

import { CreateInstantAIPostForm } from "@/components/posts/create-instant-ai-post-form";
import { CreateInstantPostForm } from "@/components/posts/create-instant-post-form";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

export default function InstantPostPage() {
  const [isAIMode, setIsAIMode] = useState(false);

  return (
    <main className="flex-1 overflow-y-auto py-10">
      <div className="mx-auto max-w-2xl px-4">
        <div className="container mx-auto px-4 max-w-2xl">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">
            Create Instant Post
          </h1>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <CardTitle>Create New Post</CardTitle>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="ai-mode" className="text-sm text-gray-600">
                    AI Mode
                  </Label>
                  {/* <Switch
                    id="ai-mode"
                    checked={isAIMode}
                    onCheckedChange={setIsAIMode}
                  /> */}
                  <Switch
                    id="ai-mode"
                    checked={isAIMode}
                    onCheckedChange={setIsAIMode}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
              </div>
            </CardHeader>
            {isAIMode ? <CreateInstantAIPostForm /> : <CreateInstantPostForm />}
          </Card>
        </div>
      </div>
    </main>
  );
}
