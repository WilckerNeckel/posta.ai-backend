import z from "zod";

export const loginValidator = z.object({
    usuario: z.string().min(1, "O campo 'usuario' é obrigatório"),
    senha: z.string().min(1, "O campo 'senha' é obrigatório"),
});
