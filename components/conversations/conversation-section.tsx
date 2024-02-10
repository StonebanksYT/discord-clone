"use client";
import { ServerWithMembersWithProfiles } from "@/types";
import { ChannelType, MemberRole } from "@prisma/client";
import React from "react";
import { ActionTooltip } from "@/components/action-tooltip";
import { Plus } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";

interface ConversationSectionProps {
  label: string;
}

export const ConversationSection = ({ label }: ConversationSectionProps) => {
  const { onOpen } = useModal();
  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
        {label}
      </p>

      <ActionTooltip label="Create DM" side="top">
        <button
          onClick={() => {}}
          className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
        >
          <Plus className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
        </button>
      </ActionTooltip>
    </div>
  );
};
