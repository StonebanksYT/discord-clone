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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ServerWithMembersWithProfiles } from "@/types";
import {
  Check,
  Crown,
  Gavel,
  MessageCircle,
  MoreVertical,
  Shield,
  ShieldCheck,
  ShieldQuestion,
  Trash2,
  Hash,
  User,
  User2,
} from "lucide-react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { UserAvatar } from "../user-avatar";
import qs from "query-string";
import { MemberRole } from "@prisma/client";
import { Separator } from "../ui/separator";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Server name is required",
  }),
  imageUrl: z.string().min(1, {
    message: "Server image is required",
  }),
});
const roleIconMap = {
  ADMIN: <Crown className="h-6 w-6 ml-2 text-rose-500" />,
  MODERATOR: <ShieldCheck className="h-6 w-6 ml-2 text-indigo-500" />,
  GUEST: <User className="h-6 w-6 ml-2 text-gray-500" />,
};

interface MembersManagementProps {
  server: ServerWithMembersWithProfiles;
}
const MembersManagement = ({ server }: MembersManagementProps) => {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState("");
  const onKick = async (memberId: string) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
        },
      });
      const response = await axios.delete(url);
      router.refresh();
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId("");
    }
  };
  const onRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
        },
      });
      const response = await axios.patch(url, { role });
      router.refresh();
      window.location.reload();
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId("");
    }
  };
  return (
    <div className="border">
      <Table>
        <TableCaption>Manage Members in {server.name}</TableCaption>
        <TableHeader>
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Member Since</TableHead>
        </TableHeader>
        <TableBody>
          {server?.members?.map((member) => (
            <TableRow key={member.id} className="">
              <TableCell className="flex items-center gap-x-2">
                <UserAvatar src={member.profile.imageUrl} />
                {member.profile.name}
                {roleIconMap[member.role]}
              </TableCell>
              <TableCell>{member.role}</TableCell>
              <TableCell>{member.createdAt.toUTCString()}</TableCell>
              <TableCell>
                {server?.profileId !== member.profileId &&
                  loadingId !== member.id && (
                    <DropdownMenu>
                      <DropdownMenuTrigger className="ring-0 outline-none">
                        <MoreVertical className="h-6 w-6 dark:text-gray-500 text-black cursor-pointer" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="right">
                        <DropdownMenuItem>
                          <User2 className="h-4 w-4 mr-2" />
                          Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Message
                        </DropdownMenuItem>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="flex items-center">
                            <ShieldQuestion className="h-4 w-4 mr-2" />
                            <span>Roles</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem
                                onClick={() => onRoleChange(member.id, "GUEST")}
                              >
                                <Shield className="h-4 w-4 mr-2" />
                                GUEST
                                {member.role === "GUEST" && (
                                  <Check className="h-4 w-4 ml-2" />
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  onRoleChange(member.id, "MODERATOR")
                                }
                              >
                                <ShieldCheck className="h-4 w-4 mr-2" />
                                MODERATOR
                                {member.role === "MODERATOR" && (
                                  <Check className="h-4 w-4 ml-2" />
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>

                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            onKick(member.id);
                          }}
                          className="text-rose-500"
                        >
                          <Gavel className="h-4 w-4 mr-2" />
                          Kick {member.profile.name}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        {/* <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">$2,500.00</TableCell>
            </TableRow>
          </TableFooter> */}
      </Table>
    </div>
  );
};

export const EditServerModal = () => {
  const { isOpen, onClose, type, data, onOpen } = useModal();
  const isModalOpen = isOpen && type === "editServer";
  const { server } = data;
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);

  // const tabs = [
  //   { name: "Overview" },
  //   { name: "Roles" },
  //   { name: "Channels" },
  //   { name: "Members" },

  // ];

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
    setActiveTab(0);
    onClose();
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white dark:bg-[#313338] flex flex-row  h-full w-full text-black dark:text-white p-0 overflow-hidden">
        <div className="hidden md:flex h-full xl:w-[576px] bg-gray-100 dark:bg-[#2b2d31] z-20 flex-col  inset-y-0 border border-r-4">
          <div className="w-full flex flex-col pr-14 mt-16 h-full font-semibold uppercase items-end">
            {server?.name}
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
                  Roles
                  <ShieldQuestion className="h-4 w-4 " />
                </div>
              </button>
              <button
                onClick={() => setActiveTab(2)}
                className={cn(
                  "text-sm font-semibold text-left text-black justify-between dark:text-neutral-400 py-2 px-1 mt-1 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition",

                  activeTab === 2 &&
                    "bg-zinc-300 dark:bg-[#36373d]  dark:text-white"
                )}
              >
                <div className="flex w-full justify-between">
                  Channels
                  <Hash className="h-4 w-4 " />
                </div>
              </button>
              <button
                onClick={() => setActiveTab(3)}
                className={cn(
                  "text-sm font-semibold text-left text-black justify-between dark:text-neutral-400 py-2 px-1 mt-1 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition",

                  activeTab === 3 &&
                    "bg-zinc-300 dark:bg-[#36373d]  dark:text-white"
                )}
              >
                <div className="flex w-full justify-between">
                  Members
                  <User className="h-4 w-4 " />
                </div>
              </button>
              <Separator />
              <button
                onClick={() => {
                  onOpen("deleteServer", { server });
                  // handleClose();
                }}
                className={cn(
                  "text-sm font-semibold text-left text-black justify-between dark:text-neutral-400 py-2 px-1 mt-1 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition",

                  activeTab === 4 &&
                    "bg-zinc-300 dark:bg-[#36373d]  dark:text-white"
                )}
              >
                <div className="flex w-full justify-between text-rose-500">
                  Delete Server
                  <Trash2 className="h-4 w-4 text-rose-500 " />
                </div>
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center  w-full h-full">
          <DialogHeader className="pt-8 px-6">
            <DialogTitle className="text-2xl text-start font-bold">
              {activeTab === 0 && "Server Overview"}
              {activeTab === 1 && "Roles Management"}
              {activeTab === 2 && "Channels Management"}
              {activeTab === 3 && "Server Members"}
            </DialogTitle>
          </DialogHeader>

          {activeTab === 0 && (
            <div className="flex flex-row  justify-center w-full h-full">
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
            </div>
          )}
          {activeTab === 1 && (
            <div className="flex flex-row items-center justify-center w-full h-full">
              Roles Management
            </div>
          )}
          {activeTab === 2 && (
            <div className="flex flex-row items-center justify-center w-full h-full">
              Channels Management
            </div>
          )}
          {activeTab === 3 && (
            <div className="flex flex-col h-full mt-2">
              <MembersManagement
                server={server as ServerWithMembersWithProfiles}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
