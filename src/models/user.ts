import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const User = prisma.user;

export const File = prisma.file;

export const Folder = prisma.folder;