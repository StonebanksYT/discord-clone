"use client";
import axios from "axios";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import qs from "query-string";

export const DeleteChannelModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const isModalOpen = isOpen && type === "deleteChannel";
  const { server, channel } = data;
  const [checked, setChecked] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    try {
      setIsLoading(true);
      const url = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}`,
        query: { serverId: server?.id },
      });
      await axios.delete(url);
      onClose();
      router.refresh();
      router.push(`/servers/${server?.id}`);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-[#313338] max-w-lg text-black dark:text-white p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-red-500 text-center font-bold">
            Delete Channel
          </DialogTitle>
          <DialogDescription className="items-center dark:text-neutral-100">
            Are you sure you want to delete{" "}
            <span className="text-indigo-500 font-semibold">
              #{channel?.name}
            </span>{" "}
            ? <br />
            <span>This action cannot be undone.</span>
          </DialogDescription>
          <div className="flex items-center space-x-2 my-8 ">
            <Checkbox
              id="terms"
              onCheckedChange={() => {
                console.log(checked);
                setChecked(!checked);
              }}
              className="text-center "
            />
            <label htmlFor="terms" className="text-sm font-medium ">
              I understand the consequences
            </label>
          </div>
        </DialogHeader>
        <DialogFooter className="flex dark:bg-[#2b2d31] justify-end space-x-4 p-6">
          <div className="flex items-center w-full justify-end">
            <Button
              disabled={isLoading}
              onClick={onClose}
              variant={"link"}
              className="focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              Cancel
            </Button>
            <Button
              disabled={isLoading || checked === false}
              variant={"destructive"}
              onClick={handleClick}
            >
              Delete Channel
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
