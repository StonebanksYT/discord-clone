"use client";

import { cn } from "@/lib/utils";
import { Member } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";

interface ConversationItemProps {
  id: string;
  imageUrl: string;
  name: string;
  member: Member;
}

export const ConversationItem = ({
  id,
  imageUrl,
  name,
}: ConversationItemProps) => {
  const params = useParams();
  const router = useRouter();
  const onClick = () => {
    router.push(`/conversations/${id}`);
  };
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center p-2 rounded-md cursor-pointer hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition",
        params?.memberId === id && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
    >
      <img src={imageUrl} alt={name} className="w-10 h-10 rounded-full" />
      <div className="ml-3">
        <p className="text-sm font-semibold dark:text-white">{name}</p>
      </div>
    </div>
  );
};
