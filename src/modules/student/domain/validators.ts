import z from "zod";
import { Password } from "./vos/Password";

export const createStudentValidator = z.object({
    nome: z.string(),
    usuario: z.string(),
    matricula: z.string(),
    senha: z
        .any()
        .refine((value): value is Password => value instanceof Password, {
            message: "O valor deve ser uma instância de Password",
        }),
    curso: z.enum([
        "Ciência da Computação",
        "Arquitetura e Urbanismo",
        "Direito",
        "Matemática",
        "Engenharia de Produção",
        "Engenharia de Alimentos",
    ]),
    dataAdmissao: z.date(),
});

export const createStudentInputValidator = z.object({
    nome: z.string(),
    curso: z.enum([
        "Ciência da Computação",
        "Arquitetura e Urbanismo",
        "Direito",
        "Matemática",
        "Engenharia de Produção",
        "Engenharia de Alimentos",
    ]),
    usuario: z.string(),
    senha: z.string().min(6, "A senha deve conter no mínimo 6 caracteres"),
});
