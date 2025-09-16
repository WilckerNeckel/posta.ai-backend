import z from "zod";

const createStudentValidator = z.object({
    nome: z.string(),
    usuario: z.string(),
    senha: z.string().min(6, "A senha deve conter no mínimo 6 caracteres"),
    curso: z.enum([
        "Ciência da Computação",
        "Arquitetura e Urbanismo",
        "Direito",
        "Matemática",
        "Engenharia de Produção",
        "Engenharia de Alimentos",
    ]),
});

const createStudentInputValidator = z.object({
    nome: z.string(),
    usuario: z.string(),
    senha: z.string().min(6, "A senha deve conter no mínimo 6 caracteres"),
    curso: z.enum([
        "Ciência da Computação",
        "Arquitetura e Urbanismo",
        "Direito",
        "Matemática",
        "Engenharia de Produção",
        "Engenharia de Alimentos",
    ]),
});
