import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";
import { ServerSidebar } from "@/components/server/server-sidebar";
import { ConversationSidebar } from "./conversations/conversation-sidebar";

export const ConversationMobileToggle = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"ghost"} size="icon" className="md:hidden">
          <Menu className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
        </Button>
      </SheetTrigger>
      <SheetContent side={"left"} className="p-0 flex gap-0 dark:bg-[#2B2D31] bg-[#F2F3F5]">
        <div className="w-[72px] ">
          <NavigationSidebar />
        </div>
        <div className="w-full h-full pt-10"><ConversationSidebar/></div>
      </SheetContent>
    </Sheet>
  );
};
