import { Response } from "express";
import prisma from "../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

export const getNeeds = async (req: AuthRequest, res: Response) => {
  try {
    const needs = await prisma.need.findMany({
      where: { status: 'open' },
      include: { club: { select: { name: true, category: true, city: true, logoUrl: true } }, position: true },
      orderBy: { createdAt: 'desc' },
    });
    return res.json(needs);
  } catch { return res.status(500).json({ message: 'Error interno' }); }
};

export const createNeed = async (req: AuthRequest, res: Response) => {
  try {
    const club = await prisma.club.findUnique({ where: { userId: req.userId! } });
    const need = await prisma.need.create({ data: { ...req.body, clubId: club.id } });
    return res.status(201).json(need);
  } catch { return res.status(500).json({ message: 'Error interno' }); }
};

export const applyToNeed = async (req: AuthRequest, res: Response) => {
  try {
    const player = await prisma.player.findUnique({ where: { userId: req.userId! } });
    const app = await prisma.application.create({
      data: { needId: req.params.id, playerId: player.id, message: req.body.message },
    });
    return res.status(201).json(app);
  } catch { return res.status(500).json({ message: 'Error interno o ya postulaste' }); }
};
