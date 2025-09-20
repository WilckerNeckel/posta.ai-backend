import { ZodError } from "zod";
import { getMongo } from "../../../database/mongo";
import { BoardGateway } from "../domain/ports/BoardGateway";
import { CreateColumn, Column } from "../domain/types";
import { Db } from "mongodb";
import { DatabaseError } from "../../shared/errors/DatabaseError";

export class MongoBoardRepository implements BoardGateway {
    readonly mongo: Db = getMongo();
    private readonly columnColl = this.mongo.collection("columns");
    private readonly taskColl = this.mongo.collection("tasks");

    public createColumn(column: CreateColumn): Promise<Column> {
        try {
            
        } catch (error) {
            if (error instanceof ZodError) throw error;

            throw new DatabaseError("Erro ao criar coluna", error);
        }
    }
}
