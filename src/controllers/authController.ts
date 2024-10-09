import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authService.register(req.body);
    res.redirect('login');
  } catch (error) {
    next(error);
  }
};

export const login = (req: Request, res: Response) => {
  res.json({ message: 'Logged in successfully', user: req.user });
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ message: 'Logged out successfully' });
  });
};

export const profile = (req: Request, res: Response) => {
  res.json(req.user);
};