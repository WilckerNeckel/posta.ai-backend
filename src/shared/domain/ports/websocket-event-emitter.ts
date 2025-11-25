import { WebSocketPayloads } from "../../types/WebSocketPayloads";

export interface WebSocketEventEmitter {
    emitToEnrolledUsers<K extends keyof WebSocketPayloads>(
        event: K,
        disciplineId: string,
        payload: WebSocketPayloads[K]
    ): void;
}
