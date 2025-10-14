import { FastifyInstance } from "fastify";
import authMiddeware from "../../shared/middlewares/auth-middeware";
import { makeUserController } from "./controllers/UserController";

export async function userRoutes(fastify: FastifyInstance) {
    fastify.register(async (protectedRoutes) => {
        protectedRoutes.register(authMiddeware);

        protectedRoutes.post("/", async (req, res) => {
            await makeUserController().create(req, res);
        });

        protectedRoutes.get("/:id", async (req, res) => {
            await makeUserController().findById(req, res);
        });

        protectedRoutes.get("/", async (req, res) => {
            await makeUserController().findMany(req, res);
        });
    });
}
