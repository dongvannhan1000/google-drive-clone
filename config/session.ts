import session from 'express-session';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { prisma } from '../utils/prisma';
import { IPrisma } from '@quixo3/prisma-session-store/dist/@types';

export const sessionMiddleware = session({
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000 // ms
  },
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: true,
  saveUninitialized: true,
  store: new PrismaSessionStore(
    prisma as unknown as IPrisma<"session">,
    {
      checkPeriod: 2 * 60 * 1000,  // ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }
  )
});