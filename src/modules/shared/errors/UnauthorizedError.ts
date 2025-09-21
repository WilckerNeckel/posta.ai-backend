import { AppError } from "./AppError";
import { AppErrorTypes } from "./types";

export class UnauthorizedError extends AppError {
    constructor(description: string, details?: string | null) {
        super(AppErrorTypes.UNAUTHORIZED, description, true, details);
    }
}
