import Avatar from "@/components/ui/avatar";
import { ListItem } from "@/components/ui/list";
import { useSidebarStatus } from "@/state/sidebar-status";
import { useViewportType } from "@/state/viewport-type";
import { ChannelType, type Prisma, UserStatuses } from "@prisma/client";
import { BsFillChatLeftTextFill, BsX } from "react-icons/bs";

type ChannelDefault = Prisma.ChannelGetPayload<{
  select: {
    id: true;
    name: true;
    type: true;
  };
}>;

export type ChannelInfoDirect = ChannelDefault & {
  type: typeof ChannelType.DIRECT;
  image?: string | null;
  status: UserStatuses;
};
export type ChannelInfoGroup = ChannelDefault & {
  type: typeof ChannelType.GROUP;
  image?: string | null;
  participants: string[];
};
export type ChannelInfo = ChannelInfoDirect | ChannelInfoGroup;
type DMChannelListItemProps = {
  active?: boolean;
  channelInfo: ChannelInfo;
  onDelete: () => void;
};

export default function DMChatListItem({
  active,
  channelInfo,
  onDelete,
}: DMChannelListItemProps) {
  const { setSidebarStatus } = useSidebarStatus();
  const { type: viewportType } = useViewportType();
  return (
    <ListItem
      noVerticalPadding
      active={active}
      href={`/users/${channelInfo.id}/private`}
      onClick={() => viewportType === "mobile" && setSidebarStatus("closed")}
      className="group max-h-[44px] gap-3 bg-transparent py-1.5"
    >
      <Avatar
        src={channelInfo?.image}
        alt={channelInfo.name}
        status={channelInfo.type === "DIRECT" ? channelInfo.status : undefined}
        className="w-8 flex-none"
      />
      <div className="flex-1 truncate text-sm">
        {channelInfo.name}
        {/* {channel.activity && (
          <div className="h-4 truncate text-xs leading-3">
            <span className="capitalize">{channel.activity?.type}</span>
            {channel.activity?.name}
            <BsFillChatLeftTextFill
              fontSize={10}
              className="ml-0.5 inline-block"
            />
          </div>
        )} */}
      </div>
      <button
        onClick={(event) => {
          event.preventDefault();
          onDelete();
        }}
        className="hidden text-gray-300 hover:text-white group-hover:block"
      >
        <BsX fontSize={24} />
      </button>
    </ListItem>
  );
}
