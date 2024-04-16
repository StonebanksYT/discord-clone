import { CurrentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string} }
) {
  try {
    const profile = await CurrentProfile();
    if (!profile) return new NextResponse("Unauthorized", { status: 401 });
    if (!params.serverId) {
      return new NextResponse("Server ID Missing", { status: 400 });
    }
    const inviteCode = await db.server.findUnique({
        where:{
            id: params.serverId
        }
        }).then((server) => {
        return server?.inviteCode
    })
    const server = await db.server.update({
        where:{
          inviteCode: inviteCode
        },
        data:{
          members:{
            create:[
              {
                profileId:profile.id
              }
            ]
          }}})
        
      
    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVER_ID_JOIN]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
