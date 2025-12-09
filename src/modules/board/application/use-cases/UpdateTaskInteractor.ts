import { BoardGateway } from "../../domain/ports/BoardGateway";
import { Task, UpdateTask } from "../../domain/types";

export class UpdateTaskInteractor {
    constructor(private boardGateway: BoardGateway) {}

    async execute(taskId: string, updateData: UpdateTask): Promise<Task> {
        const existingTask = await this.boardGateway.getTaskById(taskId);
        if (!existingTask) {
            throw new Error("Task not found");
        }

        const column = await this.boardGateway.getColumnById(
            existingTask.columnId
        );
        if (column?.disciplineColumn) {
            throw new Error("Não é possível alterar tarefa de disciplina");
        }

        const finalChanges = {
            ...existingTask,
            ...updateData,
        };

        const updatedTask = await this.boardGateway.updateTask(
            taskId,
            finalChanges
        );

        return updatedTask;
    }
}
