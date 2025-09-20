import { Column } from "../types";

export interface BoardGateway {
    createColumn(column: Column): Promise<void>;
}
