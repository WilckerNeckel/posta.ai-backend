import z from "zod";

export const columnValidator = {
    nome: z
        .string()
        .min(1, "O nome da coluna tem que possuir pelo menos 3 lettras"),
};
