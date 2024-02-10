"use client";
import { useModal } from "@/hooks/use-modal-store";
import { UserAvatar } from "../user-avatar";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { redirectToSignIn } from "@clerk/nextjs";
import { Pencil } from "lucide-react";
import { ActionTooltip } from "../action-tooltip";
import { Button } from "../ui/button";
import { redirect, useRouter } from "next/navigation";

export const ViewProfile = () => {
  const { data, isOpen, onClose } = useModal();
  const router = useRouter();
  const { member, profile, server } = data;
  if (!member) {
    return null;
  }
  if (!profile) {
    return redirectToSignIn();
  }
  if (!server) {
    return redirect("/");
  }
  const onClick = () => {
    router.push(`/conversations/${member.id}`);
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="dark:bg-[#232428] max-w-xl bg-white overflow-hidden focus-visible:ring-0 focus-visible:ring-offset-0">
        {member.profile.id === profile.id && (
          <div className="right-0 p-4 mr-8 absolute">
            <ActionTooltip label="Edit Profile" side="left">
              <button
                onClick={onClose}
                className="text-xs bg-gray-300/20 items-center hover:bg-zinc-700 focus:ring-0 focus:ring-offset-0 outline-none    rounded-full h-8 w-8 justify-center font-semibold uppercase text-primary"
              >
                <Pencil className="h-6 w-6 items ml-1 opacity-100 " />
              </button>
            </ActionTooltip>
          </div>
        )}
        <div className="flex">
          <img
            className="h-32 w-32 rounded-full"
            src={member.profile.imageUrl}
          />
          {member.profile.id !== profile.id && (
            <Button
              onClick={() => {
                onClick();
                onClose();
              }}
              className="absolute right-0 m-8 bg-indigo-500 text-white hover:bg-indigo-700 focus-visible:ring-0 focus-visible:ring-offset-0 outline-none "
            >
              Message
            </Button>
          )}
        </div>

        <div className=" h-full w-full">
          <div className=" dark:text-white text-xl p-4 bg-white dark:bg-[#111214] font-bold text-black rounded-xl">
            {member?.profile.name}
            <Separator className="mt-2" />
            <div className="flex flex-col mt-2 gap-y-1">
              <Label className="uppercase font-bold text-xs mt-2">
                About Me
              </Label>
              <p className="text-xs dark:text-gray-300 text-black">
                {member.profile.about}
              </p>
              <Label className="uppercase font-semibold text-xs mt-2 ">
                Discord Member Since
              </Label>
              <p className="text-xs dark:text-gray-500 text-black">
                {new Date(member.profile.createdAt).toDateString()}
              </p>
            </div>
            <div className="mt-2">
              <p className="text-xs dark:text-gray-500 text-black"></p>
            </div>
            <div className="mt-12"></div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
