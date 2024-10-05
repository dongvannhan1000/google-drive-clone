import express from 'express';
import passport from 'passport';
import * as authController from '../controllers/authController';
import { validateRegistration, validate } from '../middleware/validation';

const router = express.Router();

router.get("/register", (req, res) => res.render("register"));
router.post('/register', validateRegistration, validate, authController.register);

router.post('/login', passport.authenticate('local'), authController.login);
router.post('/logout', authController.logout);
router.get('/profile', authController.profile);

export default router;