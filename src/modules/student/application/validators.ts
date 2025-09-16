import z from "zod";

export const baseStudentResponseValidator = z.object({
    id: z.string(),
    matricula: z.string(),
    nome: z.string(),
    curso: z.string(),
    dataAdmissao: z.date(),
});
