"use client";

import { MemberRole, Profile, Server } from "@prisma/client";
import { Crown, ShieldCheck, User } from "lucide-react";
import React, { useState } from "react";
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
import { ActionTooltip } from "../action-tooltip";
import { useModal } from "@/hooks/use-modal-store";
import { useRouter } from "next/navigation";

interface ServerMemberProps {
  server: ServerWithMembersWithProfiles;
  index: number;
  profile: Profile;
}

const roleIconMap = {
  [MemberRole.ADMIN]: <Crown className="h-4 w-4 ml-2 text-rose-500" />,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />
  ),
  [MemberRole.GUEST]: <User className="h-5 w-5 ml-2 text-gray-500" />,
};

export const ServerMember = ({ server, index, profile }: ServerMemberProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { onOpen } = useModal();
  const member = server.members[index];
  const icon = roleIconMap[member.role];
  const router = useRouter();
  let value = "";
  return (
    <div>
      <DropdownMenu open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
        <DropdownMenuTrigger className="focus:outline-none" asChild>
          <div className="flex items-center gap-x-2  p-3 hover:dark:bg-[#36373d] cursor-pointer">
            <UserAvatar src={member.profile.imageUrl} />
            <div className=" font-semibold flex flex-row items-center  ">
              <p className="text-xs truncate text-ellipsis ">
                {member.profile.name.replace(/null/g, "")}
              </p>
              <ActionTooltip label={member.role}>{icon}</ActionTooltip>
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="left"
          className="w-96 h-full text-xs font-medium bg-[#ebedef] text-black dark:text-neutral-400 space-y-[2px]
            dark:bg-[#232428]
            "
        >
          <div
            onClick={() => {
              onOpen("viewProfile", { member, profile, server });
              setIsOpen(false);
            }}
            className=" group h-24 w-24 rounded-full mx-4 "
          >
            <p className="hidden group-hover:block absolute my-10 ml-2 z-10 font-semibold uppercase text-[12px] text-white cursor-pointer">
              View Profile
            </p>
            <img
              className="h-24 w-24 rounded-full  mt-4 group-hover:opacity-40 hover:cursor-pointer"
              src={member.profile.imageUrl}
              alt="user"
            />
          </div>
          <div className="p-4 h-full w-full">
            <div className=" dark:text-white text-xl p-4 bg-white dark:bg-[#111214] font-bold text-black rounded-xl over">
              {member.profile.name.replace(/null/g, "")}
              <Separator />
              <Label className="uppercase font-bold text-xs mt-2">
                About Me
              </Label>
              <p className="text-xs dark:text-gray-300 text-black">
                {member.profile.about}
              </p>
              <div className="mt-2">
                <Label className="uppercase font-semibold text-xs">
                  Member Since
                </Label>
                <p className="text-xs dark:text-gray-300 text-black">
                  {new Date(member.createdAt).toDateString()}
                </p>
              </div>
              <div className="mt-2">
                <Label className="uppercase font-bold text-xs ">Roles</Label>
                <p className="text-xs dark:text-gray-300 text-black">
                  <div className="flex items-center">
                    {member.role} {icon}
                  </div>
                </p>
              </div>

              {member.profile.id !== profile.id && (
                <div className="mt-12">
                  <Input
                    onChange={(evt) => {
                      value = evt.target.value;
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        // open conversation and send message with value as the text
                        // router.push(`/conversations/${member.id}`); DIRECT MESSAGE
                      }
                    }}
                    className="
                  dark:bg-[#111214] text-white border dark:border-white border-black focus-visible:ring-0 focus-visible:ring-offset-0"
                    placeholder={`Message @${member.profile.name.replace(/null/g, "")}`}
                  />
                </div>
              )}
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
