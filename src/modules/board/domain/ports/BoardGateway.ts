import {
    Column,
    ColumnWithTasks,
    CreateColumn,
    CreateTask,
    Task,
} from "../types";

export interface BoardGateway {
    getTaskById(taskId: string): Promise<Task | null>;
    getColumnById(columnId: string): Promise<Column | null>;
    moveTaskOrdem(
        taskId: string,
        columnId: string,
        currentPosition: number,
        newPosition: number
    ): Promise<void>;
    moveColumnOrdem(
        columnId: string,
        userId: string,
        currentPosition: number,
        newPosition: number
    ): Promise<void>;
    createColumn(column: CreateColumn): Promise<Column>;
    deleteColumn(columnId: string): Promise<void>;
    createTask(task: CreateTask): Promise<Task>;
    deleteTask(taskId: string): Promise<void>;
    findAllColumnsWithTasks(userId: string): Promise<ColumnWithTasks[]>;
}
