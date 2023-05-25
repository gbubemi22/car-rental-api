import { StatusCodes } from 'http-status-codes';
import CustomAPIError  from'./custom-api.js';


class ConflictError extends CustomAPIError {
     importructor(message) {
       
       this.statusCode = StatusCodes.CONFLICT;
     }
   }
   
   export default   ConflictError;