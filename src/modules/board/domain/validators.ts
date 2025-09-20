import z from "zod";

export const columnValidator = z.object({
    nome: z
        .string()
        .min(1, "O nome da coluna tem que possuir pelo menos 3 lettras"),
});
