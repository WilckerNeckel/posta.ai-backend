// src/infra/websockets/websocket-server.ts

import { Server as IOServer } from "socket.io";
import { FastifyInstance } from "fastify";
import jwt from "jsonwebtoken";
import { instrument } from "@socket.io/admin-ui";
import { logger } from "../../shared/logging/logger";
import { DisciplineMongoRepository } from "../../modules/discipline/infra/DisciplineMongoRepository";

export let io: IOServer;

const origins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(",").map((o) => o.trim())
    : [];

export function setupSocketIO(fastify: FastifyInstance) {
    io = new IOServer(fastify.server, {
        cors: {
            origin: origins,
            credentials: true,
        },
        path: "/ws",
    });

    const disciplineRepo = new DisciplineMongoRepository();

    // admin UI
    instrument(io, {
        auth: false,
    });

    io.use(async (socket, next) => {
        let token = socket.handshake.auth?.token as string | undefined;

        if (!token) {
            logger.warn("Token JWT não fornecido no handshake do socket");
            return next(new Error("Token JWT não fornecido."));
        }

        if (token.startsWith("Bearer ")) token = token.slice(7);

        const secret = process.env.JWT_SECRET as string;

        try {
            const decoded = jwt.verify(token, secret) as {
                userId: string;
            };

            socket.data.user = {
                userId: decoded.userId,
            };

            const disciplines = await disciplineRepo.findDisciplinesByUserId(
                decoded.userId
            );
            for (const discipline of disciplines) {
                socket.join(`discipline:${discipline.id}`);
            }

            return next();
        } catch (err) {
            return next(new Error("Token JWT inválido."));
        }
    });

    io.on("connection", (socket) => {
        logger.info(
            `Socket conectado: ${socket.id} | Empresa: ${socket.data.user.empresaId}`
        );

        socket.on("disconnect", () => {
            logger.info(`Socket desconectado: ${socket.id}`);
        });
    });
}
