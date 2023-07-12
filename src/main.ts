import './style.css';
import { InputController } from './input/input-controller';
import { JoyStick, JoyStickDirection, Button } from './input/input-types';
import type { JoyStickData } from './input/input-types';

const inputController = new InputController();

inputController.addKey("ArrowUp", "up");
inputController.addKey("ArrowDown", "down");
inputController.addKey("ArrowLeft", "left");
inputController.addKey("ArrowRight", "right");

inputController.addButton(Button.A, "A Pressed/Released");

inputController.$actionStart.subscribe((action: string) => {
    console.log(`${action} started`);
});

inputController.$actionEnd.subscribe((action: string) => {
    console.log(`${action} ended`);
});

inputController.$joystickAction.subscribe((data: JoyStickData) => {
    if (data[0] === JoyStick.LEFT) {
        console.log('Left Joystick');
    } else {
        console.log('Right Joystick');
    }
    console.log(`Direction: ${JoyStickDirection[data[1]].toString()}`);
    console.log(`Axis Value: ${data[2]}`);
});


