import express from 'express';
const router = express.Router();


import AuthController from '../controllers/auth.js';




router
.route('/signup')
.post(AuthController.CreateUser);

router
.route('/signup/agent')
.post(AuthController.CreateAgent)

router
.route('/login')
.post(AuthController.login);



router
.route('logout')
.get(AuthController.logout);



export default router;

