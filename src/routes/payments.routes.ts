import { Router } from 'express';
import { PaymentController } from '../controllers/payments.controller';

const router = Router();
const paymentController = new PaymentController();

router.get('/', (req, res) => paymentController.getAllPayments(req, res));
router.get('/:id', (req, res) => paymentController.getPaymentById(req, res));
router.post('/', (req, res) => paymentController.createPayment(req, res));
router.put('/:id', (req, res) => paymentController.updatePayment(req, res));
router.delete('/:id', (req, res) => paymentController.deletePayment(req, res));

export default router;
