// src/infra/mongo.ts
import { MongoClient, Db } from "mongodb";
//
const uri = process.env.MONGO_URI;
if (!uri) throw new Error("MONGO_URI is not defined");

const client = new MongoClient(uri);
let dbInstance: Db | null = null;

export async function connectToMongo(): Promise<void> {
    if (!dbInstance) {
        await client.connect();
        dbInstance = client.db("postaai"); // your DB name
        console.log("MongoDB connected");
    }

    // const collection = dbInstance.collection("mesas_bloqueadas");

    // // Ensure unique index for mesaId
    // await collection.createIndex({ id: 1 }, { unique: true });
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
export function getMongoClient(): MongoClient {
    return client;
}
