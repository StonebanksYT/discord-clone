"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/use-modal-store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useOrigin } from "@/hooks/use-origin";
import { Separator } from "../ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { cn } from "@/lib/utils";
import axios from "axios";

export const InviteModal = () => {
  const friends = [
    {
      id: "1",
      name: "John Doe",
      pfp: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
      id: "2",
      name: "Jane Doe",
      pfp: "https://randomuser.me/api/portraits/women/1.jpg",
    },
    {
      id: "3",
      name: "John Smith",
      pfp: "https://randomuser.me/api/portraits/men/2.jpg",
    },
    {
      id: "4",
      name: "Jane Smith",
      pfp: "https://randomuser.me/api/portraits/women/2.jpg",
    },
    {
      id: "5",
      name: "Alice Johnson",
      pfp: "https://randomuser.me/api/portraits/women/3.jpg",
    },
    {
      id: "6",
      name: "Bob Johnson",
      pfp: "https://randomuser.me/api/portraits/men/3.jpg",
    },
    {
      id: "7",
      name: "Charlie Brown",
      pfp: "https://randomuser.me/api/portraits/men/4.jpg",
    },
    {
      id: "8",
      name: "Diana Brown",
      pfp: "https://randomuser.me/api/portraits/women/4.jpg",
    },
  ];
  const { isOpen, onOpen, onClose, type, data } = useModal();
  const origin = useOrigin();

  const isModalOpen = isOpen && type === "invite";
  const { server } = data;
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;
  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  const onNew = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(
        `/api/servers/${server?.id}/invite-code`
      );

      onOpen("invite", { server: response.data });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const [inputValue, setValue] = useState("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setValue(inputValue);
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="dark:bg-[#313338] max-w-lg bg-white p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Invite Friends
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <Label className="uppercase text-xs font-bold">
            Invite friends to {server?.name}
          </Label>
          <div className="flex items-center w-full  justify-between ">
            <Input
              className="bg-white dark:bg-[#1e1f22] border-0 focus-visible:ring-0 dark:text-white  focus-visible:ring-offset-0 mt-2"
              placeholder="Search for friends"
              onChange={handleChange}
            />
            <Search className="absolute right-8 w-6 h-6 text-[#838992] mt-2" />
          </div>
          <Separator className="mt-4 w-full" />
          <ScrollArea className="h-[170px] w-full">
            {friends.map((friend) => (
              <div key={friend.id} className="flex flex-col gap-y-2 mt-4">
                <div className="flex items-center gap-x-2">
                  <div className="w-10 h-10 bg-gray-500 rounded-full">
                    <img
                      src={friend.pfp}
                      alt={friend.name}
                      className="w-10 h-10 rounded-full"
                    />
                  </div>
                  <div>
                    <div className="text-black dark:text-white text-sm">
                      {friend.name}{" "}
                    </div>
                  </div>
                  <Button
                    variant={"outline"}
                    className="ml-auto mr-4 bg-transparent outline outline-1 outline-emerald-500 hover:bg-emerald-700"
                  >
                    Invite
                  </Button>
                </div>
              </div>
            ))}
          </ScrollArea>
          <div className="flex items-center mt-2 gap-x-2">
            <Input
              disabled={isLoading}
              className="bg-zinc-300/50 dark:bg-[#1e1f22] border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0"
              value={inviteUrl}
            />
            <Button
              disabled={isLoading}
              onClick={onCopy}
              className={cn(
                "bg-indigo-500 text-white hover:bg-indigo-700",
                copied && "bg-green-500 hover:bg-green-700"
              )}
            >
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
          <Button
            onClick={onNew}
            disabled={isLoading}
            variant={"link"}
            size={"sm"}
            className="text-xs text-indigo-500  mt-4"
          >
            Generate a new link
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
