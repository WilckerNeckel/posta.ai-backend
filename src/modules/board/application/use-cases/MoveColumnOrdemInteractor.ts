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

        const lastOrdem = await this.boardGateway.getLastColumnOrdemByUserId(
            userId
        );
        if (newPosition < 1 || newPosition > lastOrdem)
            throw new Error("Posição inválida");

        if (newPosition === currentColumn.ordem) return;

        await this.boardGateway.moveColumnOrdem(
            columnId,
            userId,
            currentPosition,
            newPosition
        );
    }
}
