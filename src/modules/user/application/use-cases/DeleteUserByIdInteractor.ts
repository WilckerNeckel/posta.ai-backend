import { AppNotFoundError } from "../../../shared/errors/AppNotFoundError";
import { UserGateway } from "../../domain/ports/UserGateway";

export class DeleteUserByIdInteractor {
    constructor(private readonly userGateway: UserGateway) {}

    public async execute(userId: string) {
        const user = await this.userGateway.findById(userId);
        if (!user) throw new AppNotFoundError("Usuário não encontrado");

        await this.userGateway.delete(userId);
    }
}
