import { ConversationSidebar } from "@/components/conversations/conversation-sidebar";
import { ConversationsTopbar } from "@/components/conversations/conversation-topbar";
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
      <div className="hidden md:flex h-12 w-full z-10 pl-[312px] flex-col fixed right-0 inset-y-0 ">
        <ConversationsTopbar />
      </div>
      <main className="h-full md:pl-60 pt-[50px]">{children}</main>
    </div>
  );
};

export default ConversationsLayout;
