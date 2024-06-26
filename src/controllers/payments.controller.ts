import { Request, Response } from 'express';
import { RowDataPacket, OkPacket } from 'mysql2';
import db from '../config/db';

type RowDataPacketArray = RowDataPacket[] | RowDataPacket[][];
type QueryResult<T extends RowDataPacket[] | RowDataPacket[][] | OkPacket> = [T, any];

interface PaymentData {
  id: number;
  invoice: number;
  amount: number;
  date: string;
  payment_method: string;
}

export class PaymentController {
  async getAllPayments(req: Request, res: Response) {
    try {
      const [rows] = await db.query('SELECT * FROM payments') as QueryResult<RowDataPacketArray>;
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getPaymentById(req: Request, res: Response) {
    try {
      const [rows] = await db.query('SELECT * FROM payments WHERE id = ?', [req.params.id]) as QueryResult<RowDataPacketArray>;
      if (rows.length > 0) {
        res.json(rows[0] as PaymentData);
      } else {
        res.status(404).json({ message: 'Payment not found' });
      }
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async createPayment(req: Request, res: Response) {
    const { invoice, amount, date, payment_method } = req.body;
    if (!invoice || !amount || !date || !payment_method) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      const [result] = await db.query(
        'INSERT INTO payments (invoice, amount, date, payment_method) VALUES (?, ?, ?, ?)',
        [invoice, amount, date, payment_method]
      ) as QueryResult<OkPacket>;

      const insertId = result.insertId;
      res.status(201).json({ message: 'Payment created', id: insertId });
    } catch (error) {
      console.error('Error creating payment:', error);
      res.status(500).json({ error: 'Failed to create payment' });
    }
  }

  async updatePayment(req: Request, res: Response) {
    const { invoice, amount, date, payment_method } = req.body;
    const { id } = req.params;

    if (!invoice || !amount || !date || !payment_method) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      const result = await db.query(
        'UPDATE payments SET invoice = ?, amount = ?, date = ?, payment_method = ? WHERE id = ?',
        [invoice, amount, date, payment_method, id]
      );

      if ((result[0] as OkPacket).affectedRows > 0) {
        res.json({ message: 'Payment updated', id: id });
      } else {
        res.status(404).json({ message: 'Payment not found' });
      }
    } catch (error) {
      console.error('Error updating payment:', error);
      res.status(500).json({ error: 'Failed to update payment' });
    }
  }

  async deletePayment(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const result = await db.query('DELETE FROM payments WHERE id = ?', [id]);

      if ((result[0] as OkPacket).affectedRows > 0) {
        res.json({ message: 'Payment deleted', id: id });
      } else {
        res.status(404).json({ message: 'Payment not found' });
      }
    } catch (error) {
      console.error('Error deleting payment:', error);
      res.status(500).json({ error: 'Failed to delete payment' });
    }
  }
}
