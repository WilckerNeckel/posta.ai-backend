import { ZodError } from "zod";
import { User } from "../domain/entities/User";
import { UserGateway } from "../domain/ports/UserGateway";
import { DatabaseError } from "../../shared/errors/DatabaseError";
import { Db } from "mongodb";
import { getMongo } from "../../../database/mongo";
import { UserDbModel } from "./models";
import { InfraMapper } from "./InfraMapper";
import { userDbModelValidator } from "./validators";
import { UserRole } from "../domain/enums/UserRole";
import { DisciplineGateway } from "../../discipline/domain/DisciplineGateway";
import { Discipline } from "../../discipline/domain/types";

export class MongoUserRepository implements UserGateway {
    readonly mongo: Db = getMongo();

    constructor(private readonly disciplineGateway: DisciplineGateway) {}

    private readonly userColl = this.mongo.collection("user");

    public async save(user: User): Promise<User> {
        try {
            const toSave = {
                id: user.id,
                nome: user.nome,
                disciplinas: user.disciplinas.map((d) => ({ id: d.id })),
                matricula: user.matricula,
                usuario: user.usuario,
                curso: user.curso.toString(),
                role: user.role.toString(),
                senha: user.password,
                dataAdmissao: user.dataAdmissao,
            } satisfies UserDbModel;

            await this.userColl.insertOne(toSave);

            const withDisciplines = await this.enrichWithDisciplines(toSave);

            return InfraMapper.fromDbToEntity(withDisciplines);
        } catch (error) {
            if (error instanceof ZodError) throw error;

            throw new DatabaseError("Erro ao criar usuário", error);
        }
    }

    public async update(user: User): Promise<User> {
        try {
            const toUpdate = {
                id: user.id,
                nome: user.nome,
                disciplinas: user.disciplinas.map((d) => ({ id: d.id })),
                matricula: user.matricula,
                usuario: user.usuario,
                curso: user.curso.toString(),
                role: user.role.toString(),
                senha: user.password,
                dataAdmissao: user.dataAdmissao,
            } satisfies UserDbModel;

            await this.userColl.updateOne({ id: user.id }, { $set: toUpdate });

            const withDisciplines = await this.enrichWithDisciplines(toUpdate);

            return InfraMapper.fromDbToEntity(withDisciplines);
        } catch (error) {
            if (error instanceof ZodError) throw error;

            throw new DatabaseError("Erro ao atualizar usuário", error);
        }
    }

    public async findById(id: string): Promise<User | null> {
        try {
            const user = await this.userColl.findOne({ id: id });
            const validated = userDbModelValidator.parse(user);

            if (!user) return null;

            const withDisciplines = await this.enrichWithDisciplines(validated);

            return InfraMapper.fromDbToEntity(withDisciplines);
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

    public async findMany(filters?: {
        disciplineId?: string;
        role: UserRole;
    }): Promise<User[]> {
        try {
            const query: any = {};

            if (filters?.disciplineId) {
                query.disciplinas = {
                    $elemMatch: { id: filters.disciplineId },
                };
            }

            if (filters?.role) {
                query.role = filters.role;
            }

            const docs = await this.userColl.find(query).toArray();

            const validateds = docs.map((e) => userDbModelValidator.parse(e));

            const withDisciplines = await Promise.all(
                validateds.map((e) => this.enrichWithDisciplines(e))
            );
            
            return withDisciplines.map((e) => InfraMapper.fromDbToEntity(e));
        } catch (error) {
            if (error instanceof ZodError) throw error;

            throw new DatabaseError("Erro ao buscar vários usuários", error);
        }
    }

    public async findByUsername(username: string): Promise<User | null> {
        try {
            const user = await this.userColl.findOne({ usuario: username });
            const validated = userDbModelValidator.parse(user);

            if (!user) return null;

            const withDisciplines = await this.enrichWithDisciplines(validated);

            return InfraMapper.fromDbToEntity(withDisciplines);
        } catch (error) {
            if (error instanceof ZodError) throw error;

            throw new DatabaseError(
                "Erro ao buscar usuário por username",
                error
            );
        }
    }

    private async enrichWithDisciplines(
        user: UserDbModel
    ): Promise<UserDbModel & { disciplinas: Discipline[] }> {
        const disciplines =
            await this.disciplineGateway.findDisciplinesByUserId(user.id);
        return {
            ...user,
            disciplinas: disciplines,
        };
    }
}
