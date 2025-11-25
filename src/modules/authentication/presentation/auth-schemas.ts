export const loginBodySchema = {
    type: "object",
    required: ["usuario", "senha"],
    properties: {
        usuario: {
            type: "string",
            description: "Nome de usuário utilizado para login",
            // example: "usuario.demo",
        },
        senha: {
            type: "string",
            description: "Senha do usuário",
            format: "password",
            // example: "senhaSegura123",
        },
    },
};

export const loginSuccessResponseSchema = {
    type: "object",
    required: ["accessToken"],
    properties: {
        accessToken: {
            type: "string",
            description: "Token JWT para autenticar as próximas requisições",
            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        },
    },
};

const baseErrorSchema = {
    type: "object",
    required: ["status", "message"],
    properties: {
        status: { type: "string", example: "error" },
        message: { type: "string", example: "Usuário ou senha incorretos" },
    },
};

export const validationErrorResponseSchema = {
    ...baseErrorSchema,
    required: ["status", "message", "type", "errors"],
    properties: {
        ...baseErrorSchema.properties,
        type: { type: "string", example: "VALIDATION_ERROR" },
        errors: {
            type: "array",
            items: {
                type: "object",
                required: ["field", "message"],
                properties: {
                    field: { type: "string", example: "usuario" },
                    message: {
                        type: "string",
                        example: "O campo 'usuario' é obrigatório",
                    },
                },
            },
        },
    },
};

export const unauthorizedErrorResponseSchema = {
    ...baseErrorSchema,
    properties: {
        ...baseErrorSchema.properties,
        type: { type: "string", example: "UNAUTHORIZED" },
    },
};

export const genericErrorResponseSchema = baseErrorSchema;
