export const loginBodySchema = {
    type: "object",
    required: ["usuario", "senha"],
    properties: {
        usuario: {
            type: "string",
            description: "Nome de usuário utilizado para login",
        },
        senha: {
            type: "string",
            description: "Senha do usuário",
            format: "password",
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
        },
    },
};

const baseErrorSchema = {
    type: "object",
    required: ["status", "message"],
    properties: {
        status: { type: "string" },
        message: { type: "string" },
    },
};

export const validationErrorResponseSchema = {
    ...baseErrorSchema,
    required: ["status", "message", "type", "errors"],
    properties: {
        ...baseErrorSchema.properties,
        type: { type: "string" },
        errors: {
            type: "array",
            items: {
                type: "object",
                required: ["field", "message"],
                properties: {
                    field: { type: "string" },
                    message: {
                        type: "string",
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
        type: { type: "string" },
    },
};

export const genericErrorResponseSchema = baseErrorSchema;
