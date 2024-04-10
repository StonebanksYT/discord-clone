"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

import { Video, VideoOff } from "lucide-react";
import { ActionTooltip } from "@/components/action-tooltip";

export const ChatVideoButton = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const isVideo = searchParams?.get("video");

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname || "",
        query: {
          video: isVideo ? undefined : true,
        },
      },
      { skipNull: true }
    );
    router.push(url);
  };

  const Icon = isVideo ? VideoOff : Video;
  const tooltipLabel = isVideo ? "End video call" : "Start video call";
  return (
    <ActionTooltip side="bottom" label={tooltipLabel}>
      <button onClick={onClick} className="hover:opacity-75 transition mr-4 outline-none focus:ring-0 focus:ring-offset-0">
        <Icon className="h-6 w-6 text-zinc-500 dark:text-zinc-400 " />
      </button>
    </ActionTooltip>
  );
};
