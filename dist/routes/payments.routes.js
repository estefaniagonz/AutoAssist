"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payments_controller_1 = require("../controllers/payments.controller"); // Asegúrate de importar correctamente tu controlador de pagos.
const router = (0, express_1.Router)();
const paymentController = new payments_controller_1.PaymentController();
router.get('/', (req, res) => paymentController.getAllPayments(req, res));
router.get('/:id', (req, res) => paymentController.getPaymentById(req, res));
router.post('/', (req, res) => paymentController.createPayment(req, res));
router.put('/:id', (req, res) => paymentController.updatePayment(req, res));
router.delete('/:id', (req, res) => paymentController.deletePayment(req, res));
exports.default = router;
