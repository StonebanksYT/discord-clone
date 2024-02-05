"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { ChannelType } from "@prisma/client";
import { Circle, Hash, Video, Volume2 } from "lucide-react";
import qs from "query-string";

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Channel name is required",
    })
    .refine((name) => name !== "general", {
      message: "Channel name cannot be 'general'",
    }),
  type: z.nativeEnum(ChannelType),
});

export const CreateChannelModal = () => {
  const { isOpen, onClose, type } = useModal();
  const isModalOpen = isOpen && type === "createChannel";
  const router = useRouter();
  const params = useParams();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: ChannelType.TEXT,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    try {
      const url = qs.stringifyUrl({
        url: "/api/channels",
        query: { serverId: params?.serverId },
      });

      await axios.post(url, values);
      form.reset();
      router.refresh();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };
  const handleClose = () => {
    form.reset();
    onClose();
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white dark:bg-[#313338] max-w-lg text-black dark:text-white p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Create Channel
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      htmlFor="type"
                      className="uppercase text-xs font-semibold text-zinc-500 dark:text-neutral-100 "
                    >
                      Channel Type
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        defaultValue={field.value}
                        disabled={isLoading}
                        onValueChange={field.onChange}
                      >
                        <FormItem>
                          <div className="flex w-full py-4 px-2 items-center bg-[#2b2d31] hover:bg-[#43444b] rounded-md">
                            <Hash className="h-5 w-5 mr-2 ml-2" />
                            <div>
                              <FormLabel>
                                Text
                                <p className="text-sm text-gray-300">
                                  Send messages,images,GIFs,emoji,opinions and
                                  puns
                                </p>
                              </FormLabel>
                            </div>
                            <FormControl>
                              <RadioGroupItem
                                className="ml-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                                value={ChannelType.TEXT}
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                        <FormItem>
                          <div className="flex w-full py-4 px-2 items-center bg-[#2b2d31] hover:bg-[#43444b] rounded-md">
                            <Volume2 className="h-5 w-5 mr-2 ml-2" />
                            <div>
                              <FormLabel>
                                Voice
                                <p className="text-sm text-gray-300">
                                  Hang out together with voice and screen share
                                </p>
                              </FormLabel>
                            </div>
                            <FormControl>
                              <RadioGroupItem
                                className="ml-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                                value={ChannelType.VOICE}
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                        <FormItem>
                          <div className="flex w-full py-4 px-2 items-center bg-[#2b2d31] hover:bg-[#43444b] rounded-md">
                            <Video className="h-5 w-5 mr-2 ml-2" />
                            <div>
                              <FormLabel>
                                Video
                                <p className="text-sm text-gray-300">
                                  Hang out together with voice and video and
                                  screen share
                                </p>
                              </FormLabel>
                            </div>
                            <FormControl>
                              <RadioGroupItem
                                className="ml-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                                value={ChannelType.VIDEO}
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      htmlFor="name"
                      className="uppercase text-xs font-semibold text-zinc-500 dark:text-neutral-100 "
                    >
                      Channel Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 dark:bg-[#1e1f22] border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0"
                        placeholder="Enter channel name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 dark:bg-[#313338] px-6 py-4">
              <Button disabled={isLoading} variant={"primary"}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
