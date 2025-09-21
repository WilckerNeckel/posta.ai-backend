import fp from "fastify-plugin";
import { FastifyReply } from "fastify";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../../../shared/types/AuthenticatedRequest";
import { logger } from "../../../shared/logging/logger";

const secret = process.env.JWT_SECRET as string;

export default fp(async function authPlugin(fastify, opts) {
    fastify.decorateRequest(
        "user",
        undefined as unknown as { empresaId: string; userId: string }
    );
    fastify.addHook(
        "preHandler",
        async (request: AuthenticatedRequest, reply: FastifyReply) => {
            const authHeader = request.headers.authorization;

            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                logger.warn("Token não fornecido em rota protegida");
                reply.status(401).send({ message: "Token não fornecido" });
                return;
            }

            const token = authHeader.split(" ")[1];

            try {
                const decoded = jwt.verify(token, secret) as {
                    userId: string;
                };

                request.user = {
                    userId: decoded.userId,
                };
            } catch (error) {
                logger.warn("Token fornecido está inválido ou expirado");
                reply
                    .status(401)
                    .send({ message: "Token inválido ou expirado" });
                return;
            }
        }
    );
});
