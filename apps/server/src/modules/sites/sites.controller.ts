import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class SiteController {
  // Get all sites
  static async getAll(req: Request, res: Response) {
    try {
      const sites = await prisma.sites.findMany({
        include: { clients: true, rentals: true }
      });
      return res.status(200).json(sites);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to fetch sites' });
    }
  }

  // Get site by ID
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const site = await prisma.sites.findUnique({
        where: { site_id: Number(id) },
        include: { clients: true, rentals: true }
      });

      if (!site) return res.status(404).json({ error: 'Site not found' });

      return res.status(200).json(site);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to fetch site' });
    }
  }

  // Create new site
  static async create(req: Request, res: Response) {
    try {
      const { site_name, location, client_id, latitude, longitude, geofence_radius_meters } = req.body;

      const site = await prisma.sites.create({
        data: {
          site_name,
          location,
          client_id,
          latitude,
          longitude,
          geofence_radius_meters
        }
      });

      return res.status(201).json(site);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to create site' });
    }
  }

  // Update site
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { site_name, location, client_id, latitude, longitude, geofence_radius_meters } = req.body;

      const site = await prisma.sites.update({
        where: { site_id: Number(id) },
        data: {
          site_name,
          location,
          client_id,
          latitude,
          longitude,
          geofence_radius_meters
        }
      });

      return res.status(200).json(site);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to update site' });
    }
  }
}
