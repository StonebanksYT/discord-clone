import { ConversationMobileToggle } from "@/components/conversation-mobile-toggle";
import { ConversationTabs } from "@/components/conversations/conversation-tabs";
import { HelpCircle, Inbox } from "lucide-react";
import React from "react";

const ConversationPage = () => {
  return (
    <div className="h-full">
      <ConversationMobileToggle/>
      <ConversationTabs/>
    </div>
  );
};

export default ConversationPage;
