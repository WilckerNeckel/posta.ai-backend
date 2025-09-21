import { AppError } from "./AppError";
import { AppErrorTypes } from "./types";

export class AppNotFoundError extends AppError {
    constructor(description: string, details?: string | null) {
        super(AppErrorTypes.RESOURCE_NOT_FOUND, description, true, details);
    }
}
