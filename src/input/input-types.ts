
export enum JoyStick {
    LEFT,
    RIGHT
}

// Going from a direction to `None` may be an event someone is interested in.
export enum JoyStickDirection {
    NONE,
    UP,
    DOWN,
    LEFT,
    RIGHT
}

// [Which Joystick, Direction or None, Axis Value]
export type JoyStickData = [JoyStick, JoyStickDirection, number];

export enum Button {
    A,
    B,
    X,
    Y,
    LB,
    RB,
    LT,
    RT,
    BACK,
    START,
    LEFT_STICK,
    RIGHT_STICK,
    UP,
    DOWN,
    LEFT,
    RIGHT
}

export enum PlaystationButton {
    X,
    O,
    SQUARE,
    TRIANGLE
}

export const getButton = (button: PlaystationButton): Button => {
    switch (button) {
        case PlaystationButton.X:
            return Button.X;
        case PlaystationButton.O:
            return Button.B;
        case PlaystationButton.SQUARE:
            return Button.Y;
        case PlaystationButton.TRIANGLE:
            return Button.A;
    }
}