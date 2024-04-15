import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";
import { ChannelType, MemberRole } from "@prisma/client";
import { Crown, Hash, ShieldCheck, User, Video, Volume2 } from "lucide-react";
import { CurrentProfile } from "@/lib/current-profile";
import { ChatHeader } from "../chat/chat-header";
import { ConversationSearch } from "./conversation-search";

const iconMap = {
  friend: <User className="mr-2 h-4 w-4" />,
  server: <Hash className="mr-2 h-4 w-4" />,
};

const ConversationTopbar = async () => {
  const currentprofile = await CurrentProfile();
  if (!currentprofile) {
    return redirect("/");
  }

  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: currentprofile.id,
        },
      },
    },
  });
  const sentRequests = await db.friend.findMany({
    where: { profileId: currentprofile.id, status: "ACCEPTED" },
    include: { friend: true },
  });

  // Fetch all accepted friendships where the profile is the receiver
  const receivedRequests = await db.friend.findMany({
    where: { friendId: currentprofile.id, status: "ACCEPTED" },
    include: { profile: true },
  });

  // Combine the friends from the sent and received requests
  const friends = [
    ...sentRequests.map((request) => request.friend),
    ...receivedRequests.map((request) => request.profile),
  ];
  if (!friends) {
    console.error("Friends not found");
  }

  if (!servers) {
    return redirect("/");
  }
  return (
    <div className="flex flex-row w-full h-full">
      <div className="w-full h-full flex flex-row p-2 pr-[10px] ">
        <ConversationSearch
          userid={currentprofile.id}
          data={[
            {
              label: "Friends",
              type: "friend",
              data: friends?.map((friend) => ({
                id: friend.id,
                name: friend.name,
                icon: iconMap["friend"],
              })),
            },
            {
              label: "Servers",
              type: "server",
              data: servers?.map((server) => ({
                id: server.id,
                name: server.name,
                icon: iconMap["server"],
              })),
            },
          ]}
        />
      </div>
    </div>
  );
};

export default ConversationTopbar;
