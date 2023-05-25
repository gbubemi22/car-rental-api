import express from 'express';
const router = express.Router();



import  carController from '../controllers/carController.js';

router
.route('/')
.post(carController.addCard);

router
.route('/')
.get(carController.getAllCars)



router
.route('/:id')
.get(carController.getOneCar)



router
.route('/:id')
.delete(carController.deleteCar)



router
.route('/:id')
.patch(carController.updateCar)



router
.route('/notavilable/:id')
.patch(carController.carNotAvalable)



router
.route('/agent/:id')
.patch(carController.getAllCarsByAgent)



router
.route('/available/:id')
.patch(carController.carAvalable)