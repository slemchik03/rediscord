"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { useFriendsTabStore } from "@/state/friends-tab";
import { friendsTabsProps } from "./friend-tabs";
import useGetFriendList from "@/lib/hooks/friend-list/useGetFriendList";
import { useMemo } from "react";
import { motion } from "framer-motion";
import clsx from "@/lib/clsx";

export default function FriendList() {
  const { currentTab } = useFriendsTabStore();
  const { friends, isStale } = useGetFriendList({
    currentTab,
  });

  // Change tab only if we already fetched new friends for this tab
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const tab = useMemo(() => friendsTabsProps[currentTab], [friends]);
  const CurrentTab = tab.component;
  return (
    <motion.div
      key={tab.name}
      className={clsx("flex flex-1 flex-col", !isStale && "animate-pulse")}
      animate={{
        opacity: [0, 1],
      }}
      transition={{
        duration: 0.4,
        ease: "easeInOut",
      }}
    >
      <TooltipProvider>
        <CurrentTab initialUsers={friends || []} />
      </TooltipProvider>
    </motion.div>
  );
}
