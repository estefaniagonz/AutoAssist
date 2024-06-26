"use strict";
// service.routes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const service_controller_1 = require("../controllers/service.controller");
const router = (0, express_1.Router)();
const serviceController = new service_controller_1.ServiceController();
router.get('/', (req, res) => serviceController.getAllServices(req, res));
router.get('/:id', (req, res) => serviceController.getServiceById(req, res));
router.post('/', (req, res) => serviceController.createService(req, res));
router.put('/:id', (req, res) => serviceController.updateService(req, res));
router.delete('/:id', (req, res) => serviceController.deleteService(req, res));
exports.default = router;
