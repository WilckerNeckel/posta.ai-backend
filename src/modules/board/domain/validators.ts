import z from "zod";

export const columnValidator = z.object({
    id: z.string(),
    ordem: z.number(),
    disciplineColumn: z.boolean(),
    titulo: z
        .string()
        .min(1, "O nome da coluna tem que possuir pelo menos 3 letras"),
    userId: z.string(),
});

export const updateColumnValidator = columnValidator.pick({
    titulo: true,
}).partial();

export const createColumnValidator = columnValidator.omit({
    ordem: true,
    id: true,
});

export const taskValidator = z.object({
    id: z.string(),
    titulo: z.string().min(3, "O título deve conter pelo menos 3 letras"),
    ordem: z.number(),
    descricao: z.string(),
    columnId: z.string(),
});

export const updateTaskValidator = taskValidator.pick({
    titulo: true,
    descricao: true,
}).partial();

export const createTaskValidator = taskValidator.omit({
    ordem: true,
    id: true,
});

export const columnWithTasksValidator = columnValidator.extend({
    tasks: taskValidator.array(),
});

export const teacherPostNewTaskValidator = z.object({
    task: createTaskValidator,
    teacherId: z.string(),
    disciplineId: z.string(),
});