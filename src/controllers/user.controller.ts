import { Request, Response } from 'express';
import { RowDataPacket, OkPacket } from 'mysql2';
import db from '../config/db';

type QueryResult<T> = [T, any];

interface User {
    id: number;
    is_admin: boolean;
    personal_info: number;
}

export class UserController {
    async getAllUsers(req: Request, res: Response) {
        try {
            const [rows] = await db.query('SELECT * FROM users') as QueryResult<User[]>;
            res.json(rows);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async getUserById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]) as QueryResult<User[]>;
            if (rows.length > 0) {
                res.json(rows[0]);
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async createUser(req: Request, res: Response) {
        try {
            const { is_admin, personal_info } = req.body;
            
            console.log('Received data:', { is_admin, personal_info });
            console.log('Types:', { 
                is_admin: typeof is_admin, 
                personal_info: typeof personal_info 
            });

            // Convertir is_admin a 0 o 1
            const isAdminValue = is_admin ? 1 : 0;

            if (typeof personal_info !== 'number' || isNaN(personal_info)) {
                return res.status(400).json({ 
                    message: 'Invalid input data',
                    receivedTypes: {
                        is_admin: typeof is_admin,
                        personal_info: typeof personal_info
                    },
                    expectedTypes: {
                        is_admin: 'boolean or number (0 or 1)',
                        personal_info: 'number'
                    }
                });
            }

            // Verificar si el personal_info existe
            const [personalInfoRows] = await db.query('SELECT id FROM personal_info WHERE id = ?', [personal_info]) as QueryResult<RowDataPacket[]>;
            if (personalInfoRows.length === 0) {
                return res.status(400).json({ message: 'Invalid personal_info: ID does not exist' });
            }

            const [result] = await db.query(
                'INSERT INTO users (is_admin, personal_info) VALUES (?, ?)',
                [isAdminValue, personal_info]
            ) as QueryResult<OkPacket>;

            if (result && 'insertId' in result) {
                res.status(201).json({ id: result.insertId, message: 'User created' });
            } else {
                throw new Error('Failed to create user: No insert ID returned');
            }
        } catch (error) {
            console.error('Error in createUser:', error);
            res.status(500).json({ 
                error: 'Internal Server Error', 
                details: (error as Error).message,
                stack: (error as Error).stack
            });
        }
    }

    async updateUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { is_admin, personal_info } = req.body;

            console.log('Received data:', { id, is_admin, personal_info });
            console.log('Types:', { 
                id: typeof id,
                is_admin: typeof is_admin, 
                personal_info: typeof personal_info 
            });

            // Convertir is_admin a 0 o 1
            const isAdminValue = is_admin ? 1 : 0;

            if (typeof personal_info !== 'number' || isNaN(personal_info)) {
                return res.status(400).json({ 
                    message: 'Invalid input data',
                    receivedTypes: {
                        is_admin: typeof is_admin,
                        personal_info: typeof personal_info
                    },
                    expectedTypes: {
                        is_admin: 'boolean or number (0 or 1)',
                        personal_info: 'number'
                    }
                });
            }

            // Verificar si el usuario existe
            const [userRows] = await db.query('SELECT * FROM users WHERE id = ?', [id]) as QueryResult<User[]>;
            if (userRows.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Verificar si el personal_info existe
            const [personalInfoRows] = await db.query('SELECT id FROM personal_info WHERE id = ?', [personal_info]) as QueryResult<RowDataPacket[]>;
            if (personalInfoRows.length === 0) {
                return res.status(400).json({ message: 'Invalid personal_info: ID does not exist' });
            }

            const [result] = await db.query(
                'UPDATE users SET is_admin = ?, personal_info = ? WHERE id = ?',
                [isAdminValue, personal_info, id]
            ) as QueryResult<OkPacket>;

            if (result && result.affectedRows > 0) {
                res.status(200).json({ message: 'User updated successfully' });
            } else {
                throw new Error('Failed to update user: No rows affected');
            }
        } catch (error) {
            console.error('Error in updateUser:', error);
            res.status(500).json({ 
                error: 'Internal Server Error', 
                details: (error as Error).message,
                stack: (error as Error).stack
            });
        }
    }

    async deleteUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]) as QueryResult<OkPacket>;

            if (result && result.affectedRows > 0) {
                res.status(200).json({ message: 'User deleted successfully' });
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }
}
