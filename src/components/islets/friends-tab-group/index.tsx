"use client";

import Badge from "@/components/ui/badge";
import TabGroup from "@/components/ui/tab-group";
import TabGroupButton from "@/components/ui/tab-group/tab-group-button";
import { useFriendsTabStore } from "@/state/friends-tab";
import { FriendsTabEnum, friendsTabsProps } from "../friend-list/friend-tabs";
import useGetFriendList from "@/lib/hooks/friend-list/useGetFriendList";

export default function FriendsTabGroup() {
  const { currentTab, setCurrentTab } = useFriendsTabStore();

  const requestsCount = useGetFriendList({
    currentTab: FriendsTabEnum.Pending,
  }).friends.length;

  const PendingBadge = <Badge className="ml-1" count={requestsCount} />;

  return (
    <TabGroup data-testid="tab-group">
      {Object.values(friendsTabsProps).map((item) => (
        <TabGroupButton
          active={currentTab === item.key}
          key={item.key}
          tabType={item.key}
          onClick={() => setCurrentTab(item.key)}
          data-testid={
            currentTab === item.key ? "active-tab" : `tab-group-btn-${item.key}`
          }
        >
          {item.name || item.name}
          {item.key === FriendsTabEnum.Pending && PendingBadge}
        </TabGroupButton>
      ))}
    </TabGroup>
  );
}
