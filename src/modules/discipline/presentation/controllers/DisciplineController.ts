import { FastifyReply } from "fastify";
import { AuthenticatedRequest } from "../../../../shared/types/AuthenticatedRequest";
import { CreateDisciplineInteractor } from "../../application/use-cases/CreateDisciplineInteractor";
import { EnrollStudentInDisciplineInteractor } from "../../application/use-cases/EnrolIStudentInDisciplineInteractor";
import { FindManyDisciplinesInteractor } from "../../application/use-cases/FindManyDisciplinesInteractor";
import { disciplineValidator } from "../../domain/validators";
import { DisciplineMongoRepository } from "../../infra/DisciplineMongoRepository";
import { MongoUserRepository } from "../../../user/infra/MongoUserRepository";
import { AttributeTeacherInDisciplineInteractor } from "../../application/use-cases/AttributeTeacherInDiscipline";

export class DisciplineController {
    constructor(
        private readonly createDisciplineInteractor: CreateDisciplineInteractor,
        private readonly findManyDisciplinesInteractor: FindManyDisciplinesInteractor,
        private readonly enrollStudentInDisciplineInteractor: EnrollStudentInDisciplineInteractor,
        private readonly attributeTeacherInDisciplineInteractor: AttributeTeacherInDisciplineInteractor
    ) {}

    async createDiscipline(req: AuthenticatedRequest, res: FastifyReply) {
        const validated = disciplineValidator.parse(req.body);

        const discipline = await this.createDisciplineInteractor.execute(
            validated
        );
        res.status(201).send(discipline);
    }

    async findManyDisciplines(req: AuthenticatedRequest, res: FastifyReply) {
        const disciplines = await this.findManyDisciplinesInteractor.execute();
        res.status(200).send(disciplines);
    }

    async enrollStudentInDiscipline(
        req: AuthenticatedRequest,
        res: FastifyReply
    ) {
        const { disciplineId, studentId } = req.params as {
            disciplineId: string;
            studentId: string;
        };

        await this.enrollStudentInDisciplineInteractor.execute(
            disciplineId,
            studentId
        );

        res.status(204).send();
    }

    async attributeTeacherInDiscipline(
        req: AuthenticatedRequest,
        res: FastifyReply
    ) {
        const { disciplineId, teacherId } = req.params as {
            disciplineId: string;
            teacherId: string;
        };

        await this.attributeTeacherInDisciplineInteractor.execute(
            disciplineId,
            teacherId
        );

        res.status(204).send();
    }
}

export const makeDisciplineController = () => {
    const disciplineGateway = new DisciplineMongoRepository();
    const userGateway = new MongoUserRepository(disciplineGateway);
    const createDisciplineInteractor = new CreateDisciplineInteractor(
        disciplineGateway
    );
    const findManyDisciplinesInteractor = new FindManyDisciplinesInteractor(
        disciplineGateway
    );
    const enrollStudentInDisciplineInteractor =
        new EnrollStudentInDisciplineInteractor(disciplineGateway, userGateway);

    const attributeTeacherInDisciplineInteractor =
        new AttributeTeacherInDisciplineInteractor(
            disciplineGateway,
            userGateway
        );

    return new DisciplineController(
        createDisciplineInteractor,
        findManyDisciplinesInteractor,
        enrollStudentInDisciplineInteractor,
        attributeTeacherInDisciplineInteractor
    );
};
