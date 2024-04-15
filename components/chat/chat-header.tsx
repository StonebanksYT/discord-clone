import { MobileToggle } from "@/components/mobile-toggle";
import { Hash, Menu } from "lucide-react";
import { UserAvatar } from "@/components/user-avatar";
import { SocketIndicator } from "@/components/socket-indicator";
import { ChatVideoButton } from "./chat-video-button";
import { ConversationMobileToggle } from "@/components/conversation-mobile-toggle";

interface ChatHeaderProps {
  serverId?: string;
  name: string;
  type: "channel" | "conversation";
  imageUrl?: string;
}
export const ChatHeader = ({
  serverId,
  name,
  type,
  imageUrl,
}: ChatHeaderProps) => {
  return (
    <div className="text-md font-semibold px-3 flex items-center h-12 border-b-neutral-200 dark:border-b-neutral-800 border-b-2 ">
      {type === "channel" && <MobileToggle serverId={serverId!} />}
      {type === "conversation" && <ConversationMobileToggle />}

      {type === "channel" && (
        <Hash className="h-5 w-5 mr-2 text-zinc-500 dark:text-zinc-400" />
      )}
      {type === "conversation" && (
        <UserAvatar src={imageUrl} className="h-8 w-8 md:h-8 md:w-8 mr-2" />
      )}
      <p className="font-semibold text-md text-black dark:text-white">
        {name.replace(/null/g, "")}
      </p>

      {type === "conversation" && (
        <div className="flex items-center absolute md:right-[350px] right-0">
          <ChatVideoButton />
          <SocketIndicator />
        </div>
      )}
      {type === "channel" && (
        <div className="ml-auto md:mr-[550px] flex items-center">
          <SocketIndicator />
        </div>
      )}
    </div>
  );
};
