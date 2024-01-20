"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import getQueryClient from "../../app/getQueryClient";
import { SessionProvider } from "next-auth/react";
import { SocketProvider } from "./SocketProvider";

export default function Providers({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={getQueryClient()}>
      <SessionProvider>
        <SocketProvider>{children}</SocketProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}
