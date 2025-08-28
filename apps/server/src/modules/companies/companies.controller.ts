import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CompanyController {
  // Get all companies
  static async getAll(req: Request, res: Response) {
    try {
      const companies = await prisma.company.findMany();
      return res.status(200).json(companies);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch companies' });
    }
  }

  // Get company by ID
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const company = await prisma.company.findUnique({
        where: { company_id: Number(id) }
      });
      
      if (!company) {
        return res.status(404).json({ error: 'Company not found' });
      }
      
      return res.status(200).json(company);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch company' });
    }
  }

  // Create new company
  static async create(req: Request, res: Response) {
    try {
      const { company_name, reliability_score, past_delays_count } = req.body;
      
      const company = await prisma.company.create({
        data: {
          company_name,
          reliability_score,
          past_delays_count
        }
      });
      
      return res.status(201).json(company);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create company' });
    }
  }

  // Update company
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { company_name, reliability_score, past_delays_count } = req.body;
      
      const company = await prisma.company.update({
        where: { company_id: Number(id) },
        data: {
          company_name,
          reliability_score,
          past_delays_count
        }
      });
      
      return res.status(200).json(company);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update company' });
    }
  }
}