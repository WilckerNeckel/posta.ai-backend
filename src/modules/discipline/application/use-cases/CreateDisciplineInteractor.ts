import { DisciplineGateway } from "../../domain/DisciplineGateway";
import { CreateDiscipline, Discipline } from "../../domain/types";

export class CreateDisciplineInteractor {
    constructor(private disciplineGateway: DisciplineGateway) {}

    async execute(disciplineInput: CreateDiscipline): Promise<Discipline> {
        const createdDiscipline = await this.disciplineGateway.createDiscipline(
            disciplineInput
        );
        return createdDiscipline;
    }
}
