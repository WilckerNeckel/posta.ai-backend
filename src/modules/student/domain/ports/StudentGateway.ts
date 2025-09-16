import { Student } from "../entities/Student";

export interface StudentGateway {
    save(student: Student): Promise<Student>;
    findById(id: string): Promise<Student | null>;
    findMany(): Promise<Student[]>;
    delete(id: string): Promise<void>;
    update(student: Student): Promise<Student>;
}
