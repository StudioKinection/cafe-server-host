
import AbstractScreen from "../Utils/Screens/AbstractScreen";

const { ccclass, property } = cc._decorator;

@ccclass
export default class InstructionScreen extends AbstractScreen {

    @property(cc.Button)
    startGameButton: cc.Button = null;

    start() {

    }

    onStartGameButtonClick() {
        window.ScreenManager.showScreen(window.ScreenEnum.GameScreen);
    }
}
