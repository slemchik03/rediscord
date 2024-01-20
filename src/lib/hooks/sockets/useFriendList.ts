import getFriendsTabUsers from "@/app/(actions)/general/getFriendsTabUsers";
import { FriendsTabEnum } from "@/components/islets/friend-list/friend-tabs";
import { useSocket } from "@/components/providers/SocketProvider";
import { User, UserStatuses } from "@prisma/client";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

function updateUsers({
  old,
  isRemoveOffline,
  newUser,
}: {
  old: User[] | undefined;
  isRemoveOffline?: boolean;
  newUser: User;
}): User[] {
  const updatedList = old ? [...old] : [];

  if (newUser.status === UserStatuses.OFFLINE && isRemoveOffline) {
    return updatedList.filter(({ id }) => id !== newUser.id);
  }
  const idx = old?.findIndex(({ id }) => id === newUser.id);

  // If user exist just replace status
  if (idx !== undefined && idx !== -1) {
    updatedList[idx] = { ...newUser };
    return updatedList;
  }
  return [{ ...newUser }, ...updatedList];
}

export default function useFriendList() {
  const { socket } = useSocket();
  const { data: session } = useSession();
  const { data: friends } = useQuery({
    queryKey: ["friends-list", FriendsTabEnum.All],
    queryFn: () => getFriendsTabUsers({ tab: FriendsTabEnum.All }),
    placeholderData: keepPreviousData,
  });

  const queryClient = useQueryClient();
  useEffect(() => {
    if (friends) {
      friends.forEach((friend) => {
        const eventKey = `friend-status-${friend.id}`;
        socket?.on(eventKey, ({ status }: { status: UserStatuses }) => {
          queryClient.setQueryData<User[]>(
            ["friends-list", FriendsTabEnum.All],
            (old) => updateUsers({ old, newUser: { ...friend, status } }),
          );
          queryClient.setQueryData<User[]>(
            ["friends-list", FriendsTabEnum.Available],
            (old) =>
              updateUsers({
                old,
                newUser: { ...friend, status },
                isRemoveOffline: true,
              }),
          );
        });
      });
    }

    return () => {
      friends?.forEach(({ id }) => {
        const eventKey = `friend-status-${id}`;
        socket?.off(eventKey);
      });
    };
  }, [friends, queryClient, session?.user?.id, socket]);
}
