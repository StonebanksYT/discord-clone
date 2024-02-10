import { ServerWithMembersWithProfiles } from "@/types";
import { MemberRole } from "@prisma/client";
import { Crown, Scroll, ShieldCheck, User } from "lucide-react";
import React from "react";

import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ScrollArea } from "../ui/scroll-area";
import { ServerMember } from "./server-member";
import { CurrentProfile } from "@/lib/current-profile";
import { redirectToSignIn } from "@clerk/nextjs";

interface MemberSidebarProps {
  serverId: string;
  role?: MemberRole;
}

const MemberSidebar = async ({ serverId, role }: MemberSidebarProps) => {
  const profile = await CurrentProfile();
  if (!profile) {
    return redirectToSignIn();
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
  if (!server) {
    return redirect("/");
  }
  return (
    <ScrollArea className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <div className="">
        {server.members.map((member, index) => (
          <ServerMember index={index} key={member.id} server={server} profile={profile} />
        ))}
      </div>
    </ScrollArea>
  );
};

export default MemberSidebar;
