import { ZodError } from "zod";
import { getMongo } from "../../../database/mongo";
import { BoardGateway } from "../domain/ports/BoardGateway";
import {
    CreateColumn,
    Column,
    CreateTask,
    Task,
    ColumnWithTasks,
} from "../domain/types";
import { Db } from "mongodb";
import { DatabaseError } from "../../shared/errors/DatabaseError";
import cuid from "cuid";
import {
    columnValidator,
    columnWithTasksValidator,
    taskValidator,
} from "../domain/validators";

export class MongoBoardRepository implements BoardGateway {
    readonly mongo: Db = getMongo();
    private readonly columnColl = this.mongo.collection("columns");
    private readonly taskColl = this.mongo.collection("tasks");

    public async findAllColumnsWithTasks(
        userId: string
    ): Promise<ColumnWithTasks[]> {
        try {
            const results = await this.columnColl
                .aggregate([
                    { $match: { userId } },
                    { $sort: { ordem: 1 } },
                    {
                        $lookup: {
                            from: "tasks",
                            let: { columnId: "$id" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $eq: ["$columnId", "$$columnId"],
                                        },
                                    },
                                },
                                { $sort: { ordem: 1 } }, // sort tasks by ordem ASC
                            ],
                            as: "tasks",
                        },
                    },
                ])
                .toArray();

            return results.map((e) => columnWithTasksValidator.parse(e));
        } catch (error) {
            if (error instanceof ZodError) throw error;
            throw new DatabaseError("Erro buscar colunas com tasks", error);
        }
    }

    public async createColumn(column: CreateColumn): Promise<Column> {
        try {
            const last = await this.columnColl
                .find()
                .sort({ ordem: -1 })
                .limit(1)
                .next();

            const ordem = last ? last.ordem + 1 : 1;

            const columnToInsert = {
                id: cuid(),
                ordem,
                ...column,
            } satisfies Column;

            await this.columnColl.insertOne(columnToInsert);

            return columnValidator.parse(columnToInsert);
        } catch (error) {
            if (error instanceof ZodError) throw error;
            throw new DatabaseError("Erro ao criar coluna", error);
        }
    }

    public async deleteColumn(columnId: string): Promise<void> {
        try {
            await this.columnColl.deleteOne({ id: columnId });
        } catch (error) {
            if (error instanceof ZodError) throw error;
            throw new DatabaseError("Erro ao deletar coluna", error);
        }
    }

    public async createTask(task: CreateTask): Promise<Task> {
        try {
            const last = await this.taskColl
                .find()
                .sort({ ordem: -1 })
                .limit(1)
                .next();

            const ordem = last ? last.ordem + 1 : 1;

            const taskToInsert = {
                id: cuid(),
                ordem: ordem,
                ...task,
            } satisfies Task;

            await this.taskColl.insertOne(taskToInsert);

            return taskValidator.parse(taskToInsert);
        } catch (error) {
            if (error instanceof ZodError) throw error;

            throw new DatabaseError("Erro ao criar task", error);
        }
    }

    public async deleteTask(taskId: string): Promise<void> {
        try {
            await this.taskColl.deleteOne({ id: taskId });
        } catch (error) {
            if (error instanceof ZodError) throw error;
            throw new DatabaseError("Erro ao deletar task", error);
        }
    }
}
