import { FastifyReply } from "fastify";
import { CreateColumnInteractor } from "../../application/use-cases/CreateColumnInteractor";
import { CreateTaskInteractor } from "../../application/use-cases/CreateTaskInteractor";
import { DeleteTaskInteractor } from "../../application/use-cases/DeleteTaskInteractor";
import { FindAllColumnsWithTasksInteractor } from "../../application/use-cases/FindAllColumnsWithTasksInteractor";
import {
    createColumnValidator,
    createTaskValidator,
    teacherPostNewTaskValidator,
    updateColumnValidator,
    updateTaskValidator,
} from "../../domain/validators";
import { AuthenticatedRequest } from "../../../../shared/types/AuthenticatedRequest";
import { MongoBoardRepository } from "../../infra/MongoBoardRepository";
import { MoveTaskOrdemInteractor } from "../../application/use-cases/MoveTaskOrdemInteractor";
import { MoveColumnOrdemInteractor } from "../../application/use-cases/MoveColumnOrdemInteractor";
import { MoveTaskToAnotherColumnInteractor } from "../../application/use-cases/MoveTaskToAnotherColumnInteractor";
import z from "zod";
import { DeleteColumnInteractor } from "../../application/use-cases/DeleteColumnInteractor";
import { UpdateTaskInteractor } from "../../application/use-cases/UpdateTaskInteractor";
import { UpdateColumnInteractor } from "../../application/use-cases/UpdateColumnInteractor";
import { TeacherPostNewTaskInteractor } from "../../application/use-cases/TeacherPostNewTaskInteractor";
import { MongoUserRepository } from "../../../user/infra/MongoUserRepository";
import { DisciplineMongoRepository } from "../../../discipline/infra/DisciplineMongoRepository";
import { SocketIOEventEmitter } from "../../../../infra/websockets/socket-io-event-emitter";
import { TeacherUpdateTaskInteractor } from "../../application/use-cases/TeacherUpdateTaskInteractor";
import { TeacherDeleteTaskInteractor } from "../../application/use-cases/TeacherDeleteTaskInteractor";

export class BoardController {
    constructor(
        private readonly createColumnInteractor: CreateColumnInteractor,
        private readonly createTaskInteractor: CreateTaskInteractor,
        private readonly deleteTaskByIdInteractor: DeleteTaskInteractor,
        private readonly deleteColumnByIdInteractor: DeleteColumnInteractor,
        private readonly findAllColumnsWithTasksInteractor: FindAllColumnsWithTasksInteractor,
        private readonly moveTaskOrdemInteractor: MoveTaskOrdemInteractor,
        private readonly moveTaskToAnotherColumnInteractor: MoveTaskToAnotherColumnInteractor,
        private readonly moveColumnOrdemInteractor: MoveColumnOrdemInteractor,
        private readonly updateTaskInteractor: UpdateTaskInteractor,
        private readonly updateColumnInteractor: UpdateColumnInteractor,
        private readonly teacherPostNewTaskInteractor: TeacherPostNewTaskInteractor,
        private readonly teacherUpdateTaskInteractor: TeacherUpdateTaskInteractor,
        private readonly teacherDeleteTaskInteractor: TeacherDeleteTaskInteractor
    ) {}

    async createColumn(request: AuthenticatedRequest, reply: FastifyReply) {
        const validatedBody = createColumnValidator.parse({
            ...(typeof request.body === "object" && request.body !== null
                ? request.body
                : {}),
            userId: request.user?.userId!,
        });
        const column = await this.createColumnInteractor.execute(validatedBody);

        reply.status(201).send(column);
    }

