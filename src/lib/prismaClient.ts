import { PrismaClient } from "@prisma/client";
// @ts-ignore its ok
const prisma: PrismaClient = globalThis.prisma || new PrismaClient();
// @ts-ignore its ok
globalThis.prisma = prisma;

export default prisma;
