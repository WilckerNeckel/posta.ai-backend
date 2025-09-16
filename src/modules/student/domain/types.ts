import z from "zod";
import {
    createStudentInputValidator,
    createStudentValidator,
} from "./validators";

export type CreateStudentInputValidator = z.infer<
    typeof createStudentInputValidator
>;

export type CreateStudentValidator = z.infer<typeof createStudentValidator>;
