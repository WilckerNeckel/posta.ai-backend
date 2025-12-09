import { BoardGateway } from "../../domain/ports/BoardGateway";

export class MoveTaskToAnotherColumnInteractor {
    constructor(private boardGateway: BoardGateway) {}

    async execute(
        taskId: string,
        targetColumnId: string,
        newPosition: number
    ): Promise<void> {
        const task = await this.boardGateway.getTaskById(taskId);
        if (!task) throw new Error("Tarefa não encontrada");

        const sourceColumn = await this.boardGateway.getColumnById(
            task.columnId
        );
        if (!sourceColumn) throw new Error("Coluna de origem não encontrada");

        const targetColumn = await this.boardGateway.getColumnById(
            targetColumnId
        );
        if (!targetColumn) throw new Error("Coluna de destino não encontrada");

        if (sourceColumn.userId !== targetColumn.userId) {
            throw new Error("Colunas pertencem a usuários diferentes");
        }

        if (targetColumnId === task.columnId) {
            // Se a coluna é a mesma, apenas reordena
            return await this.boardGateway.moveTaskOrdem(
                taskId,
                task.columnId,
                task.ordem,
                newPosition
            );
        }

        const lastOrdemTarget =
            await this.boardGateway.getLastTaskOrdemInColumn(targetColumnId);
        if (newPosition < 1 || newPosition > lastOrdemTarget + 1) {
            throw new Error("Posição inválida para a coluna de destino");
        }

        await this.boardGateway.moveTaskToAnotherColumn(
            taskId,
            task.columnId,
            targetColumnId,
            task.ordem,
            newPosition
        );
    }
}
