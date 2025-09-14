import pino from "pino";
import { ILoggerService } from "./ILoggerService";

const pinoInstance = pino({
    transport: {
        target: "pino-pretty", // use raw JSON logs in production
        options: {
            colorize: true,
            translateTime: "SYS:standard",
        },
    },
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
});

export class PinoLogger implements ILoggerService {
    info(message: string, meta?: any): void {
        pinoInstance.info(meta || {}, message);
    }

    warn(message: string, meta?: any): void {
        pinoInstance.warn(meta || {}, message);
    }

    error(message: string, meta?: any): void {
        pinoInstance.error(meta || {}, message);
    }

    debug(message: string, meta?: any): void {
        pinoInstance.debug(meta || {}, message);
    }

    fatal(message: string, meta?: any): void {
        pinoInstance.fatal(meta || {}, message);
    }
}