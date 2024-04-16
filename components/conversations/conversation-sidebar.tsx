import React from "react";
import { db } from "@/lib/db";
import { CurrentProfile } from "@/lib/current-profile";
import { redirect } from "next/navigation";
import { ScrollArea } from "../ui/scroll-area";
import { ConversationSection } from "./conversation-section";
import { ConversationItem } from "./conversation-item";
import ConversationTopbar from "./conversation-topbar";

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
            id: profile.id,
          },
        },
        {
          memberTwo: {
            id: profile.id,
          },
        },
      ],
    },
    include: {
      memberOne: true,
      memberTwo: true,
    },
  });
  // console.log(conversations);
  if (!conversations) {
    console.log("Conversations not found");
  }
  return (
    <div className="flex flex-col h-full px-2 text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <div className="h-12 w-full z-10">
        <ConversationTopbar />
      </div>
      <ConversationSection label="Direct Messages" />
      <ScrollArea>
        {conversations.map((conversation) => {
          const otherMember =
            conversation.memberOne.id === profile.id
              ? conversation.memberTwo
              : conversation.memberOne;
          return (
            <ConversationItem
              key={conversation.id}
              id={otherMember.id}
              imageUrl={otherMember.imageUrl}
              name={otherMember.name}
              member={otherMember}
            />
          );
        })}
      </ScrollArea>
    </div>
  );
};
