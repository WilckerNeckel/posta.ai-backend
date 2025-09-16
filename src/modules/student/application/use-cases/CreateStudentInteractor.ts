import { Student } from "../../domain/entities/Student";
import { StudentGateway } from "../../domain/ports/StudentGateway";
import { BaseStudentResponseModel } from "../dtos/BaseStudentResponseModel";
import { CreateStudentRequestModel } from "../dtos/CreateStudentRequestModel";
import { StudentMapper } from "../StudentMapper";

export class CreateStudentInteractor {
    constructor(private studentGateway: StudentGateway) {}

    public async execute(
        input: CreateStudentRequestModel
    ): Promise<BaseStudentResponseModel> {
        const student = await Student.create(input);
        const savedStudent = await this.studentGateway.save(student);
        return StudentMapper.toBaseStudentResponseModel(savedStudent);
    }
}
