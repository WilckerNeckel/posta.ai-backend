import { Course } from "../../../user/domain/enums/Course";
import { DisciplineGateway } from "../../domain/DisciplineGateway";

export class FindManyDisciplinesInteractor {
    constructor(private disciplineGateway: DisciplineGateway) {}

    async execute(filters?: { course?: string }) {
        const disciplines = await this.disciplineGateway.findAll({
            course: filters?.course as Course,
        });

        return disciplines;
    }
}
