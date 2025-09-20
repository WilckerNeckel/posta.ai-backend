import { User } from "../../domain/entities/User";
import { UserGateway } from "../../domain/ports/UserGateway";
import { UpdateUserInput } from "../../domain/types";

export class UpdateUserInteractor {
    constructor(private gateway: UserGateway) {}
    async execute(id: string, updates: UpdateUserInput): Promise<User> {
        const student = await this.gateway.findById(id);
        if (!student) {
            throw new Error("User not found");
        }
        const updatedUser = await student.copyWith(updates);
        return this.gateway.update(updatedUser);
    }
}
