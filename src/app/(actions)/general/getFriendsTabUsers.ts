"use server";

import { FriendsTabEnum } from "@/components/islets/friend-list/friend-tabs";
import authOptions from "@/lib/authOptions";
import prisma from "@/lib/prismaClient";
import { getServerSession } from "next-auth";

export default async function getFriendsTabUsers({
  tab,
}: {
  tab: FriendsTabEnum;
}) {
  const session = await getServerSession(authOptions);
  if (tab === FriendsTabEnum.Available || tab === FriendsTabEnum.All) {
    return (
      await prisma.user.findUnique({
        where: {
          id: session?.user?.id,
        },
        select: {
          friends: true,
        },
      })
    )?.friends.filter(({ status }) => {
      if (tab === FriendsTabEnum.All) {
        return true;
      } else return status !== "OFFLINE";
    });
  }

  if (tab === FriendsTabEnum.Pending) {
    return (
      await prisma.user.findUnique({
        where: {
          id: session?.user?.id,
        },
        select: {
          recivedFriendRequest: {
            select: {
              requester: true,
            },
          },
        },
      })
    )?.recivedFriendRequest.map((req) => req.requester);
  }
}