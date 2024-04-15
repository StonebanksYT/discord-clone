import { ConversationSidebar } from "@/components/conversations/conversation-sidebar";
import { ConversationTabs } from "@/components/conversations/conversation-tabs";
import { MobileToggle } from "@/components/mobile-toggle";
import { CurrentProfile } from "@/lib/current-profile";
import { redirectToSignIn } from "@clerk/nextjs";

const ConversationsLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const profile = await CurrentProfile();
  if (!profile) {
    return redirectToSignIn();
  }

  return (
    <div className="h-full">
      <div className="hidden md:flex h-full md:w-40 lg:w-60 z-20 flex-col fixed inset-y-0">
        <ConversationSidebar />
      </div>
      <div className="hidden md:flex h-full md:w-44 lg:w-60 xl:w-60 z-20 flex-col fixed right-0  top-14  border-l p-2">
        <p className="text-lg font-semibold">Active Now</p>
      </div>
      <main className="h-full md:pl-40 md:mr-40 lg:pl-60 lg:mr-60">{children}</main>
    </div>
  );
};

export default ConversationsLayout;
"hidden md:flex h-full md:w-44 lg:w-60 xl:w-60 z-20 flex-col fixed right-0  top-12 inset-y-0"