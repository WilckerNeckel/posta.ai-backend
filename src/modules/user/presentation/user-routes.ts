import { FastifyInstance } from "fastify";
import authMiddeware from "../../shared/middlewares/auth-middeware";
import { makeUserController } from "./controllers/UserController";
import {
    createUserBodySchema,
    createUserSuccessResponseSchema,
    genericErrorResponseSchema,
    invalidIdErrorResponseSchema,
    listUsersSuccessResponseSchema,
    unauthorizedErrorResponseSchema,
    userResponseSchema,
    userTag,
    validationErrorResponseSchema,
} from "./user-schemas";

export async function userRoutes(fastify: FastifyInstance) {
    fastify.post(
        "/",
        {
            schema: {
                tags: [userTag],
                summary: "Criar usuário",
                description:
                    "Cria um usuário (aluno ou professor) e retorna os dados básicos.",
                body: createUserBodySchema,
                response: {
                    201: createUserSuccessResponseSchema,
                    400: validationErrorResponseSchema,
                    500: genericErrorResponseSchema,
                },
            },
        },
        async (req, res) => {
            await makeUserController().create(req, res);
        }
    );

    fastify.register(async (protectedRoutes) => {
        protectedRoutes.register(authMiddeware);

        protectedRoutes.get(
            "/:id",
            {
                schema: {
                    tags: [userTag],
                    summary: "Buscar usuário por ID",
                    security: [{ bearerAuth: [] }],
                    params: {
                        type: "object",
                        required: ["id"],
                        properties: {
                            id: {
                                type: "string",
                                description: "ID do usuário",
                            },
                        },
                    },
                    response: {
                        200: userResponseSchema,
                        400: invalidIdErrorResponseSchema,
                        401: unauthorizedErrorResponseSchema,
                        500: genericErrorResponseSchema,
                    },
                },
            },
            async (req, res) => {
                await makeUserController().findById(req, res);
            }
        );

        protectedRoutes.get(
            "/",
            {
                schema: {
                    tags: [userTag],
                    summary: "Listar usuários",
                    security: [{ bearerAuth: [] }],
                    response: {
                        200: listUsersSuccessResponseSchema,
                        401: unauthorizedErrorResponseSchema,
                        500: genericErrorResponseSchema,
                    },
                },
            },
            async (req, res) => {
                await makeUserController().findMany(req, res);
            }
        );
    });
}
