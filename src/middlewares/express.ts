import express, { Express } from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";

export const applyMiddlewaresTo = (app: Express) => {
    app.use(express.json());
    app.use(morgan("dev"));
    app.use(helmet());
    app.use(compression());
    app.use(cors());
};
