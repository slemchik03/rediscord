import { PageContent } from "@/components/layout/page";
import MessageList from "../message-list";
import InputMessageBox from "../input-message-box";
import { GoBackWideBtn } from "../go-back-btn";
import type { Prisma, User } from "@prisma/client";
import useUserDirectEffects from "@/lib/hooks/user-direct/useUserDirectEffects";

interface UserDirectContentProps {
  user?: User;
  isNoChannelWithUser?: boolean;
  messageList: Prisma.MessageGetPayload<{ include: { user: true } }>[];
}
export default function UserDirectContent({
  user,
  messageList,
  isNoChannelWithUser,
}: UserDirectContentProps) {
  useUserDirectEffects({ user, isNoChannelWithUser });

  return (
    <PageContent className="hover-scrollbar relative grid">
      <MessageList messageList={messageList} />
      <div className="sticky bottom-0 z-[1] flex flex-grow items-end bg-[#313338] px-4">
        <InputMessageBox />
      </div>
      {/* For mobile screens */}
      <GoBackWideBtn />
    </PageContent>
  );
}
