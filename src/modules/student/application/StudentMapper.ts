import { Student } from "../domain/entities/Student";
import { BaseStudentResponseModel } from "./dtos/BaseStudentResponseModel";

export class StudentMapper {
    public static toBaseStudentResponseModel(
        student: Student
    ): BaseStudentResponseModel {
        return {
            id: student.id,
            nome: student.nome,
            matricula: student.matricula,
            curso: student.curso,
            dataAdmissao: student.dataAdmissao,
        };
    }
}
