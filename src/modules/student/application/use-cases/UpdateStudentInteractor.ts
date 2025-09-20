import { Student } from "../../domain/entities/Student";
import { StudentGateway } from "../../domain/ports/StudentGateway";
import { UpdateStudentInput } from "../../domain/types";

export class UpdateStudentInteractor {
    constructor(private gateway: StudentGateway) {}
    async execute(id: string, updates: UpdateStudentInput): Promise<Student> {
        const student = await this.gateway.findById(id);
        if (!student) {
            throw new Error("Student not found");
        }
        const updatedStudent = await student.copyWith(updates);
        return this.gateway.update(updatedStudent);
    }
}
