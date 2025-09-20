import z from "zod";
import { taskValidator } from "../../domain/validators";

export type TaskResponseModel = z.infer<typeof taskValidator>;
