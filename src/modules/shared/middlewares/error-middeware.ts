import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";
import { logger } from "../../../shared/logging/logger";
import { DatabaseError } from "../errors/DatabaseError";

export function errorHandler(
    error: FastifyError,
    request: FastifyRequest,
    reply: FastifyReply
) {
    if (error instanceof ZodError) {
        const errors = error.errors.map((e) => ({
            field: e.path.join("."),
            message: e.message,
        }));

        const type = "VALIDATION_ERROR";
        const message =
            Array.isArray(errors) && errors[0]?.message?.trim()
                ? errors[0].message
                : "Erro ao validar objeto";

        logger.warn("(operational) Validation Error", {
            type,
            operational: true,
            errors,
        });

        reply.status(400).send({
            type: type,
            status: "error",
            message: message,
            errors: errors,
        });
        return;
    } else if (error instanceof DatabaseError) {
        const logPayload = {
            type: error.name,
            message: error.message,
            details: error.details || "",
        };

        logger.error(`(unexpected) ${logPayload.message}`, logPayload);
        reply.status(500).send({
            status: "error",
            message: error.message,
            type: error.name,
            path: request.originalUrl,
            method: request.method,
            timestamp: new Date().toISOString(),
        });
        return;
    }

    logger.error(error.message);

    const statusCode = error.statusCode ?? 500;
    reply.status(statusCode).send({
        status: "error",
        message: error.message,
    });
}
