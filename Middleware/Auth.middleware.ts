import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import dotenv from 'dotenv';


dotenv.config();


interface DecodedToken extends JwtPayload {
  id: string;
}

interface CustomRequest extends Request {
  user?: string;
}

const verifyToken = (req: CustomRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
     res.status(401).json({ message: 'No token provided' });
     return
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'Token is missing or improperly formatted' });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err: VerifyErrors | null, decoded: string | JwtPayload | undefined) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    const decodedToken = decoded as DecodedToken;
    if (!decodedToken._id) {
      return res.status(400).json({ message: 'Token does not contain a valid user ID' });
    }
    req.user = decodedToken._id;
    next();
  });
};

module.exports = [ verifyToken]
