import MemberSidebar from "@/components/server/server-member-sidebar";
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
  });
  if (!server) {
    return redirect("/");
  }

  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <ServerSidebar serverId={params.serverId} />
      </div>
      <div className="hidden md:flex h-12 w-full z-10 pl-[312px] flex-col fixed right-0 inset-y-0 ">
        <ServerTopbar serverId={params.serverId} />
      </div>
      <main className="h-full md:pl-60 mt-[50px]">{children}</main>
      <div className="hidden md:flex h-full w-60 z-20 flex-col fixed right-0  top-12 inset-y-0">
        <MemberSidebar serverId={params.serverId} />
      </div>
    </div>
  );
};

export default ServerIdLayout;
