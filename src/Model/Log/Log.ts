import {LogLevel} from "./LogLevel";

export class Log {
    public id: number;
    public date: Date;
    public level: LogLevel;
    public message: string;
    public context: object;

    public constructor() {

    }
}