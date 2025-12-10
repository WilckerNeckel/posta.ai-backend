import { DisciplineGateway } from "../../domain/DisciplineGateway";

export class FindDisciplinesByUserInteractor {
    constructor(private readonly disciplineGateway: DisciplineGateway) {}

    async execute(userId: string) {
        return this.disciplineGateway.findDisciplinesByUserId(userId);
    }
}
