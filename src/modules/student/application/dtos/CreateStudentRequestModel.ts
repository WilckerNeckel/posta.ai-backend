import z from "zod";
import { createStudentInputValidator } from "../../domain/validators";

export type CreateStudentRequestModel = z.infer<
    typeof createStudentInputValidator
>;
