import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";
import { ServerSearch } from "./server-search";
import { ChannelType, MemberRole } from "@prisma/client";
import { Crown, Hash, ShieldCheck, User, Video, Volume2 } from "lucide-react";
import { CurrentProfile } from "@/lib/current-profile";
import { ChatHeader } from "../chat/chat-header";

interface ServerTopbarProps {
  serverId: string;
}

const iconMap = {
  [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [ChannelType.VOICE]: <Volume2 className="mr-2 h-4 w-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
};

const roleIconMap = {
  [MemberRole.GUEST]: <User className="h-5 w-5 mr-2 text-gray-500" />,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="h-5 w-5 mr-2 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <Crown className="h-5 w-5 mr-2 text-rose-500" />,
};

const ServerTopbar = async ({ serverId }: ServerTopbarProps) => {
  const profile = await CurrentProfile();
  if (!profile) {
    return redirect("/");
  }
  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });
  const textChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  );
  const voiceChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.VOICE
  );
  const videoChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );

  const members = server?.members;

  if (!server) {
    return redirect("/");
  }
  return (
    <div className="flex flex-row w-full h-full">
      <div className="w-full h-full flex flex-row-reverse p-2 pr-[10px] ">
        <ServerSearch
          userid={profile.id}
          data={[
            {
              label: "Text Channels",
              type: "channel",
              data: textChannels?.map((channel) => ({
                id: channel.id,
                name: channel.name,
                icon: iconMap[channel.type],
              })),
            },
            {
              label: "Voice Channels",
              type: "channel",
              data: voiceChannels?.map((channel) => ({
                id: channel.id,
                name: channel.name,
                icon: iconMap[channel.type],
              })),
            },
            {
              label: "Video Channels",
              type: "channel",
              data: videoChannels?.map((channel) => ({
                id: channel.id,
                name: channel.name,
                icon: iconMap[channel.type],
              })),
            },
            {
              label: "Members",
              type: "member",
              data: members?.map((member) => ({
                id: member.profile.id,
                name:
                  member.profile.id === profile.id
                    ? `${member.profile.name} (You)`
                    : member.profile.name,
                icon: roleIconMap[member.role],
              })),
            },
          ]}
        />
      </div>
    </div>
  );
};

export default ServerTopbar;
