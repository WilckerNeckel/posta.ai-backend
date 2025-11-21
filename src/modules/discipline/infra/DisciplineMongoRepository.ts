import { ZodError } from "zod";
import { getMongo } from "../../../database/mongo";
import { DatabaseError } from "../../shared/errors/DatabaseError";
import { Course } from "../../user/domain/enums/Course";
import { DisciplineGateway } from "../domain/DisciplineGateway";
import { CreateDiscipline, Discipline } from "../domain/types";
import { Db } from "mongodb";
import cuid from "cuid";
import { disciplineValidator } from "../domain/validators";

export class DisciplineMongoRepository implements DisciplineGateway {
    readonly mongo: Db = getMongo();
    private readonly disciplineColl = this.mongo.collection("discipline");

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
            return disciplineValidator.parse(doc);
        } catch (error) {
            if (error instanceof ZodError) throw error;

            throw new DatabaseError("Erro ao criar usuário", error);
        }
    }

    async getColumnByDisciplineName(
        disciplineName: string,
        studentId: string
    ): Promise<Discipline | null> {
        try {
            const doc = await this.disciplineColl.findOne({
                name: disciplineName,
                studentId: studentId,
            });
            // return null if not found
            if (!doc) return null;

            return disciplineValidator.parse(doc);
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
            return docs.map((doc) => disciplineValidator.parse(doc));
        } catch (error) {
            if (error instanceof ZodError) throw error;

            throw new DatabaseError("Erro ao criar usuário", error);
        }
    }
}
