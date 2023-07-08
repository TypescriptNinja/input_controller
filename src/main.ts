import './style.css';
import { InputController } from './input/input-controller';

const inputController = new InputController();

inputController.addKey("ArrowUp", "up");
inputController.addKey("ArrowDown", "down");
inputController.addKey("ArrowLeft", "left");
inputController.addKey("ArrowRight", "right");

inputController.$actionStart.subscribe((action: string) => {
    console.log(`${action} started`);
});

inputController.$actionEnd.subscribe((action: string) => {
    console.log(`${action} ended`);
});


