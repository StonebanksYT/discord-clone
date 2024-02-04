"use client";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { useEffect, useState } from "react";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Server name is required",
  }),
  imageUrl: z.string().min(1, {
    message: "Server image is required",
  }),
});

export const EditServerModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "editServer";
  const { server } = data;
  const router = useRouter();

  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    { name: "Overview" },
    { name: "Roles" },
    { name: "Channels" },
    { name: "Members" },
  ];

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });
  useEffect(() => {
    if (server) {
      form.setValue("name", server.name);
      form.setValue("imageUrl", server.imageUrl);
    }
  }, [server, form]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/servers/${server?.id}`, values);
      form.reset();
      router.refresh();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };
  const handleClose = () => {
    onClose();
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white dark:bg-[#313338] flex flex-row  h-full w-full text-black dark:text-white p-0 overflow-hidden">
        <div className="hidden md:flex h-full xl:w-[576px] dark:bg-[#2b2d31] z-20 flex-col  inset-y-0 border border-r-4">
          <div className="w-full flex flex-col pr-14 mt-16 h-full font-semibold uppercase items-end">
            {server?.name}
            <div className="flex flex-col font-normal h-full items-start  mt-4">
              {tabs.map((tab, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className="text-sm font-normal text-left text-neutral-500 dark:text-neutral-400 py-2 px-6 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
                >
                  {tab.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center  w-full h-full">
          <DialogHeader className="pt-8 px-6">
            <DialogTitle className="text-2xl text-start font-bold">
              {tabs[activeTab].name}
            </DialogTitle>
          </DialogHeader>
          {(
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 mt-4 min-w-[300px] w-full max-w-lg"
              >
                <div className="space-y-8 px-6">
                  <div className="flex items-center justify-center text-center">
                    <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <FileUpload
                              endpoint="serverImage"
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          htmlFor="name"
                          className="uppercase text-xs font-bold text-zinc-500 dark:text-neutral-100 "
                        >
                          Server Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={isLoading}
                            className="bg-zinc-300/50 dark:bg-[#1e1f22] border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0"
                            placeholder="Enter server name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <DialogClose />
                <DialogFooter className="bg-gray-100 dark:bg-[#313338] px-6 py-4">
                  <Button disabled={isLoading} variant={"primary"}>
                    Save
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          ) && activeTab === 0}
        </div>
      </DialogContent>
    </Dialog>
  );
};
