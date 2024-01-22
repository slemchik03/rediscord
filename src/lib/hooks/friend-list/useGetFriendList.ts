import getFriendsTabUsers from "@/app/(actions)/general/getFriendsTabUsers";
import { FriendsTabEnum } from "@/components/islets/friend-list/friend-tabs";
import userQueryKeys from "@/lib/queries/users";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export default function useGetFriendList({
  currentTab,
}: {
  currentTab: FriendsTabEnum;
}) {
  const { data, isFetching, isStale } = useQuery({
    queryKey: userQueryKeys.friendsList({ tab: currentTab }),
    queryFn: () => getFriendsTabUsers({ tab: currentTab }),
    placeholderData: keepPreviousData,
  });
  return {
    friends: Array.isArray(data) ? data : [],
    isFetching,
    isStale,
  };
}