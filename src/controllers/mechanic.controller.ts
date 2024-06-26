import { Request, Response } from 'express';
import { RowDataPacket, OkPacket } from 'mysql2';
import db from '../config/db';

type RowDataPacketArray = RowDataPacket[] | RowDataPacket[][];
type QueryResult<T extends RowDataPacket[] | RowDataPacket[][] | OkPacket> = [T, any];

function isRowDataPacketArray(result: any): result is RowDataPacket[] {
  return Array.isArray(result) && result.length > 0 && 'id' in result[0];
}

function isOkPacket(result: any): result is OkPacket {
  return 'affectedRows' in result || 'insertId' in result;
}

interface MechanicData {
  id: number;
  is_active: boolean;
  personal_info: number;
}

export class MechanicController {
  async getAllMechanics(req: Request, res: Response) {
    try {
      const [rows] = await db.query('SELECT * FROM mechanics') as QueryResult<RowDataPacketArray>;
      res.json(rows);
    } catch (error) {
      console.error('Error al obtener los mecánicos:', error);
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getMechanicById(req: Request, res: Response) {
    try {
      const [rows] = await db.query('SELECT * FROM mechanics WHERE id = ?', [req.params.id]) as QueryResult<RowDataPacketArray>;
      if (!rows || rows.length === 0) {
        res.status(404).json({ message: 'Mechanic not found' });
      } else if (isRowDataPacketArray(rows)) {
        res.json(rows[0] as MechanicData);
      } else {
        res.status(500).json({ error: 'Unexpected result format' });
      }
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async createMechanic(req: Request, res: Response) {
    const { is_active, personal_info } = req.body as MechanicData;

    if (is_active == null || personal_info == null) {
      return res.status(400).json({ error: 'All fields are required to create a mechanic' });
    }

    try {
      const [result] = await db.query(
        'INSERT INTO mechanics (is_active, personal_info) VALUES (?, ?)',
        [is_active, personal_info]
      );

      const insertedId = (result as OkPacket).insertId;
      res.status(201).json({ id: insertedId, message: 'Mechanic created' });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async updateMechanic(req: Request, res: Response) {
    const { id } = req.params;
    const { is_active, personal_info } = req.body;

    if (is_active == null || personal_info == null) {
      return res.status(400).json({ error: 'All fields are required to update a mechanic' });
    }

    try {
      const [rows] = await db.query('SELECT * FROM mechanics WHERE id = ?', [id]) as QueryResult<RowDataPacketArray>;
      if (!isRowDataPacketArray(rows) || rows.length === 0) {
        return res.status(404).json({ message: 'Mechanic not found' });
      }

      const [result] = await db.query(
        'UPDATE mechanics SET is_active = ?, personal_info = ? WHERE id = ?',
        [is_active, personal_info, id]
      ) as QueryResult<OkPacket>;

      if (isOkPacket(result) && result.affectedRows > 0) {
        res.status(200).json({ message: 'Mechanic updated successfully' });
      } else {
        res.status(500).json({ message: 'Failed to update mechanic' });
      }
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async deleteMechanic(req: Request, res: Response) {
    try {
      const { id } = req.params;
  
      const [result] = await db.query('DELETE FROM mechanics WHERE id = ?', [id]) as QueryResult<OkPacket>;
  
      if (result.affectedRows === 0) {
        res.status(404).json({ message: 'Mechanic not found' });
      } else {
        res.status(200).json({ message: 'Mechanic deleted successfully' });
      }
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}  