import { Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const getPlayers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { position, minAge, maxAge, foot, available } = req.query;
    const now = new Date();
    const filters: any = { isPublic: true };
    if (available === 'true') filters.isAvailable = true;
    if (foot) filters.dominantFoot = foot;
    const players = await prisma.player.findMany({
      where: filters,
      include: {
        positions: { include: { position: true } },
        videos: { where: { isPrimary: true } },
        user: { select: { email: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    res.json(players);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener jugadores' });
  }
};

export const getPlayerById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const player = await prisma.player.findUnique({
      where: { id },
      include: {
        positions: { include: { position: true } },
        history: { orderBy: { createdAt: 'desc' } },
        videos: true,
        user: { select: { email: true } },
      },
    });
    if (!player) { res.status(404).json({ message: 'Jugador no encontrado' }); return; }
    if (!player.isPublic && player.userId !== req.userId) {
      res.status(403).json({ message: 'Perfil privado' }); return;
    }
    res.json(player);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener jugador' });
  }
};

export const createPlayer = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = req.body;
    const player = await prisma.player.create({
      data: { ...data, userId: req.userId! },
    });
    res.status(201).json(player);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear jugador' });
  }
};

export const updatePlayer = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const player = await prisma.player.findUnique({ where: { id } });
    if (!player) { res.status(404).json({ message: 'Jugador no encontrado' }); return; }
    if (player.userId !== req.userId) { res.status(403).json({ message: 'Sin permisos' }); return; }
    const updated = await prisma.player.update({ where: { id }, data: req.body });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar jugador' });
  }
};

export const addVideo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { url, title, type, isPrimary } = req.body;
    const video = await prisma.video.create({
      data: { playerId: id, url, title, type, isPrimary: isPrimary || false },
    });
    res.status(201).json(video);
  } catch (err) {
    res.status(500).json({ message: 'Error al agregar video' });
  }
};

export const addHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const history = await prisma.playerHistory.create({
      data: { playerId: id, ...req.body },
    });
    res.status(201).json(history);
  } catch (err) {
    res.status(500).json({ message: 'Error al agregar historial' });
  }
};
