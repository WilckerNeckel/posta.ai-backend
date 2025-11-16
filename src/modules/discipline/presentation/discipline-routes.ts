import { FastifyInstance } from "fastify";
import authMiddeware from "../../shared/middlewares/auth-middeware";
import { makeDisciplineController } from "./controllers/DisciplineController";

export async function disciplineRoutes(fastify: FastifyInstance) {
    fastify.register(async (protectedRoutes) => {
        protectedRoutes.register(authMiddeware);

        protectedRoutes.post("/", async (req, res) => {
            await makeDisciplineController().createDiscipline(req, res);
        });

        protectedRoutes.get("/", async (req, res) => {
            await makeDisciplineController().findManyDisciplines(req, res);
        });

        protectedRoutes.post("/:disciplineId/:studentId", async (req, res) => {
            await makeDisciplineController().enrollStudentInDiscipline(
                req,
                res
            );
        });
    });
}
