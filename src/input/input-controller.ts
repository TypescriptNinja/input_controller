import { Subject, fromEvent, interval } from "rxjs";
import { takeUntil, map, filter, tap } from "rxjs/operators";

export class InputController {
    private _keyMap: { [key: string]: string} = {};
    private _keyDown: { [key: string]: boolean} = {};

    private _actionStart: Subject<string> = new Subject<string>();
    private _actionEnd: Subject<string> = new Subject<string>();

    private _unsubscribe: Subject<void> = new Subject<void>();
    private _disconnect: Subject<void> = new Subject<void>();

    $actionStart = this._actionStart.asObservable();
    $actionEnd = this._actionEnd.asObservable();

    private _controllerButtons: number[] = Array(17).fill(0);
    private _controllerAxes = [
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0]
    ];
    private _controllerIndex: number = -1;
    private _axisThreshold: number = 0.5;
    private _fps: number = 12;
    private _working: boolean = false;

    constructor() {
        fromEvent<KeyboardEvent>(document, "keydown")
            .pipe(
                takeUntil(this._unsubscribe),
                filter((e: KeyboardEvent) => {
                    return Object.keys(this._keyMap).includes(e.key)
                }),
                filter((e: KeyboardEvent) => !this._keyDown[e.key]),
                map((e: KeyboardEvent) => e.key),
                tap((key: string) => this._keyDown[key] = true)
            )
            .subscribe((key: string) => {
                this._actionStart.next(this._keyMap[key]);
            });

        fromEvent<KeyboardEvent>(document, "keyup")
            .pipe(
                takeUntil(this._unsubscribe),
                filter((e: KeyboardEvent) => Object.keys(this._keyMap).includes(e.key)),
                map((e: KeyboardEvent) => e.key),
                tap((key: string) => this._keyDown[key] = false)
            )
            .subscribe((key: string) => {
                this._actionEnd.next(this._keyMap[key]);
            });

        // @ts-ignore
        fromEvent<GamepadEvent>(window, "gamepadconnected").subscribe((e: GamepadEvent) => {
            this._controllerIndex = e.gamepad.index;
            this.handleGampadInput(e.gamepad);
            this.startGamepadLoop();
        });

        // @ts-ignore
        fromEvent<GamepadEvent>(window, "gamepaddisconnected").subscribe((e: GamepadEvent) => {
            this._controllerIndex = -1;
            this._disconnect.next();
        });
    }

    private handleGampadInput(gamepad: Gamepad): void {
        const buttons = gamepad.buttons.map((button: GamepadButton) => button.value);
        const axes = gamepad.axes.map((axis: number) => {
            const hasValue = Math.abs(axis) > this._axisThreshold;
            return [hasValue ? 1 : 0, hasValue ? axis : 0];
        });

        this._controllerButtons.forEach((button: number, index: number) => {
            const change = buttons[index] - button;
            if (!!Math.abs(change)) {
                console.log(`Button ${index} changed by ${change}`);
                // check button map for this particular button.
                // next the action start/end.
            }
        });
        this._controllerAxes.forEach((axis: number[], index: number) => {
            const change = axes[index][0] - axis[0];
            if (!!Math.abs(change)) {
                console.log(`Axis ${index} changed by ${change}, axis: ${axes[index]}`);
                // check axis map for this particular axis.
                // next the action start/end.
            }
        });

        this._controllerButtons = buttons.slice();
        this._controllerAxes = axes.slice();
    }

    private startGamepadLoop(): void {
        interval(1000 / this._fps)
            .pipe(takeUntil(this._disconnect))
            .subscribe(() => {
                if (!this._working) {
                    this._working = true;
                    if (this._controllerIndex < 0) {
                        return;
                    }
                    const gamepad = navigator.getGamepads()[this._controllerIndex];
                    if (!gamepad) {
                        return;
                    }
                    this.handleGampadInput(gamepad);
                    this._working = false;
                }
            });
    }

    public addKey(key: string, action: string) {
        this._keyMap[key] = action;
    }

    public removeKey(key: string) {
        delete this._keyMap[key];
    }

    public destroy() {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    public get FPS(): number {
        return this._fps;
    }

    public set FPS(fps: number) {
        this._fps = fps;
    }
}