import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../lib/prisma';

export const createReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const report = await prisma.report.create({
      data: { ...req.body, scoutUserId: req.userId! },
    });
    res.status(201).json(report);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear reporte' });
  }
};

export const getReportsByPlayer = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { playerId } = req.params;
    const reports = await prisma.report.findMany({
      where: { playerId },
      orderBy: { createdAt: 'desc' },
      include: { player: true },
    });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener reportes' });
  }
};

export const getMyReports = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const reports = await prisma.report.findMany({
      where: { scoutUserId: req.userId! },
      orderBy: { createdAt: 'desc' },
      include: { player: true },
    });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener reportes' });
  }
};

export const updateReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const report = await prisma.report.findUnique({ where: { id } });
    if (!report) { res.status(404).json({ message: 'Reporte no encontrado' }); return; }
    if (report.scoutUserId !== req.userId) { res.status(403).json({ message: 'Sin permisos' }); return; }
    const updated = await prisma.report.update({ where: { id }, data: req.body });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar reporte' });
  }
};

export const deleteReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const report = await prisma.report.findUnique({ where: { id } });
    if (!report) { res.status(404).json({ message: 'Reporte no encontrado' }); return; }
    if (report.scoutUserId !== req.userId) { res.status(403).json({ message: 'Sin permisos' }); return; }
    await prisma.report.delete({ where: { id } });
    res.json({ message: 'Reporte eliminado' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar reporte' });
  }
};
