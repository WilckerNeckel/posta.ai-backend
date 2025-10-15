import { BoardGateway } from "../../domain/ports/BoardGateway";

export class MoveColumnOrdemInteractor {
    constructor(private boardGateway: BoardGateway) {}
    async execute(
        columnId: string,
        userId: string,
        newPosition: number
    ): Promise<void> {
        const currentColumn = await this.boardGateway.getColumnById(columnId);
        if (!currentColumn) throw new Error("Coluna não encontrada");

        const currentPosition = currentColumn.ordem;

        await this.boardGateway.moveColumnOrdem(
            columnId,
            userId,
            currentPosition,
            newPosition
        );
    }
}
