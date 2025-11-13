import z from "zod";
import { Course } from "../../user/domain/enums/Course";

export const disciplineValidator = z.object({
    id: z.string(),
    name: z.string().min(1, "Discipline name is required"),
    curso: z.nativeEnum(Course),
});

export const createDisciplineValidator = disciplineValidator.omit({
    id: true,
});
