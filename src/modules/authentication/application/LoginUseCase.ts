import jwt from "jsonwebtoken";
import { UserGateway } from "../../user";
import { UnauthorizedError } from "../../shared/errors/UnauthorizedError";
import { logger } from "../../../shared/logging/logger";

export class LoginUseCase {
    constructor(private userGateway: UserGateway) {}

    async execute(
        username: string,
        password: string
    ): Promise<{ accessToken: string }> {
        const user = await this.getUser(username);

        const passwordIsValid = await user.matchPassord(password);
        if (!passwordIsValid)
            throw new UnauthorizedError("Usuário ou senha incorretos");

        const accessToken = this.issueToken(user.id);

        logger.info(`Usuário logado { nome: ${user.nome}, userId: ${user.id}}`);
        return { accessToken };
    }

    private issueToken(userId: string) {
        const { secret, expiresIn } = this.loadEnv();
        const payload = { userId };
        const options = {
            algorithm: "HS256" as const,
            expiresIn: expiresIn,
        };

        const accessToken = jwt.sign(payload, secret, options);

        return accessToken;
    }

    private loadEnv() {
        const secret = process.env.JWT_SECRET;

        if (!secret) {
            throw new UnauthorizedError("Secret is not set in the server");
        }

        const expiresIn = process.env.JWT_ACCESS_EXPIRES_IN ?? ("1d" as any);

        return {
            secret,
            expiresIn,
        };
    }

    private async getUser(username: string) {
        // get usuarioGestor
        const user = await this.userGateway.findByUsername(username);

        if (!user) throw new UnauthorizedError("Usuário ou senha incorretos");

        return user;
    }
}
