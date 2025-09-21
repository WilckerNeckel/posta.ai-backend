import { UserGateway } from "../../domain/ports/UserGateway";
import { UserMapper } from "../mappers/UserMapper";

export class FindManyUsersInteractor {
    constructor(private readonly userGateway: UserGateway) {}

    public async execute() {
        const res = await this.userGateway.findMany();

        return res.map((e) => UserMapper.toBaseUserResponseModel(e));
    }
}
