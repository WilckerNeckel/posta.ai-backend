import { FastifyReply } from "fastify";
import { CreateColumnInteractor } from "../../application/use-cases/CreateColumnInteractor";
import { CreateTaskInteractor } from "../../application/use-cases/CreateTaskInteractor";
import { DeleteTaskInteractor } from "../../application/use-cases/DeleteTaskInteractor";
import { FindAllColumnsWithTasksInteractor } from "../../application/use-cases/FindAllColumnsWithTasksInteractor";
import {
    createColumnValidator,
    createTaskValidator,
} from "../../domain/validators";
import { AuthenticatedRequest } from "../../../../shared/types/AuthenticatedRequest";
import { MongoBoardRepository } from "../../infra/MongoBoardRepository";

export class BoardController {
    constructor(
        private readonly createColumnInteractor: CreateColumnInteractor,
        private readonly createTaskInteractor: CreateTaskInteractor,
        private readonly deleteTaskByIdInteractor: DeleteTaskInteractor,
        private readonly deleteColumnByIdInteractor: DeleteTaskInteractor,
        private readonly findAllColumnsWithTasksInteractor: FindAllColumnsWithTasksInteractor
    ) {}

    async createColumn(request: AuthenticatedRequest, reply: FastifyReply) {
        const validatedBody = createColumnValidator.parse(request.body);

        const column = await this.createColumnInteractor.execute(validatedBody);

        reply.status(201).send(column);
    }

    async findAllColumnsWithTasks(
        request: AuthenticatedRequest,
        reply: FastifyReply
    ) {
        const { userId } = request.params as { userId?: unknown };

        if (typeof userId !== "string" || userId.length === 0) {
            return reply.status(400).send({ message: "ID inválido" });
        }

        const columnsWithTasks =
            await this.findAllColumnsWithTasksInteractor.execute(userId);

        reply.send(columnsWithTasks);
    }

    async createTask(request: AuthenticatedRequest, reply: FastifyReply) {
        const validatedBody = createTaskValidator.parse(request.body);

        const task = await this.createTaskInteractor.execute(validatedBody);

        reply.status(201).send(task);
    }

    async deleteTaskById(request: AuthenticatedRequest, reply: FastifyReply) {
        const { id } = request.params as { id?: unknown };
        if (typeof id !== "string" || id.length === 0) {
            return reply.status(400).send({ message: "ID inválido" });
        }

        await this.deleteTaskByIdInteractor.execute(id);

        reply.status(204).send();
    }

    async deleteColumnById(request: AuthenticatedRequest, reply: FastifyReply) {
        const { id } = request.params as { id?: unknown };
        if (typeof id !== "string" || id.length === 0) {
            return reply.status(400).send({ message: "ID inválido" });
        }

        await this.deleteColumnByIdInteractor.execute(id);

        reply.status(204).send();
    }
}

export const makeBoardController = () => {
    const boardGateway = new MongoBoardRepository();
    const createColumnInteractor = new CreateColumnInteractor(boardGateway);
    const createTaskInteractor = new CreateTaskInteractor(boardGateway);
    const deleteTaskByIdInteractor = new DeleteTaskInteractor(boardGateway);
    const deleteColumnByIdInteractor = new DeleteTaskInteractor(boardGateway);
    const findAllColumnsWithTasksInteractor =
        new FindAllColumnsWithTasksInteractor(boardGateway);

    return new BoardController(
        createColumnInteractor,
        createTaskInteractor,
        deleteTaskByIdInteractor,
        deleteColumnByIdInteractor,
        findAllColumnsWithTasksInteractor
    );
};
