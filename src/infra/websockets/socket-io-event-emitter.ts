import { WebSocketEventEmitter } from "../../shared/domain/ports/websocket-event-emitter";
import { WebSocketPayloads } from "../../shared/types/WebSocketPayloads";
import { io } from "./websocket-server";

export class SocketIOEventEmitter implements WebSocketEventEmitter {
    emitToEnrolledUsers<K extends keyof WebSocketPayloads>(
        event: K,
        disciplineId: string,
        payload: WebSocketPayloads[K]
    ): void {
        const disciplineRoom = `discipline:${disciplineId}`;

        io.to(disciplineRoom).emit(event, payload);
    }
}
