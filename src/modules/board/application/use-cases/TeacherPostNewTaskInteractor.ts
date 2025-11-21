import { DisciplineGateway } from "../../../discipline/domain/DisciplineGateway";
import { UserGateway } from "../../../user";
import { UserRole } from "../../../user/domain/enums/UserRole";
import { BoardGateway } from "../../domain/ports/BoardGateway";
import { CreateTask } from "../../domain/types";

export class TeacherPostNewTaskInteractor {
    constructor(
        private userGateway: UserGateway,
        private boardGateway: BoardGateway,
        private disciplineGateway: DisciplineGateway
    ) {}

    public async execute(
        task: CreateTask,
        teacherId: string,
        disciplineId: string
    ): Promise<CreateTask> {
        const { teacher, discipline } =
            await this.ensureTeacherAssignedToDiscipline(
                teacherId,
                disciplineId
            );

        const usersEnrolledInDiscipline = await this.userGateway.findMany({
            disciplineId: discipline.id,
            role: UserRole.aluno,
        });

        // teacher task creation
        await this.createTeacherTask(task);

        // return createdTask;
        // student task creation
        await Promise.all(
            usersEnrolledInDiscipline.map((student) =>
                this.createStudentTask(task, student.id, discipline.name)
            )
        );

        return task;
    }

    private async createTeacherTask(task: CreateTask): Promise<CreateTask> {
        // (The column id already represents the teacher's task column)
        const createdTask = await this.boardGateway.createTask(task);
        return createdTask;
    }

    private async createStudentTask(
        task: CreateTask,
        studentId: string,
        disciplineName: string
    ): Promise<void> {
        // enusre user is not teacher
        const student = await this.userGateway.findById(studentId);
        if (!student) {
            throw new Error(`Estudante com ID ${studentId} não encontrado`);
        }
        if (student.isProfessor) {
            return;
        }

        // get the student's discipline column
        const disciplineColumn =
            await this.disciplineGateway.getColumnByDisciplineName(
                disciplineName,
                studentId
            );

        if (!disciplineColumn) {
            throw new Error(
                `Coluna de disciplina não encontrada para o estudante com ID ${studentId} e disciplina ${disciplineName}`
            );
        }

        // create a new task for the student in their discipline column
        const studentTaskInput: CreateTask = {
            ...task,
            columnId: disciplineColumn.id,
        };

        await this.boardGateway.createTask(studentTaskInput);
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
