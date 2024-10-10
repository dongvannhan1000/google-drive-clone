import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { Folder } from '../models/user';

const prisma = new PrismaClient();

export const createFolder = async (req: Request, res: Response) => {
  const { name } = req.body;
  const userId = (req.user as any).id;

  try {
    const folder = await Folder.create({
      data: {
        name,
        userId,
      },
    });
    res.redirect('/files/folders');
  } catch (error) {
    res.status(500).render('error', { message: 'Error creating folder' });
  }
};

export const getFolders = async (req: Request, res: Response) => {
  const userId = (req.user as any).id;

  try {
    const folders = await Folder.findMany({
      where: { userId },
    });
    res.render('folders', { folders });
  } catch (error) {
    res.status(500).render('error', { message: 'Error fetching folders' })
  }
};

export const getFolder = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req.user as any).id;

  try {
    const folder = await Folder.findFirst({
      where: { id: Number(id), userId },
      include: { files: true },
    });
    if (!folder) {
      return res.status(404).json({ error: 'Folder not found' });
    }
    res.render('folder', { folder });
  } catch (error) {
    res.status(500).render('error', { message: 'Error fetching folder' });
  }
};

export const updateFolder = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  const userId = (req.user as any).id;

  try {
    const updatedFolder = await Folder.updateMany({
      where: { id: Number(id), userId },
      data: { name },
    });
    if (updatedFolder.count === 0) {
      return res.status(404).render('error', { message: 'Folder not found' });
    }
    res.redirect('/files/folders');
  } catch (error) {
    res.status(500).render('error', { message: 'Error updating folder' })
  }
};

export const deleteFolder = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req.user as any).id;

  try {
    const deletedFolder = await Folder.deleteMany({
      where: { id: Number(id), userId },
    });
    if (deletedFolder.count === 0) {
      return res.status(404).render('error', { message: 'Folder not found' });
    }
    res.redirect('/files/folders');
  } catch (error) {
    res.status(500).render('error', { message: 'Error deleting folder' });
  }
};