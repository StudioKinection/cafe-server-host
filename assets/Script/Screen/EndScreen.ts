

import AbstractScreen from "../Utils/Screens/AbstractScreen";

const { ccclass, property } = cc._decorator;

@ccclass
export default class EndScreen extends AbstractScreen {

    @property(cc.Button)
    playAgainButton: cc.Button = null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }

    onPlayAgainButtonClick() {
        cc.director.loadScene("Game");

    }

    // update (dt) {}
}
