"use client";
import { Home } from "lucide-react";
import { ActionTooltip } from "@/components/action-tooltip";
import { useModal } from "@/hooks/use-modal-store";
import { useRouter } from "next/navigation";

export const HomeAction = () => {
  const router = useRouter();
  const onClick = () => {
    router.push(`/conversations`);
  };
  return (
    <div>
      <ActionTooltip side="right" align="center" label="Direct Messages">
        <button
          className="group flex items-center focus:ring-0 focus:ring-offset-0 outline-none"
          onClick={onClick}
        >
          <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500">
            <Home
              className="group-hover:text-white transition text-emerald-500"
              size={25}
            />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
};
