import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createFolder = async (req: Request, res: Response) => {
  const { name } = req.body;
  const userId = (req.user as any).id;

  try {
    const folder = await prisma.folder.create({
      data: {
        name,
        userId,
      },
    });
    res.status(201).json(folder);
  } catch (error) {
    res.status(500).json({ error: 'Error creating folder' });
  }
};

export const getFolders = async (req: Request, res: Response) => {
  const userId = (req.user as any).id;

  try {
    const folders = await prisma.folder.findMany({
      where: { userId },
    });
    res.json(folders);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching folders' });
  }
};

export const getFolder = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req.user as any).id;

  try {
    const folder = await prisma.folder.findFirst({
      where: { id: Number(id), userId },
      include: { files: true },
    });
    if (!folder) {
      return res.status(404).json({ error: 'Folder not found' });
    }
    res.json(folder);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching folder' });
  }
};

export const updateFolder = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  const userId = (req.user as any).id;

  try {
    const updatedFolder = await prisma.folder.updateMany({
      where: { id: Number(id), userId },
      data: { name },
    });
    if (updatedFolder.count === 0) {
      return res.status(404).json({ error: 'Folder not found' });
    }
    res.json({ message: 'Folder updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating folder' });
  }
};

export const deleteFolder = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req.user as any).id;

  try {
    const deletedFolder = await prisma.folder.deleteMany({
      where: { id: Number(id), userId },
    });
    if (deletedFolder.count === 0) {
      return res.status(404).json({ error: 'Folder not found' });
    }
    res.json({ message: 'Folder deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting folder' });
  }
};