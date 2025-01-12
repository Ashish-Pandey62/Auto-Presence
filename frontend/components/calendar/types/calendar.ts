import { Post } from "@/app/calendar/posts";

export interface CalendarDay {
  date: number;
  posts: Post[];
  isToday?: boolean;
  isSelected?: boolean;
}

export interface CalendarViewProps {
  year: number;
  month: number;
  posts: Post[];
  selectedDate?: number;
  onSelectDate: (date: number) => void;
}
