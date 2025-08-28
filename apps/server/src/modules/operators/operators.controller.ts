import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class OperatorController {
  // Get all operators
  static async getAll(req: Request, res: Response) {
    try {
      const operators = await prisma.operator.findMany({
        include: {
          company: true
        }
      });
      return res.status(200).json(operators);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch operators' });
    }
  }

  // Get operator by ID
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const operator = await prisma.operator.findUnique({
        where: { operator_id: Number(id) },
        include: {
          company: true
        }
      });
      
      if (!operator) {
        return res.status(404).json({ error: 'Operator not found' });
      }
      
      return res.status(200).json(operator);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch operator' });
    }
  }

  // Create new operator
  static async create(req: Request, res: Response) {
    try {
      const { operator_code, name, company_id } = req.body;
      
      const operator = await prisma.operator.create({
        data: {
          operator_code,
          name,
          company_id
        },
        include: {
          company: true
        }
      });
      
      return res.status(201).json(operator);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create operator' });
    }
  }

  // Update operator
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { operator_code, name, company_id } = req.body;
      
      const operator = await prisma.operator.update({
        where: { operator_id: Number(id) },
        data: {
          operator_code,
          name,
          company_id
        },
        include: {
          company: true
        }
      });
      
      return res.status(200).json(operator);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update operator' });
    }
  }
}