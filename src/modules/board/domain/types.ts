import z from "zod";
import {
    columnValidator,
    columnWithTasksValidator,
    createColumnValidator,
    createTaskValidator,
    taskValidator,
} from "./validators";

export type Column = z.infer<typeof columnValidator>;
export type CreateColumn = z.infer<typeof createColumnValidator>;
export type CreateTask = z.infer<typeof createTaskValidator>;
export type Task = z.infer<typeof taskValidator>;
export type ColumnWithTasks = z.infer<typeof columnWithTasksValidator>;
