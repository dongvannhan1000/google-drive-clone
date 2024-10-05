import bcrypt from 'bcryptjs';
import { User } from '../models/user';

export const register = async ({ email, password }: { email: string; password: string }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return User.create({
    data: { email, password: hashedPassword }
  });
};