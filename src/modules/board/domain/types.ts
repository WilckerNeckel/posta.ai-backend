import z from "zod";
import { columnValidator } from "./validators";

export type Column = z.infer<typeof columnValidator>;
