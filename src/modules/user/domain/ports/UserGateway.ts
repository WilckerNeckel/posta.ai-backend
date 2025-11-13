import { User } from "../entities/User";
import { UserRole } from "../enums/UserRole";

export interface UserGateway {
    save(user: User): Promise<User>;
    findById(id: string): Promise<User | null>;
    findByUsername(username: string): Promise<User | null>;
    findMany(filters?: {
        disciplineId?: string;
        role: UserRole;
    }): Promise<User[]>;
    delete(id: string): Promise<void>;
}
