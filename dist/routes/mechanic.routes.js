"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mechanic_controller_1 = require("../controllers/mechanic.controller");
const router = (0, express_1.Router)();
const mechanicController = new mechanic_controller_1.MechanicController();
router.post('/', (req, res) => mechanicController.createMechanic(req, res));
router.get('/', (req, res) => mechanicController.getAllMechanics(req, res));
router.get('/:id', (req, res) => mechanicController.getMechanicById(req, res));
router.put('/:id', (req, res) => mechanicController.updateMechanic(req, res));
router.delete('/:id', (req, res) => mechanicController.deleteMechanic(req, res));
exports.default = router;
