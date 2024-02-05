import { ServerWithMembersWithProfiles } from "@/types";
import { MemberRole } from "@prisma/client";
import { Crown, ShieldCheck, User } from "lucide-react";
import React from "react";
import { UserAvatar } from "@/components/user-avatar";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

interface MemberSidebarProps {
  server: ServerWithMembersWithProfiles;
  role?: MemberRole;
}

const roleIconMap = {
  ADMIN: <Crown className="h-4 w-4 ml-2 text-rose-500" />,
  MODERATOR: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
  GUEST: <User className="h-5 w-5 ml-2 text-gray-500" />,
};
const MemberSidebar = ({ server, role }: MemberSidebarProps) => {
  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      {server.members.map((member) => (
        <DropdownMenu key={member.id}>
          <DropdownMenuTrigger className="focus:outline-none" asChild>
            <div
              key={member.id}
              className="flex items-center gap-x-2  p-3 hover:dark:bg-[#36373d] cursor-pointer"
            >
              <UserAvatar src={member.profile.imageUrl} />
              <div className="text-xs font-semibold flex items-center">
                {member.profile.name}
                {roleIconMap[member.role]}
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="left"
            className="w-96 h-full text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]
            dark:bg-[#232428]
            "
          >
            <div className="h-full w-full  ">
              <img
                className="h-24 w-24 rounded-full mx-4 mt-4"
                src={member.profile.imageUrl}
                alt="user"
              />
            </div>
            <div className="p-4 h-full w-full">
              <div className=" dark:text-white text-xl p-4 dark:bg-[#111214] font-bold text-black rounded-xl">
                {member.profile.name}
                <Separator />
                <div>
                  <Label className="uppercase font-semibold text-xs ">
                    Member Since
                  </Label>
                  <p className="text-xs dark:text-gray-500 text-black">
                    {new Date(member.createdAt).toDateString()}
                  </p>
                </div>
                <div className="mt-2">
                  <Label className="uppercase font-bold text-xs ">Roles</Label>
                  <p className="text-xs dark:text-gray-500 text-black">
                    <div className="flex items-center">
                      {member.role} {roleIconMap[member.role]}
                    </div>
                  </p>
                </div>
                <div className="mt-12">
                  <Input
                    className="
                    dark:bg-[#111214] text-white border dark:border-white border-black focus-visible:ring-0 focus-visible:ring-offset-0"
                    placeholder={`Message @${member.profile.name}`}
                  />
                </div>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      ))}
    </div>
  );
};

export default MemberSidebar;
