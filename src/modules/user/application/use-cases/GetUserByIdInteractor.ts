import { AppNotFoundError } from "../../../shared/errors/AppNotFoundError";
import { UserGateway } from "../../domain/ports/UserGateway";
import { UserMapper } from "../mappers/UserMapper";

export class GetUserByIdInteractor {
    constructor(private readonly userGateway: UserGateway) {}

    public async execute(userId: string) {
        const user = await this.userGateway.findById(userId);
        if (!user) throw new AppNotFoundError("Usuário não encontrado");

        return UserMapper.toBaseUserResponseModel(user);
    }
}
