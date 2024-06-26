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
exports.ServiceController = void 0;
const db_1 = __importDefault(require("../config/db"));
class ServiceController {
    getAllServices(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [rows] = yield db_1.default.query('SELECT * FROM services');
                res.json(rows);
            }
            catch (error) {
                console.error('Error fetching services:', error);
                res.status(500).json({ error: error.message });
            }
        });
    }
    getServiceById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [rows] = yield db_1.default.query('SELECT * FROM services WHERE id = ?', [req.params.id]);
                if (rows.length === 0) {
                    return res.status(404).json({ message: 'Service not found' });
                }
                res.json(rows[0]);
            }
            catch (error) {
                console.error('Error fetching service:', error);
                res.status(500).json({ error: error.message });
            }
        });
    }
    createService(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, description, value } = req.body;
            if (!name || !description || value == null) {
                return res.status(400).json({ error: 'All fields are required to create a service' });
            }
            try {
                const [result] = yield db_1.default.query('INSERT INTO services (name, description,value) VALUES (?, ?, ?)', [name, description, value]);
                const insertedId = result.insertId;
                res.status(201).json({ id: insertedId, message: 'Service created' });
            }
            catch (error) {
                console.error('Error creating service:', error);
                res.status(500).json({ error: error.message });
            }
        });
    }
    updateService(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { name, description, value } = req.body;
            if (!name || !description || value == null) {
                return res.status(400).json({ error: 'All fields are required to update a service' });
            }
            try {
                const [result] = yield db_1.default.query('UPDATE services SET name = ?, description = ?, value = ? WHERE id = ?', [name, description, value, id]);
                if (result.affectedRows === 0) {
                    return res.status(404).json({ message: 'Service not found' });
                }
                res.status(200).json({ message: 'Service updated successfully' });
            }
            catch (error) {
                console.error('Error updating service:', error);
                res.status(500).json({ error: error.message });
            }
        });
    }
    deleteService(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const [result] = yield db_1.default.query('DELETE FROM services WHERE id = ?', [id]);
                if (result.affectedRows === 0) {
                    return res.status(404).json({ message: 'Service not found' });
                }
                res.status(200).json({ message: 'Service deleted successfully' });
            }
            catch (error) {
                console.error('Error deleting service:', error);
                res.status(500).json({ error: error.message });
            }
        });
    }
}
exports.ServiceController = ServiceController;
