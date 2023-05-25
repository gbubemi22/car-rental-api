import mongoose from 'mongoose';


const CarSchema = new mongoose.Schema({

     agentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
     },
     carname: {
       type: String,
       required: true
     },
     carmodel: {
          type: String,
          required: true
     },
     carbrand: {
          type: String,
          required: true
     },
     carYear: {
          type: Number,
          required: true,
     },
     rentalPrice: {
          type: Number,
          required: true,
     },
     isAvailable: {
          type: Boolean,
          default: true,
     },
     rentedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          default: null,
     },
     image: {
          type: String,
          required: false
     },



}, { timestamps: true });




const Car = mongoose.model('Car', CarSchema);

export default Car;








