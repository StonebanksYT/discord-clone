"use client";

import { MemberRole, Server } from "@prisma/client";
import { Crown, ShieldCheck, User } from "lucide-react";
import React from "react";
import { UserAvatar } from "@/components/user-avatar";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ServerWithMembersWithProfiles } from "@/types";

interface ServerMemberProps {
  server: ServerWithMembersWithProfiles;
  index: number;
}

const roleIconMap = {
  [MemberRole.ADMIN]: <Crown className="h-4 w-4 ml-2 text-rose-500" />,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />
  ),
  [MemberRole.GUEST]: <User className="h-5 w-5 ml-2 text-gray-500" />,
};

export const ServerMember = ({ server, index }: ServerMemberProps) => {
  const member = server.members[index];
  const icon = roleIconMap[member.role];
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none" asChild>
          <div className="flex items-center gap-x-2  p-3 hover:dark:bg-[#36373d] cursor-pointer">
            <UserAvatar src={member.profile.imageUrl} />
            <div className="text-xs font-semibold flex items-center">
              {member.profile.name}
              {icon}
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="left"
          className="w-96 h-full text-xs font-medium bg-[#ebedef] text-black dark:text-neutral-400 space-y-[2px]
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
            <div className=" dark:text-white text-xl p-4 bg-white dark:bg-[#111214] font-bold text-black rounded-xl">
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
                    {member.role} {icon}
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
    </div>
  );
};
