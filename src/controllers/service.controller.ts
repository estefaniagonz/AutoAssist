// src/controllers/service.controller.ts
import { Request, Response } from 'express';
import { RowDataPacket, OkPacket } from 'mysql2';
import db from '../config/db';

type QueryResult<T> = [T, any];

interface ServiceData {
  id: number;
  name: string;
  description: string;
  value: number;
}

export class ServiceController {
  async getAllServices(req: Request, res: Response) {
    try {
      const [rows] = await db.query('SELECT * FROM services') as QueryResult<RowDataPacket[]>;
      res.json(rows);
    } catch (error) {
      console.error('Error fetching services:', error);
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getServiceById(req: Request, res: Response) {
    try {
      const [rows] = await db.query('SELECT * FROM services WHERE id = ?', [req.params.id]) as QueryResult<RowDataPacket[]>;
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Service not found' });
      }
      res.json(rows[0]);
    } catch (error) {
      console.error('Error fetching service:', error);
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async createService(req: Request, res: Response) {
    const { name, description, value } = req.body as ServiceData;

    if (!name || !description || value == null) {
      return res.status(400).json({ error: 'All fields are required to create a service' });
    }

    try {
      const [result] = await db.query(
        'INSERT INTO services (name, description,value) VALUES (?, ?, ?)',
        [name, description, value]
      ) as QueryResult<OkPacket>;

      const insertedId = result.insertId;
      res.status(201).json({ id: insertedId, message: 'Service created' });
    } catch (error) {
      console.error('Error creating service:', error);
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async updateService(req: Request, res: Response) {
    const { id } = req.params;
    const { name, description,value } = req.body;

    if (!name || !description || value == null) {
      return res.status(400).json({ error: 'All fields are required to update a service' });
    }

    try {
      const [result] = await db.query(
        'UPDATE services SET name = ?, description = ?, value = ? WHERE id = ?',
        [name, description, value, id]
      ) as QueryResult<OkPacket>;

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Service not found' });
      }

      res.status(200).json({ message: 'Service updated successfully' });
    } catch (error) {
      console.error('Error updating service:', error);
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async deleteService(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const [result] = await db.query('DELETE FROM services WHERE id = ?', [id]) as QueryResult<OkPacket>;

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Service not found' });
      }

      res.status(200).json({ message: 'Service deleted successfully' });
    } catch (error) {
      console.error('Error deleting service:', error);
      res.status(500).json({ error: (error as Error).message });
    }
  }
}
