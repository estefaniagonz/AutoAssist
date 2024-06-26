import { Request, Response } from 'express';
import { RowDataPacket, OkPacket } from 'mysql2';
import db from '../config/db'; // Asegúrate de importar correctamente tu configuración de la base de datos.

type RowDataPacketArray = RowDataPacket[] | RowDataPacket[][];
type QueryResult<T extends RowDataPacket[] | RowDataPacket[][] | OkPacket> = [T, any];

interface ProductData {
  id: number;
  name: string;
  value: number;
}

export class ProductController {
  async getAllProducts(req: Request, res: Response) {
    try {
      const [rows] = await db.query('SELECT * FROM products') as QueryResult<RowDataPacketArray>;
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getProductById(req: Request, res: Response) {
    try {
      const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]) as QueryResult<RowDataPacketArray>;
      if (rows.length > 0) {
        res.json(rows[0] as ProductData);
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async createProduct(req: Request, res: Response) {
    const { name, value } = req.body;
    if (!name || !value) {
      return res.status(400).json({ error: 'Name and value are required' });
    }

    try {
      const result = await db.query('INSERT INTO products (name, value) VALUES (?, ?)', [name, value]);
      const insertId = (result[0] as any).insertId;
      if (!insertId) {
        throw new Error('Insert ID not found');
      }
      res.json({ message: 'Product created', id: insertId });
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ error: 'Failed to create product' });
    }
  }

  async updateProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, value } = req.body;

      const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]) as QueryResult<RowDataPacketArray>;
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Product not found' });
      }

      const [result] = await db.query(
        'UPDATE products SET name = ?, value = ? WHERE id = ?',
        [name, value, id]
      ) as QueryResult<OkPacket>;

      if (result.affectedRows > 0) {
        res.status(200).json({ message: 'Product updated successfully' });
      } else {
        res.status(500).json({ message: 'Failed to update product' });
      }
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async deleteProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const [result] = await db.query('DELETE FROM products WHERE id = ?', [id]) as QueryResult<OkPacket>;

      if (result.affectedRows > 0) {
        res.status(200).json({ message: 'Product deleted successfully' });
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}
