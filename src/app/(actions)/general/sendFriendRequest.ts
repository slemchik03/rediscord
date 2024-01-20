"use server";

import authOptions from "@/lib/authOptions";
import prisma from "@/lib/prismaClient";
import emitEventOnServer from "@/lib/utils/emitEventOnServer";
import { randomUUID } from "crypto";
import { getServerSession } from "next-auth";

export type FriendRequestState = {
  status: "normal" | "error" | "success";
  message: string;
};

const FRIEND_REQUEST_ERRORS = {
  notFound: {
    status: "error",
    message: "User not found",
  },
  toYourself: {
    status: "error",
    message: "You cannot send a friend request to yourself!",
  },
  noUsername: {
    status: "error",
    message: "Please enter username!",
  },
  alreadyFriends: {
    status: "error",
    message: "You are aleready friends!",
  },
  alreadySent: {
    status: "error",
    message: "You have already sent the invite!",
  },
  unknownError: {
    status: "error",
    message: "Something went wrong!",
  },
} as const;

export default async function sendFriendRequest(
  prevState: FriendRequestState,
  formData: FormData,
): Promise<FriendRequestState> {
  try {
    const friendUsername = formData.get("username");

    if (!friendUsername) return FRIEND_REQUEST_ERRORS["noUsername"];

    const session = await getServerSession(authOptions);

    if (friendUsername === session?.user?.username) {
      return FRIEND_REQUEST_ERRORS["toYourself"];
    }

    const requestedUser = await prisma.user.findUnique({
      where: { username: friendUsername.toString() },
      include: { friends: { where: { id: session?.user?.id } } },
    });
    const requestCount = await prisma.request.count({
      where: {
        requesterId: session?.user?.id,
        addresseeId: requestedUser?.id,
      },
    });
    if (requestedUser?.friends.length) {
      return FRIEND_REQUEST_ERRORS["alreadyFriends"];
    }
    if (!requestedUser) return FRIEND_REQUEST_ERRORS["notFound"];

    if (requestCount) {
      return FRIEND_REQUEST_ERRORS["alreadySent"];
    }
    await prisma.request.create({
      data: {
        id: randomUUID(),
        addresseeId: requestedUser.id,
        requesterId: session?.user?.id!,
        createdAt: new Date(),
      },
    });
    await emitEventOnServer({
      eventId: `friend-invite-${requestedUser.id}`,
      data: session?.user,
    });
    return {
      status: "success",
      message: `User "${friendUsername}" has invited success!`,
    };
  } catch (error) {
    return FRIEND_REQUEST_ERRORS["unknownError"];
  }
}
