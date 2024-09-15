import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

const SECRET = "@spiderGLOBAL_API-2021";
const APPID = "SPD2021"

export const verifyAppToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"]; //if authorization exist in header
    console.log('authHeader:', authHeader)

    const token = authHeader && authHeader.replace("Bearer ", "");
    console.log('token:', token)

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, SECRET, (err) => {
      console.log('err:', err)
      if (err) return res.sendStatus(403);
      next();
    });
  } catch (error) {
    console.log('error:', error)
    res.send({ status: 0, error: "authorization header is required!" });
  }
};

export const createToken = () => {
    return jwt.sign({APPID},SECRET, {
        expiresIn: `${60 * 30}s` //30 minutes
    });
};

export const createRefreshToken = () => {
    return jwt.sign({ type: 'refresh' }, SECRET, {
        expiresIn: `${86400 * 30 * 10}s`
    });
};
