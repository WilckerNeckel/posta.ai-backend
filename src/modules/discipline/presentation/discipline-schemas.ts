import { Course } from "../../user/domain/enums/Course";

export const disciplineTag = "Disciplines";

export const disciplineSchema = {
    type: "object",
    required: ["id", "name", "curso"],
    properties: {
        id: { type: "string", description: "Identificador da disciplina" },
        name: { type: "string", description: "Nome da disciplina" },
        professorId: {
            type: ["string", "null"],
            description: "ID do professor responsável (quando definido)",
        },
        curso: {
            type: "string",
            enum: Object.values(Course),
            description: "Curso ao qual a disciplina pertence",
        },
    },
} as const;

export const createDisciplineBodySchema = {
    type: "object",
    required: ["name", "curso"],
    properties: {
        name: { type: "string", minLength: 1 },
        professorId: { type: "string" },
        curso: { type: "string", enum: Object.values(Course) },
    },
    additionalProperties: false,
} as const;

export const validationErrorResponseSchema = {
    type: "object",
    required: ["status", "message", "type", "errors"],
    properties: {
        status: { type: "string" },
        message: { type: "string" },
        type: { type: "string" },
        errors: {
            type: "array",
            items: {
                type: "object",
                required: ["field", "message"],
                properties: {
                    field: { type: "string" },
                    message: { type: "string" },
                },
            },
        },
    },
} as const;

export const unauthorizedErrorResponseSchema = {
    type: "object",
    required: ["message"],
    properties: {
        message: { type: "string" },
    },
} as const;

export const genericErrorResponseSchema = {
    type: "object",
    required: ["message"],
    properties: {
        status: { type: "string" },
        message: { type: "string" },
    },
} as const;

export const idParamsSchema = {
    type: "object",
    required: ["disciplineId"],
    properties: {
        disciplineId: { type: "string", description: "ID da disciplina" },
    },
} as const;

export const enrollParamsSchema = {
    type: "object",
    required: ["disciplineId", "studentId"],
    properties: {
        disciplineId: { type: "string", description: "ID da disciplina" },
        studentId: { type: "string", description: "ID do estudante" },
    },
} as const;

export const attributeTeacherParamsSchema = {
    type: "object",
    required: ["disciplineId", "teacherId"],
    properties: {
        disciplineId: { type: "string", description: "ID da disciplina" },
        teacherId: { type: "string", description: "ID do professor" },
    },
} as const;
