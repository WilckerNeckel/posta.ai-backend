import { DisciplineGateway } from "../../../discipline/domain/DisciplineGateway";
import { Discipline } from "../../../discipline/domain/types";
import { User } from "../../domain/entities/User";
import { UserRole } from "../../domain/enums/UserRole";
import { UserGateway } from "../../domain/ports/UserGateway";
import { BaseUserResponseModel } from "../dtos/BaseUserResponseModel";
import { CreateUserRequestModel } from "../dtos/CreateUserRequestModel";
import { UserMapper } from "../mappers/UserMapper";

export class CreateUserInteractor {
    constructor(
        private userGateway: UserGateway,
        private disciplineGateway: DisciplineGateway
    ) {}

    public async execute(
        input: CreateUserRequestModel
    ): Promise<BaseUserResponseModel> {
        const isProfessor = input.role === UserRole.professor;

        const disciplines = await this.ensureDisciplinesExists(
            input.disciplinasIds ?? [],
            isProfessor
        );
        const user = await User.create({
            nome: input.nome,
            usuario: input.usuario,
            role: input.role,
            curso: input.curso,
            disciplinas: disciplines,
            senha: input.senha,
        });
        const savedUser = await this.userGateway.save(user);
        return UserMapper.toBaseUserResponseModel(savedUser);
    }

    private async ensureDisciplinesExists(
        disciplineIds: string[],
        isProfessor: boolean
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
            if (isProfessor && discipline.professorId) {
                throw new Error(
                    `Disciplina com ID ${disciplineId} já está atribuída a outro professor.`
                );
            }

            disciplines.push(discipline);
        }
        return disciplines;
    }
}
