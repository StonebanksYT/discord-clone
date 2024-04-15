"use client";
import { HelpCircle, Inbox, Search, User } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { ActionTooltip } from "../action-tooltip";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";

const tabs = ["Online", "All", "Pending", "Blocked"];

export const ConversationTabs = () => {
  const [activeTab, setActiveTab] = useState("Online");

  return (
    <div className="h-full flex flex-col">
      <ul className="flex items-center lg:space-x-4 mb-2 mt-2">
        <div className="flex items-center gap-x-1 pl-1">
          <User className="h-7 w-7" />
          <p className="text-[15px] font-semibold">Friends</p>
        </div>
        <Separator className="w-6 rotate-90 bg-[#3f4147]" />
        {tabs.map((tab) => (
          <li
            key={tab}
            className={cn(
              "py-1 px-1 text-gray-400 cursor-pointer hover:text-blue-400 text-[15px]",
              activeTab === tab && "text-blue-500 border-b-2 border-blue-500"
            )}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </li>
        ))}
        <Button variant={"primary"} className="h-8">
          Add Friend
        </Button>
        <div className="absolute md:right-2 flex flex-row items-center gap-x-2 mt-2">
          <ActionTooltip label="Inbox" side="bottom">
            <button type="button">
              <Inbox className="w-7 h-7" />
            </button>
          </ActionTooltip>
          <ActionTooltip label="Help" side="bottom">
            <button type="button">
              <HelpCircle className="w-7 h-7 mr-2" />
            </button>
          </ActionTooltip>
        </div>
      </ul>
      <Separator className="w-full" />
      <div>
        <div className="flex items-center w-full h-10  justify-between p-4 mb-2">
          <Input
            className="bg-white dark:bg-[#1e1f22] h-8 border-0 focus-visible:ring-0 dark:text-white  focus-visible:ring-offset-0 mt-2"
            placeholder="Search"
            onChange={()=>{}}
          />
          <Search className="absolute right-[20px] md:right-[180px] lg:right-[260px] w-6 h-6 text-[#838992] mt-2" />
        </div>
        {activeTab === "Online" && <div>Online Users</div>}
        {activeTab === "All" && <div>All Users</div>}
        {activeTab === "Pending" && <div>Pending Requests</div>}
        {activeTab === "Blocked" && <div>Blocked Users</div>}
      </div>
    </div>
  );
};
