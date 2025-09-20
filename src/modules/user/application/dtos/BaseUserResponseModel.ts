import z from "zod";
import { baseUserResponseValidator } from "../validators";

export type BaseUserResponseModel = z.infer<typeof baseUserResponseValidator>;
