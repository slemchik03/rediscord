import { FriendsTabEnum } from "@/components/islets/friend-list/friend-tabs";
import { useSocket } from "@/components/providers/SocketProvider";
import userQueryKeys from "@/lib/queries/users";
import playNotification from "@/lib/utils/playNotification";
import { User } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function useFriendInvite(): void {
  const queryClient = useQueryClient();
  const { socket } = useSocket();
  const { data: session } = useSession();

  useEffect(() => {
    const handler = (user: User | null) => {
      playNotification();
      if (user) {
        queryClient.setQueryData<User[]>(
          userQueryKeys.friendsList({ tab: FriendsTabEnum.Pending }),
          (old) => {
            return [...(old || []), user];
          },
        );
      }
    };
    socket?.on(`friend-invite-${session?.user?.id}`, handler);
    return () => {
      socket?.off(`friend-invite-${session?.user?.id}`);
    };
  }, [socket, session?.user, queryClient]);
}
