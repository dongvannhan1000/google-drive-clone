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
    res.redirect('/files/folders');
  } catch (error) {
    res.status(500).render('error', { message: 'Error uploading file' });
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
    res.redirect(`/files/folders/${folderId}`);
  } catch (error) {
    res.status(500).render('error', { message: 'Error uploading file to folder' });
  }
};

export const deleteFile = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req.user as any).id;

  try {
    const deletedFile = await File.deleteMany({
      where: { id: Number(id), userId },
    });
    if (deletedFile.count === 0) {
      return res.status(404).render('error', { message: 'File not found' });
    }
    res.redirect('/files/folders');
  } catch (error) {
    res.status(500).render('error', { message: 'Error deleting file' });
  }
};