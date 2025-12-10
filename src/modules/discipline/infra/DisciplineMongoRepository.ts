import { ZodError } from "zod";
import { getMongo } from "../../../database/mongo";
import { DatabaseError } from "../../shared/errors/DatabaseError";
import { Course } from "../../user/domain/enums/Course";
import { DisciplineGateway } from "../domain/DisciplineGateway";
import { CreateDiscipline, Discipline } from "../domain/types";
import { Db } from "mongodb";
import cuid from "cuid";
import { disciplineValidator } from "../domain/validators";
import { UserGateway } from "../../user";
import { UserRole } from "../../user/domain/enums/UserRole";

export class DisciplineMongoRepository implements DisciplineGateway {
    readonly mongo: Db = getMongo();
    private readonly disciplineColl = this.mongo.collection("discipline");
    private readonly userColl = this.mongo.collection("user");

    async createDiscipline(
        disciplineInput: CreateDiscipline
    ): Promise<Discipline> {
        try {
            const docToCreate = {
                id: cuid(),
                ...disciplineInput,
            } satisfies Discipline;

            await this.disciplineColl.insertOne(docToCreate);
            return disciplineValidator.parse(docToCreate);
        } catch (error) {
            if (error instanceof ZodError) throw error;

            throw new DatabaseError("Erro ao criar usuário", error);
        }
    }

    async getDisciplineById(id: string): Promise<Discipline | null> {
        try {
            const doc = await this.disciplineColl.findOne({
                id: id,
            });
            if (!doc) return null;
            const professorId = await this.findProfessorIdByDiscipline(id);
            return disciplineValidator.parse({
                ...doc,
                professorId,
            });
        } catch (error) {
            if (error instanceof ZodError) throw error;

            throw new DatabaseError("Erro ao criar usuário", error);
        }
    }

    async findAll(filters?: { course?: Course }): Promise<Discipline[]> {
        try {
            const query: any = {};
            if (filters?.course) {
                query.curso = filters.course.toString();
            }

            const docs = await this.disciplineColl.find(query).toArray();
            return docs.map((doc) => disciplineValidator.parse(doc));
        } catch (error) {
            if (error instanceof ZodError) throw error;

            throw new DatabaseError("Erro ao criar usuário", error);
        }
    }

    async findById(id: string): Promise<Discipline | null> {
        try {
            const doc = await this.disciplineColl.findOne({ id: id });
            if (!doc) return null;
            return disciplineValidator.parse(doc);
        } catch (error) {
            if (error instanceof ZodError) throw error;

            throw new DatabaseError("Erro ao criar usuário", error);
        }
    }

    async findDisciplinesByUserId(userId: string): Promise<Discipline[]> {
        try {
            const disciplinesIds = await this.mongo
                .collection("user")
                .findOne({ id: userId })
                .then((user) => {
                    if (user && Array.isArray(user.disciplinas)) {
                        return user.disciplinas.map(
                            (d: { id: string }) => d.id
                        );
                    }
                    return [];
                });

            if (disciplinesIds.length === 0) return [];
            const docs = await this.disciplineColl
                .find({ id: { $in: disciplinesIds } })
                .toArray();
            const docsWithProfessor = await Promise.all(
                docs.map(async (doc) => {
                    const professorId = await this.findProfessorIdByDiscipline(
                        doc.id
                    );
                    return {
                        ...doc,
                        professorId,
                    };
                })
            );
            return docsWithProfessor.map((doc) =>
                disciplineValidator.parse(doc)
            );
        } catch (error) {
            if (error instanceof ZodError) throw error;

            throw new DatabaseError("Erro ao criar usuário", error);
        }
    }

    private async findProfessorIdByDiscipline(
        disciplineId: string
    ): Promise<string | null> {
        return this.userColl
            .findOne(
                { "disciplinas.id": disciplineId, role: UserRole.professor },
                { projection: { id: 1 } }
            )
            .then((user) => (user ? user.id : null));
    }
}
