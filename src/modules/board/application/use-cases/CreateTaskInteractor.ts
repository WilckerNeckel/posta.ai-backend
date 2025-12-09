import { BoardGateway } from "../../domain/ports/BoardGateway";
import { CreateTask, Task } from "../../domain/types";

export class CreateTaskInteractor {
    constructor(private boardGateway: BoardGateway) {}

    public async execute(task: CreateTask): Promise<Task> {
        const column = await this.boardGateway.getColumnById(task.columnId);
        if (!column) {
            throw new Error("Coluna não encontrada");
        }

        if (column.disciplineColumn) {
            throw new Error("Não é possível criar tarefas em colunas de disciplina");
        }

        return await this.boardGateway.createTask(task);
    }
}
