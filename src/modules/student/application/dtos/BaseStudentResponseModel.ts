import z from "zod";
import { baseStudentResponseValidator } from "../validators";

export type BaseStudentResponseModel = z.infer<
    typeof baseStudentResponseValidator
>;
