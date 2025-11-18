import { BoardGateway } from "../../domain/ports/BoardGateway";

export class DeleteColumnInteractor {
    constructor(private boardGateway: BoardGateway) {}

    public async execute(id: string): Promise<void> {
        const column = await this.boardGateway.getColumnById(id);
        console.log("checking column", column);
        if (!column) {
            throw new Error(`Coluna com ID ${id} não encontrada.`);
        }
        if (column.disciplineColumn) {
            throw new Error(`Não é possível remover uma coluna de disciplina.`);
        }
        return await this.boardGateway.deleteColumn(id);
    }
}
