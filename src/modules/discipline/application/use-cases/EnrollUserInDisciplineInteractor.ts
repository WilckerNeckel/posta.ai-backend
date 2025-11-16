import { UserGateway } from "../../../user";
import { UserMapper } from "../../../user/application/mappers/UserMapper";
import { DisciplineGateway } from "../../domain/DisciplineGateway";

export class EnrollUserInDisciplineInteractor {
    constructor(
        private disciplineGateway: DisciplineGateway,
        private userGateway: UserGateway
    ) {}

    async execute(userId: string, disciplineId: string) {
        const { discipline, user } = await this.ensureItemsExists(
            disciplineId,
            userId
        );

        const alreadyEnrolled = user.disciplinas.some(
            (d) => d.id === discipline.id
        );
        
        if (alreadyEnrolled) {
            throw new Error(
                `Usuário com ID ${userId} já está matriculado na disciplina com ID ${disciplineId}.`
            );
        }

        const updatedDisciplines = [...user.disciplinas, discipline];

        const updatedUser = await  user.copyWith({ disciplinas: updatedDisciplines });

        const savedUser = await this.userGateway.save(updatedUser);

        return UserMapper.toBaseUserResponseModel(savedUser);
    }

    private async ensureItemsExists(disciplineId: string, userId: string) {
        const discipline = await this.disciplineGateway.getDisciplineById(
            disciplineId
        );
        if (!discipline) {
            throw new Error(
                `Disciplina com ID ${disciplineId} não encontrada.`
            );
        }

        const user = await this.userGateway.findById(userId);
        if (!user) {
            throw new Error(`Usuário com ID ${userId} não encontrado.`);
        }

        return { discipline, user };
    }
}
