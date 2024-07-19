import { RequestHandler } from "express";
import config from "../config";
import jwt from "jsonwebtoken";
import { Payload } from "../types";

const tokenCheck: RequestHandler = (req, res, next) => {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
        res.status(401).json({ message: "Sorry Chief, no auth header :(" });
        return;
    }

    const [type, token] = authorizationHeader.split(" ");

    if (!type || type.toLowerCase() !== "bearer" || !token) {
        res.status(401).json({ message: "Wrong authentication type or missing token" });
        return;
    }

    try {
        const user = jwt.verify(token, config.jwt.key) as Payload;

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: "Can't verify token - " + (error as Error).message });
    }
};

export default tokenCheck;
