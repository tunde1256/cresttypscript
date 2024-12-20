import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Define the minimal decoded token interface
interface DecodedToken {
  id: number;
  username: string;
  email: string;
  // Add other fields if necessary
}

// Extending the Request interface to include req.User (required)
interface CustomRequest extends Request {
  User: DecodedToken; // Make user required
}

export const checkAuth = (req: CustomRequest, res: Response, next: NextFunction): any => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided, authorization denied' });
  }

  try {
    // Decode the token and verify it
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;

    // Attach only the decoded token info to req.User
    req.User = {
      id: decoded.id,
      username: decoded.username,
      email: decoded.email,
    };

    next();
  } catch (err) {
     res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

export default checkAuth;
