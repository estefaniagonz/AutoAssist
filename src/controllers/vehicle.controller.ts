import { Request, Response } from 'express';
import { RowDataPacket, OkPacket } from 'mysql2';
import db from '../config/db';

type RowDataPacketArray = RowDataPacket[] | RowDataPacket[][];
type QueryResult<T extends RowDataPacket[] | RowDataPacket[][] | OkPacket> = [T, any];

interface VehicleData {
  id: number;
  user: number;
  model: string;
  placa: string;
  year: number;
}

export class VehicleController {

  async getAllVehicles(req: Request, res: Response) {
    try {
      const [rows] = await db.query('SELECT * FROM vehicles') as QueryResult<RowDataPacketArray>;
      res.json(rows);
    } catch (error) {
      console.error('Error al obtener los vehículos:', error);
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getVehicleById(req: Request, res: Response) {
    try {
      const [rows] = await db.query('SELECT * FROM vehicles WHERE id = ?', [req.params.id]) as QueryResult<RowDataPacketArray>;
      if (!rows || rows.length === 0) {
        res.status(404).json({ message: 'Vehicle not found' });
      } else {
        const vehicle = rows[0] as VehicleData;
        res.json(vehicle);
      }
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async createVehicle(req: Request, res: Response) {
    const { user, model, placa, year } = req.body as VehicleData;

    if (!user || !model || !placa || !year) {
      return res.status(400).json({ error: 'All fields including year are required to create a vehicle' });
    }

    try {
      const [result] = await db.query(
        'INSERT INTO vehicles (user, model, placa, year) VALUES (?, ?, ?, ?)',
        [user, model, placa, year]
      );

      const insertedId = (result as OkPacket).insertId;
      res.status(201).json({ id: insertedId, message: 'Vehicle created' });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async updateVehicle(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { user, model, placa, year } = req.body as VehicleData;

      // Verificar si el vehículo existe
      const [rows] = await db.query('SELECT * FROM vehicles WHERE id = ?', [id]) as QueryResult<RowDataPacketArray>;
      if (!rows || rows.length === 0) {
        return res.status(404).json({ message: 'Vehicle not found' });
      }

      // Actualizar el vehículo
      const [result] = await db.query(
        'UPDATE vehicles SET user = ?, model = ?, placa = ?, year = ? WHERE id = ?',
        [user, model, placa, year, id]
      ) as QueryResult<OkPacket>;

      if (result.affectedRows > 0) {
        res.status(200).json({ message: 'Vehicle updated successfully' });
      } else {
        res.status(500).json({ message: 'Failed to update vehicle' });
      }
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async deleteVehicle(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const [result] = await db.query('DELETE FROM vehicles WHERE id = ?', [id]) as QueryResult<OkPacket>;

      if (result.affectedRows > 0) {
        res.status(200).json({ message: 'Vehicle deleted successfully' });
      } else {
        res.status(404).json({ message: 'Vehicle not found' });
      }
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

}
