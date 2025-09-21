import { CreateUserRequestModel } from "../../application/dtos/CreateUserRequestModel";
import { Course } from "../enums/Course";
import { UserRole } from "../enums/UserRole";
import { MatriculaGenarator } from "../services/MatriculaGenarator";
import { CreateUser, CreateUserInput } from "../types";
import { createUserValidator } from "../validators";
import { Password } from "../vos/Password";

export class User {
    public readonly id: string;
    public readonly nome: string;
    public readonly matricula: string;
    private readonly _usuario: string;
    public readonly curso: Course;
    private readonly senha: Password;
    public readonly dataAdmissao: Date;
    public readonly role: UserRole;

    private constructor(props: CreateUser) {
        this.id = props.id;
        this.nome = props.nome;
        this.matricula = props.matricula;
        this._usuario = props.usuario;
        this.curso = props.curso;
        this.role = props.role;
        this.senha = props.senha;
        this.dataAdmissao = props.dataAdmissao;
    }

    get password() {
        return this.senha.value;
    }

    get usuario() {
        return this._usuario;
    }

    public async matchPassord(plainPassword: string) {
        return await this.senha.matches(plainPassword);
    }

    public static async create(input: CreateUserInput): Promise<User> {
        const admisionDate = new Date();
        const matricula = new MatriculaGenarator().generate(admisionDate);
        const resolvedInput = {
            ...input,
            id: crypto.randomUUID(),
            matricula: matricula,
            dataAdmissao: admisionDate,
            senha: await Password.create(input.senha),
        } satisfies CreateUser;

        const validatedData = this.validate(resolvedInput);

        return new User(validatedData);
    }

    public static load(props: CreateUser): User {
        const validatedData = this.validate(props);
        return new User(validatedData);
    }

    public async copyWith(
        input: Partial<CreateUserRequestModel>
    ): Promise<User> {
        const updatedData = {
            id: this.id,
            matricula: this.matricula,
            dataAdmissao: this.dataAdmissao,
            role: input.role ?? this.role,
            nome: input.nome ?? this.nome,
            curso: input.curso ?? (this.curso as CreateUser["curso"]),
            usuario: input.usuario ?? this.usuario,
            senha: input.senha
                ? await Password.create(input.senha)
                : this.senha,
        } satisfies CreateUser;

        const validatedData = User.validate(updatedData);
        return new User(validatedData);
    }

    private static validate(input: any): CreateUser {
        return createUserValidator.parse(input);
    }
}
