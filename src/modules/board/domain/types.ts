import z from "zod";
import {
    columnValidator,
    columnWithTasksValidator,
    createColumnValidator,
    createTaskValidator,
    taskValidator,
    updateColumnValidator,
    updateTaskValidator,
} from "./validators";

export type Column = z.infer<typeof columnValidator>;
export type CreateColumn = z.infer<typeof createColumnValidator>;
export type CreateTask = z.infer<typeof createTaskValidator>;
export type Task = z.infer<typeof taskValidator>;
export type ColumnWithTasks = z.infer<typeof columnWithTasksValidator>;
export type UpdateColumn = z.infer<typeof updateColumnValidator>;
export type UpdateTask = z.infer<typeof updateTaskValidator>;
