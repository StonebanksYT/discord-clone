import { ConversationSidebar } from "@/components/conversations/conversation-sidebar";
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
      <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <ConversationSidebar />
      </div>
      
      <main className="h-full md:pl-60 pt-[50px]">{children}</main>
    </div>
  );
};

export default ConversationsLayout;
