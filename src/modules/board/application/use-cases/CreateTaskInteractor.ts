import { BoardGateway } from "../../domain/ports/BoardGateway";
import { CreateTask, Task } from "../../domain/types";

export class CreateTaskInteractor {
    constructor(private boardGateway: BoardGateway) {}

    public async execute(task: CreateTask): Promise<Task> {
        return await this.boardGateway.createTask(task);
    }
}
