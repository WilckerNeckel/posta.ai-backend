import { User } from "../domain/entities/User";
import { Course } from "../domain/enums/Course";
import { UserRole } from "../domain/enums/UserRole";
import { Password } from "../domain/vos/Password";
import { UserDbModel } from "./models";

export class InfraMapper {
    public static fromDbToEntity(model: UserDbModel): User {
        return User.load({
            id: model.id,
            curso: model.curso as Course,
            matricula: model.matricula,
            nome: model.nome,
            role: model.role as UserRole,
            dataAdmissao: model.dataAdmissao,
            senha: Password.fromHash(model.senha),
            usuario: model.usuario,
        });
    }
}
