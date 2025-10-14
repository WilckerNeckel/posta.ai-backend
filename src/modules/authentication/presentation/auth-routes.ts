import { FastifyInstance } from "fastify";
import { makeAuthController } from "./AuthController";

export async function authRoutes(fastify: FastifyInstance) {
    fastify.post("/login", async (req, res) => {
        await makeAuthController().authenticate(req, res);
    });
}
