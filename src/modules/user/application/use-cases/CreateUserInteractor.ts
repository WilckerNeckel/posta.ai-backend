import { DisciplineGateway } from "../../../discipline/domain/DisciplineGateway";
import { Discipline } from "../../../discipline/domain/types";
import { User } from "../../domain/entities/User";
import { UserGateway } from "../../domain/ports/UserGateway";
import { BaseUserResponseModel } from "../dtos/BaseUserResponseModel";
import { CreateUserRequestModel } from "../dtos/CreateUserRequestModel";
import { UserMapper } from "../mappers/UserMapper";

export class CreateUserInteractor {
    constructor(
        private studentGateway: UserGateway,
        private disciplineGateway: DisciplineGateway
    ) {}

    public async execute(
        input: CreateUserRequestModel
    ): Promise<BaseUserResponseModel> {
        const disciplines = await this.ensureDisciplinesExists(
            input.disciplinasIds
        );

        const student = await User.create({
            nome: input.nome,
            usuario: input.usuario,
            role: input.role,
            curso: input.curso,
            disciplinas: disciplines,
            senha: input.senha,
        });

        const savedUser = await this.studentGateway.save(student);
        return UserMapper.toBaseUserResponseModel(savedUser);
    }

    private async ensureDisciplinesExists(
        disciplineIds: string[]
    ): Promise<Discipline[]> {
        const disciplines: Discipline[] = [];
        for (const disciplineId of disciplineIds) {
            const discipline = await this.disciplineGateway.getDisciplineById(
                disciplineId
            );
            if (!discipline) {
                throw new Error(
                    `Disciplina com ID ${disciplineId} não encontrada.`
                );
            }
            disciplines.push(discipline);
        }
        return disciplines;
    }
}
