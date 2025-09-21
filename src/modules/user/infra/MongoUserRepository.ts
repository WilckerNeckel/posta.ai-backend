import { ZodError } from "zod";
import { User } from "../domain/entities/User";
import { UserGateway } from "../domain/ports/UserGateway";
import { DatabaseError } from "../../shared/errors/DatabaseError";
import { Db } from "mongodb";
import { getMongo } from "../../../database/mongo";
import { CreateUser } from "../domain/types";
import { Course } from "../domain/enums/Course";
import { Password } from "../domain/vos/Password";
import { UserRole } from "../domain/enums/UserRole";
import { UserDbModel } from "./models";
import { InfraMapper } from "./InfraMapper";
import { userDbModelValidator } from "./validators";

export class MongoUserRepository implements UserGateway {
    readonly mongo: Db = getMongo();

    private readonly userColl = this.mongo.collection("user");

    public async save(user: User): Promise<User> {
        try {
            const toSave = {
                id: user.id,
                nome: user.nome,
                matricula: user.matricula,
                usuario: user.usuario,
                curso: user.curso.toString(),
                role: user.role.toString(),
                senha: user.password,
                dataAdmissao: user.dataAdmissao,
            } satisfies UserDbModel;

            await this.userColl.insertOne(toSave);

            return InfraMapper.fromDbToEntity(toSave);
        } catch (error) {
            if (error instanceof ZodError) throw error;

            throw new DatabaseError("Erro ao criar usuário", error);
        }
    }

    public async findById(id: string): Promise<User | null> {
        try {
            const user = await this.userColl.findOne({ id: id });
            const validated = userDbModelValidator.parse(user);

            if (!user) return null;

            return InfraMapper.fromDbToEntity(validated);
        } catch (error) {
            if (error instanceof ZodError) throw error;

            throw new DatabaseError("Erro ao buscar usuário por id", error);
        }
    }

    public async delete(id: string): Promise<void> {
        try {
            await this.userColl.deleteOne({ id: id });
        } catch (error) {
            if (error instanceof ZodError) throw error;

            throw new DatabaseError("Erro ao deletar usuário", error);
        }
    }

    public async findMany(): Promise<User[]> {
        try {
            const docs = await this.userColl.find().toArray();

            const validateds = docs.map((e) => userDbModelValidator.parse(e));
            return validateds.map((e) => InfraMapper.fromDbToEntity(e));
        } catch (error) {
            if (error instanceof ZodError) throw error;

            throw new DatabaseError("Erro ao buscar vários usuários", error);
        }
    }
}
