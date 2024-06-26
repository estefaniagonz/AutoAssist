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
exports.MechanicController = void 0;
const db_1 = __importDefault(require("../config/db"));
function isRowDataPacketArray(result) {
    return Array.isArray(result) && result.length > 0 && 'id' in result[0];
}
function isOkPacket(result) {
    return 'affectedRows' in result || 'insertId' in result;
}
class MechanicController {
    getAllMechanics(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [rows] = yield db_1.default.query('SELECT * FROM mechanics');
                res.json(rows);
            }
            catch (error) {
                console.error('Error al obtener los mecánicos:', error);
                res.status(500).json({ error: error.message });
            }
        });
    }
    getMechanicById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [rows] = yield db_1.default.query('SELECT * FROM mechanics WHERE id = ?', [req.params.id]);
                if (!rows || rows.length === 0) {
                    res.status(404).json({ message: 'Mechanic not found' });
                }
                else if (isRowDataPacketArray(rows)) {
                    res.json(rows[0]);
                }
                else {
                    res.status(500).json({ error: 'Unexpected result format' });
                }
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    createMechanic(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { is_active, personal_info } = req.body;
            if (is_active == null || personal_info == null) {
                return res.status(400).json({ error: 'All fields are required to create a mechanic' });
            }
            try {
                const [result] = yield db_1.default.query('INSERT INTO mechanics (is_active, personal_info) VALUES (?, ?)', [is_active, personal_info]);
                const insertedId = result.insertId;
                res.status(201).json({ id: insertedId, message: 'Mechanic created' });
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    updateMechanic(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { is_active, personal_info } = req.body;
            if (is_active == null || personal_info == null) {
                return res.status(400).json({ error: 'All fields are required to update a mechanic' });
            }
            try {
                const [rows] = yield db_1.default.query('SELECT * FROM mechanics WHERE id = ?', [id]);
                if (!isRowDataPacketArray(rows) || rows.length === 0) {
                    return res.status(404).json({ message: 'Mechanic not found' });
                }
                const [result] = yield db_1.default.query('UPDATE mechanics SET is_active = ?, personal_info = ? WHERE id = ?', [is_active, personal_info, id]);
                if (isOkPacket(result) && result.affectedRows > 0) {
                    res.status(200).json({ message: 'Mechanic updated successfully' });
                }
                else {
                    res.status(500).json({ message: 'Failed to update mechanic' });
                }
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    deleteMechanic(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const [result] = yield db_1.default.query('DELETE FROM mechanics WHERE id = ?', [id]);
                if (result.affectedRows === 0) {
                    res.status(404).json({ message: 'Mechanic not found' });
                }
                else {
                    res.status(200).json({ message: 'Mechanic deleted successfully' });
                }
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
}
exports.MechanicController = MechanicController;
