import { CurrentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { FriendStatus } from "@prisma/client";
import { NextResponse } from "next/server";
export const runtime = 'edge';
export async function GET(req: Request) {
  try {
    const profile = await CurrentProfile();
    const { searchParams } = new URL(req.url);
    const profileId = searchParams.get("profileId");
    if (!profileId) {
      return new NextResponse("Profile ID missing", { status: 400 });
    }

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const friends = await db.friend.findMany({
      where: {
        OR: [
          { profileId, status: FriendStatus.ACCEPTED }, // Friends sent by the profile
          { friendId: profileId, status: FriendStatus.ACCEPTED }, // Friends received by the profile
        ],
      },
      include: {
        profile: true, // Include the profile details of the friend
      },
    });
    return NextResponse.json(friends);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
