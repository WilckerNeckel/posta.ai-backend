import { User } from "../entities/User";

export interface UserGateway {
    save(user: User): Promise<User>;
    findById(id: string): Promise<User | null>;
    findMany(): Promise<User[]>;
    delete(id: string): Promise<void>;
}
