import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface IMessageCardProps {
  imageUrl: string;
  userName: string;
  message: string;
  lastSeen: string;
}

export const MessageCard = () => {
  return (
    <div className="flex items-center p-4 hover:bg-neutral-100 rounded-lg border border-neutral-200/30 cursor-pointer">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="ml-4 flex-1">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-neutral-500">John Doe</h3>
          <span className="text-sm text-neutral-500">5m ago</span>
        </div>
        <p className="text-sm text-neutral-600 ">
          Latest message preview goes here....
        </p>
      </div>
    </div>
  );
};
