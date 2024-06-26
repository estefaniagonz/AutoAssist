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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const db_1 = __importDefault(require("./config/db"));
const vehicle_routes_1 = __importDefault(require("./routes/vehicle.routes"));
const service_routes_1 = __importDefault(require("./routes/service.routes"));
const mechanic_routes_1 = __importDefault(require("./routes/mechanic.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const payments_routes_1 = __importDefault(require("./routes/payments.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
// Rutas
app.use('/api/vehicles', vehicle_routes_1.default);
app.use('/api/services', service_routes_1.default);
app.use('/api/mechanics', mechanic_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/api/products', product_routes_1.default);
app.use('/api/payments', payments_routes_1.default);
app.get('/', (req, res) => {
    res.send('¡Bienvenido a la API!');
});
app.get('/check-db-connection', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_1.default.query('SELECT 1');
        console.log('Conexión exitosa a la base de datos');
        res.json({ message: 'Conexión exitosa a la base de datos' });
    }
    catch (error) {
        console.error('Error al conectar con la base de datos:', error);
        res.status(500).json({ message: 'Error al conectar con la base de datos' });
    }
}));
app.listen(PORT, () => {
    console.log('Servidor conectado');
    console.log(`= URL: http://localhost:${PORT} =`);
    console.log('Cors habilitado');
    console.log('Morgan habilitado');
    console.log('Variables de entorno cargadas');
});
