import { DisciplineGateway } from "../../../discipline/domain/DisciplineGateway";
import { UserGateway } from "../../../user";
import { UserRole } from "../../../user/domain/enums/UserRole";
import { BoardGateway } from "../../domain/ports/BoardGateway";
import { UpdateTask } from "../../domain/types";
import { WebSocketEventEmitter } from "../../../../shared/domain/ports/websocket-event-emitter";

export class TeacherUpdateTaskInteractor {
    constructor(
        private userGateway: UserGateway,
        private boardGateway: BoardGateway,
        private disciplineGateway: DisciplineGateway,
        private wsEmitter: WebSocketEventEmitter
    ) {}

    public async execute(
        taskId: string,
        teacherId: string,
        disciplineId: string,
        updateData: UpdateTask
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

        // Guardar titulo anterior para localizar nos alunos
        const previousTitle = currentTask.titulo;

        // Atualiza tarefa do professor
        await this.boardGateway.updateTask(taskId, {
            ...currentTask,
            ...updateData,
        });

        // Propaga para alunos inscritos
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

                await this.boardGateway.updateTask(targetTask.id, {
                    ...targetTask,
                    ...updateData,
                });
            })
        );

        this.wsEmitter.emitToEnrolledUsers(
            "DISCIPLINE_TASK_UPDATED",
            discipline.id,
            {
                ...currentTask,
                ...updateData,
                disciplineId: discipline.id,
                disciplineName: discipline.name,
                previousTitle,
            }
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
