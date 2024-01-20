import { Meta, StoryObj } from "@storybook/react";
import FriendList from ".";
import { UserStatuses } from "@/lib/entities/user";
import FriendsTabGroup from "../friends-tab-group";
import FriendListSkeleton from "./friend-list-skeleton";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const meta = {
  component: FriendList,
  title: "Islets/FriendList",
  decorators: [
    (Component) => (
      <QueryClientProvider client={new QueryClient()}>
        <Component />
      </QueryClientProvider>
    ),
  ],
} as Meta;

export default meta;
const args = {
  friends: [
    {
      status: UserStatuses.Idle,
      name: "John Doe",
      id: "1",
      avatar: "https://i.pravatar.cc/150?img=3&quot;",
      username: "johndoe",
      type: "user",
    },
  ],
  friendRequests: [
    {
      status: UserStatuses.Offline,
      name: "semen",
      id: "1",
      avatar: "https://i.pravatar.cc/150?img=4&quot;",
      username: "kyeilie",
      type: "user",
    },
  ],
  blockedFriends: [
    {
      status: UserStatuses.Online,
      name: "petro",
      id: "1",
      avatar: "https://i.pravatar.cc/150?img=5&quot;",
      username: "pivozavr",
      type: "user",
    },
  ],
};
const argTypes = {
  friends: { control: { type: "object" } },
  friendRequests: { control: { type: "object" } },
  blockedFriends: { control: { type: "object" } },
};
type Story = StoryObj<typeof FriendList>;
export const Template: Story = {
  render: () => <FriendList />,
  args,
  argTypes,
};
export const WithTabGroup: Story = {
  render: () => <FriendList />,
  decorators: [
    (Story) => (
      <div className="flex h-screen flex-col gap-5">
        <FriendsTabGroup friendRequestsCount={5} />
        <Story />
      </div>
    ),
  ],
  args,
  argTypes,
};
export const Skeleton: Story = {
  render: () => <FriendListSkeleton />,
};
