import { CreateStudentRequestModel } from "../../application/dtos/CreateStudentRequestModel";
import { MatriculaGenarator } from "../services/MatriculaGenarator";
import { CreateStudent, CreateStudentInput } from "../types";
import { createStudentValidator } from "../validators";
import { Password } from "../vos/Password";

export class Student {
    public readonly id: string;
    public readonly nome: string;
    public readonly matricula: string;
    private readonly usuario: string;
    public readonly curso: string;
    private readonly senha: Password;
    public readonly dataAdmissao: Date;

    private constructor(props: CreateStudent) {
        this.id = props.id;
        this.nome = props.nome;
        this.matricula = props.matricula;
        this.usuario = props.usuario;
        this.curso = props.curso;
        this.senha = props.senha;
        this.dataAdmissao = props.dataAdmissao;
    }

    public static async create(input: CreateStudentInput): Promise<Student> {
        const admisionDate = new Date();
        const matricula = new MatriculaGenarator().generate(admisionDate);
        const resolvedInput = {
            ...input,
            id: crypto.randomUUID(),
            matricula: matricula,
            dataAdmissao: admisionDate,
            senha: await Password.create(input.senha),
        } satisfies CreateStudent;

        const validatedData = this.validate(resolvedInput);

        return new Student(validatedData);
    }

    public static load(props: CreateStudent): Student {
        const validatedData = this.validate(props);
        return new Student(validatedData);
    }

    public async copyWith(
        input: Partial<CreateStudentRequestModel>
    ): Promise<Student> {
        const updatedData = {
            id: this.id,
            matricula: this.matricula,
            dataAdmissao: this.dataAdmissao,
            nome: input.nome ?? this.nome,
            curso: input.curso ?? (this.curso as CreateStudent["curso"]),
            usuario: input.usuario ?? this.usuario,
            senha: input.senha
                ? await Password.create(input.senha)
                : this.senha,
        } satisfies CreateStudent;

        const validatedData = Student.validate(updatedData);
        return new Student(validatedData);
    }

    private static validate(input: any): CreateStudent {
        return createStudentValidator.parse(input);
    }
}
