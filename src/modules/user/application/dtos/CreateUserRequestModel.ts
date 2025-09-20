import z from "zod";
import { createUserInputValidator } from "../../domain/validators";

export type CreateUserRequestModel = z.infer<typeof createUserInputValidator>;
