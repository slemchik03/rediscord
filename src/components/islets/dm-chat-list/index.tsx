import { useQuery } from "@tanstack/react-query";
import DMChatListContent from "./dm-chat-list-content";
import { ChannelInfo } from "./dm-chat-list-item";
import useChannelList from "@/lib/hooks/sockets/useChannelList";

function DMChatListSocket() {
  useChannelList();
  return null;
}
function DMChatList() {
  const { data: channelsInfo } = useQuery<ChannelInfo[]>({
    queryKey: ["channels-list"],
    enabled: false,
  });

  return (
    <>
      <DMChatListContent channels={channelsInfo || []} />
      <DMChatListSocket />
    </>
  );
}

export default DMChatList;
