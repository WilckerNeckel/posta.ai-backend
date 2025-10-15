import {
    Column,
    ColumnWithTasks,
    CreateColumn,
    CreateTask,
    Task,
} from "../types";

export interface BoardGateway {
    moveTaskOrdem(
        taskId: string,
        columnId: string,
        currentPosition: number,
        newPosition: number
    ): Promise<void>;

    createColumn(column: CreateColumn): Promise<Column>;
    deleteColumn(columnId: string): Promise<void>;
    createTask(task: CreateTask): Promise<Task>;
    deleteTask(taskId: string): Promise<void>;
    findAllColumnsWithTasks(userId: string): Promise<ColumnWithTasks[]>;
}
