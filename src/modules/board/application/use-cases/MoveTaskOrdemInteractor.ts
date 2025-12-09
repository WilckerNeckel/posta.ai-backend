import { BoardGateway } from "../../domain/ports/BoardGateway";

export class MoveTaskOrdemInteractor {
    constructor(private boardGateway: BoardGateway) {}
    async execute(taskId: string, newPosition: number): Promise<void> {
        
        const currentTask = await this.boardGateway.getTaskById(taskId);
        if (!currentTask) throw new Error("Tarefa não encontrada");

        const column = await this.boardGateway.getColumnById(
            currentTask.columnId
        );
        if (column?.disciplineColumn) {
            throw new Error("Não é possível mover tarefa de disciplina");
        }
        
        const lastOrdem = await this.boardGateway.getLastTaskOrdemInColumn(currentTask.columnId);
        if (newPosition < 1 || newPosition > lastOrdem)
            throw new Error("Posição inválida");

        if (newPosition === currentTask.ordem) return;

        const currentPosition = currentTask.ordem;
        const columnId = currentTask.columnId;

        await this.boardGateway.moveTaskOrdem(
            taskId,
            columnId,
            currentPosition,
            newPosition
        );
    }
}
