import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../lib/prisma';

export const createNeed = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const club = await prisma.club.findUnique({ where: { userId: req.userId! } });
    if (!club) { res.status(404).json({ message: 'No tienes club registrado' }); return; }
    const need = await prisma.need.create({
      data: { ...req.body, clubId: club.id },
    });
    res.status(201).json(need);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear necesidad' });
  }
};

export const getNeeds = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const needs = await prisma.need.findMany({
      orderBy: { createdAt: 'desc' },
      include: { club: { select: { name: true } } },
    });
    res.json(needs);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener necesidades' });
  }
};

export const getMyNeeds = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const club = await prisma.club.findUnique({ where: { userId: req.userId! } });
    if (!club) { res.status(404).json({ message: 'No tienes club registrado' }); return; }
    const needs = await prisma.need.findMany({
      where: { clubId: club.id },
      orderBy: { createdAt: 'desc' },
    });
    res.json(needs);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener necesidades' });
  }
};

export const updateNeed = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const club = await prisma.club.findUnique({ where: { userId: req.userId! } });
    if (!club) { res.status(404).json({ message: 'No tienes club registrado' }); return; }
    const need = await prisma.need.findUnique({ where: { id } });
    if (!need) { res.status(404).json({ message: 'Necesidad no encontrada' }); return; }
    if (need.clubId !== club.id) { res.status(403).json({ message: 'Sin permisos' }); return; }
    const updated = await prisma.need.update({ where: { id }, data: req.body });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar necesidad' });
  }
};

export const deleteNeed = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const club = await prisma.club.findUnique({ where: { userId: req.userId! } });
    if (!club) { res.status(404).json({ message: 'No tienes club registrado' }); return; }
    const need = await prisma.need.findUnique({ where: { id } });
    if (!need) { res.status(404).json({ message: 'Necesidad no encontrada' }); return; }
    if (need.clubId !== club.id) { res.status(403).json({ message: 'Sin permisos' }); return; }
    await prisma.need.delete({ where: { id } });
    res.json({ message: 'Necesidad eliminada' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar necesidad' });
  }
};
