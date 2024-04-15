import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { MediaRoom } from "@/components/media-room";
import { CurrentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { ChannelType, Profile } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";
import MemberSidebar from "@/components/server/server-member-sidebar";

interface ChannelIdPageProps {
  params: {
    serverId: string;
    channelId: string;
  };
}

const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
  // const apiKey = process.env.LIVEKIT_API_KEY;
  // const secret = process.env.LIVEKIT_API_SECRET;
  // const livekitHost = "https://my.livekit.host";
  // const roomService = new RoomServiceClient(livekitHost, apiKey, secret);

  const profile = await CurrentProfile();
  if (!profile) {
    return redirectToSignIn();
  }
  const channel = await db.channel.findUnique({
    where: {
      id: params.channelId,
    },
  });
  const member = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
  });
  if (!channel || !member) {
    return redirect("/");
  }

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full w-full">
      <div className="fixed top-0 w-full">
        <ChatHeader
          name={channel.name}
          type="channel"
          serverId={channel.serverId}
        />
      </div>
      {channel.type === ChannelType.TEXT && (
        <>
          <ChatMessages
            member={member}
            name={channel.name}
            chatId={channel.id}
            type="channel"
            apiUrl="/api/messages"
            socketUrl="/api/socket/messages"
            socketQuery={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
            paramKey="channelId"
            paramValue={channel.id}
          />
          <ChatInput
            name={channel.name}
            type="channel"
            apiUrl="/api/socket/messages"
            query={{ channelId: channel.id, serverId: channel.serverId }}
          />
          <div className="hidden md:flex h-full md:w-44 lg:w-60 xl:w-60 z-20 flex-col fixed right-0  top-12 inset-y-0">
            <MemberSidebar serverId={params.serverId} />
          </div>
        </>
      )}
      {channel.type === ChannelType.VOICE && (
        <div className="h-full w-full lg:w-[60vw] xl:w-[78vw] 2xl:w-[82vw]">
          <MediaRoom chatId={channel.id} video={false} voice={true} />
        </div>
      )}
      {channel.type === ChannelType.VIDEO && (
        <MediaRoom chatId={channel.id} video={true} voice={false} />
      )}
    </div>
  );
};

export default ChannelIdPage;
