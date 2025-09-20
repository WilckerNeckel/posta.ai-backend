import z from "zod";

export const columnValidator = z.object({
    id: z.string(),
    userId: z.string(),
    nome: z
        .string()
        .min(1, "O nome da coluna tem que possuir pelo menos 3 lettras"),
});

export const taskValidator = z.object({
    titulo: z.string().min(3, "O título deve conter pelo menos 3 letras"),
    descricao: z.string(),
    columnId: z.string(),
});
