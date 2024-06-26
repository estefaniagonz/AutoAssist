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
exports.PaymentController = void 0;
const db_1 = __importDefault(require("../config/db"));
class PaymentController {
    getAllPayments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [rows] = yield db_1.default.query('SELECT * FROM payments');
                res.json(rows);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    getPaymentById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [rows] = yield db_1.default.query('SELECT * FROM payments WHERE id = ?', [req.params.id]);
                if (rows.length > 0) {
                    res.json(rows[0]);
                }
                else {
                    res.status(404).json({ message: 'Payment not found' });
                }
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    createPayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { invoice, amount, date, payment_method } = req.body;
            if (!invoice || !amount || !date || !payment_method) {
                return res.status(400).json({ error: 'All fields are required' });
            }
            try {
                const result = yield db_1.default.query('INSERT INTO payments (invoice, amount, date, payment_method) VALUES (?, ?, ?, ?)', [invoice, amount, date, payment_method]);
                const insertId = result[0].insertId;
                if (!insertId) {
                    throw new Error('Insert ID not found');
                }
                res.json({ message: 'Payment created', id: insertId });
            }
            catch (error) {
                console.error('Error creating payment:', error);
                res.status(500).json({ error: 'Failed to create payment' });
            }
        });
    }
    updatePayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { invoice, amount, date, payment_method } = req.body;
            const { id } = req.params;
            if (!invoice || !amount || !date || !payment_method) {
                return res.status(400).json({ error: 'All fields are required' });
            }
            try {
                const result = yield db_1.default.query('UPDATE payments SET invoice = ?, amount = ?, date = ?, payment_method = ? WHERE id = ?', [invoice, amount, date, payment_method, id]);
                if (result[0].affectedRows > 0) {
                    res.json({ message: 'Payment updated', id: id });
                }
                else {
                    res.status(404).json({ message: 'Payment not found' });
                }
            }
            catch (error) {
                console.error('Error updating payment:', error);
                res.status(500).json({ error: 'Failed to update payment' });
            }
        });
    }
    deletePayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const result = yield db_1.default.query('DELETE FROM payments WHERE id = ?', [id]);
                if (result[0].affectedRows > 0) {
                    res.json({ message: 'Payment deleted', id: id });
                }
                else {
                    res.status(404).json({ message: 'Payment not found' });
                }
            }
            catch (error) {
                console.error('Error deleting payment:', error);
                res.status(500).json({ error: 'Failed to delete payment' });
            }
        });
    }
}
exports.PaymentController = PaymentController;
