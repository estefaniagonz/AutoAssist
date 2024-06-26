import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import pool from './config/db';
import vehicleRoutes from './routes/vehicle.routes';
import serviceRoutes from './routes/service.routes'; 
import mechanicRoutes from './routes/mechanic.routes';
import userRoutes from './routes/user.routes';
import productRoutes from './routes/product.routes';
import paymentRoutes from './routes/payments.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Rutas
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/services', serviceRoutes); 
app.use('/api/mechanics', mechanicRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/payments', paymentRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('¡Bienvenido a la API!');
});

app.get('/check-db-connection', async (req: Request, res: Response) => {
  try {
    await pool.query('SELECT 1');
    console.log('Conexión exitosa a la base de datos');
    res.json({ message: 'Conexión exitosa a la base de datos' });
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    res.status(500).json({ message: 'Error al conectar con la base de datos' });
  }
});

app.listen(PORT, () => {
  console.log('Servidor conectado');
  console.log(`= URL: http://localhost:${PORT} =`);
  console.log('Cors habilitado');
  console.log('Morgan habilitado');
  console.log('Variables de entorno cargadas');
});