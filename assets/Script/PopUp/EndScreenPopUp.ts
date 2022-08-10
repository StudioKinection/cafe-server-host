

import PopUpBase from "../Utils/PopUps/PopUpBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class EndScreenPopUp extends PopUpBase {

    onPlayAgainClick() {
        cc.director.resume();
        cc.director.loadScene("Game");
    }
}
