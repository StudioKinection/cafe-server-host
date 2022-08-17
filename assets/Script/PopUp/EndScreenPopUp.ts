

import PopUpBase from "../Utils/PopUps/PopUpBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class EndScreenPopUp extends PopUpBase {

    onPlayAgainClick() {
        window.PopUpManager.hideAllPopUps();
        cc.director.loadScene("Game");
    }
}
