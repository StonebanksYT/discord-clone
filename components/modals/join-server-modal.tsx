"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import { redirect, useRouter } from "next/navigation";
import { Server } from "@prisma/client";
import Image from "next/image";

interface JoinServerModalProps {
  server: Server;
}

export const JoinServerModal = ({ server }: JoinServerModalProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setIsMounted(true);
  }, []);

  //   const { server } = data;
  const [isLoading, setIsLoading] = useState(false);

  const onNew = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(
        `/api/servers/${server?.id}/join-invite`
      );
      router.push(`/servers/${response.data.id}`);
    } catch (error) {
      console.log(error);
      return redirect("/");
    } finally {
      setIsLoading(false);
    }
  };
  if (!isMounted) return null;
  const handleClose = () => {
    router.push("/");
  };

  return (
    <Dialog open onOpenChange={handleClose}>
      <DialogContent className="bg-[#313338] max-w-lg  p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            You have been invited to join server {server?.name}
          </DialogTitle>
        </DialogHeader>
        <div className="flex w-full  justify-center">
          <Image
            src={server?.imageUrl}
            alt={server?.name}
            width={100}
            height={100}
            className="rounded-full"
          />
        </div>
        <div className="p-6 w-full flex">
          <Button
            onClick={onNew}
            disabled={isLoading}
            size={"sm"}
            className="ml-auto text-xs text-indigo-500  mt-4"
          >
            Join Server
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