    async findAllColumnsWithTasks(
        request: AuthenticatedRequest,
        reply: FastifyReply
    ) {
        const userId = request.user?.userId!;

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

    async updateTask(request: AuthenticatedRequest, reply: FastifyReply) {
        const { id } = request.params as { id?: unknown };
        if (typeof id !== "string" || id.length === 0) {
            return reply.status(400).send({ message: "ID inválido" });
        }

        const updateData = updateTaskValidator.parse(request.body);

        const updatedTask = await this.updateTaskInteractor.execute(
            id,
            updateData
        );

        reply.send(updatedTask);
    }

    async updateColumn(request: AuthenticatedRequest, reply: FastifyReply) {
        const { id } = request.params as { id?: unknown };
        if (typeof id !== "string" || id.length === 0) {
            return reply.status(400).send({ message: "ID inválido" });
        }

        const updateData = updateColumnValidator.parse(request.body);

        const updatedColumn = await this.updateColumnInteractor.execute(
            id,
            updateData
        );

        reply.send(updatedColumn);
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
        console.log("deleting column id", id);
        if (typeof id !== "string" || id.length === 0) {
            return reply.status(400).send({ message: "ID inválido" });
        }

        await this.deleteColumnByIdInteractor.execute(id);

        reply.status(204).send();
    }

    async moveTaskOrdem(request: AuthenticatedRequest, reply: FastifyReply) {
        const { novaPosicao } = request.body as {
            novaPosicao?: unknown;
        };

        const { id } = request.params as {
            id?: unknown;
        };

        const bodyValidator = z.number().int().min(1, "Nova posição inválida");
        const taskIdValidator = z.string().min(1, "ID da tarefa inválido");

        const newPosition = bodyValidator.parse(novaPosicao);
        const taskIdValidated = taskIdValidator.parse(id);

        await this.moveTaskOrdemInteractor.execute(
            taskIdValidated,
            newPosition
        );

        reply.status(204).send();
    }

    async moveTaskToAnotherColumn(
        request: AuthenticatedRequest,
        reply: FastifyReply
    ) {
        const { novaColunaId, novaPosicao } = request.body as {
            novaColunaId?: unknown;
            novaPosicao?: unknown;
        };

        const { id } = request.params as {
            id?: unknown;
        };

        const bodyValidator = z.object({
            novaColunaId: z.string().min(1, "ID da nova coluna inválido"),
            novaPosicao: z.number().int().min(1, "Nova posição inválida"),
        });

        const paramsValidator = z.object({
            id: z.string().min(1, "ID da tarefa inválido"),
        });

        const validatedBody = bodyValidator.parse({
            novaColunaId,
            novaPosicao,
        });
        const validatedParams = paramsValidator.parse({ id });

        await this.moveTaskToAnotherColumnInteractor.execute(
            validatedParams.id,
            validatedBody.novaColunaId,
            validatedBody.novaPosicao
        );

        reply.status(204).send();
    }

    async teacherPostNewTask(
        request: AuthenticatedRequest,
        reply: FastifyReply
    ) {
        const payload = request.body as {
            task: {
                titulo: string;
                descricao: string;
                columnId: string;
            };
            disciplineId: string;
        };
        const finalBody = {
            ...payload,
            teacherId: request.user?.userId!,
        };

        console.log("finalBody", finalBody);

        const validatedBody = teacherPostNewTaskValidator.parse(finalBody);

        const createdTask = await this.teacherPostNewTaskInteractor.execute(
            validatedBody.task,
            validatedBody.teacherId,
            validatedBody.disciplineId
        );

        reply.status(201).send(createdTask);
    }

    async teacherUpdateTask(
        request: AuthenticatedRequest,
        reply: FastifyReply
    ) {
        const { id } = request.params as { id?: unknown };
        const userId = request.user?.userId;
        const { disciplineId, titulo, descricao } = request.body as {
            disciplineId?: unknown;
            titulo?: unknown;
            descricao?: unknown;
        };

        const idValidator = z.string().min(1, "ID inválido");
        const disciplineValidator = z.string().min(
            1,
            "ID da disciplina inválido"
        );
        const updateTaskValidator = z.object({
            titulo: z.string().min(3).optional(),
            descricao: z.string().optional(),
        });

        const taskId = idValidator.parse(id);
        const disciplineIdValidated = disciplineValidator.parse(disciplineId);
        const updateData = updateTaskValidator.parse({ titulo, descricao });

        await this.teacherUpdateTaskInteractor.execute(
            taskId,
            userId!,
            disciplineIdValidated,
            updateData
        );

        reply.status(204).send();
    }

    async teacherDeleteTask(
        request: AuthenticatedRequest,
        reply: FastifyReply
    ) {
        const { id } = request.params as { id?: unknown };
        const userId = request.user?.userId;
        const { disciplineId } = request.body as { disciplineId?: unknown };

        const idValidator = z.string().min(1, "ID inválido");
        const disciplineValidator = z.string().min(
            1,
            "ID da disciplina inválido"
        );

        const taskId = idValidator.parse(id);
        const disciplineIdValidated = disciplineValidator.parse(disciplineId);

        await this.teacherDeleteTaskInteractor.execute(
            taskId,
            userId!,
            disciplineIdValidated
        );

        reply.status(204).send();
    }

    async moveColumnOrdem(request: AuthenticatedRequest, reply: FastifyReply) {
        const { novaPosicao } = request.body as {
            novaPosicao?: unknown;
        };

        const { id } = request.params as {
            id?: unknown;
        };

        const userId = request.user?.userId!;

        const bodyValidator = z.number().int().min(1, "Nova posição inválida");
        const columnIdValidator = z.string().min(1, "ID da coluna inválido");
        const userIdValidator = z.string().min(1, "ID do usuário inválido");

        const newPosition = bodyValidator.parse(novaPosicao);
        const columnIdValidated = columnIdValidator.parse(id);
        const userIdValidated = userIdValidator.parse(userId);

        await this.moveColumnOrdemInteractor.execute(
            columnIdValidated,
            userIdValidated,
            newPosition
        );

        reply.status(204).send();
    }
}

export const makeBoardController = () => {
    const boardGateway = new MongoBoardRepository();
    const createColumnInteractor = new CreateColumnInteractor(boardGateway);
    const createTaskInteractor = new CreateTaskInteractor(boardGateway);
    const deleteTaskByIdInteractor = new DeleteTaskInteractor(boardGateway);
    const deleteColumnByIdInteractor = new DeleteColumnInteractor(boardGateway);
    const findAllColumnsWithTasksInteractor =
        new FindAllColumnsWithTasksInteractor(boardGateway);

    const moveTaskOrdemInteractor = new MoveTaskOrdemInteractor(boardGateway);
    const moveTaskToAnotherColumnInteractor =
        new MoveTaskToAnotherColumnInteractor(boardGateway);
    const moveColumnOrdemInteractor = new MoveColumnOrdemInteractor(
        boardGateway
    );
    const updateTaskInteractor = new UpdateTaskInteractor(boardGateway);
    const updateColumnInteractor = new UpdateColumnInteractor(boardGateway);
    const disciplineGateway = new DisciplineMongoRepository();
    const userGateway = new MongoUserRepository(disciplineGateway);
    const wsEmitter = new SocketIOEventEmitter();
    const teacherPostNewTaskInteractor = new TeacherPostNewTaskInteractor(
        userGateway,
        boardGateway,
        disciplineGateway,
        wsEmitter
    );
    const teacherUpdateTaskInteractor = new TeacherUpdateTaskInteractor(
        userGateway,
        boardGateway,
        disciplineGateway
    );
    const teacherDeleteTaskInteractor = new TeacherDeleteTaskInteractor(
        userGateway,
        boardGateway,
        disciplineGateway
    );

    return new BoardController(
        createColumnInteractor,
        createTaskInteractor,
        deleteTaskByIdInteractor,
        deleteColumnByIdInteractor,
        findAllColumnsWithTasksInteractor,
        moveTaskOrdemInteractor,
        moveTaskToAnotherColumnInteractor,
        moveColumnOrdemInteractor,
        updateTaskInteractor,
        updateColumnInteractor,
        teacherPostNewTaskInteractor,
        teacherUpdateTaskInteractor,
        teacherDeleteTaskInteractor
    );
};
