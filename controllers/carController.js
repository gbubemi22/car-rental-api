import User from '../models/User.js';
import Car from '../models/Car.js';
import CustomError from '../errors/index.js';
import { StatusCodes } from 'http-status-codes';


const carController = {
     addCard: async (req, res) => {
          const {
               agentId,
               carmodel,
               carbrand,
               carYear,
               rentalPrice,
               rentedBy
          } = req.body;

          const user = await User.findOne({ agentId, type: 'agent' })

          if (!user) {
               throw new CustomError.BadRequestError('Please you are not an agent')
          }


          const agent = await Car.create({
               agentId,
               carmodel,
               carbrand,
               carYear,
               rentalPrice,
               rentedBy
          })

          res.status(StatusCodes.CREATED).json({
               message: 'Car added successfully',
               user: agent
          })
     },

     getAllCars: async (req, res) => {
          const { carname, carbrand, carYear, rentalPrice, isAvailable, sort, fields, numericFilters, page = 1, limit = 10 } = req.query;

          const filters = {};

          if (carname) filters[carname] = carname
          if (carbrand) filters[carbrand] = carbrand
          if (carYear) filters[carYear] = carYear
          if (rentalPrice) filters.rentalPrice = rentalPrice === 'true'
          if (isAvailable) filters.isAvailable = isAvailable === true

          if (numericFilters) {
               const operators = {
                    '>': '$gt',
                    '>=': '$gte',
                    '=': '$eq',
                    '<': '$lt',
                    '<=': '$lte',
               };



               const filtersArr = numericFilters.split(',');
               filtersArr.forEach((filter) => {
                    const [field, operator, value] = filter.split('-');
                    if (operators[operator]) {
                         filters[field] = { [operators[operator]]: Number(value) };
                    }
               });

               const query = Car.find(filters).sort(sort || 'createdAt').select(fields);

               const totalCars = await Car.countDocuments(filters);
               const tatalPages = Math.ceil(totalCars / limit);

               const cars = await query.skip((page - 1) * limit).limit(limit);


               response.status(StatusCodes.OK).json({
                    cars: cars,
                    totalCars: totalCars,
                    tatalPages: tatalPages
               })
          }



     },

     // getAllCars: async (req, res) => {
     //      const { page = 1, limit = 10 } = req.query;
     //      const cars = await Car.find()
     //           .limit(limit * 1)
     //           .skip((page - 1) * limit)
     //           .exec();
     //      const count = await Order.countDocuments();

     //      res.status(StatusCodes.OK).json({
     //           count: cars.length,
     //           message: 'fetched successfully',
     //           cars: cars,
     //           totalOrder: Math.ceil(count / limit),
     //           currentPage: page,
     //      })

     // },

     getOneCar: async (req, res) => {
          const { id } = req.params;

          const car = await Car.findOne({ id: id });

          if (!car) {
               throw new CustomError.NotFoundError(' Car not found')
          }

          res.status(StatusCodes.OK).json({
               message: 'Fetched car successfully',
               car: car
          })
     },

     deleteCar: async (req, res) => {
          const { id: carId } = req.params;

          const car = await Car.findOne({ id: carId });

          if (!car) {
               throw new CustomError.NotFoundError(' Car not found')
          }

          await car.remmove();

          res.status(StatusCodes.OK).json({
               message: 'Car  deleted successfully',
          })
     },


     // todo update a car

     updateCar: async (req, res) => {

          const { id: carId } = req.params;

          const car = await Car.findByIdAndUpdate(
               {
                    _id: carId,
               },
               req.body,
               {
                    new: true,
                    runValidators: true,
               }
          );

          if (!car) {
               throw new CustomError.NotFoundError(`No car with id: $ {carId}`);
          }

          await car.save();

          res.status(StatusCodes.OK).json({
               message: "Updated successfully",
               data: car,
          })
     },



     carNotAvalable: async (req, res) => {
          const { id } = req.params;

          const car = await Car.findOne({ id: id })

          if (!car) {
               throw new CustomError.NotFoundError('car not found');
          }

          await Car.updateOne(
               { _id: id },
               { $set: { isAvailable: false } }
          );

          if (car.isAvailable != false) {
               throw new CustomError.BadRequestError('car is already available');
          }
          res.status(StatusCodes.OK).json({
               message: 'Car has been updated successfully',
               car: car
          })
     },

     carAvalable: async (req, res) => {
          const { id } = req.params;

          const car = await Car.findOne({ id: id })

          if (!car) {
               throw new CustomError.NotFoundError('car not found');
          }

          await Car.updateOne(
               { _id: id },
               { $set: { isAvailable: true } }
          );

          if (car.isAvailable === true) {
               throw new CustomError.BadRequestError('car is already available');
          }
          res.status(StatusCodes.OK).json({
               message: 'Car has been updated successfully',
               car: car
          })
     },


     getAllCarsByAgent: async (req, res) => {
          const { agentId } = req.params;
          const { page = 1, limit = 10 } = req.query;

          const cars = await Car.find(agentId)
               .limit(limit * 1)
               .skip((page - 1) * limit)
               .exec();


          const count = await Car.countDocuments();

          if (cars.length === 0) {
               throw new CustomError.NotFoundError('Cars by agent not found')
          }

          res.status(StatusCodes.OK).json({
               count: cars.length,
               message: "Cars fetched successfully",
               cars: cars,
               totalCars: Math.ceil(count / limit),
               currentPage: page,
          })
     },




}

export default carController;