import { Subject, interval } from "rxjs";
import { throttle } from "rxjs/operators";

export class Logger {
    private static _instance: Logger;

    private _logInterval: number = 500;
    private _message: Subject<string> = new Subject<string>();

    private constructor() {
        this._message.pipe(throttle(() => interval(this._logInterval))).subscribe((message: string) => {
            console.log(message);
        });
    }

    public static get instance(): Logger {
        if (!Logger._instance) {
            Logger._instance = new Logger();
        }

        return Logger._instance;
    }

    public log(message: string): void {
        this._message.next(message);
    }
}