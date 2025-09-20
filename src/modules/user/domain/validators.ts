import z from "zod";
import { Password } from "./vos/Password";
import { UserRole } from "./enums/UserRole";

export const createUserValidator = z.object({
    id: z.string(),
    nome: z.string(),
    usuario: z.string(),
    matricula: z.string(),
    role: z.nativeEnum(UserRole),
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

export const createUserInputValidator = z.object({
    nome: z.string(),
    role: z.nativeEnum(UserRole),
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

export const updateUserInputValidator = createUserInputValidator.partial();

export const updateUserValidator = createUserValidator
    .omit({
        id: true,
        matricula: true,
        dataAdmissao: true,
    })
    .partial();
