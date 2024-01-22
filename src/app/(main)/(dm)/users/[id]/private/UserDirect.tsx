"use client";

import { Page, PageHeader } from "@/components/layout/page";
import RightHeaderContent from "./right-header-content";
import Avatar from "@/components/ui/avatar";
import Divider from "@/components/ui/divider";
import UserDirectContent from "@/components/islets/user-direct-content";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { UserStatuses } from "@prisma/client";
import { DirectData } from "./page";
import userQueryKeys from "@/lib/queries/users";

export default function UserDirect() {
  const { data } = useQuery<DirectData>({
    queryKey: userQueryKeys.currentUserDirect(),
    placeholderData: keepPreviousData,
    enabled: false,
  });
  return (
    <Page className="ml-0 transition-all sm:ml-[310px]">
      <PageHeader
        className="horizontal-scroll sticky top-0 z-[10]"
        rightContent={<RightHeaderContent />}
      >
        <div className="flex items-center gap-4">
          <div className="flex flex-none items-center gap-3 text-sm font-semibold">
            <Avatar
              size="sm"
              src={data!.user.avatar}
              alt="Avatar"
              status={data!.user.status || UserStatuses.IDLE}
            />
            {data!.user.username}
          </div>
          <Divider vertical />
          <div className="text-xs text-gray-400">{data!.user.username}</div>
        </div>
      </PageHeader>
      <UserDirectContent
        messageList={data?.messages || []}
        user={data!.user}
        isNoChannelWithUser={!data!.user.channels.length}
      />
    </Page>
  );
}
