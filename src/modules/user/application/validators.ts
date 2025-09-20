import z from "zod";

export const baseUserResponseValidator = z.object({
    id: z.string(),
    matricula: z.string(),
    nome: z.string(),
    curso: z.string(),
    dataAdmissao: z.date(),
});
