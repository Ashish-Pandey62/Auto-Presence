import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";
import { Post } from "@/app/calendar/posts";

interface CalendarCellProps {
  date: number;
  posts: Post[];
  isSelected?: boolean;
  isToday?: boolean;
  onClick: () => void;
}

export function CalendarCell({
  date,
  posts,
  isSelected,
  isToday,
  onClick,
}: CalendarCellProps) {
  const router = useRouter();
  const getPostTypeColor = (type?: string) => {
    switch (type) {
      case "product":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "holiday":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-green-100 text-green-700 border-green-200";
    }
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "min-h-[120px] w-full p-2 text-left hover:bg-accent/50 relative group",
        isSelected && "ring-2 ring-primary",
        isToday && "bg-accent/20"
      )}
    >
      <span className={cn("text-sm font-medium", isToday && "text-primary")}>
        {date}
      </span>

      <div className="mt-1 space-y-1">
        {posts.slice(0, 3).map((post) => (
          <TooltipProvider key={post.name}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    "text-xs rounded-md p-1.5 border truncate",
                    "bg-purple-100 text-purple-700 border-purple-200"
                  )}
                  onClick={() => {
                    router.push(`/post/scheduled/${post.id}`);
                  }}
                >
                  {post.name}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-sm">
                  <p className="font-medium">{post.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(post.scheduledFor).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
        {posts.length > 3 && (
          <div className="text-xs text-muted-foreground px-1.5">
            +{posts.length - 3} more
          </div>
        )}
      </div>

      {posts.length > 0 && (
        <div className="absolute bottom-1 right-1 text-xs px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
          {posts.length}
        </div>
      )}
    </button>
  );
}
