import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class SiteController {
  // Get all sites
  static async getAll(req: Request, res: Response) {
    try {
      const sites = await prisma.site.findMany();
      return res.status(200).json(sites);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch sites' });
    }
  }

  // Get site by ID
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const site = await prisma.site.findUnique({
        where: { site_id: Number(id) }
      });
      
      if (!site) {
        return res.status(404).json({ error: 'Site not found' });
      }
      
      return res.status(200).json(site);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch site' });
    }
  }

  // Create new site
  static async create(req: Request, res: Response) {
    try {
      const { site_code, site_name, location, latitude, longitude } = req.body;
      
      const site = await prisma.site.create({
        data: {
          site_code,
          site_name,
          location,
          latitude,
          longitude
        }
      });
      
      return res.status(201).json(site);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create site' });
    }
  }

  // Update site
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { site_code, site_name, location, latitude, longitude } = req.body;
      
      const site = await prisma.site.update({
        where: { site_id: Number(id) },
        data: {
          site_code,
          site_name,
          location,
          latitude,
          longitude
        }
      });
      
      return res.status(200).json(site);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update site' });
    }
  }
}