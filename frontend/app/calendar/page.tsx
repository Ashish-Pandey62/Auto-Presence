"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarView } from "@/components/calendar/calendar-view";
import { UpcomingPosts } from "@/components/calendar/upcoming-posts";
import SchedulePostDialog from "@/components/dialogs/schedule-post-dialog";
import { API_URL } from "@/constants/constants";
import { Post, POSTS } from "./posts";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function ContentCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number>();
  const [posts, setPosts] = useState(POSTS);
  const [postFrequency, setPostFrequency] = useState("every-week");

  // useEffect(() => {
  //   async function getPosts() {
  //     const response = await fetch(`${API_URL}/populate-posts`, {
  //       cache: "no-store",
  //     });
  //     const data = await response.json();
  //     console.log(data);
  //   }

  //   getPosts();
  // }, []);

  const onPostAdd = (post: Post) => {
    setPosts([...posts, post]);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  };

  const handleDeletePost = (name: string) => {
    setPosts(posts.filter((post) => post.name !== name));
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Content Calendar</h1>
          <p className="text-muted-foreground">
            Plan and schedule your social media content
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={postFrequency} onValueChange={setPostFrequency}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Post frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="every-day">Every day</SelectItem>
              <SelectItem value="every-3-days">Every 3 days</SelectItem>
              <SelectItem value="every-week">Every week</SelectItem>
            </SelectContent>
          </Select>
          <SchedulePostDialog onPostAdd={onPostAdd} />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={handlePrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold">
            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <Button variant="ghost" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <CalendarView
        year={currentDate.getFullYear()}
        month={currentDate.getMonth()}
        posts={posts}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />

      <UpcomingPosts
        posts={posts}
        onEdit={(post) => console.log("Edit post:", post)}
        onDelete={handleDeletePost}
      />
    </div>
  );
}
