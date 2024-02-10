import { MembersWithProfiles } from "@/types";
import { Channel, ChannelType, Profile, Server } from "@prisma/client";
import { create } from "zustand";

export type ModalType =
  | "createServer"
  | "invite"
  | "editServer"
  | "leaveServer"
  | "members"
  | "createChannel"
  | "deleteServer"
  | "editChannel"
  | "deleteChannel"
  | "viewProfile"

interface ModalData {
  server?: Server;
  channel?: Channel;
  channelType?: ChannelType;
  member?: MembersWithProfiles;
  profile?: Profile;
}

interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ type, isOpen: true, data }),
  onClose: () => set({ type: null, isOpen: false }),
}));
