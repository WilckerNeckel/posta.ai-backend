import { Course } from "../../user/domain/enums/Course";
import { CreateDiscipline, Discipline } from "./types";

export interface DisciplineGateway {
    createDiscipline(discipline: CreateDiscipline): Promise<Discipline>;
    getColumnByDisciplineName(disciplineName: string, studentId: string): Promise<Discipline | null>;
    getDisciplineById(id: string): Promise<Discipline | null>;
    findAll(filters?: { course?: Course }): Promise<Discipline[]>;
    findById(id: string): Promise<Discipline | null>;
    findDisciplinesByUserId(userId: string): Promise<Discipline[]>;
}
