import { DirectData } from "@/app/(main)/(dm)/users/[id]/private/page";
import { ChannelInfo } from "@/components/islets/dm-chat-list/dm-chat-list-item";
import { useSocket } from "@/components/providers/SocketProvider";
import { UserStatuses } from "@prisma/client";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect } from "react";

function updateChannels({
  old,
  status,
}: {
  old: ChannelInfo[];
  status: UserStatuses;
}) {
  const updatedList = old ? [...old] : [];

  return updatedList.map((channel) => {
    if (channel.type === "DIRECT") {
      return { ...channel, status };
    }
    return channel;
  });
}

function updateDirectUser({
  old,
  status,
}: {
  old: DirectData | undefined;
  status: UserStatuses;
}): DirectData | undefined {
  if (old) {
    return { ...old, user: { ...old.user, status } };
  }
}
// Serves to update
export default function useChannelList(): void {
  const { socket } = useSocket();
  const { data: channelsInfo } = useQuery<ChannelInfo[]>({
    queryKey: ["channels-list"],
    enabled: false,
    placeholderData: keepPreviousData,
  });

  const queryClient = useQueryClient();
  useEffect(() => {
    if (channelsInfo?.length && socket) {
      const eventHandler = (data: { status: UserStatuses } | null) => {
        if (data && data.status) {
          queryClient.setQueryData<ChannelInfo[]>(["channels-list"], (old) =>
            updateChannels({
              old: old || [],
              status: data.status,
            }),
          );
          queryClient.setQueryData<DirectData>(["current-user-direct"], (old) =>
            updateDirectUser({
              old,
              status: data.status,
            }),
          );
        }
      };
      // Currently listen only DIRECT channel types
      const eventKeyBase = `friend-status-`;
      channelsInfo.forEach(({ id }) => {
        // For Direct channels channel id equals to user id
        socket.on(eventKeyBase + id, eventHandler);
      });
      return () => {
        channelsInfo.forEach(({ id }) => {
          socket.off(eventKeyBase + id);
        });
      };
    }
  }, [channelsInfo, queryClient, socket]);
}
