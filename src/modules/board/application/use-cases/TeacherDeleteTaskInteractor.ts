import { DisciplineGateway } from "../../../discipline/domain/DisciplineGateway";
import { UserGateway } from "../../../user";
import { UserRole } from "../../../user/domain/enums/UserRole";
import { BoardGateway } from "../../domain/ports/BoardGateway";

export class TeacherDeleteTaskInteractor {
    constructor(
        private userGateway: UserGateway,
        private boardGateway: BoardGateway,
        private disciplineGateway: DisciplineGateway
    ) {}

    public async execute(
        taskId: string,
        teacherId: string,
        disciplineId: string
    ): Promise<void> {
        const { discipline } = await this.ensureTeacherAssignedToDiscipline(
            teacherId,
            disciplineId
        );

        const currentTask = await this.boardGateway.getTaskById(taskId);
        if (!currentTask) throw new Error("Tarefa não encontrada");

        const currentColumn = await this.boardGateway.getColumnById(
            currentTask.columnId
        );
        if (!currentColumn || !currentColumn.disciplineColumn) {
            throw new Error("Tarefa não pertence a coluna de disciplina");
        }

        if (currentColumn.titulo !== discipline.name) {
            throw new Error("Tarefa não pertence à disciplina informada");
        }

        const previousTitle = currentTask.titulo;

        // Remove tarefa do professor
        await this.boardGateway.deleteTask(taskId);

        // Propaga remoção para alunos
        const students = await this.userGateway.findMany({
            disciplineId,
            role: UserRole.aluno,
        });

        await Promise.all(
            students.map(async (student) => {
                const studentColumn =
                    await this.boardGateway.getColumnByTittle(
                        discipline.name,
                        student.id
                    );
                if (!studentColumn) return;

                const tasks = await this.boardGateway.getTasksByColumn(
                    studentColumn.id
                );

                const targetTask = tasks.find(
                    (task) => task.titulo === previousTitle
                );
                if (!targetTask) return;

                await this.boardGateway.deleteTask(targetTask.id);
            })
        );
    }

    private async ensureTeacherAssignedToDiscipline(
        teacherId: string,
        disciplineId: string
    ) {
        const teacher = await this.userGateway.findById(teacherId);

        if (!teacher) {
            throw new Error("Professor não encontrado");
        }

        const discipline = await this.disciplineGateway.getDisciplineById(
            disciplineId
        );

        if (!discipline) {
            throw new Error("Disciplina não encontrada");
        }

        if (discipline.professorId !== teacher.id) {
            throw new Error("Professor não está atribuído a esta disciplina");
        }

        return { teacher, discipline };
    }
}
