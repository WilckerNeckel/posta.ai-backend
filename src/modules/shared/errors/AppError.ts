import { AppErrorTypes } from "./types";

// centralized error object that derives from Node’s Error
export class AppError extends Error {
    public readonly isOperational: boolean;
    public readonly details?: any;

    constructor(
        name: AppErrorTypes,
        description: string = "Ocorreu um erro não esperado",
        isOperational: boolean = true,
        details?: any
    ) {
        super(description);

        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain

        this.name = name;
        this.isOperational = isOperational;
        this.details = details;

        Error.captureStackTrace(this);
    }
}
