import { CreateStudentRequestModel } from "../../application/dtos/CreateStudentRequestModel";
import { MatriculaGenarator } from "../services/MatriculaGenarator";
import { CreateStudentInputValidator, CreateStudentValidator } from "../types";
import { createStudentValidator } from "../validators";
import { Password } from "../vos/Password";

export class Student {
    private readonly nome: string;
    private readonly matricula: string;
    private readonly usuario: string;
    private readonly curso: string;
    private readonly senha: Password;
    private readonly dataAdmissao: Date;

    private constructor(props: CreateStudentValidator) {
        this.nome = props.nome;
        this.matricula = props.matricula;
        this.usuario = props.usuario;
        this.curso = props.curso;
        this.senha = props.senha;
        this.dataAdmissao = props.dataAdmissao;
    }

    public async create(input: CreateStudentInputValidator): Promise<Student> {
        const admisionDate = new Date();
        const matricula = new MatriculaGenarator().generate(admisionDate);
        const resolvedInput = {
            ...input,
            matricula: matricula,
            dataAdmissao: admisionDate,
            senha: await Password.create(input.senha),
        } satisfies CreateStudentValidator;

        const validatedData = this.validate(resolvedInput);

        return new Student(validatedData);
    }

    public async copyWith(
        input: Partial<CreateStudentRequestModel>
    ): Promise<Student> {
        const updatedData = {
            nome: input.nome ?? this.nome,
            curso:
                input.curso ?? (this.curso as CreateStudentValidator["curso"]),
            usuario: input.usuario ?? this.usuario,
            matricula: this.matricula,
            dataAdmissao: this.dataAdmissao,
            senha: input.senha
                ? await Password.create(input.senha)
                : this.senha,
        } satisfies CreateStudentValidator;

        const validatedData = this.validate(updatedData);
        return new Student(validatedData);
    }

    private validate(input: any): CreateStudentValidator {
        return createStudentValidator.parse(input);
    }
}
