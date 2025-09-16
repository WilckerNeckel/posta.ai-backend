import z from "zod";

export const baseStudentResponseValidator = z.object({
    nome: z.string(),
    curso: z.string(),
    matricula: z.string(),
});
