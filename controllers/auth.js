import User from '../models/User.js';
import CustomError from '../errors/index.js'
import { StatusCodes } from 'http-status-codes';
import ACCOUNT_TYPES from '../constant/index.js';

const validatePasswordString = (password) => {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;

    if (!password.match(regex)) {
         throw new CustomError.BadRequestError(
              'Password must contain a capital letter, number, special character & greater than 8 digits.',
         );
    }
}


const AuthController = {
    CreateUser: async (req, res) => {
        const {
            firstname,
            lastname,
            number,
            email,
            password        } = req.body;

        validatePasswordString(password);

        const emailexits = await User.findOne({ email: email })

        if (emailexits) {
            throw new CustomError.ConflictError('email already exists')
        }


        const numberexits = await User.findOne({ number: number })

        if (numberexits) {
            throw new CustomError.ConflictError('number already exists')
        }

        const user = await User.create({
            firstname,
            lastname,
            number,
            email,
            password,
            type: ACCOUNT_TYPES.USER,
        })
        // Exclude the password field from the user object
        const { password: excludedPassword, ...userWithoutPassword } = user.toObject();


        res.status(StatusCodes.CREATED).json({
            message: 'User created successfully',
            user: userWithoutPassword
        })
    },

    login: async (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new CustomError.BadRequestError("Please provide email and password");
        }

        const user = await User.findOne({ email })


        if (!user) {
            throw new CustomError.UnauthenticatedError("Invalid Credentials");
        }

        const isPasswordCorrect = await user.comparePassword(password);

        if (!isPasswordCorrect) {
            throw new CustomError.UnauthenticatedError('Invalid Credentials');
        }

        // if (user.verifiedEmail === false) {
        //   throw new CustomError.BadRequestError("Please Verify your email");
        // }


        // if (user.verifiedNumber === false) {
        //   throw new CustomError.BadRequestError("Please Verify your phone number");
        // }



        const token = user.createJWT()
        
        res.status(StatusCodes.OK).json({
            user: {
                username: user.username,
                type: user.type,
                id: user.id
            },
            token,
        });
    },

    logout: (req, res) => {
        // Clear the JWT token from client storage
        res.clearCookie('token'); // Example for clearing a cookie containing the token
        // Or
        // localStorage.removeItem('token'); // Example for removing token from local storage

        res.status(StatusCodes.OK).json({ message: 'Logout successful' });
    },
    CreateAgent: async (req, res) => {
        const {
            firstname,
            lastname,
            number,
            email,
            password        } = req.body;

        validatePasswordString(password);

        const emailexits = await User.findOne({ email: email })

        if (emailexits) {
            throw new CustomError.ConflictError('email already exists')
        }


        const numberexits = await User.findOne({ number: number })

        if (numberexits) {
            throw new CustomError.ConflictError('number already exists')
        }

        const user = await User.create({
            firstname,
            lastname,
            number,
            email,
            password,
            type: ACCOUNT_TYPES.AGENT,
        })
        // Exclude the password field from the user object
        const { password: excludedPassword, ...userWithoutPassword } = user.toObject();


        res.status(StatusCodes.CREATED).json({
            message: 'User created successfully',
            user: userWithoutPassword
        })
    },
}


export default AuthController