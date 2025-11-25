export const boardTag = "Board";

export const columnSchema = {
    type: "object",
    required: ["id", "ordem", "disciplineColumn", "titulo", "userId"],
    properties: {
        id: { type: "string", description: "Identificador da coluna" },
        ordem: {
            type: "number",
            description: "Posição da coluna no quadro do usuário",
        },
        disciplineColumn: {
            type: "boolean",
            description: "Indica se a coluna pertence a uma disciplina",
        },
        titulo: { type: "string", description: "Título da coluna" },
        userId: {
            type: "string",
            description: "ID do usuário proprietário da coluna",
        },
    },
} as const;

export const taskSchema = {
    type: "object",
    required: ["id", "titulo", "ordem", "descricao", "columnId"],
    properties: {
        id: { type: "string", description: "Identificador da tarefa" },
        titulo: { type: "string", description: "Título da tarefa" },
        ordem: { type: "number", description: "Posição da tarefa na coluna" },
        descricao: { type: "string", description: "Descrição da tarefa" },
        columnId: {
            type: "string",
            description: "ID da coluna onde a tarefa está",
        },
    },
} as const;

export const columnWithTasksSchema = {
    ...columnSchema,
    required: [...columnSchema.required, "tasks"],
    properties: {
        ...columnSchema.properties,
        tasks: {
            type: "array",
            description: "Tarefas associadas à coluna",
            items: taskSchema,
        },
    },
} as const;

export const createColumnBodySchema = {
    type: "object",
    required: ["titulo", "disciplineColumn"],
    properties: {
        titulo: { type: "string", minLength: 1 },
        disciplineColumn: { type: "boolean" },
    },
} as const;

export const updateColumnBodySchema = {
    type: "object",
    properties: {
        titulo: { type: "string", minLength: 1 },
    },
    additionalProperties: false,
} as const;

export const createTaskBodySchema = {
    type: "object",
    required: ["titulo", "descricao", "columnId"],
    properties: {
        titulo: { type: "string", minLength: 3 },
        descricao: { type: "string" },
        columnId: { type: "string" },
    },
} as const;

export const updateTaskBodySchema = {
    type: "object",
    properties: {
        titulo: { type: "string", minLength: 3 },
        descricao: { type: "string" },
    },
    additionalProperties: false,
} as const;

export const movePositionBodySchema = {
    type: "object",
    required: ["novaPosicao"],
    properties: {
        novaPosicao: { type: "integer", minimum: 1 },
    },
    additionalProperties: false,
} as const;

export const teacherPostTaskBodySchema = {
    type: "object",
    required: ["task", "disciplineId"],
    properties: {
        task: createTaskBodySchema,
        disciplineId: { type: "string" },
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
