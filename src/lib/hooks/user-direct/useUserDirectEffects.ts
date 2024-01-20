import { ChannelInfo } from "@/components/islets/dm-chat-list/dm-chat-list-item";
import { User } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export default function useUserDirectEffects({
  isNoChannelWithUser,
  user,
}: {
  user?: User;
  isNoChannelWithUser?: boolean;
}) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isNoChannelWithUser && user) {
      console.log("Currently no channel with user");

      const channel: ChannelInfo = {
        id: user.id,
        type: "DIRECT",
        status: user.status!,
        name: user.username,
        image: user.avatar,
      };
      queryClient.setQueryData<ChannelInfo[]>(["channels-list"], (old) => [
        ...(old || []),
        channel,
      ]);
    }
    return () => void queryClient.resetQueries({ queryKey: ["channels-list"] });
  }, [queryClient, isNoChannelWithUser, user]);
}
