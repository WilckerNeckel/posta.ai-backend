import { BoardGateway } from "../../domain/ports/BoardGateway";
import { Column, CreateColumn } from "../../domain/types";

export class CreateColumnInteractor {
    constructor(private boardGateway: BoardGateway) {}

    public async execute(column: CreateColumn): Promise<Column> {
        return await this.boardGateway.createColumn(column);
    }
}
