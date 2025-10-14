// ESM
import dotenv from "dotenv";
import Fastify from "fastify";
import { errorHandler } from "./modules/shared/middlewares/error-middeware";
import { connectToMongo } from "./database/mongo";
import { userRoutes } from "./modules/user/presentation/user-routes";

const fastify = Fastify({
    logger: true,
});

fastify.setErrorHandler(errorHandler);
fastify.register(userRoutes, { prefix: "/api/users" });

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
