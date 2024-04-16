import { CurrentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";
export const runtime = 'edge';
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const profile = await CurrentProfilePages(req);
    const { content, fileUrl } = req.body;
    const { conversationId } = req.query;
    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!conversationId) {
      return res.status(400).json({ error: "Conversation ID missing" });
    }

    if (!content) {
      return res.status(400).json({ error: "Content Missing" });
    }

    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            memberOne: {
              id: profile.id,
            },
          },
          {
            memberTwo: {
              id: profile.id,
            },
          },
        ],
      },
      include: {
        memberOne: true,
        memberTwo: true,
      },
    });
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    const member =
      conversation.memberOne.id === profile.id
        ? conversation.memberOne
        : conversation.memberTwo;

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }
    const message = await db.directMessage.create({
      data: {
        content,
        fileUrl,
        conversationId: conversationId as string,
        profileId: member.id,
      },
      include: {
        profile: true,
      },
    });

    const channelKey = `chat:${conversationId}:messages`;
    res?.socket?.server?.io?.emit(channelKey, message);
    return res.status(200).json(message);
  } catch (error) {
    console.log("[DIRECT_MESSAGES_POST]", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
