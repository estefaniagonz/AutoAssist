import { Router } from 'express';
import { MechanicController } from '../controllers/mechanic.controller';

const router = Router();
const mechanicController = new MechanicController();

router.post('/', (req, res) => mechanicController.createMechanic(req, res));
router.get('/', (req, res) => mechanicController.getAllMechanics(req, res));
router.get('/:id', (req, res) => mechanicController.getMechanicById(req, res));
router.put('/:id', (req, res) => mechanicController.updateMechanic(req, res));
router.delete('/:id', (req, res) => mechanicController.deleteMechanic(req, res));

export default router;
