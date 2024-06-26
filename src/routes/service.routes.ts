// service.routes.ts

import { Router } from 'express';
import { ServiceController } from '../controllers/service.controller';

const router = Router();
const serviceController = new ServiceController();

router.get('/', (req, res) => serviceController.getAllServices(req, res));
router.get('/:id', (req, res) => serviceController.getServiceById(req, res));
router.post('/', (req, res) => serviceController.createService(req, res));
router.put('/:id', (req, res) => serviceController.updateService(req, res));
router.delete('/:id', (req, res) => serviceController.deleteService(req, res));

export default router;
