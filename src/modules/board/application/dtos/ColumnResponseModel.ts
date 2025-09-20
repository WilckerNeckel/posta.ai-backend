import z from "zod";
import { createColumnValidator } from "../../domain/validators";

export type ColumnResponseModel = z.infer<typeof createColumnValidator>;
