import z from "zod";
import { columnWithTasksValidator } from "../../domain/validators";

export type ColumWithTasksResponseModel = z.infer<
    typeof columnWithTasksValidator
>;
