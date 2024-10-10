import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { File, Folder } from '../models/user';

const prisma = new PrismaClient();

export const uploadFile = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const userId = (req.user as any).id;

  try {
    const file = await File.create({
      data: {
        name: req.file.originalname,
        type: req.file.mimetype,
        size: req.file.size,
        path: req.file.path,
        userId,
      },
    });
    res.status(201).json(file);
  } catch (error) {
    res.status(500).json({ error: 'Error uploading file' });
  }
};

export const uploadFileToFolder = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const userId = (req.user as any).id;
  const folderId = Number(req.params.folderId);

  try {
    const folder = await Folder.findFirst({
      where: { id: folderId, userId },
    });

    if (!folder) {
      return res.status(404).json({ error: 'Folder not found' });
    }

    const file = await prisma.file.create({
      data: {
        name: req.file.originalname,
        type: req.file.mimetype,
        size: req.file.size,
        path: req.file.path,
        userId,
        folderId,
      },
    });
    res.status(201).json(file);
  } catch (error) {
    res.status(500).json({ error: 'Error uploading file to folder' });
  }
};