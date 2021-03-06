import dotenv from "dotenv";
dotenv.config();

import express, { NextFunction, Request, Response } from "express";
import "express-async-errors";

import { AppError } from "./errors/AppErrors";
import { routes } from "./routes";

import "./database";

import "./workers/OrdersWorker";

const app = express();

app.use(express.json());
app.use(routes);

app.use(
  (err: Error, request: Request, response: Response, _next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.httpStatusCode).json({
        message: err.message,
      });
    }

    return response.status(500).json({
      message: `Internal server error: ${err.message}`,
      status: "Error",
    });
  }
);

export { app };