import z from "zod";
import { userDbModelValidator } from "./validators";

export type UserDbModel = z.infer<typeof userDbModelValidator>;
