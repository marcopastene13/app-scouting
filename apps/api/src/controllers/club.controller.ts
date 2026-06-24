import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../lib/prisma';

export const createClub = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const existing = await prisma.club.findUnique({ where: { userId: req.userId! } });
    if (existing) { res.status(400).json({ message: 'Ya tienes un club registrado' }); return; }
    const club = await prisma.club.create({ data: { ...req.body, userId: req.userId! } });
    res.status(201).json(club);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear club' });
  }
};

export const updateClub = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const club = await prisma.club.findUnique({ where: { id } });
    if (!club) { res.status(404).json({ message: 'Club no encontrado' }); return; }
    if (club.userId !== req.userId) { res.status(403).json({ message: 'Sin permisos' }); return; }
    const updated = await prisma.club.update({ where: { id }, data: req.body });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar club' });
  }
};

export const getMyClub = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const club = await prisma.club.findUnique({
      where: { userId: req.userId! },
      include: { needs: true },
    });
    if (!club) { res.status(404).json({ message: 'No tienes club registrado' }); return; }
    res.json(club);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener club' });
  }
};
