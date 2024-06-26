import { Router } from 'express';
import { VehicleController } from '../controllers/vehicle.controller';

const router = Router();
const vehicleController = new VehicleController();

router.get('/', (req, res) => vehicleController.getAllVehicles(req, res));
router.get('/:id', (req, res) => vehicleController.getVehicleById(req, res));
router.post('/', (req, res) => vehicleController.createVehicle(req, res));
router.put('/:id', (req, res) => vehicleController.updateVehicle(req, res));
router.delete('/:id', (req, res) => vehicleController.deleteVehicle(req, res));

export default router;
