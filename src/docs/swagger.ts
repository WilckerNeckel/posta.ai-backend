import { FastifyDynamicSwaggerOptions } from "@fastify/swagger";
import { FastifySwaggerUiOptions } from "@fastify/swagger-ui";

export const swaggerOptions: FastifyDynamicSwaggerOptions = {
    openapi: {
        info: {
            title: "Posta.ai API",
            description: "Documentação da API REST da Posta.ai",
            version: "1.0.0",
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Ambiente de desenvolvimento local",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        tags: [
            {
                name: "Auth",
                description: "Autenticação e emissão de tokens",
            },
            {
                name: "Users",
                description: "Gestão de usuários e perfis",
            },
            {
                name: "Board",
                description: "Quadro, colunas e tarefas",
            },
        ],
    },
    hideUntagged: true,
} as const;

export const swaggerUiOptions: FastifySwaggerUiOptions = {
    routePrefix: "/docs",
    uiConfig: {
        docExpansion: "list",
        deepLinking: false,
    },
    staticCSP: true,
} as const;
