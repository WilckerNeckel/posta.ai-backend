import { User } from "../../domain/entities/User";
import { UserGateway } from "../../domain/ports/UserGateway";
import { BaseUserResponseModel } from "../dtos/BaseUserResponseModel";
import { CreateUserRequestModel } from "../dtos/CreateUserRequestModel";
import { UserMapper } from "../mappers/UserMapper";

export class CreateUserInteractor {
    constructor(private studentGateway: UserGateway) {}

    public async execute(
        input: CreateUserRequestModel
    ): Promise<BaseUserResponseModel> {
        const student = await User.create(input);
        const savedUser = await this.studentGateway.save(student);
        return UserMapper.toBaseUserResponseModel(savedUser);
    }
}
