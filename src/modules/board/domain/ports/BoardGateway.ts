import {
    Column,
    ColumnWithTasks,
    CreateColumn,
    CreateTask,
    Task,
    UpdateColumn,
} from "../types";

export interface BoardGateway {
    getTaskById(taskId: string): Promise<Task | null>;
    getColumnById(columnId: string): Promise<Column | null>;
    getColumnByTittle(
        disciplineName: string,
        studentId: string
    ): Promise<Column | null>;

    getLastTaskOrdemInColumn(columnId: string): Promise<number>;
    getLastColumnOrdemByUserId(userId: string): Promise<number>;
    moveTaskOrdem(
        taskId: string,
        columnId: string,
        currentPosition: number,
        newPosition: number
    ): Promise<void>;
    moveTaskToAnotherColumn(
        taskId: string,
        sourceColumnId: string,
        targetColumnId: string,
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
    updateColumn(id: string, column: UpdateColumn): Promise<Column>;
    deleteColumn(columnId: string): Promise<void>;
    createTask(task: CreateTask): Promise<Task>;
    updateTask(id: string, task: Task): Promise<Task>;
    deleteTask(taskId: string): Promise<void>;
    findAllColumnsWithTasks(userId: string): Promise<ColumnWithTasks[]>;
}
