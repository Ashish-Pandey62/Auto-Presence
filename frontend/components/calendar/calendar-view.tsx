"use client";

import { CalendarCell } from "./calendar-cell";
import { CalendarDay, CalendarViewProps } from "./types/calendar";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function CalendarView({
  year,
  month,
  posts,
  selectedDate,
  onSelectDate,
}: CalendarViewProps) {
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const days: CalendarDay[] = Array.from({ length: daysInMonth }, (_, i) => {
    const date = i + 1;
    const currentDate = new Date(year, month, date);

    return {
      date,
      posts: posts.filter((post) => {
        const postDate = new Date(post.scheduledFor);
        return (
          postDate.getFullYear() === year &&
          postDate.getMonth() === month &&
          postDate.getDate() === date
        );
      }),
      isToday:
        today.getFullYear() === year &&
        today.getMonth() === month &&
        today.getDate() === date,
      isSelected: selectedDate === date,
    };
  });

  return (
    <div className="rounded-lg border bg-card">
      <div className="grid grid-cols-7 divide-x divide-y">
        {DAYS_OF_WEEK.map((day) => (
          <div
            key={day}
            className="p-3 text-center text-sm font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}

        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="p-3" />
        ))}

        {days.map((day) => (
          <CalendarCell
            key={day.date}
            date={day.date}
            posts={day.posts}
            isSelected={day.isSelected}
            isToday={day.isToday}
            onClick={() => onSelectDate(day.date)}
          />
        ))}
      </div>
    </div>
  );
}
