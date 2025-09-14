import { InfraError } from "./InfraError";
import { InfraErrorTypes } from "./types";

export class DatabaseError extends InfraError {
    constructor(description: string, rawError: any) {
        super(
            InfraErrorTypes.DATABASE_ERROR,
            description,
            false,
            rawError
        );
    }
}
