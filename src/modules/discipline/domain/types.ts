import z from "zod";
import { disciplineValidator, createDisciplineValidator } from "./validators";

export type Discipline = z.infer<typeof disciplineValidator>;

export type CreateDiscipline = z.infer<typeof createDisciplineValidator>;
