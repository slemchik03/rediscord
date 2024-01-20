"use client";

import useFriendInvite from "@/lib/hooks/sockets/useFriendsInvite";


export default function Notifications() {
  useFriendInvite();
  return null;
}
