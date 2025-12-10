import { FastifyReply } from "fastify";
import { AuthenticatedRequest } from "../../../../shared/types/AuthenticatedRequest";
import { CreateDisciplineInteractor } from "../../application/use-cases/CreateDisciplineInteractor";
import { EnrollStudentInDisciplineInteractor } from "../../application/use-cases/EnrolIStudentInDisciplineInteractor";
import { FindManyDisciplinesInteractor } from "../../application/use-cases/FindManyDisciplinesInteractor";
import { createDisciplineValidator } from "../../domain/validators";
import { DisciplineMongoRepository } from "../../infra/DisciplineMongoRepository";
import { MongoUserRepository } from "../../../user/infra/MongoUserRepository";
import { AttributeTeacherInDisciplineInteractor } from "../../application/use-cases/AttributeTeacherInDiscipline";
import { MongoBoardRepository } from "../../../board/infra/MongoBoardRepository";
import { FindDisciplinesByUserInteractor } from "../../application/use-cases/FindDisciplinesByUserInteractor";

export class DisciplineController {
    constructor(
        private readonly createDisciplineInteractor: CreateDisciplineInteractor,
        private readonly findManyDisciplinesInteractor: FindManyDisciplinesInteractor,
        private readonly enrollStudentInDisciplineInteractor: EnrollStudentInDisciplineInteractor,
        private readonly attributeTeacherInDisciplineInteractor: AttributeTeacherInDisciplineInteractor,
        private readonly findDisciplinesByUserInteractor: FindDisciplinesByUserInteractor
    ) {}

    async createDiscipline(req: AuthenticatedRequest, res: FastifyReply) {
        const validated = createDisciplineValidator.parse(req.body);

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
            studentId,
            disciplineId
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
            teacherId,
            disciplineId
        );

        res.status(204).send();
    }

    async findMyDisciplines(req: AuthenticatedRequest, res: FastifyReply) {
        const userId = req.user?.userId;
        if (!userId || typeof userId !== "string") {
            return res.status(400).send({ message: "ID inválido" });
        }

        const disciplines = await this.findDisciplinesByUserInteractor.execute(
            userId
        );

        res.status(200).send(disciplines);
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

    const boardGateway = new MongoBoardRepository();
    const enrollStudentInDisciplineInteractor =
        new EnrollStudentInDisciplineInteractor(
            disciplineGateway,
            userGateway,
            boardGateway
        );
    const attributeTeacherInDisciplineInteractor =
        new AttributeTeacherInDisciplineInteractor(
            disciplineGateway,
            userGateway,
            boardGateway
        );
    const findDisciplinesByUserInteractor = new FindDisciplinesByUserInteractor(
        disciplineGateway
    );

    return new DisciplineController(
        createDisciplineInteractor,
        findManyDisciplinesInteractor,
        enrollStudentInDisciplineInteractor,
        attributeTeacherInDisciplineInteractor,
        findDisciplinesByUserInteractor
    );
};
