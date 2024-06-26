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
exports.VehicleController = void 0;
const db_1 = __importDefault(require("../config/db"));
class VehicleController {
    getAllVehicles(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [rows] = yield db_1.default.query('SELECT * FROM vehicles');
                res.json(rows);
            }
            catch (error) {
                console.error('Error al obtener los vehículos:', error);
                res.status(500).json({ error: error.message });
            }
        });
    }
    getVehicleById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [rows] = yield db_1.default.query('SELECT * FROM vehicles WHERE id = ?', [req.params.id]);
                if (!rows || rows.length === 0) {
                    res.status(404).json({ message: 'Vehicle not found' });
                }
                else {
                    const vehicle = rows[0];
                    res.json(vehicle);
                }
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    createVehicle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user, model, placa, year } = req.body;
            if (!user || !model || !placa || !year) {
                return res.status(400).json({ error: 'All fields including year are required to create a vehicle' });
            }
            try {
                const [result] = yield db_1.default.query('INSERT INTO vehicles (user, model, placa, year) VALUES (?, ?, ?, ?)', [user, model, placa, year]);
                const insertedId = result.insertId;
                res.status(201).json({ id: insertedId, message: 'Vehicle created' });
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    updateVehicle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { user, model, placa, year } = req.body;
                // Verificar si el vehículo existe
                const [rows] = yield db_1.default.query('SELECT * FROM vehicles WHERE id = ?', [id]);
                if (!rows || rows.length === 0) {
                    return res.status(404).json({ message: 'Vehicle not found' });
                }
                // Actualizar el vehículo
                const [result] = yield db_1.default.query('UPDATE vehicles SET user = ?, model = ?, placa = ?, year = ? WHERE id = ?', [user, model, placa, year, id]);
                if (result.affectedRows > 0) {
                    res.status(200).json({ message: 'Vehicle updated successfully' });
                }
                else {
                    res.status(500).json({ message: 'Failed to update vehicle' });
                }
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    deleteVehicle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const [result] = yield db_1.default.query('DELETE FROM vehicles WHERE id = ?', [id]);
                if (result.affectedRows > 0) {
                    res.status(200).json({ message: 'Vehicle deleted successfully' });
                }
                else {
                    res.status(404).json({ message: 'Vehicle not found' });
                }
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
}
exports.VehicleController = VehicleController;
