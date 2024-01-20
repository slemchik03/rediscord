import getQueryClient from "@/app/getQueryClient";
import {
  ChannelInfo,
  ChannelInfoDirect,
  ChannelInfoGroup,
} from "@/components/islets/dm-chat-list/dm-chat-list-item";
import DMLayout from "@/components/islets/dm-layout";
import { FriendsTabEnum } from "@/components/islets/friend-list/friend-tabs";
import authOptions from "@/lib/authOptions";
import prisma from "@/lib/prismaClient";
import { User, UserStatuses } from "@prisma/client";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getServerSession } from "next-auth/next";

const getChannelInfoList = async (): Promise<ChannelInfo[]> => {
  try {
    const session = await getServerSession(authOptions);
    const channels = await prisma.channel.findMany({
      where: {
        prarticipants: {
          some: {
            id: session?.user?.id,
          },
        },
      },
      include: {
        prarticipants: true,
        leader: true,
      },
    });
    // Convert channel to way we need
    const channelsInfo: ChannelInfo[] = channels.map((channel) => {
      if (channel.type === "GROUP") {
        const participantsNames = channel.prarticipants.map(
          ({ username }) => username,
        );
        return {
          id: channel.id,
          name: channel.name,
          type: channel.type,
          participants: participantsNames,
        } satisfies ChannelInfoGroup;
      }
      // If it's not a group there have to be only two participants
      const directUser = channel.prarticipants.find(
        (user) => user.id !== session?.user?.id,
      )!;
      return {
        id: directUser.id,
        type: channel.type,
        name: directUser.username,
        status: UserStatuses.IDLE,
        image: directUser?.avatar,
      } satisfies ChannelInfoDirect;
    });
    return channelsInfo;
  } catch (err) {
    console.log(err);
    return [];
  }
};

const getAvailbleFriends = async (): Promise<{
  user: User | null;
  friends: User[];
}> => {
  const session = await getServerSession(authOptions);

  const userWithFriends = await prisma.user.findUnique({
    where: { id: session?.user?.id },
    include: {
      friends: true,
    },
  });
  if (userWithFriends) {
    const { friends, ...user } = userWithFriends;
    return {
      user,
      friends: friends.filter(({ status }) => status !== "OFFLINE") || [],
    };
  }
  return { user: null, friends: [] };
};
export default async function SuspendedDMLayout({
  children,
}: React.PropsWithChildren) {
  const queryClient = getQueryClient();
  const [{ friends, user }, channelsInfo] = await Promise.all([
    getAvailbleFriends(),
    getChannelInfoList(),
  ]);

  queryClient.setQueryData(["user-from-server"], user);
  queryClient.setQueryData(["friends-list", FriendsTabEnum.Available], friends);
  queryClient.setQueryData(["channels-list"], channelsInfo);
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DMLayout>{children}</DMLayout>
    </HydrationBoundary>
  );
}
