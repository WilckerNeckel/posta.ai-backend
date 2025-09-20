import z from "zod";
import {
    createUserInputValidator,
    createUserValidator,
    updateUserInputValidator,
    updateUserValidator,
} from "./validators";

export type CreateUserInput = z.infer<typeof createUserInputValidator>;

export type CreateUser = z.infer<typeof createUserValidator>;

export type UpdateUser = z.infer<typeof updateUserValidator>;

export type UpdateUserInput = z.infer<typeof updateUserInputValidator>;
