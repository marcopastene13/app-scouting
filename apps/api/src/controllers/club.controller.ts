import { Response } from "express";
import prisma from "../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

export const getClubById = async (req: AuthRequest, res: Response) => {
  try {
    const club = await prisma.club.findUnique({
      where: { id: req.params.id },
      include: { needs: { where: { status: 'open' }, orderBy: { createdAt: 'desc' } } },
    });
    return res.json(club);
  } catch { return res.status(500).json({ message: 'Error interno' }); }
};

export const createClub = async (req: AuthRequest, res: Response) => {
  try {
    const existing = await prisma.club.findUnique({ where: { userId: req.userId! } });
    if (existing) return res.status(409).json({ message: 'Ya tienes un perfil de club' });
    const club = await prisma.club.create({ data: { ...req.body, userId: req.userId! } });
    return res.status(201).json(club);
  } catch { return res.status(500).json({ message: 'Error interno' }); }
};

export const updateClub = async (req: AuthRequest, res: Response) => {
  try {
    const club = await prisma.club.update({ where: { id: req.params.id }, data: req.body });
    return res.json(club);
  } catch { return res.status(500).json({ message: 'Error interno' }); }
};
