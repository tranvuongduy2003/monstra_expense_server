"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const error_code_1 = require("./error-code");
const error_exception_1 = require("./error-exception");
const errorHandler = (err, req, res, next) => {
    console.log("Error handling middleware called.");
    console.log("Path:", req.path);
    console.error("Error occured:", err);
    if (err instanceof error_exception_1.ErrorException) {
        console.log("Error is known.");
        res.status(err.status).send(err);
    }
    else {
        // For unhandled errors.
        res.status(500).send({ code: error_code_1.ErrorCode.UnknownError, status: 500 });
    }
};
exports.errorHandler = errorHandler;
