import { Course } from "../domain/enums/Course";
import { UserRole } from "../domain/enums/UserRole";

export const userTag = "Users";

export const userResponseSchema = {
    type: "object",
    required: [
        "id",
        "matricula",
        "disciplinas",
        "role",
        "nome",
        "curso",
        "dataAdmissao",
    ],
    properties: {
        id: { type: "string", description: "Identificador do usuário" },
        matricula: {
            type: "string",
            description: "Código de matrícula gerado pelo sistema",
        },
        disciplinas: {
            type: "array",
            description: "IDs das disciplinas vinculadas",
            items: { type: "string" },
        },
        role: {
            type: "string",
            enum: Object.values(UserRole),
            description: "Perfil do usuário no sistema",
        },
        nome: { type: "string", description: "Nome completo do usuário" },
        curso: {
            type: "string",
            enum: Object.values(Course),
            description: "Curso associado",
        },
        dataAdmissao: {
            type: "string",
            format: "date-time",
            description: "Data de criação/admissão do usuário",
        },
    },
} as const;

export const createUserBodySchema = {
    type: "object",
    required: ["nome", "role", "curso", "usuario", "senha"],
    properties: {
        nome: { type: "string", description: "Nome do usuário" },
        role: {
            type: "string",
            enum: Object.values(UserRole),
            description: "Perfil do usuário (professor ou aluno)",
        },
        curso: {
            type: "string",
            enum: Object.values(Course),
            description: "Curso do usuário",
        },
        usuario: {
            type: "string",
            description: "Username de login",
        },
        disciplinasIds: {
            type: "array",
            description:
                "IDs das disciplinas (opcional, usado principalmente para professor)",
            items: { type: "string" },
            minItems: 1,
        },
        senha: {
            type: "string",
            description: "Senha do usuário",
            minLength: 6,
        },
    },
} as const;

export const createUserSuccessResponseSchema = userResponseSchema;

export const listUsersSuccessResponseSchema = {
    type: "array",
    items: userResponseSchema,
} as const;

export const validationErrorResponseSchema = {
    type: "object",
    required: ["status", "message", "type", "errors"],
    properties: {
        status: { type: "string" },
        message: {
            type: "string",
        },
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
        message: {
            type: "string",
        },
    },
} as const;

export const notFoundErrorResponseSchema = {
    type: "object",
    required: ["message"],
    properties: {
        message: {
            type: "string",
        },
    },
} as const;

export const invalidIdErrorResponseSchema = {
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
