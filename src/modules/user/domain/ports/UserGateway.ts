import { User } from "../entities/User";

export interface UserGateway {
    save(student: User): Promise<User>;
    findById(id: string): Promise<User | null>;
    findMany(): Promise<User[]>;
    delete(id: string): Promise<void>;
    update(student: User): Promise<User>;
}
