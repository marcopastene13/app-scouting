import { Response } from "express";
import prisma from "../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

export const getPlayers = async (req: AuthRequest, res: Response) => {
  try {
    const { position, minAge, maxAge, foot, available } = req.query;
    const where: any = { isPublic: true };
    if (available !== undefined) where.isAvailable = available === 'true';
    if (foot) where.dominantFoot = foot;
    const players = await prisma.player.findMany({
      where,
      include: { positions: { include: { position: true } }, videos: { where: { isPrimary: true } } },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return res.json(players);
  } catch { return res.status(500).json({ message: 'Error interno' }); }
};

export const getPlayerById = async (req: AuthRequest, res: Response) => {
  try {
    const player = await prisma.player.findUnique({
      where: { id: req.params.id },
      include: { positions: { include: { position: true } }, videos: true, history: true },
    });
    return res.json(player);
  } catch { return res.status(500).json({ message: 'Error interno' }); }
};

export const createPlayer = async (req: AuthRequest, res: Response) => {
  try {
    const existing = await prisma.player.findUnique({ where: { userId: req.userId! } });
    if (existing) return res.status(409).json({ message: 'Ya tienes un perfil de jugador' });
    const player = await prisma.player.create({ data: { ...req.body, userId: req.userId! } });
    return res.status(201).json(player);
  } catch { return res.status(500).json({ message: 'Error interno' }); }
};

export const updatePlayer = async (req: AuthRequest, res: Response) => {
  try {
    const player = await prisma.player.update({ where: { id: req.params.id }, data: req.body });
    return res.json(player);
  } catch { return res.status(500).json({ message: 'Error interno' }); }
};
