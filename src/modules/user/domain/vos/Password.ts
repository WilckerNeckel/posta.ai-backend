import bcrypt from "bcrypt";
import z from "zod";

export class Password {
    private readonly hashedPassword: string;

    private constructor(hashedPassword: string) {
        this.hashedPassword = hashedPassword;
    }

    // Define password validation validator inside the Password class
    private static validate(plainTextPassword: string) {
        const validator = z
            .string()
            .min(6, "A senha deve conter pelo menos 6 caracteres");

        validator.parse(plainTextPassword); // Throws an error if invalid
    }

    //Method to create a hashed password from plain text
    static async create(plainTextPassword: string): Promise<Password> {
        Password.validate(plainTextPassword);
        const salt = 10;
        const hashedPassword = await bcrypt.hash(plainTextPassword, salt);
        return new Password(hashedPassword);
    }

    /**
     * Cria Senha sem hashear novamente, pois já está hasheado
     *
     */
    static fromHash(hashedPassword: string): Password {
        return new Password(hashedPassword);
    }

    async matches(plainTextPassword: string): Promise<boolean> {
        return await bcrypt.compare(plainTextPassword, this.hashedPassword);
    }

    get value(): string {
        return this.hashedPassword;
    }
}
