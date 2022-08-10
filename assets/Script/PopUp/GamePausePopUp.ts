

import PopUpBase from "../Utils/PopUps/PopUpBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GamePausePopUp extends PopUpBase {

    @property(cc.Button)
    gameRestartBtn: cc.Button = null;

    @property(cc.Button)
    gameResumeBtn: cc.Button = null;

    onResumeButtonClick() {
        cc.director.resume();
        window.PopUpManager.hideAllPopUps();
        console.log("Game Resume");
    }

    onRestartButtonClick() {
        cc.director.resume();
        cc.director.loadScene("Game");
        console.log("Game Restart");
    }
}
