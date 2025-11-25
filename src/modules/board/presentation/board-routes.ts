import { FastifyInstance } from "fastify";
import authMiddeware from "../../shared/middlewares/auth-middeware";
import { makeBoardController } from "./controllers/BoardController";

// 20/11/2025 ----> Preciso testar as novas rotas de atualizar coluna e tarefa e teacher post task. Depois criar a notificação via websocket

export async function boardRoutes(fastify: FastifyInstance) {
    fastify.register(async (protectedRoutes) => {
        protectedRoutes.register(authMiddeware);

        protectedRoutes.post("/column", async (req, res) => {
            await makeBoardController().createColumn(req, res);
        });
        protectedRoutes.get("/column", async (req, res) => {
            await makeBoardController().findAllColumnsWithTasks(req, res);
        });

        protectedRoutes.patch("/column/:id/move", async (req, res) => {
            await makeBoardController().moveColumnOrdem(req, res);
        });

        protectedRoutes.delete("/column/:id", async (req, res) => {
            await makeBoardController().deleteColumnById(req, res);
        });

        protectedRoutes.patch("/column/:id", async (req, res) => {
            await makeBoardController().updateColumn(req, res);
        });

        protectedRoutes.post("/task", async (req, res) => {
            await makeBoardController().createTask(req, res);
        });

        protectedRoutes.post("/task/teacher-post", async (req, res) => {
            await makeBoardController().teacherPostNewTask(req, res);
        });

        protectedRoutes.patch("/task/:id", async (req, res) => {
            await makeBoardController().updateTask(req, res);
        });

        protectedRoutes.delete("/task/:id", async (req, res) => {
            await makeBoardController().deleteTaskById(req, res);
        });

        protectedRoutes.patch("/task/:id/move", async (req, res) => {
            await makeBoardController().moveTaskOrdem(req, res);
        });
    });
}
