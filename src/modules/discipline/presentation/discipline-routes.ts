import { FastifyInstance } from "fastify";
import authMiddeware from "../../shared/middlewares/auth-middeware";
import { makeDisciplineController } from "./controllers/DisciplineController";
import {
    attributeTeacherParamsSchema,
    disciplineSchema,
    disciplineTag,
    enrollParamsSchema,
    createDisciplineBodySchema,
    genericErrorResponseSchema,
    unauthorizedErrorResponseSchema,
    validationErrorResponseSchema,
} from "./discipline-schemas";

export async function disciplineRoutes(fastify: FastifyInstance) {
    fastify.post(
        "/",
        {
            schema: {
                tags: [disciplineTag],
                summary: "Criar disciplina",
                body: createDisciplineBodySchema,
                response: {
                    201: disciplineSchema,
                    400: validationErrorResponseSchema,
                    500: genericErrorResponseSchema,
                },
            },
        },
        async (req, res) => {
            await makeDisciplineController().createDiscipline(req, res);
        }
    );

    fastify.register(async (protectedRoutes) => {
        protectedRoutes.register(authMiddeware);

        protectedRoutes.get(
            "/",
            {
                schema: {
                    tags: [disciplineTag],
                    security: [{ bearerAuth: [] }],
                    summary: "Listar disciplinas",
                    response: {
                        200: { type: "array", items: disciplineSchema },
                        401: unauthorizedErrorResponseSchema,
                        500: genericErrorResponseSchema,
                    },
                },
            },
            async (req, res) => {
                await makeDisciplineController().findManyDisciplines(req, res);
            }
        );

        protectedRoutes.post(
            "/:disciplineId/enroll-student/:studentId",
            {
                schema: {
                    tags: [disciplineTag],
                    security: [{ bearerAuth: [] }],
                    summary: "Matricular aluno na disciplina",
                    params: enrollParamsSchema,
                    response: {
                        204: { type: "null" },
                        400: genericErrorResponseSchema,
                        401: unauthorizedErrorResponseSchema,
                        500: genericErrorResponseSchema,
                    },
                },
            },
            async (req, res) => {
                await makeDisciplineController().enrollStudentInDiscipline(
                    req,
                    res
                );
            }
        );

        protectedRoutes.post(
            "/:disciplineId/attribute-teacher/:teacherId",
            {
                schema: {
                    tags: [disciplineTag],
                    security: [{ bearerAuth: [] }],
                    summary: "Atribuir professor à disciplina",
                    params: attributeTeacherParamsSchema,
                    response: {
                        204: { type: "null" },
                        400: genericErrorResponseSchema,
                        401: unauthorizedErrorResponseSchema,
                        500: genericErrorResponseSchema,
                    },
                },
            },
            async (req, res) => {
                await makeDisciplineController().attributeTeacherInDiscipline(
                    req,
                    res
                );
            }
        );
    });
}
