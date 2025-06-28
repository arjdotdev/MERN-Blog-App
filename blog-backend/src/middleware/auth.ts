import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
}
// defines TS interface what our JWT payload should contain after verification.
// In our case, when we signed tokens we embedded {userId:user._id}, so we expect to get back an object with userId:string

export interface AuthRequest extends Request {
  userId?: string;
}
//

export const requireAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  // 1) Grab the token from headers (you can also use cookies)
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];

  try {
    // 2) Verify token
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    // console.log("payload", payload);
    //      {
    //   userId: '685f703df3e18e693bd228fc',
    //   iat: 1751085411,
    //   exp: 1751089011
    // }

    // 3) Attach userId to the request object
    req.userId = payload.userId;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};
