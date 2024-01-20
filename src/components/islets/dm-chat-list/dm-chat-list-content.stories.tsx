import {Meta, StoryObj} from "@storybook/react";
import DMChatListContent from "./dm-chat-list-content";
const meta  = {
    component: DMChatListContent,
    title: 'Islets/DMChatListContent',
} as Meta;
export default meta;
type Story = StoryObj<typeof DMChatListContent>;
export const Default: Story = {
    render: (props) => <DMChatListContent {...props} />,
    argTypes: {
        channels: {
            control: {
                type: "object",
            },
        },
    },
    parameters: {
        nextjs: {
            appDirectory: true,
        },
    },
};