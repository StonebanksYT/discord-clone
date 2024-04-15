"use client";

import { useEffect, useState } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import { RoomServiceClient, Room } from "livekit-server-sdk";
import "@livekit/components-styles";
import { Channel } from "@prisma/client";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

interface MediaRoomProps {
  chatId: string;
  video: boolean;
  voice: boolean;
}

export const MediaRoom = ({ chatId, video, voice }: MediaRoomProps) => {
  const { user } = useUser();
  const [token, setToken] = useState("");
  const livekitHost = "wss://discord-clone-hd57fka7.livekit.cloud";
  const apiKey = process.env.LIVEKIT_API_KEY!;
  const secret = process.env.LIVEKIT_API_SECRET!;
  const roomService = new RoomServiceClient(livekitHost, apiKey, secret);

  useEffect(() => {
    if (!user?.firstName || !user?.lastName) return;

    const name = `${user.firstName} ${user.lastName}`;

    (async () => {
      try {
        const resp = await fetch(
          `/api/livekit?room=${chatId}&username=${name}`
        );
        const data = await resp.json();
        setToken(data.token);
      } catch (error) {
        console.log(error);
      }
    })();
    const fetchParticipants = async () => {
      try {
        const res = await roomService.listParticipants(chatId);
        console.log("room service", res);
      } catch (error) {
        console.log(error);
      }
    };

    fetchParticipants();
  }, [user?.firstName, user?.lastName, chatId]);

  if (!token) {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4 " />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }

  return (
    <LiveKitRoom
      data-lk-theme="default"
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      token={token}
      connect={true}
      video={video}
      audio={voice}
    >
      <VideoConference />
    </LiveKitRoom>
  );
};
