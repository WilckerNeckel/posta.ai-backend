import { User } from "../../domain/entities/User";
import { BaseUserResponseModel } from "../dtos/BaseUserResponseModel";

export class UserMapper {
    public static toBaseUserResponseModel(
        student: User
    ): BaseUserResponseModel {
        return {
            id: student.id,
            nome: student.nome,
            matricula: student.matricula,
            curso: student.curso.toString(),
            dataAdmissao: student.dataAdmissao,
        };
    }
}
