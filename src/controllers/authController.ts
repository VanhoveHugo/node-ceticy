import { Request, Response } from 'express';

export const authSignup = (req: Request, res: Response) => {
  res.json({ message: 'User signed up successfully' });
}

export const authLogin = (req: Request, res: Response) => {
  res.json({ message: 'User logged in successfully' });
}