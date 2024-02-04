import { JoinServerModal } from "@/components/modals/join-server-modal";
import { useModal } from "@/hooks/use-modal-store";
import { CurrentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import axios from "axios";
import { redirect } from "next/navigation";
import React from "react";

interface InvitePageProps {
  params: {
    inviteCode: string;
  };
}

const InvitePage = async ({ params }: InvitePageProps) => {
  const profile = await CurrentProfile();
  if (!profile) {
    return redirectToSignIn();
  }
  if (!params.inviteCode) {
    return redirect("/");
  }
  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });
  if (existingServer) {
    return redirect(`/servers/${existingServer.id}`);
  }
  const server = await db.server.findUnique({
    where: {
      inviteCode: params.inviteCode,
    },
  });
  // const {onOpen} = useModal();

  // if(server){
  //   return redirect(`/servers/${server.id}`)
  // }

  return <JoinServerModal server={server!} />;
};

export default InvitePage;
