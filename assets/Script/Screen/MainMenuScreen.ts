
import AbstractScreen from "../Utils/Screens/AbstractScreen";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MainMenuScreen extends AbstractScreen {

    @property(cc.Button)
    learnButton: cc.Button = null;

    start() {

    }

    onLearnButtonClick() {
        window.ScreenManager.showScreen(window.ScreenEnum.InstructionScreen);
    }
}
