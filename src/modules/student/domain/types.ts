import z from "zod";
import {
    createStudentInputValidator,
    createStudentValidator,
    updateStudentInputValidator,
    updateStudentValidator,
} from "./validators";

export type CreateStudentInput = z.infer<
    typeof createStudentInputValidator
>;

export type CreateStudent = z.infer<typeof createStudentValidator>;

export type UpdateStudent = z.infer<typeof updateStudentValidator>;

export type UpdateStudentInput = z.infer<
    typeof updateStudentInputValidator
>;
