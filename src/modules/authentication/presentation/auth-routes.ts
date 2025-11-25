import { FastifyInstance } from "fastify";
import { makeAuthController } from "./AuthController";
import {
    genericErrorResponseSchema,
    loginBodySchema,
    loginSuccessResponseSchema,
    unauthorizedErrorResponseSchema,
    validationErrorResponseSchema,
} from "./auth-schemas";

export async function authRoutes(fastify: FastifyInstance) {
    fastify.post(
        "/login",
        {
            schema: {
                tags: ["Auth"],
                summary: "Autenticar usuário",
                description:
                    "Valida as credenciais e retorna um token JWT para autenticação.",
                body: loginBodySchema,
                response: {
                    200: loginSuccessResponseSchema,
                    400: validationErrorResponseSchema,
                    401: unauthorizedErrorResponseSchema,
                    500: genericErrorResponseSchema,
                },
            },
        },
        async (req, res) => {
            await makeAuthController().authenticate(req, res);
        }
    );
}
