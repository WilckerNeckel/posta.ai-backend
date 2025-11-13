import { FastifyReply } from "fastify";
import { AuthenticatedRequest } from "../../../shared/types/AuthenticatedRequest";
import { LoginUseCase } from "../application/LoginUseCase";
import { loginValidator } from "../application/loginValidator";
import { MongoUserRepository } from "../../user/infra/MongoUserRepository";
import { DisciplineMongoRepository } from "../../discipline/infra/DisciplineMongoRepository";

export class AuthController {
    constructor(private authUserInteractor: LoginUseCase) {}

    async authenticate(request: AuthenticatedRequest, reply: FastifyReply) {
        const { usuario, senha } = loginValidator.parse(request.body);

        const authResult = await this.authUserInteractor.execute(
            usuario,
            senha
        );

        reply.send(authResult);
    }
}

export const makeAuthController = () => {
    const disciplineGateway = new DisciplineMongoRepository();
    const userGateway = new MongoUserRepository(disciplineGateway);
    const loginUseCase = new LoginUseCase(userGateway);
    return new AuthController(loginUseCase);
};
