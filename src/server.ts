// ESM
import dotenv from "dotenv";
import Fastify from "fastify";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { errorHandler } from "./modules/shared/middlewares/error-middeware";
import { connectToMongo } from "./database/mongo";
import { userRoutes } from "./modules/user/presentation/user-routes";
import { boardRoutes } from "./modules/board/presentation/board-routes";
import { authRoutes } from "./modules/authentication/presentation/auth-routes";
import { disciplineRoutes } from "./modules/discipline/presentation/discipline-routes";
import { swaggerOptions, swaggerUiOptions } from "./docs/swagger";
import cors from "@fastify/cors";

const fastify = Fastify({
    logger: true,
});

fastify.setErrorHandler(errorHandler);
fastify.register(cors, {
    origin: "*", // ou uma lista: ["http://localhost:5173"]
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
});

fastify.register(swagger, swaggerOptions);
fastify.register(swaggerUi, swaggerUiOptions);
fastify.register(userRoutes, { prefix: "/api/users" });
fastify.register(boardRoutes, { prefix: "/api/board" });
fastify.register(authRoutes, { prefix: "/api/auth" });
fastify.register(disciplineRoutes, { prefix: "/api/disciplines" });

const start = async () => {
    try {
        dotenv.config(); // initialize
        const port = parseInt(process.env.PORT || "3000");
        await connectToMongo();
        await fastify.listen({ port: port, host: "0.0.0.0" });
        console.log(`Server is running at http://localhost:${port}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
