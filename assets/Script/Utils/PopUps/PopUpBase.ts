const { ccclass, property } = cc._decorator;
// import { GameSFX } from "../SFX";
@ccclass
export default class PopUpBase extends cc.Component {
  data: any = {};

  onShow(data: any) {
    this.data = data;
    // window.PopUpManager.sounds.playSound(GameSFX.UI_Popup, false);
  }

  onHide() {
    // window.PopUpManager.sounds.playSound(GameSFX.UI_Popup, false);
  }

  onButtonClick() {
    // window.PopUpManager.sounds.playSound(GameSFX.UI_ButtonClick, false);
  }
}
