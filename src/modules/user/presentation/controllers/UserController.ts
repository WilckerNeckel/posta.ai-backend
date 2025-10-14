import { AuthenticatedRequest } from "../../../../shared/types/AuthenticatedRequest";
import { CreateUserInteractor } from "../../application/use-cases/CreateUserInteractor";
import { FindManyUsersInteractor } from "../../application/use-cases/FindManyUsersInteractor";
import { GetUserByIdInteractor } from "../../application/use-cases/GetUserByIdInteractor";
import { createUserInputValidator } from "../../domain/validators";
import { MongoUserRepository } from "../../infra/MongoUserRepository";

export class UserController {
    constructor(
        private readonly createUserInteractor: CreateUserInteractor,
        private readonly getUserByIdInteractor: GetUserByIdInteractor,
        private readonly findManyUsersInteractor: FindManyUsersInteractor
    ) {}

    async create(request: AuthenticatedRequest, reply: any) {
        const validatedInput = createUserInputValidator.parse(request.body);

        const user = await this.createUserInteractor.execute(validatedInput);

        reply.status(201).send(user);
    }

    async findById(request: AuthenticatedRequest, reply: any) {
        const { id } = request.params as { id?: unknown };

        if (typeof id !== "string" || id.length === 0) {
            return reply.status(400).send({ message: "ID inválido" });
        }

        const user = await this.getUserByIdInteractor.execute(id);

        reply.send(user);
    }

    async findMany(request: AuthenticatedRequest, reply: any) {
        const users = await this.findManyUsersInteractor.execute();

        reply.send(users);
    }
}

export const makeUserController = ( ) => {
    const studentGateway = new MongoUserRepository();
    const createUserInteractor = new CreateUserInteractor(studentGateway);
    const getUserByIdInteractor = new GetUserByIdInteractor(studentGateway);
    const findManyUsersInteractor = new FindManyUsersInteractor(studentGateway);

    return new UserController(
        createUserInteractor,
        getUserByIdInteractor,
        findManyUsersInteractor
    );
};