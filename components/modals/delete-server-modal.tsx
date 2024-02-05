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
import { Checkbox } from "../ui/checkbox";

export const DeleteServerModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const isModalOpen = isOpen && type === "deleteServer";
  const { server } = data;
  const [checked, setChecked] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/servers/${server?.id}`);
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
          <DialogTitle className="text-2xl text-red-500 text-center font-bold">
            Delete {server?.name}
          </DialogTitle>
          <DialogDescription className="text-center dark:text-neutral-100">
            Are you sure you want to delete this server? <br />{" "}
            <span>{server?.name}</span> will be permanently deleted!
          </DialogDescription>
          <div className="flex items-center space-x-2 my-4 ">
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
              Delete Server
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
