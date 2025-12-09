import { BoardGateway } from "../../domain/ports/BoardGateway";

export class DeleteTaskInteractor {
    constructor(private boardGateway: BoardGateway) {}

    public async execute(id: string): Promise<void> {
        const task = await this.boardGateway.getTaskById(id);
        if (!task) throw new Error("Task não encontrada");

        const column = await this.boardGateway.getColumnById(task.columnId);
        if (column?.disciplineColumn) {
            throw new Error("Não é possível remover tarefa de disciplina");
        }

        return await this.boardGateway.deleteTask(id);
    }
}
