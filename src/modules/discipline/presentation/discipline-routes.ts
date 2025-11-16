import { FastifyInstance } from "fastify";
import authMiddeware from "../../shared/middlewares/auth-middeware";
import { makeDisciplineController } from "./controllers/DisciplineController";

export async function disciplineRoutes(fastify: FastifyInstance) {
    fastify.post("/", async (req, res) => {
        await makeDisciplineController().createDiscipline(req, res);
    });

    fastify.register(async (protectedRoutes) => {
        protectedRoutes.register(authMiddeware);

        protectedRoutes.get("/", async (req, res) => {
            await makeDisciplineController().findManyDisciplines(req, res);
        });

        protectedRoutes.post(
            "/:disciplineId/enroll-student/:studentId",
            async (req, res) => {
                await makeDisciplineController().enrollStudentInDiscipline(
                    req,
                    res
                );
            }
        );

        protectedRoutes.post(
            "/:disciplineId/attribute-teacher/:teacherId",
            async (req, res) => {
                await makeDisciplineController().attributeTeacherInDiscipline(
                    req,
                    res
                );
            }
        );
    });
}
