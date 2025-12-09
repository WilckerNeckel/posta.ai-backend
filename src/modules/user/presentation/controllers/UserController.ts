import { FastifyReply } from "fastify";
import { AuthenticatedRequest } from "../../../../shared/types/AuthenticatedRequest";
import { CreateUserInteractor } from "../../application/use-cases/CreateUserInteractor";
import { FindManyUsersInteractor } from "../../application/use-cases/FindManyUsersInteractor";
import { GetUserByIdInteractor } from "../../application/use-cases/GetUserByIdInteractor";
import { createUserInputValidator } from "../../domain/validators";
import { MongoUserRepository } from "../../infra/MongoUserRepository";
import { DisciplineMongoRepository } from "../../../discipline/infra/DisciplineMongoRepository";

export class UserController {
    constructor(
        private readonly createUserInteractor: CreateUserInteractor,
        private readonly getUserByIdInteractor: GetUserByIdInteractor,
        private readonly findManyUsersInteractor: FindManyUsersInteractor
    ) {}

    async create(request: AuthenticatedRequest, reply: FastifyReply) {
        const validatedInput = createUserInputValidator.parse(request.body);

        const user = await this.createUserInteractor.execute(validatedInput);

        reply.status(201).send(user);
    }

    async findById(request: AuthenticatedRequest, reply: FastifyReply) {
        const { id } = request.params as { id?: unknown };

        if (typeof id !== "string" || id.length === 0) {
            return reply.status(400).send({ message: "ID inválido" });
        }

        const user = await this.getUserByIdInteractor.execute(id);

        reply.send(user);
    }

    async findMany(request: AuthenticatedRequest, reply: FastifyReply) {
        const users = await this.findManyUsersInteractor.execute();

        reply.send(users);
    }

    async findMe(request: AuthenticatedRequest, reply: FastifyReply) {
        const userId = request.user?.userId;

        if (!userId || typeof userId !== "string") {
            return reply.status(400).send({ message: "ID inválido" });
        }

        const user = await this.getUserByIdInteractor.execute(userId);

        reply.send(user);
    }
}

export const makeUserController = () => {
    const disciplineGateway = new DisciplineMongoRepository();
    const studentGateway = new MongoUserRepository(disciplineGateway);
    const createUserInteractor = new CreateUserInteractor(studentGateway, disciplineGateway);
    const getUserByIdInteractor = new GetUserByIdInteractor(studentGateway);
    const findManyUsersInteractor = new FindManyUsersInteractor(studentGateway);

    return new UserController(
        createUserInteractor,
        getUserByIdInteractor,
        findManyUsersInteractor
    );
};
