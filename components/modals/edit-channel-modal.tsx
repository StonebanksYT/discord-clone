"use client";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";

import { useModal } from "@/hooks/use-modal-store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import qs from "query-string";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Edit, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChannelType } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Channel name is required",
  }),
  type: z.nativeEnum(ChannelType),
});

export const EditChannelModal = () => {
  const { isOpen, onClose, type, data, onOpen } = useModal();
  const isModalOpen = isOpen && type === "editChannel";
  const { server, channel } = data;
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: channel?.type || ChannelType.TEXT,
    },
  });
  useEffect(() => {
    if (channel) {
      form.setValue("name", channel.name);
      form.setValue("type", channel.type);
    }
  }, [channel, form]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    try {
      const url = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}`,
        query: { serverId: server?.id },
      });
      await axios.patch(url, values);
      form.reset();
      router.refresh();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };
  const handleClose = () => {
    setActiveTab(0);
    onClose();
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white dark:bg-[#313338] flex max-w-[50%] h-[700px] text-black dark:text-white p-0 overflow-hidden">
        <div className="hidden lg:flex h-full xl:w-[576px] bg-gray-100 dark:bg-[#2b2d31]  flex-col  inset-y-0 border border-r-4">
          <div className="w-full flex flex-col pr-14 mt-16 h-full font-semibold uppercase items-end">
            {channel?.name}
            <div className="flex flex-col font-normal h-full items-start  mt-4">
              <button
                onClick={() => setActiveTab(0)}
                className={cn(
                  "text-sm font-semibold text-left text-black dark:text-neutral-400 py-2 px-1 mt-1 w-[150px] hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition",

                  activeTab === 0 &&
                    "bg-zinc-300 dark:bg-[#36373d]  dark:text-white"
                )}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab(1)}
                className={cn(
                  "text-sm font-semibold text-left text-black dark:text-neutral-400 py-2 px-1 mt-1 w-[150px] hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition",

                  activeTab === 1 &&
                    "bg-zinc-300 dark:bg-[#36373d]  dark:text-white"
                )}
              >
                <div className="flex w-full justify-between">
                  Permissions
                  <Edit className="h-4 w-4 " />
                </div>
              </button>

              <Separator />
              {channel?.name === "general" ? null : (
                <button
                  onClick={() => {
                    onOpen("deleteChannel", { server, channel });
                    // handleClose();
                  }}
                  className={cn(
                    "text-sm font-semibold text-left text-black justify-between dark:text-neutral-400 py-2 px-1 mt-1 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition",

                    activeTab === 4 &&
                      "bg-zinc-300 dark:bg-[#36373d]  dark:text-white"
                  )}
                >
                  <div className="flex w-full justify-between text-rose-500">
                    Delete Channel
                    <Trash2 className="h-4 w-4 text-rose-500 " />
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center w-full h-full">
          <DialogHeader className="pt-8 px-6">
            <DialogTitle className="text-2xl text-start font-bold">
              {activeTab === 0 && "Overview"}
              {activeTab === 1 && "Permissions"}
            </DialogTitle>
          </DialogHeader>

          {activeTab === 0 && (
            <div className="flex flex-row  justify-center w-full h-full">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8 mt-10 min-w-[300px] w-full max-w-lg"
                >
                  <div className="space-y-8 px-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel
                            htmlFor="name"
                            className="uppercase text-xs font-bold text-zinc-500 dark:text-neutral-100 "
                          >
                            Channel Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              disabled={
                                isLoading || channel?.name === "general"
                              }
                              className="bg-zinc-300/50 dark:bg-[#1e1f22] border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0"
                              placeholder="Enter server name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Channel Type</FormLabel>
                          <Select
                            disabled={isLoading || channel?.name === "general"}
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-zinc-300/50 dark:bg-[#1e1f22] border-0 focus:ring-0 outline-none text-black dark:text-white focus:ring-offset-0">
                                <SelectValue placeholder="Select a Channel Type" />
                              </SelectTrigger>
                            </FormControl>

                            <SelectContent>
                              {Object.values(ChannelType).map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type.toUpperCase()}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <DialogFooter className="bg-gray-100 dark:bg-[#313338] px-6 py-4">
                    <Button
                      disabled={isLoading || channel?.name === "general"}
                      variant={"primary"}
                    >
                      Save
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </div>
          )}
          {activeTab === 1 && (
            <div className="flex flex-row items-center justify-center w-full h-full">
              Permissions
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
