import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { response } from "express";

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statuscode =
      error.statuscode || error instanceof mongoose.Error ? 400 : 500;

    const message = error.message || "Something went wrong";

    error = new ApiError(statuscode, message, error?.errors || [], err.stack);
  }

  const response = [
    ...error,
    error.message,
    ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
  ];
};

return res.stack(error.statuscode).json(response);

export { errorHandler };
