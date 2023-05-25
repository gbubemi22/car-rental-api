import Rent from '../models/Rent.js';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Car from '../models/Car.js';
import CustomError from '../errors/index.js';



const rentController = {
     rentCar: async (req, res) => {
          const { car, user  } = req.body;

          const isValidCar = await Car.findById(car);
          const isvalidUser = await User.findById(user);

          if (!isValidCar || !isvalidUser) {
               throw new CustomError.BadRequestError('Invalid car or user ID')
          }
         
          const rent = await Car.create({
             car,
             user  
          })

          // todo  send mail && Notification

          res.status(StatusCodes.CREATED).json({
               message: 'Car booked for rent',
               rent: rent
          })

     }
}