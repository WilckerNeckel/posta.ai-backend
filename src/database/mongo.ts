// src/infra/mongo.ts
import { MongoClient, Db } from "mongodb";
//

let dbInstance: Db | null = null;
let mongoClient: MongoClient | null = null;

export async function connectToMongo(): Promise<void> {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        throw new Error("MONGO_URI is not set in the environment variables");
    }
    mongoClient = new MongoClient(uri);
    if (!dbInstance) {
        await mongoClient.connect();
        dbInstance = mongoClient.db("postaai"); // your DB name
        console.log("MongoDB connected");
    }
}

export function getMongo(): Db {
    if (!dbInstance) {
        throw new Error(
            "MongoDB not initialized. Call connectToMongo() first."
        );
    }
    return dbInstance;
}

// >>> Exponha o client para o data layer poder abrir sessão/transação
// // >>> Exponha o client para o data layer poder abrir sessão/transação
export function getMongoClient(): MongoClient {
    if (!mongoClient) {
        throw new Error(
            "MongoDB Client not initialized. Call connectToMongo() first."
        );
    }
    return mongoClient;
}
