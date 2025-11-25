import { BoardGateway } from "../../../board/domain/ports/BoardGateway";
import { UserGateway } from "../../../user";
import { UserMapper } from "../../../user/application/mappers/UserMapper";
import { DisciplineGateway } from "../../domain/DisciplineGateway";

export class AttributeTeacherInDisciplineInteractor {
    constructor(
        private disciplineGateway: DisciplineGateway,
        private userGateway: UserGateway,
        private boardGateway: BoardGateway
    ) {}

    async execute(userId: string, disciplineId: string) {
        const { discipline, user } = await this.ensureItemsExists(
            disciplineId,
            userId
        );

        if (!user.isProfessor) {
            throw new Error(
                `Usuário com ID ${userId} não é um professor e não pode ser atribuído como docente da disciplina.`
            );
        }

        const alreadyEnrolled = user.disciplinas.some(
            (d) => d.id === discipline.id
        );

        if (alreadyEnrolled) {
            throw new Error(
                `Professor com ID ${userId} já está atribuído à disciplina com ID ${disciplineId}.`
            );
        }

        const updatedDisciplines = [...user.disciplinas, discipline];

        const updatedUser = await user.copyWith({
            disciplinas: updatedDisciplines,
        });

        const updated = await this.userGateway.update(updatedUser);

        await this.boardGateway.createColumn({
            disciplineColumn: true,
            titulo: discipline.name,
            userId: updated.id,
        });

        return UserMapper.toBaseUserResponseModel(updated);
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
