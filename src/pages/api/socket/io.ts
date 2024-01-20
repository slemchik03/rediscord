import authOptions from "@/lib/authOptions";
import prisma from "@/lib/prismaClient";
import { UserStatuses } from "@prisma/client";
import { Server as NetServer } from "http";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { Server as ServerIO, Socket } from "socket.io";

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Omit<Socket, "server"> & {
    server: NetServer & {
      io: ServerIO;
    };
  };
};

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = async (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (!res.socket.server.io) {
    const session = await getServerSession(req, res, authOptions);
    const path = "/api/socket/io";
    const httpServer: NetServer = res.socket.server;
    const io = new ServerIO(httpServer, {
      path,
      addTrailingSlash: false,
    });
    res.socket.server.io = io;

    const eventKey = `friend-status-${session?.user?.id}`;
    io.on("connection", async (socket) => {
      io.emit(eventKey, {
        status: UserStatuses.ONLINE,
      });
      await prisma.user.update({
        where: { id: session?.user?.id },
        data: {
          status: UserStatuses.ONLINE,
        },
      });
      socket.on("disconnect", async () => {
        await prisma.user.update({
          where: { id: session?.user?.id },
          data: {
            status: UserStatuses.OFFLINE,
          },
        });
        io.emit(eventKey, {
          status: UserStatuses.OFFLINE,
        });
      });
    });
  }
  res.end();
};

export default ioHandler;
