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

export const LeaveServerModal = () => {
  const { isOpen, onClose, type, data } = useModal();

  const [isLoading, setIsLoading] = useState(false);
  const isModalOpen = isOpen && type === "leaveServer";
  const { server } = data;

  const router = useRouter();

  const handleClick = async () => {
    try {
      setIsLoading(true);
      await axios.patch(`/api/servers/${server?.id}/leave-server`);
      onClose();
      router.refresh();
      router.push("/");
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
          <DialogTitle className="text-2xl text-start font-bold">
            Leave {server?.name}
          </DialogTitle>
          <DialogDescription className="text-start dark:text-neutral-100">
            <p>
              Are you sure you want to leave {server?.name}? You won&#39;t be able
              to rejoin unless you are re-invited.
            </p>
          </DialogDescription>
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
              disabled={isLoading}
              variant={"destructive"}
              onClick={handleClick}
            >
              Leave Server
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
