import prisma from "@/lib/prismaClient";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/authOptions";
import { ChannelType, type Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import UserDirect from "./UserDirect";
import getQueryClient from "@/app/getQueryClient";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

export type DirectData = {
  messages: Prisma.MessageGetPayload<{ include: { user: true } }>[];
  user: Prisma.UserGetPayload<{ include: { channels: true } }>;
};

const getDirectData = async (
  userId: string,
) => {
  try {
    const session = await getServerSession(authOptions);
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        channels: {
          where: {
            prarticipants: {
              some: {
                id: session?.user?.id,
              },
            },
            type: ChannelType.DIRECT,
          },
          include: {
            messages: {
              include: { user: true },
            },
          },
        },
      },
    });
    return {
      user,
      messages: user?.channels.at(0)?.messages || [],
    } as DirectData;
  } catch (err) {
    console.log(err);
    return { user: null, messages: [] };
  }
};

export default async function ChannelPage({
  params,
}: {
  params: { id: string };
}) {
  const queryClient = getQueryClient();
  const data = await getDirectData(params.id);

  if (!data.user) {
    redirect("/me");
  }
  queryClient.setQueryData(["current-user-direct"], data);
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserDirect />
    </HydrationBoundary>
  );
}
