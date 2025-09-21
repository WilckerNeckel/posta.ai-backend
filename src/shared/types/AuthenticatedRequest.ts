import { FastifyRequest } from "fastify";

export interface AuthenticatedRequest extends FastifyRequest {
    user?: {
        empresaId: string;
        userId: string;
        terminalId: string;
    };
    subdomain?: string;
}
