"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const db_1 = __importDefault(require("../config/db"));
class UserController {
    getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [rows] = yield db_1.default.query('SELECT * FROM users');
                res.json(rows);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const [rows] = yield db_1.default.query('SELECT * FROM users WHERE id = ?', [id]);
                if (rows.length > 0) {
                    res.json(rows[0]);
                }
                else {
                    res.status(404).json({ message: 'User not found' });
                }
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const [personalInfoRows] = yield db_1.default.query('SELECT id FROM personal_info WHERE id = ?', [personal_info]);
                if (personalInfoRows.length === 0) {
                    return res.status(400).json({ message: 'Invalid personal_info: ID does not exist' });
                }
                const [result] = yield db_1.default.query('INSERT INTO users (is_admin, personal_info) VALUES (?, ?)', [isAdminValue, personal_info]);
                if (result && 'insertId' in result) {
                    res.status(201).json({ id: result.insertId, message: 'User created' });
                }
                else {
                    throw new Error('Failed to create user: No insert ID returned');
                }
            }
            catch (error) {
                console.error('Error in createUser:', error);
                res.status(500).json({
                    error: 'Internal Server Error',
                    details: error.message,
                    stack: error.stack
                });
            }
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const [userRows] = yield db_1.default.query('SELECT * FROM users WHERE id = ?', [id]);
                if (userRows.length === 0) {
                    return res.status(404).json({ message: 'User not found' });
                }
                // Verificar si el personal_info existe
                const [personalInfoRows] = yield db_1.default.query('SELECT id FROM personal_info WHERE id = ?', [personal_info]);
                if (personalInfoRows.length === 0) {
                    return res.status(400).json({ message: 'Invalid personal_info: ID does not exist' });
                }
                const [result] = yield db_1.default.query('UPDATE users SET is_admin = ?, personal_info = ? WHERE id = ?', [isAdminValue, personal_info, id]);
                if (result && result.affectedRows > 0) {
                    res.status(200).json({ message: 'User updated successfully' });
                }
                else {
                    throw new Error('Failed to update user: No rows affected');
                }
            }
            catch (error) {
                console.error('Error in updateUser:', error);
                res.status(500).json({
                    error: 'Internal Server Error',
                    details: error.message,
                    stack: error.stack
                });
            }
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const [result] = yield db_1.default.query('DELETE FROM users WHERE id = ?', [id]);
                if (result && result.affectedRows > 0) {
                    res.status(200).json({ message: 'User deleted successfully' });
                }
                else {
                    res.status(404).json({ message: 'User not found' });
                }
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
}
exports.UserController = UserController;
