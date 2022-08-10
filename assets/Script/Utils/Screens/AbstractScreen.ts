const { ccclass, property } = cc._decorator;
// import { GameSFX } from '../SFX';
@ccclass
export default class AbstractScreen extends cc.Component {

    data: any
    onShow(data) {
        this.data = data;
    }
    onButtonClick() {
        // window.ScreenManager.sounds.playSound(GameSFX.UI_ButtonClick, false);
    }

}