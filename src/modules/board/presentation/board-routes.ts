import { FastifyInstance } from "fastify";
import authMiddeware from "../../shared/middlewares/auth-middeware";
import { makeBoardController } from "./controllers/BoardController";
import {
    boardTag,
    columnSchema,
    columnWithTasksSchema,
    createColumnBodySchema,
    createTaskBodySchema,
    genericErrorResponseSchema,
    invalidIdErrorResponseSchema,
    movePositionBodySchema,
    moveTaskToColumnBodySchema,
    taskSchema,
    teacherPostTaskBodySchema,
    unauthorizedErrorResponseSchema,
    updateColumnBodySchema,
    updateTaskBodySchema,
    validationErrorResponseSchema,
} from "./board-schemas";

// 20/11/2025 ----> Preciso testar as novas rotas de atualizar coluna e tarefa e teacher post task. Depois criar a notificação via websocket

export async function boardRoutes(fastify: FastifyInstance) {
    fastify.register(async (protectedRoutes) => {
        protectedRoutes.register(authMiddeware);

        protectedRoutes.post(
            "/column",
            {
                schema: {
                    tags: [boardTag],
                    security: [{ bearerAuth: [] }],
                    summary: "Criar coluna",
                    description: "Cria uma nova coluna no board do usuário.",
                    body: createColumnBodySchema,
                    response: {
                        201: columnSchema,
                        400: validationErrorResponseSchema,
                        401: unauthorizedErrorResponseSchema,
                        500: genericErrorResponseSchema,
                    },
                },
            },
            async (req, res) => {
                await makeBoardController().createColumn(req, res);
            }
        );
        protectedRoutes.get(
            "/column",
            {
                schema: {
                    tags: [boardTag],
                    security: [{ bearerAuth: [] }],
                    summary: "Listar colunas com tarefas",
                    description:
                        "Retorna todas as colunas do usuário autenticado com suas tarefas.",
                    response: {
                        200: {
                            type: "array",
                            items: columnWithTasksSchema,
                        },
                        400: invalidIdErrorResponseSchema,
                        401: unauthorizedErrorResponseSchema,
                        500: genericErrorResponseSchema,
                    },
                },
            },
            async (req, res) => {
                await makeBoardController().findAllColumnsWithTasks(req, res);
            }
        );

        protectedRoutes.patch(
            "/column/:id/move",
            {
                schema: {
                    tags: [boardTag],
                    security: [{ bearerAuth: [] }],
                    summary: "Mover coluna",
                    description: "Reordena a posição de uma coluna.",
                    params: {
                        type: "object",
                        required: ["id"],
                        properties: {
                            id: { type: "string", description: "ID da coluna" },
                        },
                    },
                    body: movePositionBodySchema,
                    response: {
                        204: { type: "null" },
                        400: validationErrorResponseSchema,
                        401: unauthorizedErrorResponseSchema,
                        500: genericErrorResponseSchema,
                    },
                },
            },
            async (req, res) => {
                await makeBoardController().moveColumnOrdem(req, res);
            }
        );

        protectedRoutes.delete(
            "/column/:id",
            {
                schema: {
                    tags: [boardTag],
                    security: [{ bearerAuth: [] }],
                    summary: "Excluir coluna",
                    params: {
                        type: "object",
                        required: ["id"],
                        properties: {
                            id: { type: "string", description: "ID da coluna" },
                        },
                    },
                    response: {
                        204: { type: "null" },
                        400: invalidIdErrorResponseSchema,
                        401: unauthorizedErrorResponseSchema,
                        500: genericErrorResponseSchema,
                    },
                },
            },
            async (req, res) => {
                await makeBoardController().deleteColumnById(req, res);
            }
        );

        protectedRoutes.patch(
            "/column/:id",
            {
                schema: {
                    tags: [boardTag],
                    security: [{ bearerAuth: [] }],
                    summary: "Atualizar coluna",
                    params: {
                        type: "object",
                        required: ["id"],
                        properties: {
                            id: { type: "string", description: "ID da coluna" },
                        },
                    },
                    body: updateColumnBodySchema,
                    response: {
                        200: columnSchema,
                        400: validationErrorResponseSchema,
                        401: unauthorizedErrorResponseSchema,
                        500: genericErrorResponseSchema,
                    },
                },
            },
            async (req, res) => {
                await makeBoardController().updateColumn(req, res);
            }
        );

        protectedRoutes.post(
            "/task",
            {
                schema: {
                    tags: [boardTag],
                    security: [{ bearerAuth: [] }],
                    summary: "Criar tarefa",
                    body: createTaskBodySchema,
                    response: {
                        201: taskSchema,
                        400: validationErrorResponseSchema,
                        401: unauthorizedErrorResponseSchema,
                        500: genericErrorResponseSchema,
                    },
                },
            },
            async (req, res) => {
                await makeBoardController().createTask(req, res);
            }
        );

        protectedRoutes.post(
            "/task/teacher-post",
            {
                schema: {
                    tags: [boardTag],
                    security: [{ bearerAuth: [] }],
                    summary: "Professor publica tarefa",
                    description:
                        "Cria a tarefa para o professor e replica para alunos inscritos na disciplina.",
                    body: teacherPostTaskBodySchema,
                    response: {
                        201: taskSchema,
                        400: validationErrorResponseSchema,
                        401: unauthorizedErrorResponseSchema,
                        500: genericErrorResponseSchema,
                    },
                },
            },
            async (req, res) => {
                await makeBoardController().teacherPostNewTask(req, res);
            }
        );

        protectedRoutes.patch(
            "/task/:id",
            {
                schema: {
                    tags: [boardTag],
                    security: [{ bearerAuth: [] }],
                    summary: "Atualizar tarefa",
                    params: {
                        type: "object",
                        required: ["id"],
                        properties: {
                            id: { type: "string", description: "ID da tarefa" },
                        },
                    },
                    body: updateTaskBodySchema,
                    response: {
                        200: taskSchema,
                        400: validationErrorResponseSchema,
                        401: unauthorizedErrorResponseSchema,
                        500: genericErrorResponseSchema,
                    },
                },
            },
            async (req, res) => {
                await makeBoardController().updateTask(req, res);
            }
        );

        protectedRoutes.delete(
            "/task/:id",
            {
                schema: {
                    tags: [boardTag],
                    security: [{ bearerAuth: [] }],
                    summary: "Excluir tarefa",
                    params: {
                        type: "object",
                        required: ["id"],
                        properties: {
                            id: { type: "string", description: "ID da tarefa" },
                        },
                    },
                    response: {
                        204: { type: "null" },
                        400: invalidIdErrorResponseSchema,
                        401: unauthorizedErrorResponseSchema,
                        500: genericErrorResponseSchema,
                    },
                },
            },
            async (req, res) => {
                await makeBoardController().deleteTaskById(req, res);
            }
        );

        protectedRoutes.patch(
            "/task/:id/move",
            {
                schema: {
                    tags: [boardTag],
                    security: [{ bearerAuth: [] }],
                    summary: "Mover tarefa",
                    description: "Reordena a posição de uma tarefa na coluna.",
                    params: {
                        type: "object",
                        required: ["id"],
                        properties: {
                            id: { type: "string", description: "ID da tarefa" },
                        },
                    },
                    body: movePositionBodySchema,
                    response: {
                        204: { type: "null" },
                        400: validationErrorResponseSchema,
                        401: unauthorizedErrorResponseSchema,
                        500: genericErrorResponseSchema,
                    },
                },
            },
            async (req, res) => {
                await makeBoardController().moveTaskOrdem(req, res);
            }
        );

        protectedRoutes.patch(
            "/task/:id/move-column",
            {
                schema: {
                    tags: [boardTag],
                    security: [{ bearerAuth: [] }],
                    summary: "Mover tarefa para outra coluna",
                    description:
                        "Move a tarefa para outra coluna e posiciona na ordem desejada.",
                    params: {
                        type: "object",
                        required: ["id"],
                        properties: {
                            id: { type: "string", description: "ID da tarefa" },
                        },
                    },
                    body: moveTaskToColumnBodySchema,
                    response: {
                        204: { type: "null" },
                        400: validationErrorResponseSchema,
                        401: unauthorizedErrorResponseSchema,
                        500: genericErrorResponseSchema,
                    },
                },
            },
            async (req, res) => {
                await makeBoardController().moveTaskToAnotherColumn(req, res);
            }
        );
    });
}
