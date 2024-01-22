import { FriendsTabEnum } from "@/components/islets/friend-list/friend-tabs";
const userQueryKeys = {
  friendsList: ({ tab }: { tab: FriendsTabEnum }) =>
    ["friends-list", tab] as const,
  currentUserDirect: () => ["current-user-direct"] as const,
  usersGeneral: ({ filter }: { filter?: string }) =>
    ["users-general", ...(filter ? [filter] : [])] as const,
  userFromServer: () => ["user-from-server"] as const,
  userInfo: ({ id }: { id: string }) => ["user-info", id] as const,
} as const;
export default userQueryKeys;
