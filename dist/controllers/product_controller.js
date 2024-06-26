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
exports.ProductController = void 0;
const db_1 = __importDefault(require("../config/db"));
function isRowDataPacketArray(result) {
    return Array.isArray(result) && result.length > 0 && 'id' in result[0];
}
function isOkPacket(result) {
    return 'affectedRows' in result || 'insertId' in result;
}
class ProductController {
    // Obtiene la lista de todos los productos
    getAllProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [rows] = yield db_1.default.query('SELECT * FROM products');
                res.json(rows);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    // Obtiene un producto por su ID
    getProductById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [rows] = yield db_1.default.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
                if (isRowDataPacketArray(rows) && rows.length > 0) {
                    res.json(rows[0]);
                }
                else {
                    res.status(404).json({ message: 'Product not found' });
                }
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    // Crea un nuevo producto
    createProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, value } = req.body;
                // Check for missing properties
                if (!name || !value) {
                    throw new Error('Name and value are required in the request body');
                }
                const [result] = yield db_1.default.query('INSERT INTO products (name, value) VALUES (?, ?)', [name, value]);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    // Actualiza un producto existente 
    updateProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { name, value } = req.body;
                const [rows] = yield db_1.default.query('SELECT * FROM products WHERE id = ?', [id]);
                if (!isRowDataPacketArray(rows) || rows.length === 0) {
                    return res.status(404).json({ message: 'Product not found' });
                }
                const [result] = yield db_1.default.query('UPDATE products SET name = ?,value = ? WHERE id = ?', [name, value, id]);
                if (isOkPacket(result) && result.affectedRows > 0) {
                    res.status(200).json({ message: 'Product updated successfully' });
                }
                else {
                    res.status(500).json({ message: 'Failed to update product' });
                }
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    // Elimina un producto
    deleteProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const [result] = yield db_1.default.query('DELETE FROM products WHERE id = ?', [id]);
                if (isOkPacket(result)) {
                    if (result.affectedRows === 0) {
                        res.status(404).json({ message: 'Product not found' });
                    }
                    else {
                        res.status(200).json({ message: 'Product deleted successfully' });
                    }
                }
                else {
                    res.status(500).json({ message: 'Unknown error occurred' });
                }
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
}
exports.ProductController = ProductController;
