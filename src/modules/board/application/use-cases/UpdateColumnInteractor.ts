import { BoardGateway } from "../../domain/ports/BoardGateway";
import { Column, UpdateColumn } from "../../domain/types";

export class UpdateColumnInteractor {
    constructor(private boardGateway: BoardGateway) {}

    async execute(columnId: string, updateData: UpdateColumn): Promise<Column> {
        const existingColumn = await this.boardGateway.getColumnById(columnId);
        if (!existingColumn) {
            throw new Error("Column not found");
        }

        if (existingColumn.disciplineColumn) {
            throw new Error(
                "Não é permitido atualizar colunas de disciplinas."
            );
        }

        const finalChanges = {
            ...existingColumn,
            ...updateData,
        };

        const updatedColumn = await this.boardGateway.updateColumn(
            columnId,
            finalChanges
        );

        return updatedColumn;
    }
}
