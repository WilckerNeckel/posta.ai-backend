import z from "zod";

export const userDbModelValidator = z.object({
    id: z.string(),
    nome: z.string(),
    matricula: z.string(),
    disciplinas: z.array(z.object({ id: z.string() })),
    usuario: z.string(),
    curso: z.string(),
    role: z.string(),
    senha: z.string(),
    dataAdmissao: z.date(),
});
