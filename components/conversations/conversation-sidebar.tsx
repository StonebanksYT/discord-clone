import React from "react";
import { db } from "@/lib/db";
import { CurrentProfile } from "@/lib/current-profile";
import { redirect } from "next/navigation";
import { ScrollArea } from "../ui/scroll-area";
import { ActionTooltip } from "../action-tooltip";
import { Plus } from "lucide-react";
import { ConversationSection } from "./conversation-section";
import { ConversationItem } from "./conversation-item";

export const ConversationSidebar = async () => {
  const profile = await CurrentProfile();
  if (!profile) {
    return redirect("/");
  }

  // NOT CONVERSATION BUT DIRECT MESSAGE NEW ROUTE AFTER SOCKETIO
  const conversations = await db.conversation.findMany({
    where: {
      OR: [
        {
          memberOne: {
            profileId: profile.id,
          },
        },
        {
          memberTwo: {
            profileId: profile.id,
          },
        },
      ],
    },
    include: {
      memberOne: {
        include: {
          profile: true,
        },
      },
      memberTwo: {
        include: {
          profile: true,
        },
      },
    },
  });
  console.log(conversations);
  return (
    <div className="flex flex-col h-full p-2 text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ConversationSection label="Direct Messages" />
      <ScrollArea>
        {conversations.map((conversation) => {
          const otherMember =
            conversation.memberOne.profileId === profile.id
              ? conversation.memberTwo
              : conversation.memberOne;
          return (
            <ConversationItem
              key={conversation.id}
              id={otherMember.id}
              imageUrl={otherMember.profile.imageUrl}
              name={otherMember.profile.name}
              member={otherMember}
            />
          );
        })}
      </ScrollArea>
    </div>
  );
};
