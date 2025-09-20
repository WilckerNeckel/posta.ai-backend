import { BoardGateway } from "../../domain/ports/BoardGateway";

export class DeleteTaskInteractor {
    constructor(private boardGateway: BoardGateway) {}

    public async execute(id: string): Promise<void> {
        return await this.boardGateway.deleteTask(id);
    }
}
