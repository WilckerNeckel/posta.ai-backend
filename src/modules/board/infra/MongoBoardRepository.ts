import { ZodError } from "zod";
import { getMongo, getMongoClient } from "../../../database/mongo";
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
import { logger } from "../../../shared/logging/logger";

export class MongoBoardRepository implements BoardGateway {
    readonly mongo: Db = getMongo();
    private readonly columnColl = this.mongo.collection("columns");
    private readonly taskColl = this.mongo.collection("tasks");

    public async getColumnById(columnId: string): Promise<Column | null> {
        try {
            const column = await this.columnColl.findOne({ id: columnId });
            if (!column) return null;

            return columnValidator.parse(column);
        } catch (error) {
            if (error instanceof ZodError) throw error;
            throw new DatabaseError("Erro ao buscar coluna", error);
        }
    }

    public async getLastColumnOrdemByUserId(userId: string): Promise<number> {
        try {
            return await this.columnColl
                .find({ userId })
                .sort({ ordem: -1 })
                .limit(1)
                .next()
                .then((col) => (col ? col.ordem : 0));
        } catch (error) {
            if (error instanceof ZodError) throw error;
            throw new DatabaseError(
                "Erro ao buscar última ordem da coluna",
                error
            );
        }
    }

    public async getLastTaskOrdemInColumn(columnId: string): Promise<number> {
        try {
            return await this.taskColl
                .find({ columnId })
                .sort({ ordem: -1 })
                .limit(1)
                .next()
                .then((task) => (task ? task.ordem : 0));
        } catch (error) {
            if (error instanceof ZodError) throw error;
            throw new DatabaseError(
                "Erro ao buscar última ordem da task",
                error
            );
        }
    }

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

    public async getTaskById(taskId: string): Promise<Task | null> {
        try {
            const task = await this.taskColl.findOne({ id: taskId });
            if (!task) return null;

            return taskValidator.parse(task);
        } catch (error) {
            if (error instanceof ZodError) throw error;
            throw new DatabaseError("Erro ao buscar task", error);
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

    public async moveTaskOrdem(
        taskId: string,
        columnId: string,
        currentPosition: number,
        newPosition: number
    ): Promise<void> {
        try {
            if (newPosition < currentPosition) {
                // Move up: increase ordem by +1 for those between newPosition and currentPosition - 1
                await this.taskColl.updateMany(
                    {
                        columnId: columnId,
                        ordem: { $gte: newPosition, $lt: currentPosition },
                    },
                    { $inc: { ordem: 1 } }
                );
            } else if (newPosition > currentPosition) {
                // Move down: decrease ordem by -1 for those between currentPosition + 1 and newPosition
                await this.taskColl.updateMany(
                    {
                        columnId: columnId,
                        ordem: { $lte: newPosition, $gt: currentPosition },
                    },
                    { $inc: { ordem: -1 } }
                );
            }

            // Update target task
            await this.taskColl.updateOne(
                { id: taskId },
                { $set: { ordem: newPosition } }
            );

            logger.info(
                `Task movida { taskId: ${taskId}, columnId: ${columnId}, ordem: ${newPosition} }`
            );
        } catch (error) {
            if (error instanceof ZodError) throw error;
            throw new DatabaseError("Erro mover task", error);
        }
    }

    public async moveColumnOrdem(
        columnId: string,
        userId: string,
        currentPosition: number,
        newPosition: number
    ): Promise<void> {
        try {
            if (newPosition < currentPosition) {
                // Move up: increase ordem by +1 for those between newPosition and currentPosition - 1
                await this.columnColl.updateMany(
                    {
                        userId,
                        ordem: { $gte: newPosition, $lt: currentPosition },
                    },
                    { $inc: { ordem: 1 } }
                );
            } else if (newPosition > currentPosition) {
                // Move down: decrease ordem by -1 for those between currentPosition + 1 and newPosition
                await this.columnColl.updateMany(
                    {
                        userId,
                        ordem: { $lte: newPosition, $gt: currentPosition },
                    },
                    { $inc: { ordem: -1 } }
                );
            }

            // Update target column
            await this.columnColl.updateOne(
                { id: columnId },
                { $set: { ordem: newPosition } }
            );

            logger.info(
                `Coluna movida { columnId: ${columnId}, userId: ${userId}, ordem: ${newPosition} }`
            );
        } catch (error) {
            if (error instanceof ZodError) throw error;
            throw new DatabaseError("Erro mover coluna", error);
        }
    }
}
