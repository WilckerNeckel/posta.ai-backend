import { BoardGateway } from "../../domain/ports/BoardGateway";

export class MoveTaskOrdemInteractor{
    constructor(private boardGateway: BoardGateway){}
    async execute(
        taskId: string,
        columnId: string,
        newPosition: number,
    ): Promise<void> {
        const currentTask = await this.boardGateway.getTaskById(taskId);
        if (!currentTask) throw new Error("Tarefa não encontrada");

        const currentPosition = currentTask.ordem;


        await this.boardGateway.moveTaskOrdem(
            taskId,
            columnId,
            currentPosition,
            newPosition
        );
    }
}