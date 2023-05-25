import mongoose from 'mongoose';
import RENT_STATUS from '../constant/index.js';



const rentSchema = new mongoose.Schema({

     car: {
          type: mongoose.Types.ObjectId,
          ref: "Car",
          required: true
     },

     user: {
          type: mongoose.Types.ObjectId,
          ref: "User",
          required: true
     },
     status: {
          type: String,
          enum: RENT_STATUS,
          default: RENT_STATUS.PENDING
     }

}, { timestamps: true });


const Rent = mongoose.model('Rent', rentSchema);

export default Rent;