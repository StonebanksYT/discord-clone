import { CurrentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { MemberRole } from "@prisma/client";
import { NextApiRequest } from "next";
export const runtime = 'edge';
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "DELETE" && req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const profile = await CurrentProfilePages(req);
    const { directMessageId, conversationId } = req.query;
    const { content } = req.body;
    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!conversationId) {
      return res.status(400).json({ error: "Conversation ID missing" });
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
        
        memberTwo:true
      },
    });
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }
    const member =
      conversation.memberOne.id === profile.id
        ? conversation.memberOne
        : conversation.memberTwo;
    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }
    let directMessage = await db.directMessage.findFirst({
      where: {
        id: directMessageId as string,
        conversationId: conversationId as string,
      },
      include:{
        profile:true,
      },
    });

    if (!directMessage || directMessage.deleted) {
      return res.status(404).json({ error: "Message not found" });
    }
    const isMessageOwner = directMessage.profileId === member.id;

    const canModify = isMessageOwner;
    if (!canModify) {
      return res.status(403).json({ error: "Forbidden" });
    }
    if (req.method === "DELETE") {
      directMessage = await db.directMessage.update({
        where: {
          id: directMessageId as string,
        },
        data: {
          fileUrl: null,
          content: "This message has been deleted",
          deleted: true,
        },
        include: {
          profile: true,
        },
      });
    }
    if (req.method === "PATCH") {
      if (!isMessageOwner) {
        return res.status(403).json({ error: "Forbidden" });
      }
      directMessage = await db.directMessage.update({
        where: {
          id: directMessageId as string,
        },
        data: {
          content,
        },
        include: {
          profile: true,
        },
      });
    }
    const updatedKey = `chat:${conversation.id}:messages:update`;
    res?.socket?.server?.io?.emit(updatedKey, directMessage);
    return res.status(200).json(directMessage);
  } catch (error) {
    console.log("[MESSAGE_ID]", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
