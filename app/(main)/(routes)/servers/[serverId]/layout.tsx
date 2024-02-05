import MemberSidebar from "@/components/server/member-sidebar";
import { ServerSidebar } from "@/components/server/server-sidebar";
import ServerTopbar from "@/components/server/server-topbar";
import { CurrentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

const ServerIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { serverId: string };
}) => {
  const profile = await CurrentProfile();
  if (!profile) {
    return redirectToSignIn();
  }
  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
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
    <div className="h-full">
      <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <ServerSidebar serverId={params.serverId} />
      </div>
      <div className="hidden md:flex h-12 w-full z-30 flex-col fixed left-[312px] inset-y-0 border-b">
        <ServerTopbar />
      </div>
      <main className="h-full md:pl-60 mt-[50px]">{children}</main>
      <div className="hidden md:flex h-full w-60 z-20 flex-col right-0 fixed top-12 inset-y-0">
        <MemberSidebar server={server} />
      </div>
    </div>
  );
};

export default ServerIdLayout;
