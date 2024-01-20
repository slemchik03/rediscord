import MessageItem from "../message-item";
import dayjs from "dayjs";
import DateBar from "./date-bar";
import clsx from "@/lib/clsx";
import type { Prisma } from "@prisma/client";

interface Props {
  messageList: Prisma.MessageGetPayload<{ include: { user: true } }>[];
  greetingMessageElement?: React.ReactNode;
  className?: string;
}
export default function MessageList({
  messageList,
  greetingMessageElement,
  className,
}: Props) {
  return (
    <div className={clsx("grid max-h-full grid-flow-row", className)}>
      {greetingMessageElement}
      {messageList.map((item, idx) => {
        const prev = dayjs(messageList[idx - 1]?.createdAt || 0);
        const curr = dayjs(item.createdAt);
        const diff = curr.day() - prev.day() + (curr.month() - prev.month());

        return (
          <div key={item.id} className="flex flex-col">
            {diff ? <DateBar date={curr.format("D MMMM, YYYY")} /> : null}
            <MessageItem
              key={item.id}
              id={item.id}
              createdAt={item.createdAt}
              authorAvatar={item.user?.avatar!}
              authorNickname={item.user?.username}
              message={item.content}
            />
          </div>
        );
      })}
    </div>
  );
}
