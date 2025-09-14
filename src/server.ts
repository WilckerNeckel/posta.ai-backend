// ESM
import "../maintenance/env";
import "../maintenance/ensure-env-is-set";
import Fastify from "fastify";
import { errorHandler } from "./modules/shared/middlewares/error-middeware";
import { connectToMongo } from "./database/mongo";

const fastify = Fastify({
    logger: true,
});

fastify.setErrorHandler(errorHandler);
// fastify.register(mesasRoutes, { prefix: "/api/mesas" });
// fastify.register(orderPrintingRoutes, { prefix: "/api/impressoes" });

const port = parseInt(process.env.PORT || "3000");

const start = async () => {
    try {
        await connectToMongo();
        await fastify.listen({ port: port, host: "0.0.0.0" });
        console.log(`Server is running at http://localhost:${port}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
